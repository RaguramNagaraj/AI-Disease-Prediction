import json
from typing import List, Dict, Any, Optional
from ..models.schemas import SymptomInput, ConditionCandidate


SYSTEM_PROMPT = """You are HealthAI, a clinical decision-support and medical education AI system.
Your role is to analyze reported symptoms objectively, provide balanced clinical explanations for discussion with a qualified physician, assess appropriate medical care urgency (triage), and highlight red flag warning signs.

CRITICAL MEDICAL SAFETY RULES:
1. You are NOT a doctor and CANNOT diagnose medical conditions.
2. NEVER prescribe prescription medications, calculate drug dosages, or recommend altering or stopping prescribed therapies.
3. NEVER express absolute certainty (e.g., avoid "You have X"; use "Symptoms may be consistent with X", "Potential considerations include X").
4. ALWAYS recommend in-person consultation with a licensed healthcare provider for definitive diagnosis.
5. Emphasize life-threatening emergency warning signs (red flags) that mandate immediate hospital/ER care.
6. Provide safe, general non-pharmacological self-care (hydration, rest, cooling compresses, monitoring temperature) where clinically appropriate.
7. If reported symptoms are vague, non-specific, or insufficient, explicitly acknowledge the ambiguity and ask targeted clarifying questions.

You MUST respond ONLY with a valid JSON object matching the requested schema. Do NOT include markdown code blocks (```json ... ```) or conversational commentary outside the JSON."""


def build_assessment_prompt(
    symptom_data: SymptomInput,
    ml_candidates: Optional[List[ConditionCandidate]] = None
) -> str:
    """
    Construct carefully engineered clinical prompt for Qwen 3.5 LLM.
    Integrates ML classifier candidates as educational background hypotheses.
    """
    context_lines = [
        f"Reported Symptoms: {', '.join(symptom_data.symptoms)}",
        f"Onset / Duration: {symptom_data.duration or 'Not specified'}",
        f"Perceived Severity: {symptom_data.severity.value if symptom_data.severity else 'Not specified'}",
        f"Progression Trend: {symptom_data.progression.value if symptom_data.progression else 'Not specified'}",
        f"Age Demographic: {symptom_data.age_group or 'Not specified'}",
        f"Biological Sex: {symptom_data.biological_sex or 'Not specified'}",
    ]

    if symptom_data.medical_history:
        context_lines.append(f"Voluntary Medical History: {', '.join(symptom_data.medical_history)}")
    if symptom_data.allergies:
        context_lines.append(f"Voluntary Allergies: {', '.join(symptom_data.allergies)}")
    if symptom_data.answers:
        qa_pairs = [f"Q: {k} -> A: {v}" for k, v in symptom_data.answers.items()]
        context_lines.append(f"Clarifications Provided: {'; '.join(qa_pairs)}")

    ml_context = ""
    if ml_candidates:
        ml_summary = []
        for c in ml_candidates[:3]:
            ml_summary.append(f"- {c.condition_name} ({c.confidence_category}, matched: {', '.join(c.matched_symptoms)})")
        ml_context = (
            "\nBackground ML Classifier Statistical Candidates (for differential consideration only):\n"
            + "\n".join(ml_summary)
            + "\n"
        )

    prompt = f"""Assess the following patient presentation:

{chr(10).join(context_lines)}
{ml_context}
Generate a structured medical assessment formatted strictly as a single JSON object with these exact keys:
{{
  "symptom_summary": "Concise 1-2 sentence medical summary of reported symptoms and timeline.",
  "triage_level": "one of: 'emergency', 'urgent_same_day', 'routine_primary_care', 'self_care_monitor'",
  "triage_explanation": "Clear explanation of why this level of care urgency is indicated.",
  "possible_conditions": [
    {{
      "condition_name": "Name of condition",
      "confidence_category": "Possible Consideration | Moderate Overlap | Strong Correlation",
      "match_score": 0.75,
      "overview": "Clear 2-sentence explanation of what this condition is.",
      "common_symptoms": ["symptom 1", "symptom 2"],
      "matched_symptoms": ["matching reported symptom 1"],
      "questions_for_doctor": [
        "Specific diagnostic question to ask doctor",
        "Recommended follow-up test to discuss"
      ]
    }}
  ],
  "clinical_notes": "Clinical reasoning discussing the symptom constellation, potential causes, and why certain conditions are more or less likely.",
  "supporting_info": ["Key symptom or risk factor that supports the assessment"],
  "missing_info": ["Important clinical details not yet provided (e.g. vital signs, lab tests, exact temperature)"],
  "follow_up_questions": [
    {{
      "id": "q1",
      "question": "Clarifying clinical question",
      "reason": "Why this information matters",
      "options": ["Option A", "Option B", "Option C"]
    }}
  ],
  "general_self_care": [
    "General safe non-prescription supportive measures (hydration, rest, etc.)"
  ],
  "red_flags": [
    "Specific warning symptoms that necessitate immediate emergency room or urgent medical evaluation"
  ],
  "medical_disclaimer": "This assessment is generated by HealthAI for educational and decision-support purposes only and does not constitute a medical diagnosis. Consult a licensed physician for diagnosis and treatment planning."
}}"""

    return prompt
