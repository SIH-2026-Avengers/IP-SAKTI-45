# IP-SAKTI Sahayak (IP-शक्ति सहायक)
**Problem Statement SIH 26045**

> Multilingual, evidence-grounded AI Assistant for Intellectual Property (IP) and Regulatory Guidance across Indian Ayurvedic/AYUSH statutory regimes and international frameworks.

---

## 🏛️ Project Architecture & Folder Structure

```text
ip_sakti_rag_ui/
├── backend/                         # Complete FastAPI Backend & RAG Engine
│   ├── classifier/                 # Trained Machine Learning Model Pipeline
│   │   ├── classifier.py          # River online classifier serving adapter
│   │   └── incremental_classifier.ipynb # River training workflow
│   ├── data/
│   │   ├── raw/                   # 21 Statutory Acts, Rules & Compendia PDFs
│   │   ├── processed/             # Semantic Chunks & Text Manifests
│   │   └── vectorstore/           # 6,352 ChromaDB Embedded Vectors
│   ├── embeddings/                # BAAI/bge-small-en-v1.5 embedding service
│   ├── ingestion/                 # Document extraction & chunking pipeline
│   ├── models/                    # Trained River model artifact
│   ├── rag/                       # Reranker & Groq LLM RAG generation
│   ├── retrieval/                 # Metadata-filtered semantic retriever
│   ├── services/                  # Business logic (IP-SAKTI, Gemini, Domain matrix)
│   ├── storage/                   # Chroma vector database persistent client
│   ├── config.py                  # Core backend paths and model hyperparameters
│   ├── main.py                    # FastAPI application & REST endpoints
│   ├── pyproject.toml             # Python dependencies and runtime constraints
│   └── uv.lock                    # Locked Python dependency versions
│
├── public/                          # Static assets, SVG icons, and favicon
├── src/                             # React 19 + TypeScript + Tailwind Frontend
│   ├── assets/                     # Brand graphics and images
│   ├── components/                 # UI components (dashboard, intake, rag, ui)
│   │   ├── assistant/              # Assistant page components
│   │   ├── common/                 # Header, Markdown, Language switcher, Citations
│   │   ├── dashboard/              # Assessment cards, distribution chart, insights
│   │   ├── intake/                 # 2-Stage intake questionnaire
│   │   ├── layout/                 # App layout & wrappers
│   │   ├── processing/             # Animated analysis screen
│   │   ├── rag/                    # Grounded floating assistant chat widget
│   │   └── ui/                     # Accessible design system components
│   ├── context/                    # React Contexts (Assessment, Language, Jurisdiction)
│   ├── data/                       # Form configurations & 10-language translations
│   ├── pages/                      # Intake, Dashboard, Evidence, Assistant views
│   ├── services/                   # Frontend HTTP API client (`api.ts`)
│   ├── types/                      # TypeScript contracts and models
│   └── utils/                      # Classname and formatting utilities
│
├── .env.example                     # Unified environment template
├── .gitignore                       # Git ignore rules for Node, Python & Chroma
├── package.json                     # Frontend dependencies & scripts
├── render.yaml                      # 1-Click Render Deployment Blueprint
├── package-lock.json                # Locked frontend dependency versions
├── setup.ps1                        # One-command Windows environment setup
├── tailwind.config.js               # Tailwind CSS theme configuration
└── vite.config.ts                   # Vite build tool configuration
```

---

## ⚡ Quickstart (Local Development)

### 1. Prerequisites
- **Node.js** (v22.12+) & **npm**
- **uv** (Python package and environment manager)

### 2. Set Up the Environment
On Windows, from the repository root, run:
```powershell
.\setup.ps1
```

The script installs Python 3.12 and the locked backend dependencies, runs `npm ci` from the committed frontend lockfile, creates a local `.env` from `.env.example` if needed, trains the initial River classifier only if its model artifact is missing, and builds the frontend. `.env` files, virtual environments, `node_modules`, and build outputs are not committed.

Add your `GROQ_API_KEY` and/or `GEMINI_API_KEY` to `.env` for live LLM responses. Without them, the backend uses its deterministic fallback.

### 3. Start the Backend and Frontend
In one terminal:
```bash
cd backend
uv run --locked uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

In another terminal:
```bash
npm run dev
```

The API is available at `http://127.0.0.1:8000` and the UI at `http://localhost:5173`. To install the optional notebook kernel dependencies separately, run `uv sync --locked --extra notebook` from `backend/`.

---

## 🚀 Deployment to Render (1-Click Blueprint)

This repository includes a [`render.yaml`](./render.yaml) file for automated deployment:

1. Push this repository to your **GitHub** account.
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** &rarr; **Blueprint**.
3. Select your GitHub repository.
4. Render will automatically detect `render.yaml` and provision:
   - **`ip-sakti-backend`**: Python FastAPI Web Service.
   - **`ip-sakti-frontend`**: Static Site with Vite build.
5. Add `GROQ_API_KEY` and/or `GEMINI_API_KEY` under the backend environment variables in Render. Never commit `.env` or API keys.

The classifier saves feedback to a local model file. The included Render free web service has ephemeral storage, so online model updates may be lost on restart or redeploy and are not shared across multiple instances. Use persistent shared storage for durable production learning.

---

## 🧪 Testing the RAG Engine

1. Open the UI at `http://localhost:5173`.
2. Fill out the Stage 1 & 2 intake details (e.g., *Classical Ayurvedic formulation*).
3. Click **Begin Assessment**.
4. Open the RAG Assistant in the bottom right corner and ask:
   > *"What are the licensing and GMP requirements for manufacturing an Ayurvedic drug under the Drugs and Cosmetics Rules?"*
5. The assistant returns verified answers citing **Schedule T, Rule 153/154/157, and Form 24-D** with exact page references.
