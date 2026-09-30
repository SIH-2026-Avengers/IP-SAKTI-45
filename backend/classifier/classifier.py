from pathlib import Path

import joblib
import pandas as pd


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

    def __init__(self, model_path=None):

        if model_path is None:
            model_path = (
                Path(__file__).resolve().parent.parent
                / "models"
                / "IPShaktiClassification.joblib"
            )

        self.model_path = Path(model_path)

        if not self.model_path.exists():
            raise FileNotFoundError(
                f"Classifier model not found: {self.model_path}"
            )

        print(
            f"Loading IP-SAKTI classifier: "
            f"{self.model_path}"
        )

        self.model = joblib.load(self.model_path)

    def predict(self, features):
        """
        Predict the target category.

        Parameters
        ----------
        features : dict
            Dictionary containing the 10 classifier features.

        Returns
        -------
        dict
            Top-5 predictions and the top predicted category.
        """

        missing = [
            feature
            for feature in self.FEATURES
            if feature not in features
        ]

        if missing:
            raise ValueError(
                f"Missing classifier features: {missing}"
            )

        # Keep ONLY the features expected by the model
        input_data = {
            feature: features[feature]
            for feature in self.FEATURES
        }

        df = pd.DataFrame([input_data])

        # Top prediction
        prediction = self.model.predict(df)[0]

        # Probability distribution
        probabilities = self.model.predict_proba(df)[0]

        classes = self.model.classes_

        results = [
            {
                "category": category,
                "probability": float(probability),
            }
            for category, probability in zip(
                classes,
                probabilities
            )
        ]

        # Highest probability first
        results.sort(
            key=lambda x: x["probability"],
            reverse=True
        )

        return {
            "predicted_category": prediction,
            "top_predictions": results[:5],
        }