import sys
from pathlib import Path

# Ensure project root is on sys.path
sys.path.insert(
    0,
    str(Path(__file__).resolve().parent.parent)
)

from classifier import IPShaktiClassifier


classifier = IPShaktiClassifier()


features = {

    "subject_matter":
        "Invention",

    "primary_objective":
        "Get Protection",

    "technical_invention":
        "Yes",

    "brand_identifier":
        "No",

    "product_appearance":
        "No",

    "geographical_origin":
        "No",

    "creative_expression":
        "No",

    "bio_or_plant_matter":
        None,

    "confidentiality":
        "No",

    "regulated_product_type":
        None,
}


result = classifier.predict(features)


print("\n")
print("=" * 70)
print("IP-SAKTI CLASSIFIER TEST")
print("=" * 70)

print(
    f"\nPredicted Category: "
    f"{result['predicted_category']}"
)

print("\nTop 5 Predictions:")

for index, item in enumerate(
    result["top_predictions"],
    start=1
):

    print(
        f"{index}. "
        f"{item['category']:<30}"
        f"{item['probability'] * 100:.2f}%"
    )

print("=" * 70)