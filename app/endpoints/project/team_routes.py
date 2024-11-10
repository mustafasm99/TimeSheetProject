from app.models.project_model import Team
from app.endpoints.base.base_router import BaseRouter
from app.controller.base_controller import BaseController
from pydantic import BaseModel
from fastapi import Body, HTTPException
import logging
from app.controller.auth import authentication
from fastapi import Depends


class CreateTeam(BaseModel):
    name: str
    description: str
    team_leader_id: int
    members_limit: int


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


team_router = TeamRouter()
