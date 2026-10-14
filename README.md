# HealthAI: AI Disease Prediction & Clinical Symptom Assessment System

> **Educational & Clinical Decision-Support Notice:**
> HealthAI is an educational decision-support tool. It does **not** provide formal medical diagnoses, write prescriptions, or replace in-person consultation with a licensed healthcare provider. In a medical emergency, call **112 (in India)** or **911 (US/Canada)** immediately.

---

## 1. System Overview

HealthAI is a full-stack, modular clinical symptom assessment and disease triage platform. It integrates:
1. **Interactive Clinical Intake**: A 4-step wizard capturing symptoms, onset duration, severity, progression, and optional health history.
2. **Instant Emergency Red-Flag Screener**: Pre-assessment rule-based evaluation detecting life-threatening signs (cardiac chest pain, stroke FAST indicators, respiratory failure, severe hemorrhages) with direct dispatch guidance.
3. **Machine Learning Disease Classifier**: Scikit-learn calibrated Random Forest classifier trained on 24 common clinical conditions and 150+ standardized symptom features, yielding statistical match indices without hallucinations.
4. **Local LLM Cognitive Reasoning**: Local Ollama runtime executing `qwen3.5:4b` via HTTP API for structured natural-language clinical explanations, triage urgency classification, and physician discussion questions.
5. **Fail-Safe Offline Mode**: If Ollama is offline or downloading, the system automatically falls back to the local Scikit-Learn classifier and clinical rule engine with 100% operational uptime.

---

## 2. Technology Stack

### Backend
- **Python 3.13+**
- **FastAPI**: Asynchronous high-performance REST API
- **Pydantic v2**: Request/response validation and settings management
- **HTTPX**: Asynchronous HTTP client communicating with Ollama
- **Scikit-Learn & NumPy**: Calibrated Random Forest disease classifier
- **Pytest & Pytest-Asyncio**: Comprehensive unit and integration test suite
- **Uvicorn**: ASGI web server

### Frontend
- **React 18** + **Vite 6**
- **Vanilla Modern CSS**: Curated HSL dark-mode medical glassmorphic design system
- **Lucide React**: Clean, accessible clinical iconography
- **Responsive Layout**: Optimized for desktop, tablet, and mobile browsers

### AI Runtime
- **Ollama**: Local open-source LLM runtime (`http://localhost:11434`)
- **Model**: `qwen3.5:4b` (configurable dynamically via UI or environment variables)

---

## 3. Project Structure

```text
disease-prediction-system/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                     # FastAPI application & lifespan startup
│   │   ├── config.py                   # Pydantic Settings (Ollama URL, Model, etc.)
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py              # Pydantic schemas (Triage, Symptoms, Conditions)
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── emergency_screener.py   # Immediate red-flag emergency screening
│   │   │   ├── prompt_builder.py       # Clinical guardrailed prompt engineering
│   │   │   ├── ollama_client.py        # Async client for Ollama /api/chat
│   │   │   ├── assessment_service.py   # Orchestrator with fail-safe fallbacks
│   │   │   └── ml_engine/              # Decoupled ML classifier engine
│   │   │       ├── __init__.py
│   │   │       ├── base.py             # BaseDiseasePredictor ABC interface
│   │   │       ├── dataset.py          # Clinical profiles & symptom dictionary
│   │   │       ├── classifier.py       # Scikit-learn Random Forest model
│   │   │       └── trainer.py          # Training, CV evaluation, and serialization
│   │   └── api/
│   │       ├── __init__.py
│   │       ├── routes_assessment.py    # Assessment, emergency check, symptom lists
│   │       └── routes_system.py        # Health, Ollama status, ML info, dynamic config
│   ├── tests/                          # 19 Pytest test cases (100% pass rate)
│   │   ├── test_api.py
│   │   ├── test_emergency_screener.py
│   │   ├── test_ml_classifier.py
│   │   └── test_ollama_client.py
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js                  # Includes /api proxy to FastAPI
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                     # View state & modal coordinator
│       ├── index.css                   # Master medical design system
│       ├── services/
│       │   └── api.js                  # Frontend API client
│       └── components/
│           ├── Navbar.jsx              # Status badge & Emergency hotlink
│           ├── Hero.jsx                # Landing hero with trust markers
│           ├── DisclaimerBanner.jsx    # Prominent medical notice
│           ├── EmergencyModal.jsx      # High-urgency modal (112 India / 911 Intl)
│           ├── SymptomSelector.jsx     # Searchable symptom tags with category filters
│           ├── AssessmentWizard.jsx    # 4-step intake wizard
│           ├── AssessmentResults.jsx   # Triage banner, differential cards, doctor Qs
│           ├── HowItWorks.jsx          # Educational 4-step workflow
│           ├── SystemSettingsModal.jsx # Runtime configuration modal
│           └── Footer.jsx              # Governance & privacy notice
└── README.md
```

---

## 4. Setup & Installation

### Prerequisites
- Python 3.10+ (Python 3.13 verified)
- Node.js 18+ (Node 24 verified) & npm
- Optional: [Ollama](https://ollama.com/) for local Qwen 3.5 AI inference

### Step 1: Install Backend Dependencies
```bash
# In the repository root:
python -m pip install -r backend/requirements.txt
```

### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

---

## 5. Running the Application

### 1. (Optional) Start Ollama Runtime & Pull Model
```bash
# Start Ollama service (if not already running)
ollama serve

# Pull the lightweight Qwen 3.5 4B model
ollama pull qwen3.5:4b
```
*Note: If Ollama is not running, HealthAI automatically operates in local ML & Clinical Rule mode with zero downtime.*

### 2. Start the Backend API Server
```bash
# From the repository root:
powershell -Command "$env:PYTHONPATH='backend'; python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
```
The FastAPI interactive documentation is available at: `http://127.0.0.1:8000/docs`

### 3. Start the Frontend Dev Server
```bash
# In a separate terminal inside the frontend folder:
cd frontend
npm run dev
```
Open your browser at: `http://localhost:5173/`

---

## 6. Running Backend Automated Tests

Run the complete test suite verifying emergency rules, ML predictions, Ollama JSON parsing, and API endpoints:
```bash
powershell -Command "$env:PYTHONPATH='backend'; python -m pytest backend/tests -v"
```
**Results**: 19 passed in ~6 seconds.

---

## 7. Medical Safety & Privacy Guardrails

1. **Emergency Prioritization**: Critical red flags trigger an immediate emergency alert advising the user to dial 112 (India) or 911 without waiting for model inference.
2. **No Diagnostic Certainty**: Predictions are categorized as "Strong Correlation", "Moderate Overlap", or "Possible Consideration". The system explicitly states it is not a medical diagnosis.
3. **No Prescriptions**: The AI does not recommend prescription medications or calculate drug dosages.
4. **Transient Data**: No identifying health information is logged or stored in external databases.
