from app.models.task.task_counter_model import TaskCounter
from app.endpoints.base.base_router import BaseRouter
from app.controller.base_controller import BaseController
from pydantic import BaseModel
from fastapi import Body, HTTPException
import logging
from app.controller.auth import authentication
from fastapi import Depends
from datetime import datetime

class CreateTaskCounter(BaseModel):
    task_id: int
    user_id: int
    start_time: datetime
    end_time: datetime|None
    notes: str
    counter_type_id: int

class TaskCounterRouter(BaseRouter[TaskCounter, CreateTaskCounter]):
     def __init__(self):
          super().__init__(
               tag=["TaskCounter"],
               controller=BaseController(TaskCounter),
               model=TaskCounter,
               create_type=CreateTaskCounter,
               prefix="/task_counter",
               auth_object=[Depends(authentication.get_current_user)],
          )
     
     async def create(self, data: CreateTaskCounter = Body(...)):
          result = await super().create(data=data)
          logging.info(f"Create result: {result}")  # Log the result
          if not result:
               # Handle error: maybe raise an HTTPException
               raise HTTPException(status_code=400, detail="Creation failed")
          return result
     
     async def update(self, id, data: CreateTaskCounter = Body(...)):
          result = await super().update(id=id, data=data)
          logging.info(f"Update result: {result}")
          if not result:
               raise HTTPException(status_code=400, detail="Update failed")
          return result

task_counter_router = TaskCounterRouter()