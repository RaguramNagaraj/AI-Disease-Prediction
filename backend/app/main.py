import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .api import api_router
from .services.ml_engine.trainer import train_and_evaluate

from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Verify and initialize ML model artifact on server startup if not present."""
    if not os.path.exists(settings.ml_model_path):
        print(f"[STARTUP] ML Model not found at {settings.ml_model_path}. Training initial artifact...")
        try:
            train_and_evaluate(save_path=settings.ml_model_path)
            print("[STARTUP] ML Model trained and saved.")
        except Exception as e:
            print(f"[STARTUP] Error training initial ML model: {e}")
    else:
        print(f"[STARTUP] Loaded existing ML Model artifact from {settings.ml_model_path}")
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Intelligent AI Disease Prediction and Symptom Assessment System with Qwen LLM & Scikit-Learn Classifier",
    lifespan=lifespan,
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins + ["*"],  # Allows local dev from Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(api_router)



@app.get("/")
async def root():
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "online",
        "docs_url": "/docs",
    }
