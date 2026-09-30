from langchain_text_splitters import (
    RecursiveCharacterTextSplitter
)

from config import (
    CHUNK_SIZE,
    CHUNK_OVERLAP
)


def create_page_chunks(
    pages
):

    splitter = RecursiveCharacterTextSplitter(

        chunk_size=CHUNK_SIZE,

        chunk_overlap=CHUNK_OVERLAP,

        separators=[
            "\n\n",
            "\n",
            ". ",
            "; ",
            ", ",
            " ",
            ""
        ]
    )

    chunks = []

    global_chunk_index = 0

    for page in pages:

        page_number = page[
            "page_number"
        ]

        page_text = page[
            "text"
        ]

        if not page_text.strip():
            continue

        page_chunks = splitter.split_text(
            page_text
        )

        for chunk in page_chunks:

            chunks.append({

                "text": chunk,

                "page_start":
                    page_number,

                "page_end":
                    page_number,

                "chunk_index":
                    global_chunk_index
            })

            global_chunk_index += 1

    return chunks