from app.models.project_model import Project
from app.endpoints.base.base_router import BaseRouter
from app.controller.base_controller import BaseController
from pydantic import BaseModel
from fastapi import Body, HTTPException
import logging
from app.controller.auth import authentication
from fastapi import Depends

class CreateProject(BaseModel):
    title: str
    description: str
#     status: str
    start_date: str
    end_date: str
    team_id: int
    members_limit: int
    team_leader_id: int
    project_manager_id: int
    project_status_id: int

class ProjectRouter(BaseRouter[Project, CreateProject]):
     def __init__(self):
          super().__init__(
               tag=["Project"],
               controller=BaseController(Project),
               model=Project,
               create_type=CreateProject,
               prefix="/project",
               auth_object=[Depends(authentication.get_current_user)],
          )
     
     async def create(self, data: CreateProject = Body(...)):
          result = await super().create(data=data)
          logging.info(f"Create result: {result}")  # Log the result
          if not result:
               # Handle error: maybe raise an HTTPException
               raise HTTPException(status_code=400, detail="Creation failed")
          return result
     
     async def update(self, id, data: CreateProject = Body(...)):
          result = await super().update(id=id, data=data)
          logging.info(f"Update result: {result}")
          if not result:
               raise HTTPException(status_code=400, detail="Update failed")
          return result

project_router = ProjectRouter()
