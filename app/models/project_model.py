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


class Project(SQLModel, table=True):
    __tablename__ = "projects"
    id: int = Field(
        sa_column=Column(Integer, primary_key=True, index=True, autoincrement=True)
    )
    name: str = Field(sa_column=Column(String, index=True))
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

    team_id: int = Field(
        sa_column=Column(
             Integer,
             ForeignKey("teams.id", ondelete="CASCADE"),
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
    members_limit: int = Field(sa_column=Column(Integer))
    members_counter: int = Field(sa_column=Column(Integer))
    team_leader_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("users.id", ondelete="CASCADE"),
        ),
    )
    is_completed: bool = Field(sa_column=Column(Boolean, default=False))
    project_manager_id: int = Field(
            sa_column=Column(
               Integer,
               ForeignKey("users.id", ondelete="CASCADE"),
            ),
     )
    team: "Team" = Relationship(back_populates="projects") 


class Team(SQLModel , table=True):
     """
          Team model
          manage members for each project
     """
     __tablename__ = "teams"
     id: int = Field(
        sa_column=Column(Integer, primary_key=True, index=True, autoincrement=True)
     )
     name: str = Field(sa_column=Column(String, index=True))
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
     team_leader_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("users.id", ondelete="CASCADE"),
        ),
     )
     members_limit: int = Field(sa_column=Column(
          Integer,
          default=10
          )
     )
     members_counter: int = Field(sa_column=Column(Integer , default=0))
     project: "Project" = Relationship(back_populates="team")
     