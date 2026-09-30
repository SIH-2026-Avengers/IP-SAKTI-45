import sys
import json
from pathlib import Path

# Ensure project root is on sys.path
sys.path.insert(
    0,
    str(Path(__file__).resolve().parent.parent)
)

from langchain_core.documents import Document

from embeddings.embedding_service import (
    create_embedding_model
)

from storage.vector_store import (
    get_vector_store
)

from config import CHUNKS_DIR


BATCH_SIZE = 100


def load_chunks():

    documents = []

    for document_dir in CHUNKS_DIR.iterdir():

        if not document_dir.is_dir():
            continue

        chunks_metadata_file = (
            document_dir / "chunks.json"
        )

        if not chunks_metadata_file.exists():

            print(
                f"Warning: No chunks.json found "
                f"for {document_dir.name}"
            )

            continue

        with open(
            chunks_metadata_file,
            "r",
            encoding="utf-8"
        ) as file:

            chunk_records = json.load(file)

        for record in chunk_records:

            documents.append(
                Document(
                    page_content=record["text"],
                    metadata=record["metadata"]
                )
            )

    return documents


def main():

    documents = load_chunks()

    print(
        f"Loaded {len(documents)} chunks."
    )

    if not documents:

        print("No chunks found.")
        return

    print(
        "\nLoading embedding model..."
    )

    embeddings = create_embedding_model()

    print(
        "Embedding model loaded successfully."
    )

    print(
        "\nOpening vector store..."
    )

    vector_store = get_vector_store(
        embeddings
    )

    print(
        "Vector store opened successfully."
    )

    total = len(documents)

    print(
        f"\nStarting embedding generation "
        f"for {total} chunks..."
    )

    print(
        f"Batch size: {BATCH_SIZE}\n"
    )

    for start in range(
        0,
        total,
        BATCH_SIZE
    ):

        end = min(
            start + BATCH_SIZE,
            total
        )

        batch = documents[start:end]

        ids = [
            document.metadata["chunk_id"]
            for document in batch
        ]

        print(
            f"Processing chunks "
            f"{start + 1}-{end} "
            f"of {total}..."
        )

        vector_store.add_documents(
            documents=batch,
            ids=ids
        )

        print(
            f"Stored {end}/{total} chunks."
        )

    print(
        "\n" + "=" * 60
    )

    print(
        "EMBEDDING BUILD COMPLETE"
    )

    print(
        "=" * 60
    )

    print(
        f"Total vectors stored: {total}"
    )


if __name__ == "__main__":
    main()