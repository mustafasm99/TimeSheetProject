from app.models.task.task_counter_model import TaskCounter
from app.endpoints.base.base_router import BaseRouter
from app.controller.base_controller import BaseController
from pydantic import BaseModel
from fastapi import Body, HTTPException
import logging
from app.controller.auth import authentication
from fastapi import Depends
from datetime import datetime
from sqlmodel import select
from app.models.task.task_model import Task , TaskAssignee

class CreateTaskCounter(BaseModel):
    task_id: int
    start_time: datetime
    end_time: datetime|None
    notes: str
    counter_type_id: int
    is_counting: bool

class CreateDbTaskCounter(CreateTaskCounter):
     user_id: int

class UpdateCounterTime(BaseModel):
     end_time: datetime
     is_counting: bool
    
class TaskCounterRouter(BaseRouter[TaskCounter, CreateTaskCounter]):
     def __init__(self):
          super().__init__(
               tag=["TaskCounter"],
               controller=BaseController(TaskCounter),
               model=TaskCounter,
               create_type=CreateDbTaskCounter,
               prefix="/task_counter",
               auth_object=[Depends(authentication.get_current_user)],
          )
     
     async def create(self, data: CreateTaskCounter = Body(...) , user = Depends(authentication.get_current_user)):
          result = await super().create(data=CreateDbTaskCounter(**data.model_dump(), user_id=user.id))
          logging.info(f"Create result: {result}")  # Log the result
          if not result:
               # Handle error: maybe raise an HTTPException
               raise HTTPException(status_code=400, detail="Creation failed")
          return result
     
     async def update(self, id, data: UpdateCounterTime = Body(...) , user = Depends(authentication.get_current_user)):
          old_counter:TaskCounter = await self.get_one(id)
          if not old_counter:
               raise HTTPException(status_code=404, detail="Counter not found")
          if old_counter.task.user_id != user.id:
               raise HTTPException(status_code=403, detail="You are not allowed to update this counter")
          user_tasks:list[TaskAssignee] = self.controller.session.exec(select(TaskAssignee).where(TaskAssignee.assignee_id == user.id)).all()
          for task in user_tasks:
               if task.task.task_counter[0].is_counting:
                    if task.task.task_counter[0].id == id and not data.is_counting:
                         break
                    raise HTTPException(status_code=400, detail="You can't stop this counter because you have another running counter")
               
               
          result = await super().update(id=id, data=CreateTaskCounter(
               counter_type_id=old_counter.counter_type_id,
               end_time=data.end_time,
               is_counting=data.is_counting,
               notes=old_counter.notes,
               start_time=old_counter.start_time,
               task_id=old_counter.task
          ))
          logging.info(f"Update result: {result}")
          if not result:
               raise HTTPException(status_code=400, detail="Update failed")
          return result

task_counter_router = TaskCounterRouter()