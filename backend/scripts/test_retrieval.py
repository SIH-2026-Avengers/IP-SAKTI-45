import sys
from pathlib import Path

# Ensure project root is on sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from retrieval.retriever import (
    IPSaktiRetriever
)

from retrieval.models import (
    RetrievalRequest
)


def main():

    retriever = IPSaktiRetriever()

    request = RetrievalRequest(

        query=(
            # "Can an Ayurvedic formulation "
            # "be patented?"
            "What are the conditions for patentability of an invention in India?"
        ),

        jurisdiction="India",

        category="Patent",

        # top_k=5
        top_k=20
    )

    results = retriever.retrieve(
        request
    )

    print(
        "\n"
        + "=" * 70
    )

    print(
        "RETRIEVAL RESULTS"
    )

    print(
        "=" * 70
    )

    if not results:

        print(
            "\nNo matching documents found."
        )

        return

    for index, result in enumerate(
        results,
        start=1
    ):

        print(
            f"\n[{index}]"
        )

        print(
            f"Chunk ID: "
            f"{result.chunk_id}"
        )

        print(
            f"Jurisdiction: "
            f"{result.jurisdiction}"
        )

        print(
            f"Category: "
            f"{result.category}"
        )

        print(
            f"Score: "
            f"{result.score:.4f}"
        )

        print(
            f"Source: "
            f"{result.source_file}"
        )

        print(
            "\nContent:"
        )

        print(
            result.content[:1000]
        )

        print(
            "\n" + "-" * 70
        )


if __name__ == "__main__":
    main()