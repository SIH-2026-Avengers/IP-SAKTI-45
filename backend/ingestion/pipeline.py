import json
from pathlib import Path

from ingestion.text_extractor import (
    extract_page_text
)

from ingestion.text_cleaner import (
    clean_text
)

from ingestion.chunker import (
    create_page_chunks
)

from ingestion.contextualizer import (
    contextualize_chunk
)

from ingestion.metadata import (
    create_document_metadata
)

from ingestion.manifest import (
    load_manifest,
    save_manifest,
    document_already_ingested,
    add_document
)

from ingestion.provenance import (
    find_section
)

from config import (
    TEXT_DIR,
    CHUNKS_DIR
)


def save_text(text, output_path):

    output_path.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    with open(
        output_path,
        "w",
        encoding="utf-8"
    ) as file:

        file.write(text)


def process_pdf(
    pdf_path,
    document_title=None
):

    pdf_path = Path(pdf_path)

    print(
        f"\nProcessing: {pdf_path.name}"
    )

    # ==================================================
    # 1. DOCUMENT METADATA
    # ==================================================

    metadata = create_document_metadata(
        pdf_path,
        document_title=document_title
    )

    print(
        f"Jurisdiction: "
        f"{metadata['jurisdiction']}"
    )

    print(
        f"Category: "
        f"{metadata['category']}"
    )

    # ==================================================
    # 2. EXTRACT PAGES
    # ==================================================

    pages = extract_page_text(
        pdf_path
    )

    cleaned_pages = []

    for page in pages:

        cleaned = clean_text(
            page["text"]
        )

        if not cleaned.strip():
            continue

        cleaned_pages.append({

            "page_number":
                page["page_number"],

            "text":
                cleaned
        })

    # ==================================================
    # 3. SAVE FULL TEXT
    # ==================================================

    full_text_parts = []

    for page in cleaned_pages:

        full_text_parts.append(

            f"--- PAGE "
            f"{page['page_number']}"
            f" ---\n"
            f"{page['text']}"
        )

    full_text = "\n\n".join(
        full_text_parts
    )

    text_output = (
        TEXT_DIR
        / f"{metadata['document_id']}.txt"
    )

    save_text(
        full_text,
        text_output
    )

    print(
        f"Saved extracted text: "
        f"{text_output}"
    )

    # ==================================================
    # 4. PAGE-AWARE CHUNKING
    # ==================================================

    chunks = create_page_chunks(
        cleaned_pages
    )

    # ==================================================
    # 5. CREATE CHUNK DIRECTORY
    # ==================================================

    chunk_directory = (
        CHUNKS_DIR
        / metadata["document_id"]
    )

    chunk_directory.mkdir(
        parents=True,
        exist_ok=True
    )

    chunk_records = []

    # ==================================================
    # 6. CREATE CHUNK RECORDS
    # ==================================================

    for chunk in chunks:

        chunk_index = chunk[
            "chunk_index"
        ]

        page_start = chunk[
            "page_start"
        ]

        page_end = chunk[
            "page_end"
        ]

        chunk_id = (

            f"{metadata['document_id']}"
            f"_chunk_{chunk_index:04d}"
        )

        # Detect legal section
        section = find_section(
            chunk["text"]
        )

        # Add document/page/section context
        contextualized = (
            contextualize_chunk(

                chunk=chunk["text"],

                document_title=
                    metadata[
                        "document_title"
                    ],

                section=section,

                page_number=
                    page_start
            )
        )

        # ==================================================
        # CHUNK METADATA
        # ==================================================

        chunk_metadata = {

            "chunk_id":
                chunk_id,

            "document_id":
                metadata[
                    "document_id"
                ],

            "document_title":
                metadata[
                    "document_title"
                ],

            "jurisdiction":
                metadata[
                    "jurisdiction"
                ],

            "category":
                metadata[
                    "category"
                ],

            "document_type":
                metadata[
                    "document_type"
                ],

            "language":
                metadata[
                    "language"
                ],

            "page_start":
                page_start,

            "page_end":
                page_end,

            "section":
                section,

            "chunk_index":
                chunk_index,

            "source_file":
                metadata[
                    "source_file"
                ]
        }

        # ==================================================
        # STORE CHUNK RECORD
        # ==================================================

        chunk_records.append({

            "chunk_id":
                chunk_id,

            "text":
                contextualized,

            "metadata":
                chunk_metadata
        })

        # ==================================================
        # SAVE INDIVIDUAL TXT
        # ==================================================

        chunk_file = (

            chunk_directory
            / f"{chunk_id}.txt"
        )

        save_text(
            contextualized,
            chunk_file
        )

    # ==================================================
    # 7. SAVE ALL CHUNK METADATA
    # ==================================================

    chunk_metadata_file = (
        chunk_directory
        / "chunks.json"
    )

    with open(
        chunk_metadata_file,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            chunk_records,
            file,
            indent=2,
            ensure_ascii=False
        )

    print(
        f"Saved chunk metadata: "
        f"{chunk_metadata_file}"
    )

    # ==================================================
    # 8. UPDATE MANIFEST
    # ==================================================

    manifest = load_manifest()

    if not document_already_ingested(
        manifest,
        metadata["file_hash"]
    ):

        manifest = add_document(

            manifest,

            metadata,

            len(chunk_records)
        )

        save_manifest(
            manifest
        )

    # ==================================================
    # RETURN
    # ==================================================

    return {

        "metadata":
            metadata,

        "chunks":
            chunk_records
    }