from app.models.task.task_model import Task
from app.endpoints.base.base_router import BaseRouter
from app.controller.base_controller import BaseController
from pydantic import BaseModel
from fastapi import Body, HTTPException
import logging
from app.controller.auth import authentication
from fastapi import Depends
from datetime import datetime

class CreateTask(BaseModel):
     title:str
     description:str
     project_id:int
     start_time:datetime
     end_time:datetime
     status_id:int
     category_id:int

class TaskRouter(BaseRouter[Task, CreateTask]):
     def __init__(self):
          super().__init__(
               tag=["Task"],
               controller=BaseController(Task),
               model=Task,
               create_type=CreateTask,
               prefix="/task",
               auth_object=[Depends(authentication.get_current_user)],
          )
     
     async def create(self, data: CreateTask = Body(...)):
          result = await super().create(data=data)
          logging.info(f"Create result: {result}")  # Log the result
          if not result:
               # Handle error: maybe raise an HTTPException
               raise HTTPException(status_code=400, detail="Creation failed")
          return result
     
     async def update(self, id, data: CreateTask = Body(...)):
          result = await super().update(id=id, data=data)
          logging.info(f"Update result: {result}")
          if not result:
               raise HTTPException(status_code=400, detail="Update failed")
          return result

task_router = TaskRouter()