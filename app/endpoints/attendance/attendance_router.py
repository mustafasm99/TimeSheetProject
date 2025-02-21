from app.endpoints.base.base_router import BaseRouter
from app.models.attendance import Attendance
from app.models.user_model import User
from app.controller.auth import authentication
from app.controller.base_controller import BaseController
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

class CreateAttendance(BaseModel):
    token:str
    
class AttendanceRouter(BaseRouter[Attendance , CreateAttendance]):
     def __init__(self):
          super().__init__(
               model = Attendance,
               prefix = "/attendance",
               tag = ["attendance"],
               # auth_object=[authentication.get_current_user],
               create_type=CreateAttendance,
               controller=BaseController(Attendance)
               
          )
     
     async def create(self, attendance:CreateAttendance, user:User=Depends(authentication.get_current_user)):
          attendance = Attendance(
               user_id = user.id,
               token = attendance.token
          )
          await super().create(attendance)
          return attendance
     
     async def update(self, attendance:CreateAttendance, user:User=Depends(authentication.get_current_user)):
          attendance = Attendance(
               user_id = user.id,
               token = attendance.token
          )
          await super().update(attendance)
          return attendance
     

attendance_router = AttendanceRouter()