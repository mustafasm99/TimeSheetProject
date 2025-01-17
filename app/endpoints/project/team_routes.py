from app.models.project_model import Team, Project , Team_Member
from app.endpoints.base.base_router import BaseRouter
from app.controller.base_controller import BaseController
from pydantic import BaseModel
from fastapi import Body, HTTPException
import logging
from app.controller.auth import authentication
from fastapi import Depends
from sqlmodel import select
from app.models.user_model import User



class CreateTeam(BaseModel):
    name: str
    description: str
    team_leader_id: int
    members_limit: int

class teamMember(BaseModel):
    id:int
    name:str
    bio:str|None
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
            response_model=myTeam|None,
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
        team:Team = await self.get_one(id=id)
        print(team.team_members[0].user.profile , "team -------------->")
        return [
            member.user
            for member in team.team_members
        ]

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
    ) -> myTeam|None:
        query = select(Team).where(Team.id == user.team_members[-1].team_id)
        result = self.controller.session.exec(query).first()
        if not result:
            return None
        return myTeam(
            team_id=result.id,
            name=result.name,
            description=result.description,
            team_leader_id=list(filter(lambda member: member.is_leader, result.team_members))[0].id,
            members=[
                teamMember(
                    id=user.id,
                    name=user.name,
                    bio=user.profile.bio if user.profile else None,
                    profile_image=f"/profile/me/image?id={user.profile.id}" if user.profile else None,
                )
                for user in await self.get_team_members(id=result.id)
                ],
            projects=result.projects,
        )


team_router = TeamRouter()
