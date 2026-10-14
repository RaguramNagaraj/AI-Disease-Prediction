from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    """Application Configuration Settings."""

    app_name: str = "HealthAI - Disease Prediction & Symptom Assessment System"
    app_version: str = "1.0.0"
    environment: str = "development"
    debug: bool = False

    # Ollama Configuration
    ollama_url: str = "http://localhost:11434"
    ollama_model: str = "qwen3.5:4b"
    ollama_timeout_seconds: float = 45.0

    # ML Classifier Engine Configuration
    enable_ml_classifier: bool = True
    ml_model_path: str = "backend/app/services/ml_engine/models/disease_classifier.joblib"

    # Emergency Services Configuration
    emergency_contact_india: str = "112"
    emergency_contact_international: str = "911 / Local Emergency Dispatch"

    # CORS Configuration
    cors_origins: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()

