from pathlib import Path
import hashlib
import re


CATEGORY_MAP = {
    # Patent
    "patents": "Patent",
    "patent": "Patent",

    # Trademark
    "trademarks": "Trademark",
    "trademark": "Trademark",

    # Geographical Indication
    "gi": "Geographical Indication",
    "geographical_indication": "Geographical Indication",

    # Copyright
    "copyright": "Copyright",
    "copyrights": "Copyright",

    # Design
    "design": "Design",
    "designs": "Design",

    # Biological Diversity
    "biodiversity": "Biological Diversity",
    "biological_diversity": "Biological Diversity",

    # Plant Variety Protection
    "plant_variety": "Plant Variety Protection",
    "plant_varieties": "Plant Variety Protection",
    "plant_variety_protection": "Plant Variety Protection",

    # Trade Secret
    "trade_secrets": "Trade Secret",
    "trade_secret": "Trade Secret",

    # Regulatory
    "regulatory": "Regulatory",

    # Drug Regulation
    "drugs": "Drug Regulation",
    "drug": "Drug Regulation",
    "drug_regulation": "Drug Regulation",

    # Food Regulation
    "fssai": "Food Regulation",
    "food": "Food Regulation",
    "food_regulation": "Food Regulation",

    # Ayurveda-Aahar
    "ayurveda_aahar": "Ayurveda-Aahar",
}


JURISDICTION_MAP = {
    "india": "India",
    "indian": "India",

    "international": "International",
    "global": "International",

    "wipo": "International",
    "trips": "International",
    "pct": "International",
    "nagoya": "International",
    "cbd": "International",
}


def calculate_file_hash(file_path):
    """
    Create SHA-256 hash of a file.

    This lets us detect duplicate or changed PDFs.
    """

    sha256 = hashlib.sha256()

    with open(file_path, "rb") as file:
        while chunk := file.read(1024 * 1024):
            sha256.update(chunk)

    return sha256.hexdigest()


def normalize_name(value):
    return re.sub(
        r"[^a-z0-9_]+",
        "_",
        value.lower()
    ).strip("_")


def detect_jurisdiction(pdf_path):
    """
    Detect jurisdiction from folder structure.

    Example:

    data/raw/india/patents/document.pdf
                        ↑
                    category
    """

    parts = [
        normalize_name(part)
        for part in Path(pdf_path).parts
    ]

    for part in parts:

        if part in JURISDICTION_MAP:
            return JURISDICTION_MAP[part]

    return "Unknown"


def detect_category(pdf_path):
    """
    Detect legal category from folder structure.
    """

    parts = [
        normalize_name(part)
        for part in Path(pdf_path).parts
    ]

    for part in parts:

        if part in CATEGORY_MAP:
            return CATEGORY_MAP[part]

    return "Unknown"


def create_document_id(pdf_path):
    """
    Create a stable document ID from filename.
    """

    return normalize_name(
        Path(pdf_path).stem
    )


def create_document_metadata(
    pdf_path,
    document_title=None,
    document_type="Legal Document",
    language="English",
    version=None,
    effective_date=None,
    source_url=None,
):
    pdf_path = Path(pdf_path)

    return {
        "document_id": create_document_id(pdf_path),

        "document_title":
            document_title or pdf_path.stem,

        "jurisdiction":
            detect_jurisdiction(pdf_path),

        "category":
            detect_category(pdf_path),

        "document_type":
            document_type,

        "language":
            language,

        "version":
            version,

        "effective_date":
            effective_date,

        "source_file":
            pdf_path.name,

        "source_url":
            source_url,

        "file_hash":
            calculate_file_hash(pdf_path),
    }