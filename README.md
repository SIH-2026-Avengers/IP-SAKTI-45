# IP-SAKTI Sahayak (IP-शक्ति सहायक)
**Problem Statement SIH 26045**

> Multilingual, evidence-grounded AI Assistant for Intellectual Property (IP) and Regulatory Guidance across Indian Ayurvedic/AYUSH statutory regimes and international frameworks.

---

## 🏛️ Project Architecture & Folder Structure

```text
ip_sakti_rag_ui/
├── backend/                         # Complete FastAPI Backend & RAG Engine
│   ├── classifier/                 # Trained Machine Learning Model Pipeline
│   │   └── classifier.py          # Calibrated HistGradientBoosting wrapper
│   ├── data/
│   │   ├── raw/                   # 21 Statutory Acts, Rules & Compendia PDFs
│   │   ├── processed/             # Semantic Chunks & Text Manifests
│   │   └── vectorstore/           # 6,352 ChromaDB Embedded Vectors
│   ├── embeddings/                # BAAI/bge-small-en-v1.5 embedding service
│   ├── ingestion/                 # Document extraction & chunking pipeline
│   ├── models/                    # Trained model binaries (IPShaktiClassification.joblib)
│   ├── rag/                       # Reranker & Groq LLM RAG generation
│   ├── retrieval/                 # Metadata-filtered semantic retriever
│   ├── services/                  # Business logic (IP-SAKTI, Gemini, Domain matrix)
│   ├── storage/                   # Chroma vector database persistent client
│   ├── config.py                  # Core backend paths and model hyperparameters
│   ├── main.py                    # FastAPI application & REST endpoints
│   └── requirements.txt           # Python backend dependencies
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
├── .env                             # Unified environment configuration
├── .gitignore                       # Git ignore rules for Node, Python & Chroma
├── package.json                     # Frontend dependencies & scripts
├── render.yaml                      # 1-Click Render Deployment Blueprint
├── requirements.txt                 # Unified root Python dependencies
├── tailwind.config.js               # Tailwind CSS theme configuration
└── vite.config.ts                   # Vite build tool configuration
```

---

## ⚡ Quickstart (Local Development)

### 1. Prerequisites
- **Node.js** (v18+) & **npm**
- **Python** (3.12)
- **uv** (recommended for ultra-fast virtual environments)

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the root:
```bash
cp .env.example .env
```
Ensure your `GROQ_API_KEY` is set.

---

### 3. Start the Backend API Server
In a terminal, run using `uv`:
```bash
cd backend
uv venv
uv run uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*The FastAPI backend will start at `http://127.0.0.1:8000` (docs available at `/docs`).*

---

### 4. Start the Frontend UI
In a separate terminal, run:
```bash
npm install
npm run dev
```
*The React UI will start at `http://localhost:5173`.*

---

## 🚀 Deployment to Render (1-Click Blueprint)

This repository includes a [`render.yaml`](./render.yaml) file for automated deployment:

1. Push this repository to your **GitHub** account.
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** &rarr; **Blueprint**.
3. Select your GitHub repository.
4. Render will automatically detect `render.yaml` and provision:
   - **`ip-sakti-backend`**: Python FastAPI Web Service.
   - **`ip-sakti-frontend`**: Static Site with Vite build.
5. Add your `GROQ_API_KEY` under the backend environment variables in Render.

---

## 🧪 Testing the RAG Engine

1. Open the UI at `http://localhost:5173`.
2. Fill out the Stage 1 & 2 intake details (e.g., *Classical Ayurvedic formulation*).
3. Click **Begin Assessment**.
4. Open the RAG Assistant in the bottom right corner and ask:
   > *"What are the licensing and GMP requirements for manufacturing an Ayurvedic drug under the Drugs and Cosmetics Rules?"*
5. The assistant returns verified answers citing **Schedule T, Rule 153/154/157, and Form 24-D** with exact page references.
