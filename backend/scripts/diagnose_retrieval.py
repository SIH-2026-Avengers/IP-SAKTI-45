import sys
from pathlib import Path

# Ensure project root is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

# Ensure UTF-8
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

from embeddings.embedding_service import create_embedding_model
from storage.vector_store import get_vector_store
from rag.reranker import Reranker
from rag.context_builder import build_context

print("Loading vector store & embedding model...")
embedder = create_embedding_model()
store = get_vector_store(embedder)
total_count = store._collection.count()
print(f"Total vectors in ChromaDB: {total_count}")

query = "How does Section 3(p) of the Patents Act affect traditional knowledge and herbal formulations?"
print(f"\nQuery: {query}")

# 1. Similarity Search
results = store.similarity_search_with_score(
    query,
    k=25,
    filter={"$and": [{"jurisdiction": "India"}, {"category": "Patent"}]}
)

print(f"\nRetrieved {len(results)} chunks from Patent category:")
for i, (doc, score) in enumerate(results):
    meta = doc.metadata
    print(f"[{i+1}] Score: {score:.4f} | Doc: {meta.get('document_title')} | Page: {meta.get('page_start')} | Section: {meta.get('section')}")
    snippet = doc.page_content.replace("\n", " ")[:150]
    print(f"    Content: {snippet}...")

# 2. Check if "Section 3" or "traditional knowledge" or "3(p)" exists in the entire collection
print("\nScanning raw chunks in data/processed/chunks/ or Chroma collection for '3(p)' or 'traditional knowledge'...")
raw_matches = store._collection.get(where={"category": "Patent"}, include=["documents", "metadatas"])
docs = raw_matches.get("documents", [])
metas = raw_matches.get("metadatas", [])
print(f"Total Patent category chunks in collection: {len(docs)}")

matching_chunks = []
for idx, (text, m) in enumerate(zip(docs, metas)):
    if "3(p)" in text or "3 (p)" in text or "traditional knowledge" in text.lower() or "traditional" in text.lower():
        matching_chunks.append((idx, m, text))

print(f"Found {len(matching_chunks)} chunks in Patent category containing 'traditional' or '3(p)':")
for idx, m, text in matching_chunks[:10]:
    print(f"\n--- Chunk ID: {m.get('chunk_id')} | Doc: {m.get('document_title')} | Page: {m.get('page_start')} | Section: {m.get('section')}")
    print(text[:400])
