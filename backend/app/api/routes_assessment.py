from fastapi import APIRouter, HTTPException, status
from typing import List, Dict, Any
from ..models.schemas import (
    SymptomInput,
    AssessmentResponse,
    EmergencyScreeningResult,
)
from ..services.assessment_service import assessment_service
from ..services.emergency_screener import EmergencyScreener
from ..services.ml_engine.dataset import ALL_SUPPORTED_SYMPTOMS, CLINICAL_DISEASE_PROFILES

router = APIRouter(prefix="/api/assessment", tags=["Assessment"])


@router.post("/evaluate", response_model=AssessmentResponse)
async def evaluate_symptoms(input_data: SymptomInput):
    """
    Primary symptom assessment endpoint.
    Performs emergency screening, ML differential classification, and LLM reasoning.
    """
    if not input_data.symptoms:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one symptom must be provided."
        )

    try:
        result = await assessment_service.assess_symptoms(input_data)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during assessment: {str(e)}"
        )


@router.post("/emergency-check", response_model=EmergencyScreeningResult)
async def check_emergency(data: Dict[str, Any]):
    """
    Lightweight, instant check for life-threatening emergency warning signs.
    Can be polled or triggered in real-time as user selects symptoms.
    """
    symptoms = data.get("symptoms", [])
    context = data.get("context", "")

    if isinstance(symptoms, str):
        symptoms = [symptoms]

    return EmergencyScreener.evaluate(symptoms=symptoms, additional_context=context)


@router.get("/symptoms/list", response_model=List[str])
async def list_standard_symptoms():
    """Return alphabetical list of recognized clinical symptoms for autocomplete and tags."""
    return ALL_SUPPORTED_SYMPTOMS


@router.get("/symptoms/categories")
async def list_symptoms_by_category():
    """Return categorized symptoms for intuitive user browsing."""
    categories: Dict[str, List[str]] = {
        "Respiratory & Chest": [
            "persistent cough", "dry cough", "productive cough with discolored phlegm",
            "shortness of breath", "mild wheezing", "chest tightness", "chest discomfort with coughing",
            "pleuritic chest pain", "rapid shallow breathing",
        ],
        "Head, Eyes, Ears, Nose & Throat": [
            "runny nose", "sneezing", "sore throat", "nasal congestion", "facial pain and pressure",
            "throbbing unilateral headache", "dull aching head pain", "photophobia (light sensitivity)",
            "itchy watery eyes", "loss of taste", "loss of smell", "ear pain",
        ],
        "Gastrointestinal & Abdominal": [
            "nausea", "vomiting", "watery diarrhea", "abdominal cramping", "heartburn",
            "acid regurgitation", "bloating", "loss of appetite", "sour taste in mouth",
        ],
        "Systemic & Fever": [
            "high fever", "low grade fever", "chills", "severe body aches", "extreme fatigue",
            "chronic fatigue", "cold intolerance", "drenching sweating", "unexplained weight loss",
        ],
        "Urinary & Pelvic": [
            "burning sensation during urination", "frequent urge to urinate",
            "cloudy or strong smelling urine", "lower pelvic pressure", "frequent urination (polyuria)",
        ],
        "Musculoskeletal & Skin": [
            "joint pain", "joint stiffness", "localized red skin rash", "intense skin itching",
            "dry cracked scaly skin", "muscle aches", "tenderness on scalp or neck muscles",
        ],
    }
    return categories
