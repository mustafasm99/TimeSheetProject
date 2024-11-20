from sqlmodel import (
    ForeignKey,
    Boolean,
    JSON,
    DateTime,
    Field,
    Column,
    Integer,
    SQLModel,
    Relationship,
)
from datetime import datetime
from typing import TYPE_CHECKING , Any

if TYPE_CHECKING:
    from .task_model import Task
    from ..user_model import User
    
class TaskUpdate(SQLModel, table=True):
    __tablename__ = "task_update" 
    id: int = Field(
        sa_column=Column(Integer, primary_key=True, index=True, autoincrement=True)
    )
    task_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("tasks.id", ondelete="CASCADE"),
        ),
    )
    update_time: datetime = Field(
        sa_column=Column(
            DateTime,
            default=datetime.utcnow,
            onupdate=datetime.utcnow,
        )
    )
    update: dict[str , Any] = Field(
         sa_column=Column(
              JSON,
              index=True,
              nullable=True
          )
         )
    user_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("users.id", ondelete="CASCADE"),
        ),
    )
    is_active: bool = Field(sa_column=Column(Boolean, default=True))
    task: "Task" = Relationship(back_populates="task_update")
    user: "User" = Relationship(back_populates="task_update")