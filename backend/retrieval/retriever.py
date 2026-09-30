from embeddings.embedding_service import (
    create_embedding_model
)

from storage.vector_store import (
    get_vector_store
)

from retrieval.filters import (
    build_metadata_filter
)

from retrieval.models import (
    RetrievalRequest,
    RetrievedChunk
)


class IPSaktiRetriever:

    def __init__(self):

        print(
            "Initializing IP-SAKTI retriever..."
        )

        self.embeddings = (
            create_embedding_model()
        )

        self.vector_store = (
            get_vector_store(
                self.embeddings
            )
        )

    def retrieve(
        self,
        request: RetrievalRequest
    ):

        if not request.query.strip():

            raise ValueError(
                "Query cannot be empty."
            )

        # --------------------------------------------------
        # 1. Build HARD metadata filter
        # --------------------------------------------------

        metadata_filter = (
            build_metadata_filter(
                jurisdiction=
                    request.jurisdiction,

                category=
                    request.category
            )
        )

        print(
            "\nRetrieval configuration:"
        )

        print(
            f"Query: {request.query}"
        )

        print(
            f"Jurisdiction: "
            f"{request.jurisdiction}"
        )

        print(
            f"Category: "
            f"{request.category}"
        )

        print(
            f"Top-K: {request.top_k}"
        )

        # --------------------------------------------------
        # 2. Semantic search INSIDE filtered documents
        # --------------------------------------------------

        results = (
            self.vector_store
            .similarity_search_with_score(
                query=request.query,

                k=request.top_k,

                filter=metadata_filter
            )
        )

        # --------------------------------------------------
        # 3. Convert results to our data model
        # --------------------------------------------------

        retrieved_chunks = []

        for document, score in results:

            metadata = document.metadata

            chunk = RetrievedChunk(

                chunk_id=
                    metadata.get(
                        "chunk_id"
                    ),

                content=
                    document.page_content,

                score=float(score),

                document_id=
                    metadata.get(
                        "document_id"
                    ),

                document_title=
                    metadata.get(
                        "document_title"
                    ),

                jurisdiction=
                    metadata.get(
                        "jurisdiction"
                    ),

                category=
                    metadata.get(
                        "category"
                    ),

                source_file=
                    metadata.get(
                        "source_file"
                    ),

                page_number=
                    metadata.get(
                        "page_start"
                    ),

                page_start=
                    metadata.get(
                        "page_start"
                    ),

                page_end=
                    metadata.get(
                        "page_end"
                    ),

                section=
                    metadata.get(
                        "section"
                    )
                )

            retrieved_chunks.append(
                chunk
            )

        return retrieved_chunks