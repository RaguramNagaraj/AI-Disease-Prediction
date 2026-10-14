from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum


class SeverityLevel(str, Enum):
    MILD = "mild"
    MODERATE = "moderate"
    SEVERE = "severe"


class ProgressionStatus(str, Enum):
    IMPROVING = "improving"
    STABLE = "stable"
    WORSENING = "worsening"


class TriageLevel(str, Enum):
    EMERGENCY = "emergency"
    URGENT_SAME_DAY = "urgent_same_day"
    ROUTINE_PRIMARY_CARE = "routine_primary_care"
    SELF_CARE_MONITOR = "self_care_monitor"


class SymptomInput(BaseModel):
    """User submitted symptoms and clinical context."""
    symptoms: List[str] = Field(..., min_length=1, description="List of reported symptoms")
    duration: Optional[str] = Field(None, description="Duration/onset of symptoms (e.g., '2 days')")
    severity: Optional[SeverityLevel] = Field(None, description="Perceived symptom severity")
    progression: Optional[ProgressionStatus] = Field(None, description="Symptom progression trend")
    age_group: Optional[str] = Field(None, description="Age group (e.g., 'adult', 'child', 'senior')")
    biological_sex: Optional[str] = Field(None, description="Biological sex (e.g., 'male', 'female', 'not_specified')")
    medical_history: Optional[List[str]] = Field(default_factory=list, description="Voluntary chronic conditions")
    allergies: Optional[List[str]] = Field(default_factory=list, description="Voluntary known allergies")
    answers: Optional[Dict[str, str]] = Field(default_factory=dict, description="Answers to follow-up questions")


class EmergencyScreeningResult(BaseModel):
    """Emergency screening evaluation result."""
    is_emergency: bool = Field(..., description="True if red-flag life-threatening signs are detected")
    red_flags_detected: List[str] = Field(default_factory=list, description="List of identified emergency triggers")
    emergency_message: Optional[str] = Field(None, description="Immediate instruction message for user")
    emergency_numbers: Dict[str, str] = Field(default_factory=dict, description="Emergency dispatch numbers")
    immediate_actions: List[str] = Field(default_factory=list, description="Life-safety immediate guidance")


class ConditionCandidate(BaseModel):
    """Potential health condition for discussion with physician."""
    condition_name: str = Field(..., description="Name of possible condition")
    confidence_category: str = Field(..., description="Possibility category (e.g., 'Possible Match', 'Consider')")
    match_score: float = Field(..., ge=0.0, le=1.0, description="Relative symptom overlap score (0.0 - 1.0)")
    overview: str = Field(..., description="Educational overview of condition")
    common_symptoms: List[str] = Field(default_factory=list, description="Hallmark symptoms")
    matched_symptoms: List[str] = Field(default_factory=list, description="Symptoms user reported that match this condition")
    questions_for_doctor: List[str] = Field(default_factory=list, description="Key questions to bring to the doctor")


class FollowUpQuestion(BaseModel):
    """Contextual clarifying question when symptom data is insufficient."""
    id: str = Field(..., description="Unique question identifier")
    question: str = Field(..., description="The clinical follow-up question")
    reason: str = Field(..., description="Why this question is relevant to the assessment")
    options: Optional[List[str]] = Field(default_factory=list, description="Quick selectable options if applicable")


class AssessmentResponse(BaseModel):
    """Complete structured assessment report."""
    assessment_id: str
    timestamp: str
    is_emergency: bool = False
    emergency_details: Optional[EmergencyScreeningResult] = None
    symptom_summary: str
    triage_level: TriageLevel
    triage_explanation: str
    possible_conditions: List[ConditionCandidate] = Field(default_factory=list)
    clinical_notes: str
    supporting_info: List[str] = Field(default_factory=list)
    missing_info: List[str] = Field(default_factory=list)
    follow_up_questions: List[FollowUpQuestion] = Field(default_factory=list)
    general_self_care: List[str] = Field(default_factory=list)
    red_flags: List[str] = Field(default_factory=list)
    medical_disclaimer: str
    engine_source: str = Field("hybrid", description="'ollama_qwen', 'clinical_ml_engine', or 'hybrid'")
    model_name: Optional[str] = None


class OllamaStatusResponse(BaseModel):
    """Status of local Ollama runtime."""
    connected: bool
    url: str
    configured_model: str
    model_available: bool
    available_models: List[str] = Field(default_factory=list)
    message: str


class MLModelInfoResponse(BaseModel):
    """Information about the machine learning classifier engine."""
    model_type: str
    is_trained: bool
    num_supported_conditions: int
    num_supported_symptoms: int
    supported_conditions: List[str]
    training_accuracy: Optional[float] = None
    notes: str
