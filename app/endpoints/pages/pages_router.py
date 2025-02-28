from app.models.profile import Profile
from app.models.project_model import Project, Team
from app.endpoints.base.base_router import BaseRouter
from app.controller.base_controller import BaseController
from pydantic import BaseModel
from fastapi import Body, HTTPException
from sqlmodel import select
from app.controller.auth import authentication
from fastapi import Depends
from app.models.task.task_model import Task, TaskAssignee
from app.models.task.task_status_model import TaskStatus
from app.models.user_model import User
from datetime import datetime


class FullUser(BaseModel):
    user: User
    profile: Profile
    image_url: str = None


class PageProject(BaseModel):
    project: Project
    team_members: list[FullUser]
    team:Team = None

class FullTask(BaseModel):
     task: Task
     task_status:TaskStatus


class DashboardPageResponse(BaseModel):
    current_project: PageProject
    my_tasks: list[FullTask]


class CreateProject(BaseModel):
    title: str
    description: str
    start_date: str
    end_date: str
    team_id: int
    members_limit: int
    project_manager_id: int


class PagesRouter(BaseRouter[Project, CreateProject]):
    def __init__(self):
        super().__init__(
            tag=["pages"],
            controller=BaseController(Project),
            model=Project,
            create_type=CreateProject,
            prefix="/pages",
            auth_object=[Depends(authentication.get_current_user)],
        )

    def setup_routes(self):
        self.router.add_api_route(
            path="/user_dashboard",
            endpoint=self.user_dashboard,
            methods=["GET"],
            tags=["pages"],
            summary="Get user dashboard",
            response_description="User dashboard",
        )
        super().setup_routes

    async def user_dashboard(
        self, user: User = Depends(authentication.get_current_user)
    ) -> DashboardPageResponse:
        current_project = user.team_members[-1].team.projects[-1]
        team_members = [
            FullUser(
                user=member.user,
                profile=member.user.profile,
                image_url=self.get_image_url(member.user.profile.profile_image),
            )
            for member in current_project.team.team_members
        ]
        my_tasks = [task.task for task in user.user_assign]
        return DashboardPageResponse(
            current_project=PageProject(
                project=current_project,
                team_members=team_members,
                team=current_project.team,
            ),
            my_tasks=[
                FullTask(
                    task=task,
                    task_status=task.task_status,
                )
                for task in my_tasks
            ],
        )


page_router = PagesRouter()
