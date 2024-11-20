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
from app.models.task.task_assignee_model import TaskAssignee
from app.models.task.task_category_model import TaskCategory
from app.models.task.task_coments_model import TaskComment
from app.models.task.task_counter_model import TaskCounter
from app.models.task.task_status_model import TaskStatus
from app.models.task.task_update_model import TaskUpdate
from app.models.task.task_accountable_model import TaskAccountable
from typing import Optional as Opt


class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    id: int = Field(
        sa_column=Column(Integer, primary_key=True, index=True, autoincrement=True)
    )
    title: str = Field(sa_column=Column(String, index=True))
    description: str = Field(sa_column=Column(String))
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
    project_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("projects.id", ondelete="CASCADE"),
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
            #  default=datetime.utcnow,
        )
    )
    status_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("task_status.id", ondelete="SET NULL"),
            nullable=True,
        )
    )
    category_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("task_category.id", ondelete="SET NULL"),
        )
    )
    task_status: Opt[TaskStatus] = Relationship(back_populates="task")
    task_update: list[TaskUpdate] = Relationship(back_populates="task")
    task_accountable: list["TaskAccountable"] = Relationship(back_populates="task")
    task_assign: list["TaskAssignee"] = Relationship(back_populates="task")
    task_category: "TaskCategory" = Relationship(back_populates="task")
    task_comment: list["TaskComment"] = Relationship(back_populates="task")
    task_counter: list["TaskCounter"] = Relationship(back_populates="task")