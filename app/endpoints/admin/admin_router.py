from app.models.project_model import Project, Team
from app.controller.base_controller import BaseController
from app.endpoints.base.base_router import BaseRouter
from pydantic import BaseModel
from fastapi import Depends, HTTPException
from app.controller.auth import authentication
from app.endpoints.project.team_routes import ReadAllTeamResponse, team_router
from app.models.user_model import User
from app.endpoints.users.users_endpoint import user_router
from app.endpoints.project.project_status_routes import project_status_router
from app.models.project_model import Project_Status


class AdminSiteResponse(BaseModel):
    teams: list[ReadAllTeamResponse]
    projects: list[Project]
    users: list[User]
    project_statuses: list[Project_Status]


class AdminRouter(BaseRouter[Project, Project]):
    def __init__(self):
        super().__init__(
            prefix="/admin",
            tag=["admin"],
            model=Project,
            create_type=Project,
            controller=BaseController(Project),
            auth_object=[Depends(authentication.get_admin_user)],
        )

    def setup_routes(self):
        self.router.add_api_route(
            methods=["GET"],
            path="/site_data",
            endpoint=self.get_admin_site_data,
        )

    async def get_admin_site_data(self) -> AdminSiteResponse:
        teams = await team_router.read_all()
        projects = await self.read_all()
        users = await user_router.read_all()
        project_statuses = await project_status_router.read_all()
        return AdminSiteResponse(
            teams=teams,
            projects=projects,
            users=users,
            project_statuses=project_statuses,
        )


admin_router = AdminRouter()
