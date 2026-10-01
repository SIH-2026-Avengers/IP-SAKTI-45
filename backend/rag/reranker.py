MODEL_NAME = "cross-encoder/ms-marco-MiniLM-L6-v2"


class Reranker:

    def __init__(self):
        self._model = None

    @property
    def model(self):
        if self._model is None:
            print(f"Loading reranker: {MODEL_NAME}")
            from sentence_transformers import CrossEncoder
            self._model = CrossEncoder(MODEL_NAME)
        return self._model

    def rerank(
        self,
        query,
        documents,
        top_k=3
    ):
        """
        Re-rank already retrieved documents.

        IMPORTANT:
        Metadata filtering has already happened
        before this function is called.
        """
        if not documents:
            return []

        pairs = [
            (
                query,
                document.content
            )
            for document in documents
        ]

        try:
            scores = self.model.predict(pairs)
            ranked = []
            for document, score in zip(documents, scores):
                document.rerank_score = float(score)
                ranked.append(document)

            ranked.sort(
                key=lambda x: x.rerank_score,
                reverse=True
            )
            return ranked[:top_k]
        except Exception as e:
            print(f"[RERANKER WARNING] Falling back to retrieval order: {e}")
            return documents[:top_k]