from fastapi import FastAPI
from fastapi.routing import APIRoute
from core.conf import settings

def custom_generate_unique_id(router:APIRoute):
     return f"{router.tags[0]}-{router.name}"


app = FastAPI(
     title = settings.PROJECT_NAME,
     openapi_url=f"/api/{settings.PROJECT_NAME}/{settings.API_VERSION}/openapi.json",
     generate_unique_id_function=custom_generate_unique_id,
)



