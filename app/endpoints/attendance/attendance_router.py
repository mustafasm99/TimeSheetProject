from app.endpoints.base.base_router import BaseRouter
from app.models.attendance import Attendance
from app.models.user_model import User
from app.controller.auth import authentication
from app.controller.base_controller import BaseController
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi.responses import FileResponse
import os

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
     
     async def get_token(self, user: User = Depends(authentication.get_current_user)):
          import qrcode
          token = jwt.encode({"sub": user.id, "exp": datetime.utcnow() + timedelta(minutes=30)}, "secret-key-to-attendance", algorithm="HS256")
          qr = qrcode.make(token)
          
          # Save the QR code to a temporary file
          qr_file_path = "/tmp/attendance_qr.png"
          qr.save(qr_file_path)
          
          # Return the file as a response and delete it after use
          response = FileResponse(qr_file_path, media_type="image/png", filename="attendance_qr.png")
          response.headers["X-Delete-File"] = "true"
          
          @response.background
          async def cleanup():
               if os.path.exists(qr_file_path):
                    os.remove(qr_file_path)
          
          return response
     

attendance_router = AttendanceRouter()