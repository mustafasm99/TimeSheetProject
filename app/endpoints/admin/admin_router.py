from app.endpoints.pages.pages_router import FullUser
from app.models.project_model import Project
from app.models.user_model import User
from app.controller.base_controller import BaseController
from app.endpoints.base.base_router import BaseRouter
from pydantic import BaseModel
from fastapi import Depends, Body
from app.controller.auth import authentication
from app.endpoints.project.team_routes import ReadAllTeamResponse, team_router
from app.endpoints.users.users_endpoint import user_router , ReadUserObject
from app.endpoints.project.project_status_routes import project_status_router
from app.models.project_model import Project_Status
from app.models.task.task_status_model import TaskStatus
from app.models.task.task_category_model import TaskCategory
from sqlmodel import select
from datetime import datetime , timedelta
from app.models.attendance import Attendance
from sqlmodel import func

class AdminSiteResponse(BaseModel):
    teams: list[ReadAllTeamResponse]
    projects: list[Project]
    users: list[ReadUserObject]
    project_statuses: list[Project_Status]

class AdminSiteTaskMangerResponse(BaseModel):
    task_statuses: list[TaskStatus]
    task_categories: list[TaskCategory]

class WeeklyReports(BaseModel):
    date:list[datetime]|None = None
    user:FullUser
    count:int = 0

class AttendanceResponse(BaseModel):
    attendance:Attendance
    user:FullUser

class GetAttendanceByToken(BaseModel):
    token:str = Body(...)



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
            dependencies=self.auth_object,
        )
        self.router.add_api_route(
            methods=["GET"],
            path="/task_manager",
            endpoint=self.get_task_manager_data,
            dependencies=self.auth_object,
        )
        self.router.add_api_route(
            methods=["GET"],
            path="/employee_reports",
            endpoint=self.get_employee_reports,
            dependencies=self.auth_object,
        )
        self.router.add_api_route(
            methods=["POST"],
            path="/attendance",
            endpoint=self.checkAttendanceByToken,
            dependencies=self.auth_object,
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
    
    async def get_task_manager_data(self)->AdminSiteTaskMangerResponse:
        statuses = self.controller.session.exec(select(
            TaskStatus,
            )).all()
        categories = self.controller.session.exec(select(
            TaskCategory,
            )).all()
        return AdminSiteTaskMangerResponse(
            task_statuses = statuses,
            task_categories = categories
        )
    
    async def get_employee_reports(self)->list[WeeklyReports|None]|None:
        employees = self.controller.session.exec(
            select(User).where(User.is_superuser == False)
        ).all()
        reports = []
        for employee in employees:
            if employee.profile is None:
                print(employee.email , "has no profile")
                continue
            print(employee.email , "has profile")
            user = FullUser(
                image_url=self.get_image_url(employee.profile.profile_image),
                profile=employee.profile,
                user=employee,
            )
            count = self.controller.session.scalars(
                (select(func.count())
                 .where(Attendance.user_id == employee.id)
                 .where(Attendance.day >= datetime.now().date() - timedelta(days=7))
                )
            ).one()
            dates = self.controller.session.exec(
                select(Attendance.day)
                .where(Attendance.user_id == employee.id)
                .where(Attendance.day >= datetime.now().date() - timedelta(days=7))
            ).all()
            reports.append(WeeklyReports(
                user=user,
                count=count,
                date=dates
            ))
        return reports

    async def checkAttendanceByToken(self , data:GetAttendanceByToken=Body(...))->AttendanceResponse|None:
        attendance:Attendance = self.controller.session.exec(
            select(Attendance).where(Attendance.token == data.token)
        ).first()
        if attendance is None:
            return None
        user = self.controller.session.exec(
            select(User).where(User.id == attendance.user_id)
        ).first()
        if not user:
            return None
        return AttendanceResponse(
            attendance=attendance,
            user=FullUser(
                image_url=self.get_image_url(user.profile.profile_image),
                profile=user.profile,
                user=user
            )
        )


admin_router = AdminRouter()
