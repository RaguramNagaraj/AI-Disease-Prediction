import pytest
from app.services.emergency_screener import EmergencyScreener


def test_emergency_chest_pain():
    res = EmergencyScreener.evaluate(["crushing chest pain", "sweating"])
    assert res.is_emergency is True
    assert len(res.red_flags_detected) > 0
    assert "Cardiovascular" in res.red_flags_detected[0]
    assert res.emergency_numbers["India"] == "112"
    assert len(res.immediate_actions) > 0


def test_emergency_stroke_fast():
    res = EmergencyScreener.evaluate(["slurred speech", "face drooping"])
    assert res.is_emergency is True
    assert any("Stroke" in flag for flag in res.red_flags_detected)


def test_emergency_breathing():
    res = EmergencyScreener.evaluate(["severe difficulty breathing", "blue lips"])
    assert res.is_emergency is True
    assert any("Respiratory" in flag for flag in res.red_flags_detected)


def test_emergency_loss_of_consciousness():
    res = EmergencyScreener.evaluate(["loss of consciousness", "dizziness"])
    assert res.is_emergency is True
    assert any("Consciousness" in flag for flag in res.red_flags_detected)


def test_non_emergency_routine_symptoms():
    res = EmergencyScreener.evaluate(["mild runny nose", "slight sneezing", "low grade fever"])
    assert res.is_emergency is False
    assert len(res.red_flags_detected) == 0
    assert res.emergency_message is None
    assert len(res.immediate_actions) == 0
