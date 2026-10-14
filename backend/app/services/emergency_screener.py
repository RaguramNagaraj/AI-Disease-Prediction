import re
from typing import List, Tuple
from ..models.schemas import EmergencyScreeningResult
from ..config import settings


# Structured emergency red flag rules with trigger patterns and categories
EMERGENCY_RULES = [
    {
        "category": "Cardiovascular / Heart Attack",
        "keywords": [
            r"chest pain",
            r"crushing (chest|pain)",
            r"chest pressure",
            r"chest tightness",
            r"radiating (to|down) (arm|jaw|back|neck)",
            r"heart attack",
            r"squeezing chest",
        ],
        "description": "Potential acute coronary syndrome or heart attack.",
    },
    {
        "category": "Respiratory Failure / Severe Hypoxia",
        "keywords": [
            r"severe (shortness of breath|difficulty breathing|breathlessness)",
            r"gasping for (air|breath)",
            r"cannot (speak|talk) in full sentences",
            r"blue (lips|fingers|skin|face)",
            r"cyanosis",
            r"choking",
            r"stridor",
        ],
        "description": "Critical respiratory distress or compromised airway.",
    },
    {
        "category": "Neurological / Stroke (FAST)",
        "keywords": [
            r"face drooping",
            r"facial droop",
            r"arm weakness",
            r"one[- ]sided (weakness|paralysis|numbness)",
            r"slurred speech",
            r"inability to speak",
            r"sudden (confusion|loss of balance)",
            r"stroke",
            r"sudden loss of vision",
            r"thunderclap headache",
            r"worst headache of (my|life)",
        ],
        "description": "Suspected acute stroke or intracranial hemorrhage.",
    },
    {
        "category": "Loss of Consciousness / Altered Mental State",
        "keywords": [
            r"loss of consciousness",
            r"passed out",
            r"unresponsive",
            r"fainted and (hit head|injured)",
            r"seizure",
            r"convulsions",
            r"active seizure",
            r"coma",
        ],
        "description": "Loss of consciousness, active seizure, or acute unresponsiveness.",
    },
    {
        "category": "Severe Hemorrhage / Bleeding",
        "keywords": [
            r"uncontrolled bleeding",
            r"severe bleeding",
            r"spurting blood",
            r"coughing (up )?blood",
            r"hemoptysis",
            r"vomiting blood",
            r"hematemesis",
            r"profuse bleeding",
        ],
        "description": "Severe or uncontrolled hemorrhage.",
    },
    {
        "category": "Severe Allergic Reaction / Anaphylaxis",
        "keywords": [
            r"swollen (tongue|throat|lips)",
            r"throat closing",
            r"inability to swallow",
            r"anaphylaxis",
            r"severe allergic reaction",
        ],
        "description": "Suspected life-threatening anaphylactic reaction.",
    },
    {
        "category": "Severe Infection / Meningism / Sepsis",
        "keywords": [
            r"stiff neck with (high )?fever",
            r"confusion with high fever",
            r"cold clammy skin with rapid heart",
            r"mottled skin",
            r"sepsis",
        ],
        "description": "Signs indicative of acute septic shock or bacterial meningitis.",
    },
    {
        "category": "Self-Harm / Mental Health Crisis",
        "keywords": [
            r"suicidal",
            r"suicide",
            r"want to (die|end my life|kill myself)",
            r"harming myself",
            r"self[- ]harm",
            r"overdose",
            r"swallowed poison",
        ],
        "description": "Immediate mental health crisis, poisoning, or overdose.",
    },
]


class EmergencyScreener:
    """Evaluates symptoms and text input for critical life-threatening red flags."""

    @staticmethod
    def evaluate(symptoms: List[str], additional_context: str = "") -> EmergencyScreeningResult:
        """
        Check reported symptoms against critical emergency red flags.
        Returns EmergencyScreeningResult with findings.
        """
        detected_flags: List[str] = []
        tokens = list(symptoms)
        if additional_context:
            tokens.append(additional_context)
        combined_text = " ".join(tokens).lower()

        for rule in EMERGENCY_RULES:
            matched_keywords = []

            for pattern in rule["keywords"]:
                if re.search(r"\b" + pattern + r"\b", combined_text, re.IGNORECASE):
                    matched_keywords.append(pattern.replace(r"\b", "").replace(r"\-", "-"))

            if matched_keywords:
                flag_text = f"{rule['category']}: {rule['description']}"
                if flag_text not in detected_flags:
                    detected_flags.append(flag_text)

        is_emergency = len(detected_flags) > 0

        emergency_numbers = {
            "India": settings.emergency_contact_india,
            "US / Canada": "911",
            "UK": "999",
            "Europe": "112",
            "International": settings.emergency_contact_international,
        }

        if is_emergency:
            emergency_message = (
                "EMERGENCY WARNING: Your reported symptoms indicate a potentially life-threatening medical emergency. "
                "Do NOT wait for online assessment. Contact emergency medical services immediately or go to the nearest emergency room."
            )
            immediate_actions = [
                "Call 112 (in India) or 911 / your local emergency dispatch immediately.",
                "If experiencing chest pain or stroke symptoms, do NOT attempt to drive yourself. Request an ambulance.",
                "Keep doors unlocked so emergency responders can access you.",
                "If alone, alert a family member, neighbor, or colleague immediately.",
                "Rest in a comfortable, seated, or semi-upright position while waiting for help.",
            ]
        else:
            emergency_message = None
            immediate_actions = []

        return EmergencyScreeningResult(
            is_emergency=is_emergency,
            red_flags_detected=detected_flags,
            emergency_message=emergency_message,
            emergency_numbers=emergency_numbers,
            immediate_actions=immediate_actions,
        )
