from sqlmodel import (
    ForeignKey,
    Boolean,
    String,
    DateTime,
    Field,
    Column,
    Integer,
    SQLModel,
    Relationship,
)
from datetime import datetime
from typing import TYPE_CHECKING
if TYPE_CHECKING:
     from .task_model import Task
     from ..user_model import User

class TaskComment(SQLModel , table=True):
     __tablename__ = "task_comments"
     id:int = Field(
           sa_column=Column(Integer, primary_key=True, index=True, autoincrement=True)
      )
     create_time: datetime = Field(
           sa_column=Column(
                DateTime,
                default=datetime.utcnow,
           )
      )
     update_time: datetime = Field(
           sa_column=Column(
                DateTime,
                default=datetime.utcnow,
                onupdate=datetime.utcnow,
           )
      )
     comment: str = Field(sa_column=Column(String, index=True))
     is_active: bool = Field(sa_column=Column(Boolean, default=True))
     task_id: int = Field(
          sa_column=Column(
               Integer,
               ForeignKey("tasks.id", ondelete="CASCADE"),
            ),
      )
     user_id: int = Field(
          sa_column=Column(
               Integer,
               ForeignKey("users.id", ondelete="CASCADE"),
            ),
      )
     task: "Task" = Relationship(back_populates="task_comment")
     user: "User" = Relationship(back_populates="user_comment")
     