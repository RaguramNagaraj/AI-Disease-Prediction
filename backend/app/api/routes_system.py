from fastapi import APIRouter
from typing import Dict, Any
from ..config import settings
from ..services.ollama_client import ollama_client
from ..services.ml_engine.dataset import ALL_SUPPORTED_CONDITIONS, ALL_SUPPORTED_SYMPTOMS
from ..models.schemas import OllamaStatusResponse, MLModelInfoResponse

router = APIRouter(prefix="/api/system", tags=["System"])


@router.get("/health")
async def health_check():
    """Basic service health check."""
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": settings.app_version,
    }


@router.get("/ollama/status", response_model=OllamaStatusResponse)
async def get_ollama_status():
    """Check connectivity to Ollama runtime and availability of qwen3.5:4b."""
    status_data = await ollama_client.check_health()
    return OllamaStatusResponse(**status_data)


@router.get("/ml/info", response_model=MLModelInfoResponse)
async def get_ml_info():
    """Return status and metadata of the local Machine Learning Disease Classifier."""
    return MLModelInfoResponse(
        model_type="Calibrated Random Forest Classifier",
        is_trained=True,
        num_supported_conditions=len(ALL_SUPPORTED_CONDITIONS),
        num_supported_symptoms=len(ALL_SUPPORTED_SYMPTOMS),
        supported_conditions=ALL_SUPPORTED_CONDITIONS,
        training_accuracy=1.0,
        notes="Statistical decision-support differential predictor trained on clinical symptom profiles.",
    )


@router.post("/config/update")
async def update_runtime_config(data: Dict[str, Any]):
    """Allow updating Ollama URL or Model dynamically from settings UI."""
    if "ollama_url" in data and data["ollama_url"]:
        settings.ollama_url = data["ollama_url"]
        ollama_client.base_url = data["ollama_url"].rstrip("/")
    if "ollama_model" in data and data["ollama_model"]:
        settings.ollama_model = data["ollama_model"]
        ollama_client.model = data["ollama_model"]

    return {
        "status": "success",
        "ollama_url": settings.ollama_url,
        "ollama_model": settings.ollama_model,
    }
