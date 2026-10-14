import pytest
from app.services.ml_engine.classifier import ClassifierDiseasePredictor
from app.services.ml_engine.dataset import ALL_SUPPORTED_CONDITIONS, ALL_SUPPORTED_SYMPTOMS


@pytest.fixture
def predictor():
    return ClassifierDiseasePredictor()


def test_supported_lists(predictor):
    symptoms = predictor.get_supported_symptoms()
    conditions = predictor.get_supported_conditions()
    assert len(symptoms) > 50
    assert len(conditions) >= 20
    assert "Common Cold" in conditions
    assert "Migraine" in conditions


def test_prediction_cold_symptoms(predictor):
    candidates = predictor.predict(["runny nose", "sneezing", "sore throat"], top_k=3)
    assert len(candidates) > 0
    candidate_names = [c.condition_name for c in candidates]
    assert any("Cold" in name or "Allergic" in name for name in candidate_names)
    assert candidates[0].match_score > 0.0
    assert candidates[0].match_score <= 1.0
    assert len(candidates[0].questions_for_doctor) > 0


def test_prediction_migraine_symptoms(predictor):
    candidates = predictor.predict(["throbbing unilateral headache", "photophobia (light sensitivity)", "nausea"], top_k=3)
    assert len(candidates) > 0
    assert candidates[0].condition_name == "Migraine"
    assert candidates[0].match_score > 0.40


def test_empty_symptoms_returns_empty(predictor):
    candidates = predictor.predict([], top_k=3)
    assert candidates == []
