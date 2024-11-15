from fastapi import APIRouter
from .auth.login_routes import router as login_router
from .auth.user_rolls import router as user_rolls_router
from .project.project_status_routes import project_status_router
from .project.project_routes import project_router
from .project.team_routes import team_router
from .tasks.task_routes import task_router
from .tasks.task_status import task_status_router
from .tasks.task_update_routes import task_update_router
from .tasks.task_accountable_router import task_accountable_router
from .tasks.task_assignee_router import task_assignee_router
from .tasks.task_category_router import task_category_router
from .tasks.task_comments_routes import task_comment_router
from .tasks.task_counter_router import task_counter_router
from .tasks.task_counter_type import task_counter_type_router
router = APIRouter()

router.include_router(login_router, prefix="/auth", tags=["Auth"])
router.include_router(user_rolls_router, prefix="/roll", tags=["Roll"])
router.include_router(project_status_router.router)
router.include_router(project_router.router)
router.include_router(team_router.router)
router.include_router(task_router.router)
router.include_router(task_status_router.router)
router.include_router(task_update_router.router)
router.include_router(task_accountable_router.router)
router.include_router(task_assignee_router.router)
router.include_router(task_category_router.router)
router.include_router(task_comment_router.router)
router.include_router(task_counter_router.router)
router.include_router(task_counter_type_router.router)