import sys
from pathlib import Path

# Ensure project root is on sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from rag.pipeline import (
    IPSaktiRAG
)


def main():

    rag = IPSaktiRAG()

    question = (
        "Can an Ayurvedic formulation "
        "be patented?"
    )

    jurisdiction = "India"

    category = "Patent"

    print(
        "\n"
        + "=" * 80
    )

    print(
        "IP-SAKTI RAG TEST"
    )

    print(
        "=" * 80
    )

    print(
        f"\nQuestion: {question}"
    )

    print(
        f"Jurisdiction: {jurisdiction}"
    )

    print(
        f"Category: {category}"
    )

    result = rag.ask(

        question=question,

        jurisdiction=jurisdiction,

        category=category,

        retrieval_k=8,

        final_k=3
    )

    print(
        "\n"
        + "=" * 80
    )

    print(
        "ANSWER"
    )

    print(
        "=" * 80
    )

    print(
        result["answer"]
    )

    print(
        "\n"
        + "=" * 80
    )

    print(
        "SOURCES"
    )

    print(
        "=" * 80
    )

    for index, source in enumerate(
        result["sources"],
        start=1
    ):

        print(
            f"\n[{index}]"
        )

        print(
            f"Document: "
            f"{source['document']}"
        )

        print(
            f"File: "
            f"{source['source_file']}"
        )

        print(
            f"Page: "
            f"{source['page_start']}"
        )

        print(
            f"Section: "
            f"{source['section']}"
        )

        print(
            f"Rerank score: "
            f"{source['rerank_score']:.4f}"
        )


if __name__ == "__main__":

    main()