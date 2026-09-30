from pathlib import Path


# ============================================================
# PROJECT PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

DATA_DIR = BASE_DIR / "data"

RAW_DIR = DATA_DIR / "raw"

PROCESSED_DIR = DATA_DIR / "processed"

TEXT_DIR = PROCESSED_DIR / "text"

CHUNKS_DIR = PROCESSED_DIR / "chunks"

VECTORSTORE_DIR = DATA_DIR / "vectorstore"


# ============================================================
# EMBEDDING MODEL
# ============================================================

EMBEDDING_MODEL_NAME = "BAAI/bge-small-en-v1.5"


# ============================================================
# CHUNKING
# ============================================================

CHUNK_SIZE = 1000

CHUNK_OVERLAP = 150


# ============================================================
# CREATE DIRECTORIES
# ============================================================

for directory in [
    RAW_DIR,
    TEXT_DIR,
    CHUNKS_DIR,
    VECTORSTORE_DIR,
]:
    directory.mkdir(parents=True, exist_ok=True)