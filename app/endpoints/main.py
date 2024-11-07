from fastapi import APIRouter
from .auth.login_routes import router as login_router
from .auth.user_rolls import router as user_rolls_router
from .project.project_routes import project_status_router
router = APIRouter()

router.include_router(login_router, prefix="/auth", tags=["Auth"])
router.include_router(user_rolls_router, prefix="/roll", tags=["Roll"])
router.include_router(project_status_router.router)