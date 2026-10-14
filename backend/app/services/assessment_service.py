import uuid
from datetime import datetime, timezone
from typing import List, Optional
from ..models.schemas import (
    SymptomInput,
    AssessmentResponse,
    TriageLevel,
    ConditionCandidate,
    FollowUpQuestion,
    SeverityLevel,
    ProgressionStatus,
)
from ..config import settings
from .emergency_screener import EmergencyScreener
from .ml_engine.classifier import ClassifierDiseasePredictor
from .prompt_builder import build_assessment_prompt
from .ollama_client import ollama_client


class AssessmentService:
    """Core assessment orchestrator coordinating screening, ML classifier, and LLM reasoning."""

    def __init__(self):
        self.ml_predictor = ClassifierDiseasePredictor(model_path=settings.ml_model_path)

    async def assess_symptoms(self, data: SymptomInput) -> AssessmentResponse:
        """Execute full assessment pipeline with safety screening and tiered fallback."""
        assessment_id = f"HA-{uuid.uuid4().hex[:8].upper()}"
        timestamp = datetime.now(timezone.utc).isoformat()

        # 1. Immediate Emergency Red-Flag Screening (Requirement C)
        emergency_result = EmergencyScreener.evaluate(
            symptoms=data.symptoms,
            additional_context=f"{data.severity.value if data.severity else ''} {data.progression.value if data.progression else ''}"
        )

        if emergency_result.is_emergency:
            # Immediate return without LLM delay
            return AssessmentResponse(
                assessment_id=assessment_id,
                timestamp=timestamp,
                is_emergency=True,
                emergency_details=emergency_result,
                symptom_summary=f"Critical symptoms reported: {', '.join(data.symptoms)}",
                triage_level=TriageLevel.EMERGENCY,
                triage_explanation="Potentially life-threatening emergency warning signs detected. Immediate emergency medical intervention is required.",
                possible_conditions=[],
                clinical_notes="Assessment halted due to identified medical emergency indicators. Do not rely on digital screening.",
                supporting_info=emergency_result.red_flags_detected,
                missing_info=["Immediate emergency medical evaluation required."],
                follow_up_questions=[],
                general_self_care=["Do not delay care. Do not attempt home remedies."],
                red_flags=emergency_result.red_flags_detected,
                medical_disclaimer="EMERGENCY NOTICE: Immediate medical attention required. Call 112 (India) or your local emergency number.",
                engine_source="emergency_screener",
                model_name=None,
            )

        # 2. Run ML Disease Prediction Engine
        ml_candidates: List[ConditionCandidate] = []
        if settings.enable_ml_classifier:
            try:
                ml_candidates = self.ml_predictor.predict(symptoms=data.symptoms, top_k=4)
            except Exception as e:
                print(f"[ASSESSMENT_SERVICE] ML Predictor error: {e}")

        # 3. Construct Clinical Prompt for Ollama Qwen
        prompt = build_assessment_prompt(data, ml_candidates)

        # 4. Attempt LLM Assessment via Ollama
        llm_response = await ollama_client.generate_chat_assessment(prompt)

        if llm_response and isinstance(llm_response, dict) and "possible_conditions" in llm_response:
            try:
                return self._build_from_llm_response(
                    assessment_id=assessment_id,
                    timestamp=timestamp,
                    data=data,
                    llm_data=llm_response,
                    ml_candidates=ml_candidates,
                )
            except Exception as e:
                print(f"[ASSESSMENT_SERVICE] Error formatting LLM response: {e}")

        # 5. Graceful Fallback: Clinical ML Rule Engine
        return self._build_fallback_assessment(
            assessment_id=assessment_id,
            timestamp=timestamp,
            data=data,
            ml_candidates=ml_candidates,
        )

    def _build_from_llm_response(
        self,
        assessment_id: str,
        timestamp: str,
        data: SymptomInput,
        llm_data: dict,
        ml_candidates: List[ConditionCandidate],
    ) -> AssessmentResponse:
        """Parse and structure validated LLM response."""
        # Convert triage_level
        raw_triage = llm_data.get("triage_level", "routine_primary_care").lower()
        if "emergency" in raw_triage:
            triage = TriageLevel.EMERGENCY
        elif "urgent" in raw_triage:
            triage = TriageLevel.URGENT_SAME_DAY
        elif "self" in raw_triage:
            triage = TriageLevel.SELF_CARE_MONITOR
        else:
            triage = TriageLevel.ROUTINE_PRIMARY_CARE

        # Conditions
        conditions = []
        for c in llm_data.get("possible_conditions", []):
            if isinstance(c, dict) and "condition_name" in c:
                conditions.append(
                    ConditionCandidate(
                        condition_name=c.get("condition_name", "Unspecified Condition"),
                        confidence_category=c.get("confidence_category", "Possible Consideration"),
                        match_score=min(max(float(c.get("match_score", 0.5)), 0.05), 0.95),
                        overview=c.get("overview", "Clinical entity to discuss with physician."),
                        common_symptoms=c.get("common_symptoms", []),
                        matched_symptoms=c.get("matched_symptoms", data.symptoms),
                        questions_for_doctor=c.get("questions_for_doctor", []),
                    )
                )

        if not conditions and ml_candidates:
            conditions = ml_candidates

        # Follow up questions
        follow_ups = []
        for q in llm_data.get("follow_up_questions", []):
            if isinstance(q, dict) and "question" in q:
                follow_ups.append(
                    FollowUpQuestion(
                        id=q.get("id", f"q_{len(follow_ups)+1}"),
                        question=q.get("question", ""),
                        reason=q.get("reason", "Clarification"),
                        options=q.get("options", []),
                    )
                )

        return AssessmentResponse(
            assessment_id=assessment_id,
            timestamp=timestamp,
            is_emergency=False,
            symptom_summary=llm_data.get(
                "symptom_summary",
                f"Assessment of {', '.join(data.symptoms)} over {data.duration or 'unspecified duration'}."
            ),
            triage_level=triage,
            triage_explanation=llm_data.get(
                "triage_explanation",
                "Clinical recommendation based on reported symptom severity and progression."
            ),
            possible_conditions=conditions,
            clinical_notes=llm_data.get(
                "clinical_notes",
                "Analysis generated based on reported symptoms and medical knowledge patterns."
            ),
            supporting_info=llm_data.get("supporting_info", data.symptoms),
            missing_info=llm_data.get("missing_info", ["Objective vital signs", "Physical examination findings"]),
            follow_up_questions=follow_ups,
            general_self_care=llm_data.get("general_self_care", [
                "Maintain adequate fluid intake and physical rest.",
                "Monitor for any change or worsening of symptoms.",
                "Seek medical evaluation if symptoms persist or deteriorate.",
            ]),
            red_flags=llm_data.get("red_flags", [
                "Sudden severe shortness of breath or chest discomfort",
                "Persistent high fever unresponsive to standard measures",
                "Sudden neurological changes or loss of consciousness",
            ]),
            medical_disclaimer=(
                "HealthAI Educational Notice: This assessment is an automated decision-support summary "
                "and does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional."
            ),
            engine_source="ollama_qwen",
            model_name=settings.ollama_model,
        )

    def _build_fallback_assessment(
        self,
        assessment_id: str,
        timestamp: str,
        data: SymptomInput,
        ml_candidates: List[ConditionCandidate],
    ) -> AssessmentResponse:
        """
        High-integrity fallback assessment generated by local ML & clinical rule engine
        when Ollama service is unavailable or in offline mode.
        """
        # Determine triage level based on severity and progression
        if data.severity == SeverityLevel.SEVERE or data.progression == ProgressionStatus.WORSENING:
            triage = TriageLevel.URGENT_SAME_DAY
            triage_explanation = "Reported severe symptom intensity or worsening trend warrants same-day medical evaluation."
        elif data.severity == SeverityLevel.MODERATE:
            triage = TriageLevel.ROUTINE_PRIMARY_CARE
            triage_explanation = "Moderate symptom presentation is best evaluated by your primary care provider."
        else:
            triage = TriageLevel.SELF_CARE_MONITOR
            triage_explanation = "Mild presentation with stable course. Monitor symptoms and practice safe self-care."

        # Generate targeted clarifying follow-up questions
        follow_up_questions = [
            FollowUpQuestion(
                id="f1",
                question="Have you had a measured body temperature above 101°F (38.3°C)?",
                reason="Differentiates high-grade inflammatory or bacterial causes.",
                options=["Yes (>101°F / 38.3°C)", "Mild fever", "No fever", "Haven't measured"],
            ),
            FollowUpQuestion(
                id="f2",
                question="Are your symptoms localized to one specific area or generalized across your whole body?",
                reason="Helps clarify systemic versus focal pathology.",
                options=["Localized to one spot", "Generalized / Whole body", "Uncertain"],
            ),
        ]

        # Clinical summary
        duration_str = f" for {data.duration}" if data.duration else ""
        severity_str = f" with {data.severity.value} severity" if data.severity else ""
        summary = f"Patient presents with {', '.join(data.symptoms)}{duration_str}{severity_str}."

        self_care = [
            "Maintain optimal hydration (water, clear broths, oral electrolyte solutions).",
            "Allow sufficient physical rest and avoid strenuous exertion.",
            "Record symptom progression, onset timing, and any temperature readings in a log for your doctor.",
            "Do not stop or alter any existing prescribed medications without consulting your physician.",
        ]

        red_flags = [
            "Sudden severe difficulty breathing or inability to catch your breath",
            "New onset chest tightness, chest pressure, or palpitations",
            "Stiff neck accompanied by high fever or light sensitivity",
            "Fainting, confusion, or severe persistent dizziness",
            "Any uncontrolled bleeding or persistent vomiting preventing fluid retention",
        ]

        return AssessmentResponse(
            assessment_id=assessment_id,
            timestamp=timestamp,
            is_emergency=False,
            symptom_summary=summary,
            triage_level=triage,
            triage_explanation=triage_explanation,
            possible_conditions=ml_candidates,
            clinical_notes=(
                f"Symptom profile analyzed using HealthAI Clinical Classification Engine. "
                f"Identified {len(ml_candidates)} potential conditions exhibiting symptom correlation for your clinical review."
            ),
            supporting_info=[f"Reported symptoms: {', '.join(data.symptoms)}"],
            missing_info=[
                "Objective physical examination findings",
                "Vital signs (Blood Pressure, Heart Rate, SpO2, Temperature)",
                "Relevant laboratory blood tests",
            ],
            follow_up_questions=follow_up_questions,
            general_self_care=self_care,
            red_flags=red_flags,
            medical_disclaimer=(
                "HealthAI Educational Notice: This assessment was processed using the local Clinical Decision Engine "
                "(Ollama LLM in standby/offline mode). It is provided strictly for educational and decision-support purposes, "
                "not as a definitive diagnosis. Please consult a licensed medical provider."
            ),
            engine_source="clinical_ml_engine",
            model_name="HealthAI-RandomForest-Classifier",
        )


assessment_service = AssessmentService()
