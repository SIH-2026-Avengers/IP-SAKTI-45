import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from classifier import IPShaktiClassifier


def main():
    dataset_path = (
        BACKEND_DIR
        / "notebook"
        / "Temp"
        / "rag_router_dataset_v1_10000.csv"
    )
    model_path = (
        BACKEND_DIR
        / "models"
        / "IPShaktiRiverClassifier.pkl"
    )
    classifier = IPShaktiClassifier.train_from_csv(
        dataset_path=dataset_path,
        model_path=model_path,
    )
    print(
        f"Saved River classifier at {model_path} "
        f"({classifier.training_samples} examples, "
        f"model version {classifier.model_version})."
    )


if __name__ == "__main__":
    main()
