import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/system/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_ollama_status_endpoint():
    response = client.get("/api/system/ollama/status")
    assert response.status_code == 200
    data = response.json()
    assert "connected" in data
    assert "configured_model" in data


def test_ml_info_endpoint():
    response = client.get("/api/system/ml/info")
    assert response.status_code == 200
    data = response.json()
    assert data["num_supported_conditions"] > 0
    assert data["is_trained"] is True


def test_symptoms_list_endpoint():
    response = client.get("/api/assessment/symptoms/list")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_emergency_check_endpoint():
    # Emergency trigger
    payload = {"symptoms": ["chest pain", "shortness of breath"]}
    response = client.post("/api/assessment/emergency-check", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_emergency"] is True
    assert data["emergency_numbers"]["India"] == "112"


def test_evaluate_endpoint_emergency():
    payload = {
        "symptoms": ["crushing chest pain", "sweating"],
        "severity": "severe",
        "duration": "10 minutes"
    }
    response = client.post("/api/assessment/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_emergency"] is True
    assert data["triage_level"] == "emergency"
    assert data["engine_source"] == "emergency_screener"


def test_evaluate_endpoint_routine():
    payload = {
        "symptoms": ["runny nose", "sneezing", "mild sore throat"],
        "severity": "mild",
        "duration": "3 days",
        "progression": "stable"
    }
    response = client.post("/api/assessment/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_emergency"] is False
    assert len(data["possible_conditions"]) > 0
    assert "Common Cold" in [c["condition_name"] for c in data["possible_conditions"]]
    assert len(data["general_self_care"]) > 0
    assert len(data["red_flags"]) > 0
