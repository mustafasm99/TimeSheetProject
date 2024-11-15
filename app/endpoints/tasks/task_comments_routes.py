from app.models.task.task_coments_model import TaskComment
from app.endpoints.base.base_router import BaseRouter
from app.controller.base_controller import BaseController
from pydantic import BaseModel
from fastapi import Body, HTTPException
import logging
from app.controller.auth import authentication
from fastapi import Depends


class CreateTaskComment(BaseModel):
     comment: str
     task_id: int
     user_id: int


class TaskCommentRouter(BaseRouter[TaskComment, CreateTaskComment]):
     def __init__(self):
          super().__init__(
               tag=["TaskComment"],
               controller=BaseController(TaskComment),
               model=TaskComment,
               create_type=CreateTaskComment,
               prefix="/task_comment",
               auth_object=[Depends(authentication.get_current_user)],
          )
     
     async def create(self, data: CreateTaskComment = Body(...)):
          result = await super().create(data=data)
          logging.info(f"Create result: {result}")  # Log the result
          if not result:
               # Handle error: maybe raise an HTTPException
               raise HTTPException(status_code=400, detail="Creation failed")
          return result
     
     async def update(self, id, data: CreateTaskComment = Body(...)):
          result = await super().update(id=id, data=data)
          logging.info(f"Update result: {result}")
          if not result:
               raise HTTPException(status_code=400, detail="Update failed")
          return result


task_comment_router = TaskCommentRouter()