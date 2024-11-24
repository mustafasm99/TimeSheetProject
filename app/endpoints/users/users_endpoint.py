from app.models.user_model import User
from app.controller.base_controller import BaseController
from app.endpoints.base.base_router import BaseRouter
from pydantic import BaseModel
from fastapi import Body, HTTPException
import logging
from app.controller.auth import authentication
from fastapi import Depends


class CreateUser(BaseModel):
    name: str
    email: str
    password: str
    is_active: bool
    is_superuser: bool
    is_temp_password: bool


class UserRouter(BaseRouter[User, CreateUser]):
    def __init__(self):        
        super().__init__(
            tag=["User"],
            model=User,
            controller=BaseController(model=User),
            create_type=CreateUser,
            prefix="/user",
            auth_object=[Depends(authentication.get_current_user)],
        )
        
    def setup_routes(self):
        self.router.add_api_route(
           methods=["GET"],
           path="/me",
           endpoint = self.get_me,
           response_model=User,
        ) 
        return super().setup_routes()
 
    async def create(self, data: CreateUser = Body(...)):
        result = await super().create(data=data)
        logging.info(f"Create result: {result}")
        if not result:
            raise HTTPException(status_code=400, detail="Creation failed")
        return result

    async def update(self, id, data: CreateUser = Body(...)):
        result = await super().update(id=id, data=data)
        logging.info(f"Update result: {result}")
        if not result:
            raise HTTPException(status_code=400, detail="Update failed")
        return result

    async def get_me(self, user: User = Depends(authentication.get_current_user)):
        return user


user_router = UserRouter()
