from app.endpoints.base.base_router import BaseRouter
from app.models.attendance import Attendance
from app.models.user_model import User
from app.controller.auth import authentication
from app.controller.base_controller import BaseController
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.qr import qr
from fastapi.responses import FileResponse
from fastapi import Path , File
from app.core.conf import settings
import uuid
from sqlmodel import select , func
from datetime import datetime



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
     
     def setup_routes(self):
          self.router.add_api_route(
               path="/token",
               endpoint=self.get_token,
               methods=["GET"],
          )
          self.router.add_api_route(
               path="/read-token/{token}",
               endpoint=self.attendance,
               methods=["GET"],
          )
          self.router.add_api_route(
               path="/today",
               endpoint=self.today_attendance,
               methods=["GET"],
          )
          self.router.add_api_route(
               path="/me",
               endpoint=self.get_me,
               methods=["GET"],
          )
          return super().setup_routes()
     
     
     
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
     
     async def get_token(self, user: User = Depends(authentication.get_current_user))->FileResponse:          
          # Save the QR code to a temporary file
          qr_file_path = settings.MEDIA_PATH + f"/qr/{uuid.uuid4()}.png"
          qr.create_token(user.id)
          qr.get_new_qr().save(qr_file_path)
          
          # Return the file as a response and delete it after use
          response = FileResponse(qr_file_path, media_type="image/png", filename="attendance_qr.png")
          response.headers["X-Delete-File"] = "true"
          
          
          return response
     
     async def attendance(self, token:str = Path(), user:User=Depends(authentication.get_current_user),):
          # try:
               old_attendance = await self.get_by_field("token", token)
               if old_attendance:
                    raise HTTPException(status_code=400, detail="Attendance already marked")
               token_data = qr.decode_token(token)
               
               if token_data["sub"] != str(user.id):
                    raise HTTPException(status_code=403, detail="Invalid token")
               attendance = Attendance(
                    user_id = user.id,
                    token = token
               )
               await super().create(attendance)
               return attendance
          # except:
          #      raise HTTPException(status_code=400, detail="Invalid token")
     
     async def today_attendance(self, user:User=Depends(authentication.get_current_user))->Attendance|None:
          attendance = self.controller.session.exec(
               select(
                    Attendance
               ).where(
                    Attendance.user_id == user.id,
                    func.date(Attendance.day) == func.date(datetime.now()),
               )
          ).first()
          return attendance
     
     async def get_me(self, user:User=Depends(authentication.get_current_user))->list[Attendance|None]|None:
          attendance = self.controller.session.exec(
               select(
                    Attendance
               ).where(
                    Attendance.user_id == user.id
               )
          ).all()
          return attendance
     

attendance_router = AttendanceRouter()