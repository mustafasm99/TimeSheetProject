from app.controller.task_controllers.task_controller import TaskController
from app.endpoints.pages.pages_router import FullTask, FullUser
from app.models.task.task_model import Task, TaskAssignee
from app.endpoints.base.base_router import BaseRouter
from .task_assignee_router import task_assignee_router, CreateTaskAssignee
from pydantic import BaseModel
from fastapi import Body, HTTPException
import logging
from app.controller.auth import authentication
from fastapi import Depends
from datetime import datetime
from sqlmodel import select


class CreateTask(BaseModel):
    title: str
    description: str
    project_id: int
    start_time: datetime
    end_time: datetime
    status_id: int
    category_id: int
    is_counting: bool = False
    work_time: int = 0


class CreateTaskForm(CreateTask):
    assignee: list[int]


class TaskRouter(BaseRouter[Task, CreateTask]):
    def __init__(self):
        super().__init__(
            tag=["Task"],
            controller=TaskController(),
            model=Task,
            create_type=CreateTask,
            prefix="/task",
            auth_object=[Depends(authentication.get_current_user)],
        )

    def setup_routes(self):
        self.router.add_api_route(
            methods=["GET"],
            path="/me",
            endpoint=self.task_me,
            response_model=list[Task],
        )
        self.router.add_api_route(
            methods=["GET"],
            path="/current",
            endpoint=self.get_current_task,
            response_model=FullTask,
        )
        super().setup_routes()

    async def create(self, data: CreateTaskForm = Body(...) , user=Depends(authentication.get_current_user))->FullTask:
        result = await super().create(data=CreateTask(**data.model_dump()))
        logging.info(f"Create result: {result}")  # Log the result
        if not result:
            # Handle error: maybe raise an HTTPException
            raise HTTPException(status_code=400, detail="Creation failed")
        for assignee in data.assignee:
            if assignee == 0:
                assignee = user.id
            await task_assignee_router.create(
                data=CreateTaskAssignee(
                    task_id=result.id,
                    assignee_id=assignee,
                )
            )
        return FullTask(
            task=result,
            task_status=result.task_status,
            task_assignees=[
                FullUser(
                    user=assignee.user,
                    profile=assignee.user.profile,
                    image_url=self.get_image_url(assignee.user.profile.profile_image)
                    if assignee.user
                    and assignee.user.profile
                    and assignee.user.profile.profile_image
                    else None,
                )
                for assignee in result.task_assign
            ]
            if result.task_assign
            else None,
        )

    async def update(
        self,
        id,
        data: CreateTask = Body(...),
        user=Depends(authentication.get_current_user),
    ):
        old_task: Task = await self.get_one(id=id)
        if not old_task:
            raise HTTPException(status_code=404, detail="Task not found")
        if user.id not in [assignee.assignee_id for assignee in old_task.task_assign]:
            raise HTTPException(
                status_code=403, detail="You are not allowed to update this task"
            )

        my_task = await self.task_me(user=user)
        for task in my_task:
            if int(task.id) != int(id):
                if task.is_counting:
                    raise HTTPException(
                        status_code=403,
                        detail="You cant run this task you have another task running",
                    )
            if task.id == id:
                if task.is_counting and not data.is_counting:
                    raise HTTPException(
                        status_code=403,
                        detail="You cant stop a task that is not running",
                    )
                if not task.is_counting and data.is_counting:
                    raise HTTPException(
                        status_code=403, detail="You cant start a task that is running"
                    )
        data.work_time = int(
            (
                data.end_time.replace(tzinfo=None)
                - data.start_time.replace(tzinfo=None)
            ).total_seconds()
        )
        data.start_time = old_task.start_time.replace(tzinfo=None)
        result = await super().update(id=id, data=data)
        logging.info(f"Update result: {result}")
        if not result:
            raise HTTPException(status_code=400, detail="Update failed")
        return result

    async def task_me(self, user=Depends(authentication.get_current_user)):
        result = self.controller.get_user_tasks(user_id=user.id)
        logging.info(f"Task result: {result}")
        if not result:
            raise HTTPException(status_code=404, detail="No tasks found")
        return result

    async def get_current_task(
        self, user=Depends(authentication.get_current_user)
    ) -> FullTask:
        current_task = (
            select(Task)
            .join(TaskAssignee, Task.id == TaskAssignee.task_id)
            .filter(TaskAssignee.assignee_id == user.id)
            .filter(Task.is_counting == True)
        )
        current_task = self.controller.session.exec(current_task).first()
        logging.info(f"Current task: {current_task}")
        if not current_task:
            raise HTTPException(status_code=404, detail="No running task found")
        return FullTask(
            task=current_task,
            task_status=current_task.task_status,
            task_assignees=[
                FullUser(
                    user=assignee.user,
                    profile=assignee.user.profile,
                    image_url=self.get_image_url(assignee.user.profile.profile_image)
                    if assignee.user
                    and assignee.user.profile
                    and assignee.user.profile.profile_image
                    else None,
                )
                for assignee in current_task.task_assign
            ]
            if current_task.task_assign
            else None,
        )


task_router = TaskRouter()
