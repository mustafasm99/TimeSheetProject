from app.controller.base_controller import BaseController
from app.models.task.task_model import Task
from app.models.task.task_assignee_model import TaskAssignee
from pydantic import BaseModel
from sqlmodel import select


class TaskController(BaseController[Task]):
    def __init__(self):
        super().__init__(model=Task)

 
    def get_user_tasks(self, user_id: int) -> list[Task]:
        tasks:list[Task] = []
        query = select(TaskAssignee).where(TaskAssignee.assignee_id == user_id)
        user_tasks = self.session.exec(query).all()
        for user_task in user_tasks:
            tasks.append(user_task.task)
        return tasks