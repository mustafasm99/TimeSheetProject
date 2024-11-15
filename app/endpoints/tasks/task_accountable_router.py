from app.models.task.task_accountable_model import TaskAccountable
from app.endpoints.base.base_router import BaseRouter
from app.controller.base_controller import BaseController
from pydantic import BaseModel
from fastapi import Body, HTTPException
import logging
from app.controller.auth import authentication
from fastapi import Depends

class CreateTaskAccountable(BaseModel):
     task_id: int
     accountable_id: int

class TaskAccountableRouter(BaseRouter[TaskAccountable, CreateTaskAccountable]):
     def __init__(self):
          super().__init__(
               tag=["Task Accountable"],
               controller=BaseController(TaskAccountable),
               model=TaskAccountable,
               create_type=CreateTaskAccountable,
               prefix="/task_accountable",
               auth_object=[Depends(authentication.get_current_user)],
          )
     
     async def create(self, data: CreateTaskAccountable = Body(...)):
          result = await super().create(data=data)
          logging.info(f"Create result: {result}")  # Log the result
          if not result:
               # Handle error: maybe raise an HTTPException
               raise HTTPException(status_code=400, detail="Creation failed")
          return result
     
     async def update(self, id, data: CreateTaskAccountable = Body(...)):
          result = await super().update(id=id, data=data)
          logging.info(f"Update result: {result}")
          if not result:
               raise HTTPException(status_code=400, detail="Update failed")
          return result


task_accountable_router = TaskAccountableRouter()