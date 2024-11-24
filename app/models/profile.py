from sqlmodel import (
     Boolean,
     String,
     DateTime,
     Field,
     Column,
     Integer,
     SQLModel,
     Relationship,
     ForeignKey,
)
from typing import TYPE_CHECKING
if TYPE_CHECKING:
     from app.models.user_model import User


class Profile(SQLModel , table = True):
     __tablename__ = "profiles"
     id: int = Field(
         sa_column=Column(Integer, primary_key=True, index=True, autoincrement=True)
     )
     user_id: int = Field(
         sa_column=Column(
             Integer,
             ForeignKey("users.id", ondelete="CASCADE"),
             unique=True,  
         ),
     )
     profile_image: str = Field(
          sa_column=Column(
               String,
               nullable=True,
          )
     )
     bio: str = Field(
          sa_column=Column(
               String,
               nullable=True,
          )
     )
     
     user:"User"  = Relationship(back_populates="profile")