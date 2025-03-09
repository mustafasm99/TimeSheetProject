from app.models.profile import Profile
from app.models.project_model import Project, Team
from app.endpoints.base.base_router import BaseRouter
from app.controller.base_controller import BaseController
from pydantic import BaseModel
from sqlmodel import select
from app.controller.auth import authentication
from fastapi import Depends
from app.models.task.task_model import Task , TaskAssignee
from app.models.task.task_status_model import TaskStatus
from app.models.user_model import User



class FullUser(BaseModel):
    user: User
    profile: Profile|None = None
    image_url: str|None = None


class PageProject(BaseModel):
    project: Project
    team_members: list[FullUser]
    team: Team = None


class FullTask(BaseModel):
    task: Task
    task_status: TaskStatus
    task_assignees: list[FullUser]|None = None


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

class ProjectsPageResponse(BaseModel):
    projects: PageProject
    tasks: list[FullTask]

class oneProjectPageResponse(ProjectsPageResponse):
    task_status: list[TaskStatus]|None


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
        self.router.add_api_route(
            path="/user_projects",
            endpoint=self.user_projects,
            methods=["GET"],
            tags=["pages"],
            summary="Get user projects",
            response_description="User projects",
        )
        self.router.add_api_route(
            path="/project_page/{project_id}",
            endpoint=self.project_page,
            methods=["GET"],
            tags=["pages"],
            summary="Get project page",
            response_description="Project page",
        )
        self.router.add_api_route(
            path="/my_tasks",
            endpoint=self.my_task_page,
            methods=["GET"],
            tags=["pages"],
            summary="Get my task page",
            response_description="My task page",
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

    async def user_projects(
        self,
        user: User = Depends(authentication.get_current_user),
    ) -> list[ProjectsPageResponse]:
        my_teams = user.team_members
        response: list[ProjectsPageResponse] = []
        for team in my_teams:
            for project in team.team.projects:
                tasks = []
                userTasks = self.controller.session.exec(
                    select(Task).where(Task.project_id == project.id)
                    ).all()
                for task in userTasks:
                    tasks.append(
                        FullTask(
                            task=task,
                            task_status=task.task_status,
                        )
                    )
                response.append(
                    ProjectsPageResponse(
                        projects=PageProject(
                            project=project,
                            team_members=[
                                FullUser(
                                    user=member.user,
                                    profile=member.user.profile,
                                    image_url=self.get_image_url(
                                        member.user.profile.profile_image
                                    ),
                                )
                                for member in project.team.team_members
                            ],
                            team=project.team,
                        ),
                        tasks=tasks,
                    )
                )
        return response
    
    async def project_page(self, project_id:int, user: User = Depends(authentication.get_current_user))->oneProjectPageResponse:
        project = self.controller.session.exec(select(Project).where(Project.id == project_id)).first()
        tasks = self.controller.session.exec(select(Task).where(Task.project_id == project_id)).all()
        statuses = self.controller.session.exec(select(TaskStatus)).all()
        return oneProjectPageResponse(
            projects=PageProject(
                project=project,
                team_members=[
                    FullUser(
                        user=member.user,
                        profile=member.user.profile,
                        image_url=self.get_image_url(
                            member.user.profile.profile_image
                        ),
                    )
                    for member in project.team.team_members
                ],
                team=project.team,
            ),
            tasks=[
                FullTask(
                    task=task,
                    task_status=task.task_status,
                    task_assignees=[
                        FullUser(
                            user=assignee.user,
                            profile=assignee.user.profile,
                            image_url=self.get_image_url(
                                assignee.user.profile.profile_image
                            ) if assignee.user and assignee.user.profile and assignee.user.profile.profile_image else None,
                        )
                        for assignee in task.task_assign
                    ] if task.task_assign else None
                )
                for task in tasks
            ],
            task_status=statuses,
        )
    
    async def my_task_page(self, user: User = Depends(authentication.get_current_user))->list[FullTask]:
        tasks = self.controller.session.exec(select(TaskAssignee).where(TaskAssignee.assignee_id == user.id)).all()
        return [
            FullTask(
                task=task.task,
                task_status=task.task.task_status,
                task_assignees=[
                    FullUser(
                        user=assignee.user,
                        profile=assignee.user.profile,
                        image_url=self.get_image_url(
                            assignee.user.profile.profile_image
                        ) if assignee.user and assignee.user.profile and assignee.user.profile.profile_image else None,
                    )
                    for assignee in task.task.task_assign
                ] if task.task.task_assign else None
            )
            for task in tasks
        ]


page_router = PagesRouter()
