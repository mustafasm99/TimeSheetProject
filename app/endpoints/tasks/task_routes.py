from app.controller.task_controllers.task_controller import TaskController
from app.models.task.task_model import Task
from app.endpoints.base.base_router import BaseRouter
from .task_assignee_router import task_assignee_router , CreateTaskAssignee
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
     is_counting:bool = False


class CreateTaskForm(CreateTask):
     assignee:list[int]

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
          super().setup_routes()
     
     async def create(self, data: CreateTaskForm = Body(...)):
          result = await super().create(data=CreateTask(**data.model_dump()))
          logging.info(f"Create result: {result}")  # Log the result
          if not result:
               # Handle error: maybe raise an HTTPException
               raise HTTPException(status_code=400, detail="Creation failed")
          for assignee in data.assignee:
               await task_assignee_router.create(data=CreateTaskAssignee(
                    task_id=result.id,
                    assignee_id=assignee,
               )
          )
          return result
     
     async def update(self, id, data: CreateTask = Body(...) , user = Depends(authentication.get_current_user)):
          old_task:Task = await self.get_one(id=id)
          if not old_task:
               raise HTTPException(status_code=404, detail="Task not found")
          if user.id not in [assignee.assignee_id for assignee in old_task.task_assign]:
               raise HTTPException(status_code=403, detail="You are not allowed to update this task")
          
          my_task = await self.task_me(user=user)
          for task in my_task:
               if int(task.id) != int(id):
                    if task.is_counting:
                         raise HTTPException(status_code=403, detail="You cant run this task you have another task running")
               if task.id == id:
                    if task.is_counting and not data.is_counting:
                         raise HTTPException(status_code=403, detail="You cant stop a task that is not running")
                    if not task.is_counting and data.is_counting:
                         raise HTTPException(status_code=403, detail="You cant start a task that is running")
               
          
          result = await super().update(id=id, data=data)
          logging.info(f"Update result: {result}")
          if not result:
               raise HTTPException(status_code=400, detail="Update failed")
          return result
     
     async def task_me(self , user = Depends(authentication.get_current_user)):
          result = self.controller.get_user_tasks(user_id = user.id)
          logging.info(f"Task result: {result}")
          if not result:
               raise HTTPException(status_code=404, detail="No tasks found")
          return result

task_router = TaskRouter()