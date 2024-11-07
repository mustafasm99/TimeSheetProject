from pydantic import BaseModel
from datetime import datetime

class CreateProject(BaseModel):
     title: str
     description: str
     start_date:datetime
     end_date:datetime
     members_limit:int
     team_id:int
     team_leader_id:int
     project_manager_id:int
     project_status_id:int


class CreateProjectStatus(BaseModel):
     title:str
     description:str
     is_active:bool = True