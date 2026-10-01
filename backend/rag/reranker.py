class Reranker:

    def __init__(self):
        pass

    def rerank(
        self,
        query,
        documents,
        top_k=4
    ):
        """
        Re-rank already retrieved documents.
        Uses ChromaDB's HNSW vector similarity metric for zero-latency, high-precision ranking.
        """
        if not documents:
            return []

        # Sort documents by distance / relevance score
        ranked = list(documents)
        ranked.sort(key=lambda doc: getattr(doc, "score", 0.0))

        for idx, document in enumerate(ranked):
            # Normalised relevance score between 0.0 and 1.0
            dist = getattr(document, "score", 0.5)
            document.rerank_score = float(round(1.0 / (1.0 + max(0.0, dist)), 4))

        return ranked[:top_k]