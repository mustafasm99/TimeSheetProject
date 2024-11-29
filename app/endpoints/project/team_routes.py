from app.models.profile import Profile
from app.models.project_model import Team, Project
from app.endpoints.base.base_router import BaseRouter
from app.controller.base_controller import BaseController
from pydantic import BaseModel
from fastapi import Body, HTTPException
import logging
from app.controller.auth import authentication
from fastapi import Depends
from sqlmodel import select
from app.models.user_model import User
from app.endpoints.profile.profile_router import profile_router 


class CreateTeam(BaseModel):
    name: str
    description: str
    team_leader_id: int
    members_limit: int

class teamMember(BaseModel):
    id:int
    name:str
    bio:str
    profile_image:str|None
    

class myTeam(BaseModel):
    team_id: int
    name: str
    description: str
    team_leader_id: int
    projects: list[Project]
    members: list[teamMember]


class TeamRouter(BaseRouter[Team, CreateTeam]):
    def __init__(
        self,
    ):
        super().__init__(
            tag=["Team"],
            controller=BaseController(Team),
            model=Team,
            create_type=CreateTeam,
            auth_object=[Depends(authentication.get_admin_user)],
            prefix="/team",
        )

    def setup_routes(self):
        self.router.add_api_route(
            methods=["GET"],
            path="/my_teams",
            endpoint=self.my_teams,
            response_model=myTeam,
        )
        super().setup_routes()
        self.router.add_api_route(
            methods=["GET"],
            path="/{id}/members",
            endpoint=self.get_team_members,
            response_model=list[User],
        )

    async def get_team_members(
        self, id: int, user: User = Depends(authentication.get_current_user)
    ):
        query = select(User).where(User.team_id == id)
        return list[User](self.controller.session.exec(query).all())

    async def create(self, data: CreateTeam = Body(...)):
        result = await super().create(data=data)
        logging.info(f"Create result: {result}")
        if not result:
            raise HTTPException(status_code=400, detail="Creation failed")
        return result

    async def update(self, id, data: CreateTeam = Body(...)):
        result = await super().update(id=id, data=data)
        logging.info(f"Update result: {result}")
        if not result:
            raise HTTPException(status_code=400, detail="Update failed")
        return result

    async def my_teams(
        self, user: User = Depends(authentication.get_current_user)
    ) -> myTeam:
        query = select(Team).where(Team.id == user.team_id)
        result = self.controller.session.exec(query).first()
        return myTeam(
            team_id=result.id,
            name=result.name,
            description=result.description,
            team_leader_id=result.team_leader_id,
            members=[
                teamMember(
                    id=user.id,
                    name=user.name,
                    bio=user.profile.bio,
                    profile_image=f"/profile/me/image?id={user.profile.id}",
                )
                for user in await self.get_team_members(id=result.id)
                ],
            projects=result.projects,
        )


team_router = TeamRouter()
