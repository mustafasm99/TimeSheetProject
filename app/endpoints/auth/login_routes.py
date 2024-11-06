from fastapi import  HTTPException , status , APIRouter
from app.models.types.loginForm import LoginForm
from ..base.base_response import BaseResponse
from app.models.user_model import User
from app.controller.auth import user , create_access_token
from app.controller.auth import login as user_login
from app.db.depend import db_connection
from datetime import datetime
router = APIRouter(
     # prefix="/auth",
     tags=["auth"]
)

@router.post("/login")
async def login(
     session:db_connection,
     login_form:LoginForm,
     ):
     user = user_login(
          data=login_form,
          session=session
     )
     if user:
          token = create_access_token({
               "sub":user.email,
               "name":user.name,
               "id":user.id
          })
          return BaseResponse(
               message="Login Success",
               data=token
          )
     return BaseResponse(
          message="Login Failed",
          data=None
     )
from pydantic import BaseModel
class UserCreate(BaseModel):
     email:str
     password:str
     name:str
     

@router.post("/register")
async def register(
     session:db_connection,
     data:UserCreate,
     ):
     print( "--------------------->", datetime.now())
     user = User(
          **data.model_dump(),
     )
     session.add(user)
     session.commit()
     return user