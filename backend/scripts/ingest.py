import sys
from pathlib import Path

# Ensure project root is on sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))


from ingestion.pdf_loader import (
    find_pdf_files
)

from ingestion.pipeline import (
    process_pdf
)

from config import RAW_DIR


def main():

    pdf_files = find_pdf_files(
        RAW_DIR
    )

    if not pdf_files:

        print(
            "No PDF files found."
        )

        return

    print(
        f"Found {len(pdf_files)} PDF(s)."
    )

    total_chunks = 0

    for pdf_path in pdf_files:

        try:

            result = process_pdf(
                pdf_path
            )

            total_chunks += len(
                result["chunks"]
            )

        except Exception as error:

            print(
                f"\nERROR processing "
                f"{pdf_path.name}:"
            )

            print(error)

    print(
        "\n" + "=" * 60
    )

    print(
        "INGESTION COMPLETE"
    )

    print(
        "=" * 60
    )

    print(
        f"PDFs processed: "
        f"{len(pdf_files)}"
    )

    print(
        f"Total chunks: "
        f"{total_chunks}"
    )


if __name__ == "__main__":
    main()