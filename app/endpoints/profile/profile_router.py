from app.models.profile import Profile
from app.endpoints.base.base_router import BaseRouter
from app.controller.base_controller import BaseController
from pydantic import BaseModel
from fastapi import Body, HTTPException, File, UploadFile
from fastapi.responses import FileResponse
import logging
from app.core.conf import settings
from app.controller.auth import authentication
from fastapi import Depends

from app.models.user_model import User

from pathlib import Path
import shutil

class CreateProfile(BaseModel):
    user_id: int
    bio: str

class UserData(BaseModel):
    name:str
    email:str
    is_superuser:bool
    is_active:bool
    

class ProfileData(BaseModel):
    bio:str
    user_id:int
    id:int
    profile_image:str
    user:UserData


class ProfileRouter(BaseRouter[Profile, CreateProfile]):
    def __init__(self):
        super().__init__(
            tag=["Profile"],
            controller=BaseController(Profile),
            model=Profile,
            create_type=CreateProfile,
            prefix="/profile",
            auth_object=[Depends(authentication.get_current_user)],
        )

    def setup_routes(self):
        self.router.add_api_route(
            methods=["GET"],
            path="/me",
            endpoint=self.profileMe,
            response_model=ProfileData,
        )
        self.router.add_api_route(
               methods=["POST"],
               path="/me/upload-image",
               endpoint=self.upload_profile_image,
               response_model=Profile,
          )
        self.router.add_api_route(
               methods=["GET"],
               path="/me/image",
               endpoint=self.get_image,
               response_model=Profile,
               
          )  
        return super().setup_routes()

    async def create(
        self,
        data: CreateProfile = Body(...),
    ):
        result = await super().create(data=data)
        logging.info(f"Create result: {result}")
        if not result:
            raise HTTPException(status_code=400, detail="Creation failed")
        return result

    async def update(self, id, data: CreateProfile = Body(...)):
        result = await super().update(id=id, data=data)
        logging.info(f"Update result: {result}")
        if not result:
            raise HTTPException(status_code=400, detail="Update failed")
        return result

    async def profileMe(self, user: User = Depends(authentication.get_current_user))->ProfileData:
        profile = await self.get_one(user.id)
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        return ProfileData(**profile.dict(), user=UserData(**user.model_dump()))
    
    async def upload_profile_image(
         self,
         file: UploadFile = File(...),
         user: User = Depends(authentication.get_current_user),
         ):
     # you can add these logic to the controller
     media_path = Path(settings.MEDIA_PATH + "/profiles") if settings.MEDIA_PATH else Path("media/profile")
     if file.content_type not in ["image/jpeg", "image/png"]:
         raise HTTPException(status_code=400, detail="Invalid file type")
     if file is not None and file.filename:
          filePath = Path(media_path) / file.filename
          with open(filePath, "wb") as buffer:
               shutil.copyfileobj(file.file, buffer)
          profile:Profile =  await self.get_one(user.id)
          profile.profile_image = str(filePath)
          self.controller.session.add(profile)
          self.controller.session.commit()
          self.controller.session.refresh(profile)
          return FileResponse(str(filePath))
     
    async def get_image(
         self ,
         id: int,
         ):
           profile:Profile =  await self.get_one(id)
           if profile.profile_image:
               return FileResponse(profile.profile_image)
           else:
               raise HTTPException(status_code=404, detail="Image not found")


profile_router = ProfileRouter()
