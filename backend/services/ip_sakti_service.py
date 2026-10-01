from classifier import IPShaktiClassifier


class IPSaktiService:

    def __init__(self):
        print("\nInitializing IP-SAKTI Service (Classifier & Insights)...")
        self.classifier = IPShaktiClassifier()
        self._rag = None

    @property
    def rag(self):
        if self._rag is None:
            print("\n[LAZY LOAD] Initializing IP-SAKTI Statutory RAG & ChromaDB...")
            from rag.pipeline import IPSaktiRAG
            self._rag = IPSaktiRAG()
        return self._rag

    # =====================================================
    # CLASSIFICATION
    # =====================================================

    def classify(self, features):
        result = self.classifier.predict(features)
        return {
            "predicted_category": result["predicted_category"],
            "top_predictions": result["top_predictions"]
        }

    # =====================================================
    # RAG
    # =====================================================

    def ask(
        self,
        question,
        jurisdiction,
        category
    ):
        return self.rag.ask(
            question=question,
            jurisdiction=jurisdiction,
            category=category,
            retrieval_k=30,
            final_k=6
        )

    # =====================================================
    # CLASSIFY + RAG
    # =====================================================

    def classify_and_ask(
        self,
        question,
        jurisdiction,
        features
    ):
        classification = self.classify(features)
        category = classification["predicted_category"]
        rag_result = self.ask(
            question=question,
            jurisdiction=jurisdiction,
            category=category
        )
        return {
            "classification": classification,
            "jurisdiction": jurisdiction,
            "category": category,
            "rag": rag_result
        }