from retrieval.models import (
    RetrievalRequest
)

from retrieval.retriever import (
    IPSaktiRetriever
)

from rag.reranker import (
    Reranker
)

from rag.context_builder import (
    build_context
)

from rag.generator import (
    RAGGenerator
)


class IPSaktiRAG:

    def __init__(self):

        print(
            "\nInitializing IP-SAKTI RAG..."
        )

        self.retriever = (
            IPSaktiRetriever()
        )

        self.reranker = Reranker()

        self.generator = RAGGenerator()

    def ask(
        self,
        question,
        jurisdiction,
        category,
        # retrieval_k=8,
        retrieval_k=30,
        # final_k=3
        final_k=6
    ):

        # ==========================================
        # 1. HARD FILTERED RETRIEVAL
        # ==========================================

        request = RetrievalRequest(

            query=question,

            jurisdiction=jurisdiction,

            category=category,

            top_k=retrieval_k
        )

        retrieved = (
            self.retriever
            .retrieve(request)
        )

        if not retrieved:

            return {
                "answer":
                    "I could not find relevant "
                    "information in the selected "
                    "jurisdiction and category.",

                "sources": []
            }

        # ==========================================
        # 2. RERANK
        # ==========================================

        reranked = (
            self.reranker
            .rerank(

                question,

                retrieved,

                top_k=final_k
            )
        )

        # ==========================================
        # 3. BUILD CONTEXT
        # ==========================================

        context = build_context(
            reranked
        )

        # ==========================================
        # 4. GENERATE
        # ==========================================

        answer = (
            self.generator
            .generate(

                question,

                context
            )
        )

        # ==========================================
        # 5. SOURCE INFORMATION
        # ==========================================

        sources = []

        for document in reranked:

            sources.append({

                "chunk_id":
                    document.chunk_id,

                "document":
                    document.document_title,

                "source_file":
                    document.source_file,

                "page_start":
                    document.page_start,

                "page_end":
                    document.page_end,

                "section":
                    document.section,

                "jurisdiction":
                    document.jurisdiction,

                "category":
                    document.category,

                "rerank_score":
                    document.rerank_score
            })

        return {

            "answer": answer,

            "sources": sources
        }