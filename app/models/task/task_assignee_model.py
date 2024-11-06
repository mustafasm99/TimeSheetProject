from sqlmodel import (
    ForeignKey,
    Boolean,
#     String,
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


class TaskAssignee(SQLModel, table=True):
    id: int = Field(
        sa_column=Column(Integer, primary_key=True, index=True, autoincrement=True)
    )
    assignee_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("users.id", ondelete="CASCADE"),
        ),
    )
    task_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("tasks.id", ondelete="CASCADE"),
        ),
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
    is_active: bool = Field(sa_column=Column(Boolean, default=True))
    task: "Task" = Relationship(back_populates="task_assign")
    user: "User" = Relationship(back_populates="user_assign")
