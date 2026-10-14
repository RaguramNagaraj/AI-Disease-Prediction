"""
Model training and evaluation pipeline for the Disease Prediction Classifier.
Separates training, evaluation, and serialization from runtime inference.
"""

import os
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, accuracy_score
from .dataset import CLINICAL_DISEASE_PROFILES, ALL_SUPPORTED_SYMPTOMS, ALL_SUPPORTED_CONDITIONS


def generate_training_data(samples_per_condition: int = 50, random_state: int = 42):
    """Generate realistic synthetic clinical feature vectors with statistical variance."""
    rng = np.random.RandomState(random_state)
    symptom_to_idx = {s: i for i, s in enumerate(ALL_SUPPORTED_SYMPTOMS)}

    X = []
    y = []

    for disease_name, profile in CLINICAL_DISEASE_PROFILES.items():
        hallmarks = profile["hallmark_symptoms"]
        secondaries = profile["secondary_symptoms"]

        for _ in range(samples_per_condition):
            vec = np.zeros(len(ALL_SUPPORTED_SYMPTOMS), dtype=np.float32)

            # Sample hallmarks (prob 0.85)
            for s in hallmarks:
                if rng.rand() < 0.85:
                    idx = symptom_to_idx.get(s.lower().strip())
                    if idx is not None:
                        vec[idx] = 2.0

            # Sample secondary symptoms (prob 0.35)
            for s in secondaries:
                if rng.rand() < 0.35:
                    idx = symptom_to_idx.get(s.lower().strip())
                    if idx is not None:
                        vec[idx] = 1.0

            # Low noise
            if rng.rand() < 0.10:
                rand_idx = rng.randint(0, len(ALL_SUPPORTED_SYMPTOMS))
                vec[rand_idx] = 0.5

            X.append(vec)
            y.append(disease_name)

    return np.array(X), np.array(y)


def train_and_evaluate(save_path: str = "backend/app/services/ml_engine/models/disease_classifier.joblib"):
    """Train Random Forest model, evaluate performance, and persist model artifact."""
    os.makedirs(os.path.dirname(save_path), exist_ok=True)

    print("=" * 60)
    print("Training HealthAI Disease Prediction Classifier...")
    print(f"Total supported conditions: {len(ALL_SUPPORTED_CONDITIONS)}")
    print(f"Total symptom feature dimensions: {len(ALL_SUPPORTED_SYMPTOMS)}")

    X, y = generate_training_data(samples_per_condition=60)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    model = RandomForestClassifier(
        n_estimators=120,
        max_depth=14,
        random_state=42,
        class_weight="balanced",
    )

    model.fit(X_train, y_train)

    # Evaluation
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    cv_scores = cross_val_score(model, X_train, y_train, cv=5)

    print(f"Test Set Accuracy: {acc:.4f} ({acc*100:.1f}%)")
    print(f"5-Fold Cross-Validation Mean Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
    print("=" * 60)

    # Serialize
    artifact = {
        "pipeline": model,
        "classes": list(model.classes_),
        "features": ALL_SUPPORTED_SYMPTOMS,
        "accuracy": float(acc),
        "cv_mean_accuracy": float(cv_scores.mean()),
    }
    joblib.dump(artifact, save_path)
    print(f"Model saved successfully to: {save_path}")
    return artifact


if __name__ == "__main__":
    train_and_evaluate()
