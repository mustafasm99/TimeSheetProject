from fastapi import APIRouter
from .auth.login_routes import router as login_router


router = APIRouter()

router.include_router(login_router, prefix="/auth", tags=["auth"])