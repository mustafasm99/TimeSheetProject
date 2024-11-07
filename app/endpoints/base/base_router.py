from fastapi import HTTPException, status, APIRouter, Depends
from typing import Generic, TypeVar, Type, List
from enum import Enum
from app.controller.base_controller import BaseController
from sqlmodel import SQLModel
from app.models.project_model import Project_Status
from dataclasses import dataclass

_T = TypeVar("_T", bound=SQLModel)


@dataclass
class BaseRouter(Generic[_T]):
    def __init__(
        self,
        tag: list[str | Enum] | None,
        controller: BaseController,
        model: Type[_T],
        create_type: Type[_T],
        prefix: str = "/",
    ):
        # print("BaseRouter" , type[_T])
        self.router = APIRouter(prefix=prefix, tags=tag)
        self.controller = controller
        self.model: type[_T]
        self.create_type = create_type
        # Add routers
        self.router.add_api_route(
            path="/",
            endpoint=self.read_all,
            methods=["GET"],
            response_model=model,
        )
        self.router.add_api_route(
            path="/{id}",
            endpoint=self.get_one,
            methods=["GET"],
            response_model=model,
        )
        self.router.add_api_route(
            path="/",
            endpoint=self.create,
            methods=["POST"],
            response_model=create_type,
            status_code=status.HTTP_201_CREATED,
        )
        self.router.add_api_route(
            path="/{id}",
            endpoint=self.update,
            methods=["PUT"],
            response_model=create_type,
            status_code=status.HTTP_200_OK,
        )
        self.router.add_api_route(
               path="/{id}",
               endpoint=self.delete,
               methods=["DELETE"],
               status_code=status.HTTP_204_NO_CONTENT,
            )

    async def read_all(self):
        return self.controller.read()

    async def get_one(self, id: int):
        data = self.controller.get(id)
        if not data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Item with id {id} not found",
            )
        return data

    async def create(self, data: _T):
        return self.controller.create(data)

    async def update(self, id: int, data: _T):
        return self.controller.update(id, data)

    async def delete(self, id: int):
        return self.controller.delete(id)
