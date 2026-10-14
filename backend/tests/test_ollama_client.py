import pytest
from app.services.ollama_client import OllamaClient


def test_parse_json_direct():
    client = OllamaClient()
    raw = '{"symptom_summary": "Test summary", "triage_level": "routine_primary_care"}'
    parsed = client._parse_json_response(raw)
    assert parsed is not None
    assert parsed["triage_level"] == "routine_primary_care"


def test_parse_json_with_markdown_blocks():
    client = OllamaClient()
    raw = """```json
{
  "symptom_summary": "Cleaned from code block",
  "triage_level": "urgent_same_day"
}
```"""
    parsed = client._parse_json_response(raw)
    assert parsed is not None
    assert parsed["symptom_summary"] == "Cleaned from code block"


def test_parse_malformed_json_fallback():
    client = OllamaClient()
    raw = "Not a json response at all"
    parsed = client._parse_json_response(raw)
    assert parsed is None
