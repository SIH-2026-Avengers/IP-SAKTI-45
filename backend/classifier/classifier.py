from __future__ import annotations

import copy
import os
import pickle
import tempfile
import threading
from pathlib import Path
from typing import Any

import pandas as pd
from river import compose, linear_model, preprocessing


class IPShaktiClassifier:
    FEATURES = [
        "subject_matter",
        "primary_objective",
        "technical_invention",
        "brand_identifier",
        "product_appearance",
        "geographical_origin",
        "creative_expression",
        "bio_or_plant_matter",
        "confidentiality",
        "regulated_product_type",
    ]

    CATEGORIES = [
        "Ayurveda-Aahar",
        "Biological Diversity",
        "Copyright",
        "Design",
        "Drug Regulation",
        "Food Regulation",
        "Geographical Indication",
        "Patent",
        "Plant Variety Protection",
        "Regulatory",
        "Trade Secret",
        "Trademark",
    ]

    FORMAT_VERSION = 1
    DEFAULT_DATASET_PATH = (
        Path(__file__).resolve().parent.parent
        / "notebook"
        / "Temp"
        / "rag_router_dataset_v1_10000.csv"
    )

    def __init__(self, model_path: str | Path | None = None):
        if model_path is None:
            model_path = (
                Path(__file__).resolve().parent.parent
                / "models"
                / "IPShaktiRiverClassifier.pkl"
            )

        self.model_path = Path(model_path)
        self._lock = threading.RLock()
        self.model = self._new_model()
        self.training_samples = 0
        self.model_version = 0
        self.feedback_ids: set[str] = set()

        if self.model_path.exists():
            self._load()
        else:
            print(
                "River classifier model is missing; training from "
                f"{self.DEFAULT_DATASET_PATH}"
            )
            self._train_from_csv(self.DEFAULT_DATASET_PATH)

    @staticmethod
    def _new_model():
        return compose.Pipeline(
            preprocessing.OneHotEncoder(),
            linear_model.SoftmaxRegression(),
        )

    @classmethod
    def _normalize_features(cls, features: dict[str, Any]) -> dict[str, Any]:
        missing = [feature for feature in cls.FEATURES if feature not in features]
        if missing:
            raise ValueError(f"Missing classifier features: {missing}")

        normalized = {feature: features[feature] for feature in cls.FEATURES}
        regulated_type = normalized["regulated_product_type"]
        if regulated_type == "Ayurveda-Aahara Product":
            normalized["regulated_product_type"] = "Ayurveda-Aahar Product"
        return normalized

    def _load(self) -> None:
        with self.model_path.open("rb") as model_file:
            state = pickle.load(model_file)

        if state.get("format_version") != self.FORMAT_VERSION:
            raise ValueError(
                f"Unsupported River classifier model format in {self.model_path}"
            )
        if not isinstance(state.get("model"), compose.Pipeline):
            raise ValueError(f"Invalid River classifier model in {self.model_path}")

        self.model = state["model"]
        self.training_samples = int(state["training_samples"])
        self.model_version = int(state["model_version"])
        self.feedback_ids = set(state["feedback_ids"])

    def _save_state(
        self,
        model,
        training_samples: int,
        model_version: int,
        feedback_ids: set[str],
    ) -> None:
        self.model_path.parent.mkdir(parents=True, exist_ok=True)
        state = {
            "format_version": self.FORMAT_VERSION,
            "model": model,
            "training_samples": training_samples,
            "model_version": model_version,
            "feedback_ids": feedback_ids,
        }

        temporary_path: Path | None = None
        try:
            with tempfile.NamedTemporaryFile(
                mode="wb",
                dir=self.model_path.parent,
                prefix=f".{self.model_path.name}.",
                suffix=".tmp",
                delete=False,
            ) as model_file:
                temporary_path = Path(model_file.name)
                pickle.dump(state, model_file, protocol=pickle.HIGHEST_PROTOCOL)
                model_file.flush()
                os.fsync(model_file.fileno())

            os.replace(temporary_path, self.model_path)
        finally:
            if temporary_path is not None:
                temporary_path.unlink(missing_ok=True)

    def _train_from_csv(self, dataset_path: str | Path) -> None:
        dataset_path = Path(dataset_path)
        if not dataset_path.is_file():
            raise FileNotFoundError(f"Classifier training data not found: {dataset_path}")

        data = pd.read_csv(dataset_path)
        required_columns = set(self.FEATURES + ["target_category"])
        missing_columns = sorted(required_columns - set(data.columns))
        if missing_columns:
            raise ValueError(
                f"Training data is missing required columns: {missing_columns}"
            )
        if data.empty:
            raise ValueError(f"Classifier training data is empty: {dataset_path}")

        observed_categories = set(data["target_category"].dropna().unique())
        unsupported_categories = observed_categories - set(self.CATEGORIES)
        missing_categories = set(self.CATEGORIES) - observed_categories
        if unsupported_categories or missing_categories:
            raise ValueError(
                "Training data categories do not match the classifier contract. "
                f"Unsupported: {sorted(unsupported_categories)}; "
                f"missing: {sorted(missing_categories)}"
            )

        candidate = self._new_model()
        for row in data.to_dict(orient="records"):
            category = row["target_category"]
            if pd.isna(category):
                raise ValueError("Training data contains an empty target category")

            features = {
                feature: None if pd.isna(row[feature]) else row[feature]
                for feature in self.FEATURES
            }
            candidate.learn_one(self._normalize_features(features), category)

        training_samples = len(data)
        model_version = 1
        self._save_state(candidate, training_samples, model_version, set())
        self.model = candidate
        self.training_samples = training_samples
        self.model_version = model_version

    @classmethod
    def train_from_csv(
        cls,
        dataset_path: str | Path,
        model_path: str | Path | None = None,
    ) -> IPShaktiClassifier:
        classifier = cls.__new__(cls)
        if model_path is None:
            model_path = (
                Path(__file__).resolve().parent.parent
                / "models"
                / "IPShaktiRiverClassifier.pkl"
            )
        classifier.model_path = Path(model_path)
        classifier._lock = threading.RLock()
        classifier.model = classifier._new_model()
        classifier.training_samples = 0
        classifier.model_version = 0
        classifier.feedback_ids = set()
        classifier._train_from_csv(dataset_path)
        return classifier

    def predict(self, features: dict[str, Any]) -> dict[str, Any]:
        input_data = self._normalize_features(features)
        with self._lock:
            probabilities = self.model.predict_proba_one(input_data)

        results = [
            {
                "category": category,
                "probability": float(probabilities.get(category, 0.0)),
            }
            for category in self.CATEGORIES
        ]
        results.sort(
            key=lambda item: (
                -item["probability"],
                self.CATEGORIES.index(item["category"]),
            )
        )

        return {
            "predicted_category": results[0]["category"],
            "top_predictions": results[:5],
        }

    def learn_one(
        self,
        features: dict[str, Any],
        target_category: str,
        feedback_id: str,
    ) -> dict[str, Any]:
        if target_category not in self.CATEGORIES:
            raise ValueError(f"Unsupported classifier category: {target_category}")
        if not feedback_id.strip():
            raise ValueError("feedback_id cannot be empty")

        input_data = self._normalize_features(features)
        with self._lock:
            if feedback_id in self.feedback_ids:
                return {
                    "updated": False,
                    "training_samples": self.training_samples,
                    "model_version": self.model_version,
                }

            candidate = copy.deepcopy(self.model)
            candidate.learn_one(input_data, target_category)
            feedback_ids = self.feedback_ids | {feedback_id}
            training_samples = self.training_samples + 1
            model_version = self.model_version + 1
            self._save_state(
                candidate,
                training_samples,
                model_version,
                feedback_ids,
            )

            self.model = candidate
            self.feedback_ids = feedback_ids
            self.training_samples = training_samples
            self.model_version = model_version

        return {
            "updated": True,
            "training_samples": self.training_samples,
            "model_version": self.model_version,
        }
