from app.models.project_model import Project_Status
from app.endpoints.base.base_router import BaseRouter
from app.controller.base_controller import BaseController

project_status_controller = BaseController(Project_Status)
project_status_router = BaseRouter[Project_Status](
     tag = ["Project Status"],
     prefix = "/project_status",
     controller=project_status_controller,
     model=Project_Status,
     create_type=Project_Status
)
