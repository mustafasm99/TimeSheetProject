from app.controller.base_controller import BaseController
from app.models.project_model import Project_Status , Project , Team



class ProjectStatusController(BaseController[Project_Status]):
     pass

class ProjectController(BaseController[Project]):
     pass

class TeamController(BaseController[Team]):
     pass
