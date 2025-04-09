from fastapi import APIRouter

from app.api.v1 import auth, portfolios, feedback

router = APIRouter(
    prefix="/v1",
)

# Include all routers
router.include_router(auth.router)
router.include_router(portfolios.router)
router.include_router(feedback.router) 