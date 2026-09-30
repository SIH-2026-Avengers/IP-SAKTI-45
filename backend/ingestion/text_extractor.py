import pymupdf as fitz
from pathlib import Path


def extract_text_from_pdf(pdf_path: Path) -> str:
    """
    Extract text from every page of a PDF.
    """

    document = fitz.open(pdf_path)

    pages = []

    for page_number, page in enumerate(document, start=1):

        text = page.get_text()

        pages.append(
            f"\n\n--- PAGE {page_number} ---\n\n{text}"
        )

    document.close()

    return "\n".join(pages)


def extract_page_text(pdf_path: Path) -> list[dict]:
    """
    Extract text while preserving page-level information.

    This will be important later for citations.
    """

    document = fitz.open(pdf_path)

    pages = []

    for page_number, page in enumerate(document, start=1):

        pages.append(
            {
                "page_number": page_number,
                "text": page.get_text(),
            }
        )

    document.close()

    return pages