from app.models.task.task_update_model import TaskUpdate
from app.controller.base_controller import BaseController
from app.endpoints.base.base_router import BaseRouter
from pydantic import BaseModel
from fastapi import Body, HTTPException
import logging
from app.controller.auth import authentication
from fastapi import Depends
from typing import Any

class CreateTaskUpdate(BaseModel):
     task_id: int
     user_id: int
     update: dict[str , Any]
     status: str

class TaskUpdateRouter(BaseRouter[TaskUpdate, CreateTaskUpdate]):
     def __init__(self):
          super().__init__(
               tag=["Task Update"],
               controller=BaseController(TaskUpdate),
               model=TaskUpdate,
               create_type=CreateTaskUpdate,
               prefix="/task_update",
               auth_object=[Depends(authentication.get_current_user)],
          )
     
     async def create(self, data: CreateTaskUpdate = Body(...)):
          result = await super().create(data=data)
          logging.info(f"Create result: {result}")
          if not result:
               raise HTTPException(status_code=400, detail="Creation failed")
          return result
     
     async def update(self, id, data: CreateTaskUpdate = Body(...)):
          result = await super().update(id=id, data=data)
          logging.info(f"Update result: {result}")
          if not result:
               raise HTTPException(status_code=400, detail="Update failed")
          return result


task_update_router = TaskUpdateRouter()