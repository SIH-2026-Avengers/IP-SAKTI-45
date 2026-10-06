# IP-SAKTI Sahayak — AI Regulatory & IP Backend Engine
**Problem Statement:** SIH 26045

Evidence-grounded multilingual AI engine for Intellectual Property (IP) and regulatory guidance for Ayurveda & Ayush products under Indian and international statutory regimes.

---

## Architecture Overview

1. **Machine Learning Classifier**: River `OneHotEncoder` + `SoftmaxRegression` model (`models/IPShaktiRiverClassifier.pkl`) predicting across 12 statutory categories from 10 intake features. User-selected RAG categories are submitted as one incremental training example when the selected category is used for a question.
2. **Statutory Vector Store**: Persistent ChromaDB (`data/vectorstore/`) containing **6,352 vectors** across 21 Indian legal and regulatory PDFs (Patents Act 1970, DCA 1940, BDA 2002, FSSAI 2022).
3. **Embeddings**: `BAAI/bge-small-en-v1.5` (384-dimensional dense semantic vectors).
4. **Reranker**: `cross-encoder/ms-marco-MiniLM-L6-v2` cross-attention reranker refining top-20 retrieved candidates to top-5 high-precision statutory excerpts.
5. **RAG Generator**: Groq LLM generation (`openai/gpt-oss-120b` / `llama-3.3-70b-versatile`) with strict statutory evidence grounding and structured citation synthesis.
6. **Assessment Insight Engine**: Server-side contextual synthesis and LLM insight engine.

---

## 12 Target Statutory Categories

1. `Ayurveda-Aahar`
2. `Biological Diversity`
3. `Copyright`
4. `Design`
5. `Drug Regulation`
6. `Food Regulation`
7. `Geographical Indication`
8. `Patent`
9. `Plant Variety Protection`
10. `Regulatory`
11. `Trade Secret`
12. `Trademark`

---

## Requirements & Environment

- **Python**: `3.12.x`
- **Package Manager**: `uv`
- **River**: `0.26.1` (incremental classifier and model persistence)

The incremental classifier notebook is `notebook/incremental_classifier.ipynb`. It trains from `notebook/Temp/rag_router_dataset_v1_10000.csv`, whose ten input columns and twelve target categories match the serving contract. The similarly named 100k CSV has a different feature schema and seven unrelated labels, so it is not used for this classifier. The River model is saved atomically; run `uv run --locked python scripts/train_incremental_classifier.py` to rebuild it from the bootstrap data. Install the optional notebook kernel with `uv sync --locked --extra notebook` when using the `pyproject.toml` workflow.

---

## Quickstart

### 1. Install Dependencies with `uv`

```bash
uv sync --locked
```

### 2. Configure Environment Variables

Create `.env` file (see `.env.example`):

```env
GROQ_API_KEY="your_groq_api_key"
GROQ_MODEL="openai/gpt-oss-120b"
API_HOST="127.0.0.1"
API_PORT=8000
FRONTEND_ORIGIN="http://localhost:5173"
```

### 3. Start Backend Server

```bash
uv run uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

---

## API Endpoints

- `GET /api/health` — Returns system health and confirms 6,352 vector count.
- `GET /api/categories` — Returns 12 authoritative target classification classes.
- `POST /api/classify` — Runs ML classification, returns top-1 category, confidence score, top-5 distribution, and dynamic relevant domains.
- `POST /api/classifier/feedback` — Applies and persists one idempotent River update for a user-selected category and the active assessment feature snapshot.
- `POST /api/assessment/insight` — Generates assessment insight and strategic considerations.
- `POST /api/rag/query` — Executes metadata-filtered Chroma retrieval, ms-marco reranking, Groq LLM synthesis, and structured citations.

Classifier feedback is persisted to the local River model artifact. Deployments using ephemeral storage can lose those online updates when an instance restarts or is redeployed; multiple instances also do not share updates without shared persistent storage.

---

## Running Integration Tests

```bash
uv run python scripts/test_integration_e2e.py
```

---

## Legal & Statutory Disclaimer

IP-SAKTI Sahayak provides evidence-grounded informational guidance synthesized from statutes and official publications. It does not constitute formal legal counsel.
