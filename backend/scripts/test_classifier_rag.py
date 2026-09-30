import sys
from pathlib import Path

sys.path.insert(
    0,
    str(Path(__file__).resolve().parent.parent)
)

from services.ip_sakti_service import (
    IPSaktiService
)


def main():

    service = IPSaktiService()

    # ==========================================
    # USER FORM DATA
    # ==========================================

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
            "Traditional Knowledge",

        "confidentiality":
            "No",

        "regulated_product_type":
            "Other"
    }

    jurisdiction = "India"

    question = (
        "Can an Ayurvedic formulation "
        "be patented?"
    )

    # ==========================================
    # CLASSIFICATION
    # ==========================================

    classification = service.classify(
        features
    )

    print("\n")
    print("=" * 80)
    print("CLASSIFICATION")
    print("=" * 80)

    print(
        f"\nPredicted Category: "
        f"{classification['predicted_category']}"
    )

    print("\nTop 5:")

    for index, item in enumerate(
        classification["top_predictions"],
        start=1
    ):

        print(
            f"{index}. "
            f"{item['category']:<30}"
            f"{item['probability'] * 100:.2f}%"
        )

    # ==========================================
    # RAG
    # ==========================================

    category = (
        classification["predicted_category"]
    )

    print("\n")
    print("=" * 80)
    print("RAG")
    print("=" * 80)

    print(
        f"\nJurisdiction: {jurisdiction}"
    )

    print(
        f"Category: {category}"
    )

    result = service.ask(

        question=question,

        jurisdiction=jurisdiction,

        category=category
    )

    # ==========================================
    # ANSWER
    # ==========================================

    print("\n")
    print("=" * 80)
    print("ANSWER")
    print("=" * 80)

    print(result["answer"])

    # ==========================================
    # SOURCES
    # ==========================================

    print("\n")
    print("=" * 80)
    print("SOURCES")
    print("=" * 80)

    for index, source in enumerate(
        result["sources"],
        start=1
    ):

        print(f"\n[{index}]")

        print(
            f"Document: "
            f"{source['document']}"
        )

        print(
            f"Page: "
            f"{source['page_start']}"
        )

        print(
            f"Section: "
            f"{source['section']}"
        )


if __name__ == "__main__":

    main()