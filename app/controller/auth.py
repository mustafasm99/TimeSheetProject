from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import Depends, HTTPException, status
from app.models.types.loginForm import LoginForm
from jose import JWTError, jwt
from datetime import timedelta, datetime
from app.core.conf import settings
from app.models.user_model import User
from app.db.depend import db_connection
from sqlmodel import Session , select
from typing import Annotated , Optional


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(data: dict):
     to_encode = data.copy()
     expire_date = datetime.utcnow() + timedelta(minutes=30)
     to_encode.update({"exp": expire_date})
     encode_jwt = jwt.encode(to_encode,settings.API_SECRET ,algorithm="HS256")
     return encode_jwt

def get_current_user(
     session:db_connection,
     token: str = Depends(oauth2_scheme)
     )-> User:
     credentials_exception = HTTPException(
          status_code=status.HTTP_401_UNAUTHORIZED,
          detail="Could not validate credentials",
          headers={"WWW-Authenticate": "Bearer"},
     )
     try:
          payload = jwt.decode(token, settings.API_SECRET, algorithms=["HS256"])
          username: str = payload.get("sub")
          if username is None:
               raise credentials_exception
     except JWTError:
          raise credentials_exception
     query = select(User).where(User.email == username)
     user = session.exec(query).first()
     if not user :
          raise credentials_exception
     return user

user = Annotated[User, Depends(get_current_user)]

def login(data:LoginForm , session:Session)-> Optional["User"]:
        query = select(User).where(User.email == data.username)
        user = session.exec(query).first()
        return user