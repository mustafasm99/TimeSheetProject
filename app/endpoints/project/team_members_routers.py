from app.models.project_model import Team_Member
from pydantic import BaseModel
from app.endpoints.base.base_router import BaseRouter
from app.controller.base_controller import BaseController
from app.controller.auth import authentication
from fastapi import Depends


class CreateTeamMember(BaseModel):
     team_id: int
     user_id: int
     is_leader: bool
     is_active:bool = True


class TeamMembersRouter(BaseRouter[CreateTeamMember , Team_Member]):
     def __init__(self):
          super().__init__(
               tag=["Team Members"],
               prefix="/team_members",
               controller=BaseController(Team_Member),
               model=Team_Member,
               create_type=CreateTeamMember,
               auth_object=[Depends(authentication.get_current_user)]
          )
     
     async def create(self, data: CreateTeamMember):
          return await super().create(data)
     
     async def update(self , id:int , data:CreateTeamMember):
          return await super().update(id , data)


teamMembersRouter = TeamMembersRouter()