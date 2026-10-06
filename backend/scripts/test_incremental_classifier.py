import sys
import tempfile
import unittest
from pathlib import Path

import pandas as pd

BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from classifier import IPShaktiClassifier


class IncrementalClassifierTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.dataset_path = (
            BACKEND_DIR
            / "notebook"
            / "Temp"
            / "rag_router_dataset_v1_10000.csv"
        )
        cls.temporary_directory = tempfile.TemporaryDirectory()
        cls.model_path = Path(cls.temporary_directory.name) / "classifier.pkl"
        cls.classifier = IPShaktiClassifier.train_from_csv(
            cls.dataset_path,
            cls.model_path,
        )
        cls.example = pd.read_csv(cls.dataset_path).iloc[0].to_dict()

    @classmethod
    def tearDownClass(cls):
        cls.temporary_directory.cleanup()

    def test_prediction_returns_ranked_top_five(self):
        features = {
            feature: (
                None
                if pd.isna(self.example[feature])
                else self.example[feature]
            )
            for feature in IPShaktiClassifier.FEATURES
        }
        result = self.classifier.predict(features)

        self.assertIn(result["predicted_category"], IPShaktiClassifier.CATEGORIES)
        self.assertEqual(len(result["top_predictions"]), 5)
        probabilities = [
            item["probability"] for item in result["top_predictions"]
        ]
        self.assertEqual(probabilities, sorted(probabilities, reverse=True))
        self.assertTrue(all(0.0 <= value <= 1.0 for value in probabilities))

    def test_feedback_is_saved_and_duplicate_feedback_is_idempotent(self):
        features = {
            feature: (
                None
                if pd.isna(self.example[feature])
                else self.example[feature]
            )
            for feature in IPShaktiClassifier.FEATURES
        }
        initial_samples = self.classifier.training_samples
        initial_version = self.classifier.model_version
        feedback = {
            "features": features,
            "target_category": "Trademark",
            "feedback_id": "test-feedback-1",
        }

        result = self.classifier.learn_one(**feedback)
        self.assertTrue(result["updated"])
        self.assertEqual(result["training_samples"], initial_samples + 1)
        self.assertEqual(result["model_version"], initial_version + 1)

        reloaded = IPShaktiClassifier(self.model_path)
        duplicate = reloaded.learn_one(**feedback)
        self.assertFalse(duplicate["updated"])
        self.assertEqual(duplicate["training_samples"], initial_samples + 1)

    def test_rejects_unknown_labels_and_missing_features(self):
        with self.assertRaises(ValueError):
            self.classifier.learn_one(
                features={feature: None for feature in IPShaktiClassifier.FEATURES},
                target_category="unknown",
                feedback_id="invalid-category",
            )

        with self.assertRaises(ValueError):
            self.classifier.predict({"subject_matter": "Other"})


if __name__ == "__main__":
    unittest.main()
