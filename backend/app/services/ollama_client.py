import json
import re
import httpx
from typing import Dict, Any, Optional
from ..config import settings
from .prompt_builder import SYSTEM_PROMPT


class OllamaClient:
    """Async client for interacting with local Ollama runtime and Qwen model."""

    def __init__(self, base_url: Optional[str] = None, model: Optional[str] = None):
        self.base_url = (base_url or settings.ollama_url).rstrip("/")
        self.model = model or settings.ollama_model
        self.timeout = settings.ollama_timeout_seconds

    async def check_health(self) -> Dict[str, Any]:
        """Check Ollama connectivity and model availability."""
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                res = await client.get(f"{self.base_url}/api/tags")
                if res.status_code == 200:
                    data = res.json()
                    models = [m.get("name", "") for m in data.get("models", [])]
                    model_found = any(self.model in m for m in models)
                    return {
                        "connected": True,
                        "url": self.base_url,
                        "configured_model": self.model,
                        "model_available": model_found,
                        "available_models": models,
                        "message": (
                            f"Ollama connected. Model '{self.model}' is ready."
                            if model_found
                            else f"Ollama connected, but '{self.model}' was not found. Run 'ollama pull {self.model}'."
                        ),
                    }
                else:
                    return {
                        "connected": False,
                        "url": self.base_url,
                        "configured_model": self.model,
                        "model_available": False,
                        "available_models": [],
                        "message": f"Ollama returned HTTP status {res.status_code}",
                    }
        except httpx.ConnectError:
            return {
                "connected": False,
                "url": self.base_url,
                "configured_model": self.model,
                "model_available": False,
                "available_models": [],
                "message": f"Could not connect to Ollama at {self.base_url}. Ensure Ollama is running ('ollama serve').",
            }
        except Exception as e:
            return {
                "connected": False,
                "url": self.base_url,
                "configured_model": self.model,
                "model_available": False,
                "available_models": [],
                "message": f"Ollama health check error: {str(e)}",
            }

    async def generate_chat_assessment(self, prompt: str) -> Optional[Dict[str, Any]]:
        """
        Send prompt to Ollama /api/chat and parse structured JSON.
        Returns parsed dict or None if LLM is unavailable or fails.
        """
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            "stream": False,
            "options": {
                "temperature": 0.2,
                "top_p": 0.9,
            },
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                res = await client.post(f"{self.base_url}/api/chat", json=payload)
                if res.status_code != 200:
                    print(f"[OLLAMA] Error {res.status_code}: {res.text}")
                    return None

                response_data = res.json()
                content = response_data.get("message", {}).get("content", "")
                return self._parse_json_response(content)

        except (httpx.ConnectError, httpx.TimeoutException) as e:
            print(f"[OLLAMA] Connection/Timeout error: {e}")
            return None
        except Exception as e:
            print(f"[OLLAMA] Unexpected error calling Ollama: {e}")
            return None

    def _parse_json_response(self, text: str) -> Optional[Dict[str, Any]]:
        """Clean and extract valid JSON from LLM generation."""
        if not text:
            return None

        # Clean markdown code blocks if model included ```json ... ```
        cleaned = re.sub(r"^```(?:json)?\s*", "", text.strip(), flags=re.IGNORECASE)
        cleaned = re.sub(r"\s*```$", "", cleaned.strip())

        # Attempt direct parse
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            # Fallback regex extraction for curly braces
            match = re.search(r"(\{.*\})", cleaned, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(1))
                except json.JSONDecodeError:
                    pass
            print(f"[OLLAMA] Failed to parse JSON from output: {text[:200]}")
            return None


ollama_client = OllamaClient()
