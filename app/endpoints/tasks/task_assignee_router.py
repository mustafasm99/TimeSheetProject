from app.models.task.task_assignee_model import TaskAssignee
from app.endpoints.base.base_router import BaseRouter
from app.controller.base_controller import BaseController
from pydantic import BaseModel
from fastapi import Body, HTTPException
import logging
from app.controller.auth import authentication
from fastapi import Depends

class CreateTaskAssignee(BaseModel):
     task_id: int
     assignee_id: int

class TaskAssigneeRouter(BaseRouter[TaskAssignee, CreateTaskAssignee]):
     def __init__(self):
          super().__init__(
               tag=["Task Assignee"],
               controller=BaseController(TaskAssignee),
               model=TaskAssignee,
               create_type=CreateTaskAssignee,
               prefix="/task_assignee",
               auth_object=[Depends(authentication.get_current_user)],
          )
     
     async def create(self, data: CreateTaskAssignee = Body(...)):
          result = await super().create(data=data)
          logging.info(f"Create result: {result}")  # Log the result
          if not result:
               # Handle error: maybe raise an HTTPException
               raise HTTPException(status_code=400, detail="Creation failed")
          return result
     
     async def update(self, id, data: CreateTaskAssignee = Body(...)):
          result = await super().update(id=id, data=data)
          logging.info(f"Update result: {result}")
          if not result:
               raise HTTPException(status_code=400, detail="Update failed")
          return result


task_assignee_router = TaskAssigneeRouter()