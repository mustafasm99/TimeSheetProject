from app.endpoints.base.message_response import MessageResponse
from app.models.types.auth_types import  SetNewPassword
from app.models.user_model import User
from app.controller.base_controller import BaseController
from app.endpoints.base.base_router import BaseRouter
from pydantic import BaseModel
from fastapi import Body, HTTPException
import logging
from app.controller.auth import authentication
from fastapi import Depends
from sqlmodel import select
from datetime import datetime
class CreateUser(BaseModel):
    name: str
    email: str
    password: str
    is_active: bool
    is_superuser: bool
    is_temp_password: bool
    team_id: int

class UpdateUser(BaseModel):
    name: str
    email: str
    is_active: bool
    is_superuser: bool
    is_temp_password: bool
    team_id: int

class ReadUserObject(BaseModel):
    id: int
    name: str
    email: str
    is_active: bool
    is_superuser: bool
    is_temp_password: bool
    create_time: datetime
    update_time: datetime
    password: str
    roll: str|None
    team_name: str|None
    image: str|None

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
        self.router.add_api_route(
            methods=["PUT"],
            path="/update",
            endpoint=self.update,
            response_model=MessageResponse,
        )
        self.router.add_api_route(
            methods=["POST"],
            path="/reset-password",
            endpoint=self.reset_password,
            response_model=User,
        )
        return super().setup_routes()
    
    async def read_all(self)->list[ReadUserObject]:
        data:list[User] = await super().read_all()
        result = []
        for user in data:
            user_roll = ""
            for roll in user.users_roll:
                user_roll += roll.roll.name+" , "
            result.append(ReadUserObject(
                id=user.id,
                name=user.name,
                email=user.email,
                is_active=user.is_active,
                is_superuser=user.is_superuser,
                is_temp_password=user.is_temp_password,
                roll=user_roll,
                team_name=user.team_members[0].team.name if user.team_members else None,
                image=str(user.profile.id )if user.profile else None,
                create_time=user.create_time,
                update_time=user.update_time,
                password=user.password
            ))
        return result
    
    async def create(self, data: CreateUser = Body(...)):
        try:
            result = authentication.CreateUser(data=data , session=self.controller.session)
            logging.info(f"Create result: {result}")
            if not result:
                raise HTTPException(status_code=400, detail="Creation failed")
            return result
        except Exception as e:
            logging.error(f"Error in create user: {e}")
            raise HTTPException(status_code=400, detail="Creation failed email already exists")

    async def update(self, id:int|None = None, data: UpdateUser = Body(...) , user:User = Depends(authentication.get_current_user)):
        if not user.is_superuser:
            query = select(User).where(User.id == id)
        else:
            query = select(User).where(User.id == user.id)
        old_object = self.controller.session.exec(query).first()
        if not old_object:
            raise HTTPException(status_code=400, detail="User not found")
        for key, value in data.dict(exclude_unset=True).items():
            setattr(old_object, key, value)
        old_object.update_time = datetime.now()
        self.controller.session.add(old_object)
        self.controller.session.commit()
        logging.info(f"Update result: {old_object}")
        if not old_object:
            raise HTTPException(status_code=400, detail="Update failed")
        return MessageResponse(message="User updated successfully")

    async def get_me(self, user: User = Depends(authentication.get_current_user)):
        return user
    
    async def reset_password(self, data: SetNewPassword = Body(...)):
        result = authentication.reset_password(data=data , session=self.controller.session)
        logging.info(f"Reset password result: {result}")
        if not result:
            raise HTTPException(status_code=400, detail="Reset password failed")
        return MessageResponse(message="Password reset successfully")

user_router = UserRouter()
