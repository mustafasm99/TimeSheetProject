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
from app.models.project_model import Team_Member
from app.endpoints.project.team_members_routers import CreateTeamMember, teamMembersRouter


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
    have_profile:bool|None

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
           response_model=ReadUserObject,
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
        self.router.add_api_route(
            methods=["PUT"],
            path="/deactivate/{id}",
            endpoint=self.deactivate_user,
            response_model=MessageResponse,
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
                image=self.get_image_url(user.profile.profile_image) if user.profile else None,
                create_time=user.create_time,
                update_time=user.update_time,
                password=user.password,
                have_profile=False,
            ))
        return result
    
    async def create(self, data: CreateUser = Body(...))->ReadUserObject:
        try:
            result = authentication.CreateUser(data=data , session=self.controller.session)
            logging.info(f"Create result: {result}")
            
            if data.team_id is not None and data.team_id > 0:
                await teamMembersRouter.create(
                    CreateTeamMember(
                        team_id=data.team_id,
                        user_id=result.id,
                        is_leader=False,
                        is_active=True
                    )
                )
            if not result:
                raise HTTPException(status_code=400, detail="Creation failed")
            return ReadUserObject(
                id=result.id,
                name=result.name,
                email=result.email,
                is_active=result.is_active,
                is_superuser=result.is_superuser,
                is_temp_password=result.is_temp_password,
                roll=None,
                team_name=result.team_members[0].team.name if result.team_members else None,
                image=self.get_image_url(result.profile.profile_image) if result.profile else None,
                create_time=result.create_time,
                update_time=result.update_time,
                password=result.password
            )
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

    async def get_me(self, user: User = Depends(authentication.get_current_user))->ReadUserObject:
        user = user
        return ReadUserObject(
            id=user.id,
            email=user.email,
            create_time=user.create_time,
            have_profile=user.profile is not None,
            is_active=user.is_active,
            image=self.get_image_url(user.profile.profile_image if user.profile else ""),
            is_superuser=user.is_superuser,
            is_temp_password=user.is_temp_password,
            name=user.name,
            password=user.password,
            roll=str([ i.roll for i in  user.users_roll]).replace("[","").replace("]",""),
            team_name=user.team_members[-1].team.name,
            update_time=user.update_time,
        )
    
    async def reset_password(self, data: SetNewPassword = Body(...)):
        result = authentication.reset_password(data=data , session=self.controller.session)
        logging.info(f"Reset password result: {result}")
        if not result:
            raise HTTPException(status_code=400, detail="Reset password failed")
        return MessageResponse(message="Password reset successfully")
    
    async def deactivate_user(self, id:int):
        result = authentication.deactivate_user(user_id=id , session=self.controller.session)
        logging.info(f"Deactivate user result: {result}")
        if not result:
            raise HTTPException(status_code=400, detail="Deactivation failed")
        return MessageResponse(message="User deactivated successfully")

user_router = UserRouter()
