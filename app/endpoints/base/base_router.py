from fastapi import HTTPException, status, APIRouter, Body
from typing import Generic, TypeVar, Type, List, Union
from enum import Enum
from app.controller.base_controller import BaseController
from sqlmodel import SQLModel
from dataclasses import dataclass
from pydantic import BaseModel
from abc import abstractmethod
from app.models.user_model import User


_ModelType = TypeVar("_ModelType", bound=SQLModel)
_CreateType = TypeVar("_CreateType", bound=BaseModel)

@dataclass
class BaseRouter(Generic[_ModelType, _CreateType]):
    def __init__(
        self,
        tag: list[Union[str, Enum]] | None,
        controller: BaseController,
        model: Type[_ModelType],       # Explicitly pass model type
        create_type: Type[_CreateType], # Explicitly pass create_type
        auth_object:User|None = None,
        prefix: str = "/",
    ):
        self.router = APIRouter(prefix=prefix, tags=tag)
        self.controller = controller
        self.model = model
        self.create_type = create_type
        self.auth_object = auth_object if auth_object else []
        self.setup_routes()

    def setup_routes(self):
        # Register routes with dynamically inferred create_type for request body
        self.router.add_api_route(
            path="/",
            endpoint=self.read_all,
            methods=["GET"],
            # response_model=List[self.model],
            dependencies=self.auth_object,
        )
        self.router.add_api_route(
            path="/{id}",
            endpoint=self.get_one,
            methods=["GET"],
            # response_model=self.model,
            dependencies=self.auth_object,
        )
        self.router.add_api_route(
            path="/",
            endpoint=self.create,
            methods=["POST"],
            status_code=status.HTTP_201_CREATED,
            dependencies=self.auth_object,
            summary="Create a new item",
            description="Creates an item based on the provided schema.",
        )
        self.router.add_api_route(
            path="/{id}",
            endpoint=self.update,
            methods=["PUT"],
            # response_model=self.model,
            dependencies=self.auth_object,
            status_code=status.HTTP_200_OK,
        )
        self.router.add_api_route(
            path="/{id}",
            endpoint=self.delete,
            methods=["DELETE"],
            dependencies=self.auth_object,
            status_code=status.HTTP_204_NO_CONTENT,
        )
    # @abstractmethod
    async def read_all(self):
        return await self.controller.read()

    # @abstractmethod
    async def get_one(self, id: int):
        data = await self.controller.get(id)
        if not data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Item with id {id} not found",
            )
        return data
    
    @abstractmethod
    async def create(self, data:_CreateType = Body(...)):  # Explicitly type as _CreateType
        postedData = self.model(**data.model_dump())
        return await self.controller.create(postedData)

    # @abstractmethod
    async def update(self, id: int, data: _CreateType):
        updateData = self.model(**data.model_dump())
        return await self.controller.update(id, updateData)

    # @abstractmethod
    async def delete(self, id: int):
        if await self.controller.delete(id):
            return HTTPException(status_code=status.HTTP_204_NO_CONTENT)
        else:    
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    def get_image_url(self , image_path:str):
        image_path = image_path.replace("app/","")
        image_path = image_path.replace("app\\","")
        image_path = image_path.replace("\\","/")
        image_path = image_path.replace("media/","")
        return f"/static/{image_path}"
    
    def get_by_field(self , field:str , value:str):
        return self.controller.get_by_field(field,value)
