import json
from pathlib import Path


MANIFEST_PATH = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "processed"
    / "manifest.json"
)


def load_manifest():

    if not MANIFEST_PATH.exists():

        return {
            "documents": []
        }

    with open(
        MANIFEST_PATH,
        "r",
        encoding="utf-8"
    ) as file:

        return json.load(file)


def save_manifest(manifest):

    MANIFEST_PATH.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    with open(
        MANIFEST_PATH,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            manifest,
            file,
            indent=2,
            ensure_ascii=False
        )


def document_already_ingested(
    manifest,
    file_hash
):

    for document in manifest["documents"]:

        if document["file_hash"] == file_hash:
            return True

    return False


def add_document(
    manifest,
    metadata,
    chunk_count
):

    document_record = dict(metadata)

    document_record["chunk_count"] = chunk_count

    manifest["documents"].append(
        document_record
    )

    return manifest