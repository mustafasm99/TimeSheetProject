from app.models.task.task_category_model import TaskCategory
from app.endpoints.base.base_router import BaseRouter
from app.controller.base_controller import BaseController
from pydantic import BaseModel
from fastapi import Body, HTTPException
import logging
from app.controller.auth import authentication
from fastapi import Depends

class CreateTaskCategory(BaseModel):
     category: str


class TaskCategoryRouter(BaseRouter[TaskCategory, CreateTaskCategory]):
     def __init__(self):
          super().__init__(
               tag=["Task Category"],
               controller=BaseController(TaskCategory),
               model=TaskCategory,
               create_type=CreateTaskCategory,
               prefix="/task_category",
               auth_object=[Depends(authentication.get_current_user)],
          )
     
     async def create(self, data: CreateTaskCategory = Body(...)):
          result = await super().create(data=data)
          logging.info(f"Create result: {result}")  # Log the result
          if not result:
               # Handle error: maybe raise an HTTPException
               raise HTTPException(status_code=400, detail="Creation failed")
          return result
     
     async def update(self, id, data: CreateTaskCategory = Body(...)):
          result = await super().update(id=id, data=data)
          logging.info(f"Update result: {result}")
          if not result:
               raise HTTPException(status_code=400, detail="Update failed")
          return result

task_category_router = TaskCategoryRouter()
