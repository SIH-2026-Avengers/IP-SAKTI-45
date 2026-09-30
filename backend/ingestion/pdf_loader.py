from pathlib import Path


def find_pdf_files(directory):
    """
    Recursively find all PDF files inside a directory.
    """

    directory = Path(directory)

    return sorted(
        [pdf for pdf in directory.rglob("*.pdf")]
    )


def get_pdf_file(directory):
    """
    Backward-compatible helper.

    Returns the first PDF found.
    """

    pdf_files = find_pdf_files(directory)

    if not pdf_files:
        raise FileNotFoundError(
            f"No PDF files found in {directory}"
        )

    if len(pdf_files) > 1:
        print(
            f"Warning: {len(pdf_files)} PDFs found. "
            f"Using the first one: {pdf_files[0]}"
        )

    return pdf_files[0]