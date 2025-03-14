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
    from .task_counter_type_model import TaskCounterType
class TaskCounter(SQLModel, table=True):
    __tablename__ = "task_counter"
    id: int = Field(
        sa_column=Column(Integer, primary_key=True, index=True, autoincrement=True)
    )
    task_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("tasks.id", ondelete="CASCADE"),
        ),
    )
    start_time: datetime = Field(
        sa_column=Column(
            DateTime,
            default=datetime.utcnow,
        )
    )
    end_time: datetime = Field(
        sa_column=Column(
            DateTime,
            default=datetime.utcnow,
        )
    )
    notes: str = Field(sa_column=Column(String, index=True))
    counter_type_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("task_counter_type.id", ondelete="CASCADE"),
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
    is_counting: bool = Field(sa_column=Column(Boolean, default=True))
    is_active: bool = Field(sa_column=Column(Boolean, default=True))
    task: "Task" = Relationship(back_populates="task_counter")
    counter_type: "TaskCounterType" = Relationship(back_populates="task_counter")
