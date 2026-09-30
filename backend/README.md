# IP-SAKTI Sahayak — AI Regulatory & IP Backend Engine
**Problem Statement:** SIH 26045

Evidence-grounded multilingual AI engine for Intellectual Property (IP) and regulatory guidance for Ayurveda & Ayush products under Indian and international statutory regimes.

---

## Architecture Overview

1. **Machine Learning Classifier**: Trained `HistGradientBoostingClassifier` with `CalibratedClassifierCV` (`models/IPShaktiClassification.joblib`) predicting across 12 statutory categories from 10 product features using `scikit-learn==1.6.1`.
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
- **Scikit-Learn**: `1.6.1` (strict requirement for joblib classifier model compatibility)

---

## Quickstart

### 1. Install Dependencies with `uv`

```bash
uv sync
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
- `POST /api/assessment/insight` — Generates assessment insight and strategic considerations.
- `POST /api/rag/query` — Executes metadata-filtered Chroma retrieval, ms-marco reranking, Groq LLM synthesis, and structured citations.

---

## Running Integration Tests

```bash
uv run python scripts/test_integration_e2e.py
```

---

## Legal & Statutory Disclaimer

IP-SAKTI Sahayak provides evidence-grounded informational guidance synthesized from statutes and official publications. It does not constitute formal legal counsel.
