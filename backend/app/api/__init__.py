from fastapi import APIRouter
from .routes_assessment import router as assessment_router
from .routes_system import router as system_router

api_router = APIRouter()
api_router.include_router(assessment_router)
api_router.include_router(system_router)

__all__ = ["api_router"]
