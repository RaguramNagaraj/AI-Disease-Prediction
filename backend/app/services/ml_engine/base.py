from abc import ABC, abstractmethod
from typing import List, Dict, Any
from ...models.schemas import ConditionCandidate


class BaseDiseasePredictor(ABC):
    """
    Abstract Base Class for disease prediction models.
    Decouples the disease-prediction engine from the conversational LLM.
    """

    @abstractmethod
    def predict(self, symptoms: List[str], top_k: int = 5) -> List[ConditionCandidate]:
        """
        Predict candidate health conditions given a list of symptoms.

        Args:
            symptoms: List of reported symptom names.
            top_k: Number of candidate conditions to return.

        Returns:
            List of ConditionCandidate objects with relative match scores.
        """
        pass

    @abstractmethod
    def get_supported_symptoms(self) -> List[str]:
        """Return all symptom names recognized by the model."""
        pass

    @abstractmethod
    def get_supported_conditions(self) -> List[str]:
        """Return all disease/condition names predictable by the model."""
        pass

    @abstractmethod
    def get_model_metadata(self) -> Dict[str, Any]:
        """Return metadata regarding model version, training metrics, and limitations."""
        pass
