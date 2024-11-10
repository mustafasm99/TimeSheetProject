from app.models.project_model import Project_Status
from app.endpoints.base.base_router import BaseRouter
from app.controller.base_controller import BaseController
from pydantic import BaseModel
from fastapi import Body , HTTPException
import logging
from app.controller.auth import authentication
from fastapi import Depends


class CreateProjectStatus(BaseModel):
    title: str
    description: str


class ProjectStatusRouter(BaseRouter[Project_Status, CreateProjectStatus]):
    def __init__(self):
        super().__init__(
            tag=["Project Status"],
            controller=BaseController(Project_Status),
            model=Project_Status,
            create_type=CreateProjectStatus,
            prefix="/project_status",
            auth_object=[Depends(authentication.get_admin_user)],
        )

    async def create(self, data: CreateProjectStatus = Body(...)):
        result = await super().create(data=data)
        logging.info(f"Create result: {result}")  # Log the result
        if not result:
            # Handle error: maybe raise an HTTPException
            raise HTTPException(status_code=400, detail="Creation failed")
        return result
    async def update(self, id, data: CreateProjectStatus = Body(...)):
          result = await super().update(id=id, data=data)
          logging.info(f"Update result: {result}")
          if not result:
               raise HTTPException(status_code=400, detail="Update failed")
          return result 
    
     
project_status_router = ProjectStatusRouter()
