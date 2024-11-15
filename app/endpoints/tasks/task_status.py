from app.models.task.task_status_model import TaskStatus
from app.endpoints.base.base_router import BaseRouter
from app.controller.base_controller import BaseController
from pydantic import BaseModel
from fastapi import Body, HTTPException
import logging
from app.controller.auth import authentication
from fastapi import Depends


class CreateTaskStatus(BaseModel):
    status:str

class TaskStatusRouter(BaseRouter[TaskStatus, CreateTaskStatus]):
     def __init__(self):
          super().__init__(
               tag=["Task Status"],
               controller=BaseController(TaskStatus),
               model=TaskStatus,
               create_type=CreateTaskStatus,
               prefix="/task_status",
               auth_object=[Depends(authentication.get_admin_user)],
          )
     
     async def create(self, data: CreateTaskStatus = Body(...)):
          result = await super().create(data=data)
          logging.info(f"Create result: {result}")  # Log the result
          if not result:
               # Handle error: maybe raise an HTTPException
               raise HTTPException(status_code=400, detail="Creation failed")
          return result
     async def update(self, id, data: CreateTaskStatus = Body(...)):
            result = await super().update(id=id, data=data)
            logging.info(f"Update result: {result}")
            if not result:
                  raise HTTPException(status_code=400, detail="Update failed")
            return result

task_status_router = TaskStatusRouter()