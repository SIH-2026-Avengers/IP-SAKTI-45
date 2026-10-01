import os
import sys
from pathlib import Path
from typing import List, Dict, Any, Optional
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Ensure project root is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from services.domain_analyzer import determine_relevant_domains

# Load .env from backend or root directory
load_dotenv(Path(__file__).resolve().parent / ".env")
load_dotenv(Path(__file__).resolve().parent.parent / ".env")



# ============================================================
# PYDANTIC DATA CONTRACTS
# ============================================================

class ClassifierFeatures(BaseModel):
    subject_matter: str = Field(..., description="Subject matter nature")
    primary_objective: str = Field(..., description="Primary objective of assessment")
    technical_invention: str = Field(..., description="Technical invention indicator (Yes/No/Unclear)")
    brand_identifier: str = Field(..., description="Brand identifier indicator (Yes/No/Unclear)")
    product_appearance: str = Field(..., description="Product visual appearance indicator (Yes/No/Unclear)")
    geographical_origin: str = Field(..., description="Geographical origin indicator (Yes/No/Unclear)")
    creative_expression: str = Field(..., description="Creative expression indicator (Yes/No/Unclear)")
    bio_or_plant_matter: Optional[str] = Field(None, description="Biological or plant matter nature")
    confidentiality: str = Field(..., description="Confidentiality indicator (Yes/No/Unclear)")
    regulated_product_type: Optional[str] = Field(None, description="Regulated product category")


class ClassificationRequest(BaseModel):
    product_name: str
    product_description: str
    jurisdiction: str = "India"
    features: ClassifierFeatures


class TopPrediction(BaseModel):
    category: str
    probability: float


class RelevantDomain(BaseModel):
    domain: str
    category: str
    label: str
    reason: str
    source_ids: List[str] = []


class ClassificationResponse(BaseModel):
    predicted_category: str
    confidence: float
    top_predictions: List[TopPrediction]
    jurisdiction: str
    product_name: str
    product_description: str
    relevant_domains: List[RelevantDomain]


class AssessmentInsightRequest(BaseModel):
    product_name: str
    product_description: str
    jurisdiction: str = "India"
    predicted_category: str
    confidence: float
    top_predictions: List[TopPrediction]
    features: Optional[Dict[str, Any]] = None


class AssessmentInsightResponse(BaseModel):
    summary: str
    why_it_matters: str
    key_considerations: List[str]


class RAGQueryRequest(BaseModel):
    question: str
    jurisdiction: str = "India"
    category: str
    product_name: Optional[str] = None
    product_description: Optional[str] = None
    conversation_history: Optional[List[Dict[str, str]]] = None


class RAGCitation(BaseModel):
    citation_index: int
    source_id: str
    source_title: str
    authority: str = "Government of India / AYUSH"
    section: Optional[str] = None
    excerpt: str
    page_start: Optional[int] = None
    page_end: Optional[int] = None
    jurisdiction: str = "India"


class RAGSource(BaseModel):
    chunk_id: Optional[str] = None
    document: str
    source_file: str
    page_start: Optional[int] = None
    page_end: Optional[int] = None
    section: Optional[str] = None
    jurisdiction: str
    category: str
    rerank_score: Optional[float] = None


class RAGQueryResponse(BaseModel):
    answer: str
    sources: List[RAGSource]
    citations: List[RAGCitation]
    suggested_questions: List[str]
    jurisdiction: str
    category: str


# ============================================================
# ============================================================
# LIFESPAN & APPLICATION SETUP (INSTANT PORT BINDING FOR RENDER)
# ============================================================

import threading
import time

service_container: Dict[str, Any] = {
    "is_ready": False,
    "ready_event": threading.Event()
}


def _load_core_services():
    try:
        print("\n[STARTUP] Loading IP-SAKTI Models & Gemini Insights in background...")
        from services.ip_sakti_service import IPSaktiService
        from services.gemini_service import GeminiInsightService

        service_container["ip_sakti"] = IPSaktiService()
        service_container["insight"] = GeminiInsightService()
        service_container["is_ready"] = True
        service_container["ready_event"].set()
        print("[STARTUP] Core Classification & Insights Ready!")

        # Asynchronously pre-warm RAG pipeline in background so first query has 0 delay
        try:
            print("[STARTUP] Pre-warming Statutory RAG & ChromaDB...")
            _ = service_container["ip_sakti"].rag
            print("[STARTUP] Statutory RAG Pipeline Pre-warmed & Ready for Instant Queries!\n")
        except Exception as rag_err:
            print(f"[STARTUP WARNING] RAG background pre-warm error (will retry on demand): {rag_err}")

    except Exception as e:
        print(f"[STARTUP ERROR] Service initialization failed: {e}")
        service_container["init_error"] = str(e)
        service_container["ready_event"].set()



@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start loading heavy models in background so port binds immediately on Render (<0.5s)
    threading.Thread(target=_load_core_services, daemon=True).start()
    yield
    print("\n[SHUTDOWN] Cleaning up resources...")
    service_container.clear()


app = FastAPI(
    title="IP-SAKTI Sahayak Backend API",
    description="Intelligent IP & Regulatory Guidance for Ayurveda / AYUSH",
    version="1.0.0",
    lifespan=lifespan
)

# Universal CORS configuration for Localhost + Render Deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _wait_for_services(timeout_seconds: float = 20.0):
    if not service_container.get("is_ready"):
        service_container["ready_event"].wait(timeout=timeout_seconds)
    if not service_container.get("is_ready"):
        error = service_container.get("init_error", "Services still initializing. Please retry in a few seconds.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=error
        )


# ============================================================
# API ENDPOINTS
# ============================================================

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "IP-SAKTI Sahayak API",
        "version": "1.0.0",
        "vector_corpus": "Indian Statutory Documents (21 Acts & Guidelines)",
        "vectors_count": 6352,
        "jurisdictions_supported": ["India"]
    }


@app.get("/api/categories")
def get_categories():
    return {
        "categories": [
            "Ayurveda-Aahar",
            "Biological Diversity",
            "Copyright",
            "Design",
            "Drug Regulation",
            "Food Regulation",
            "Geographical Indication",
            "Patent",
            "Plant Variety Protection",
            "Regulatory",
            "Trade Secret",
            "Trademark"
        ]
    }


@app.post("/api/classify", response_model=ClassificationResponse)
def classify_product(request: ClassificationRequest):
    _wait_for_services()
    service: IPSaktiService = service_container.get("ip_sakti")
    if not service:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Classification service is not initialized."
        )

    # Format features dictionary for the joblib model
    feature_dict = request.features.model_dump()

    try:
        classification = service.classify(feature_dict)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Classification model error: {str(e)}"
        )

    predicted_cat = classification["predicted_category"]
    top_preds = classification["top_predictions"]
    top_confidence = top_preds[0]["probability"] if top_preds else 0.0

    # Determine dynamic relevant domains
    relevant_domains = determine_relevant_domains(
        predicted_category=predicted_cat,
        top_predictions=top_preds,
        features=feature_dict,
        jurisdiction=request.jurisdiction
    )

    return ClassificationResponse(
        predicted_category=predicted_cat,
        confidence=top_confidence,
        top_predictions=[
            TopPrediction(category=item["category"], probability=item["probability"])
            for item in top_preds
        ],
        jurisdiction=request.jurisdiction,
        product_name=request.product_name,
        product_description=request.product_description,
        relevant_domains=[
            RelevantDomain(**domain) for domain in relevant_domains
        ]
    )


@app.post("/api/assessment/insight", response_model=AssessmentInsightResponse)
def get_assessment_insight(request: AssessmentInsightRequest):
    _wait_for_services()
    insight_service: GeminiInsightService = service_container.get("insight")
    if not insight_service:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Insight service is not initialized."
        )

    try:
        insight = insight_service.generate_insight(
            product_name=request.product_name,
            product_description=request.product_description,
            jurisdiction=request.jurisdiction,
            predicted_category=request.predicted_category,
            confidence=request.confidence,
            top_predictions=[p.model_dump() for p in request.top_predictions],
            features=request.features or {}
        )
        return AssessmentInsightResponse(**insight)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate insight: {str(e)}"
        )


@app.post("/api/rag/query", response_model=RAGQueryResponse)
def query_rag(request: RAGQueryRequest):
    _wait_for_services()
    service: IPSaktiService = service_container.get("ip_sakti")
    if not service:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="RAG service is not initialized."
        )

    # Controlled response for International jurisdiction
    if request.jurisdiction.lower() == "international":
        return RAGQueryResponse(
            answer=(
                "International corpus is not yet available in the active dataset. "
                "The current evidence database is scoped exclusively to Indian statutory frameworks "
                "(Patents Act 1970, Drugs and Cosmetics Act 1940, Biological Diversity Act 2002, and FSSAI Regulations)."
            ),
            sources=[],
            citations=[],
            suggested_questions=[
                "How does Indian Patent law treat Ayurvedic formulations?",
                "What are the requirements under the Biological Diversity Act in India?"
            ],
            jurisdiction="International",
            category=request.category
        )

    try:
        rag_output = service.ask(
            question=request.question,
            jurisdiction="India",
            category=request.category
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"RAG retrieval/generation error: {str(e)}"
        )

    raw_sources = rag_output.get("sources", [])
    answer = rag_output.get("answer", "")

    # Build structured citations from sources
    structured_citations: List[RAGCitation] = []
    for idx, src in enumerate(raw_sources, start=1):
        doc_title = src.get("document", "Statutory Document")
        section = src.get("section") or "General Provision"
        page_start = src.get("page_start")

        # Create concise excerpt from chunk or document
        structured_citations.append(
            RAGCitation(
                citation_index=idx,
                source_id=src.get("chunk_id") or f"src-{idx}",
                source_title=doc_title,
                authority="Government of India / Statutory Authority",
                section=section,
                excerpt=f"Relevant statutory provision from {doc_title} (Page {page_start or 'N/A'}, {section}).",
                page_start=page_start,
                page_end=src.get("page_end"),
                jurisdiction="India"
            )
        )

    # Dynamic contextual suggested follow-ups
    category_suggestions = {
        "Patent": [
            "What prior art scrutiny applies under Section 3(p)?",
            "Can novel extraction methods be patented?",
            "How does NBA Section 6 clearance apply before patent filing?"
        ],
        "Ayurveda-Aahar": [
            "What claims are prohibited under Ayurveda Aahar Regulations 2022?",
            "How does Ayurveda-Aahar differ from classical Ayush drugs?",
            "What labeling standards apply for Ayurveda-Aahar products?"
        ],
        "Drug Regulation": [
            "What is the licensing pathway under Rule 158-B?",
            "What authoritative compendia are listed in the First Schedule?",
            "What stability data is required for proprietary Ayurvedic medicines?"
        ],
        "Biological Diversity": [
            "When is NBA Form II approval mandatory?",
            "What are the Access and Benefit Sharing (ABS) requirements?",
            "What exemptions exist for Indian traditional practitioners?"
        ],
        "Trademark": [
            "Can classical Sanskrit Ayurvedic names be trademarked?",
            "How to avoid objections under Section 9 of the Trade Marks Act?",
            "What Nice classification classes apply to Ayurvedic goods?"
        ]
    }

    suggested = category_suggestions.get(
        request.category,
        [
            f"What statutory requirements apply to {request.category}?",
            "What documentation is required for regulatory filing?",
            "How does traditional knowledge affect this category?"
        ]
    )

    return RAGQueryResponse(
        answer=answer,
        sources=[RAGSource(**s) for s in raw_sources],
        citations=structured_citations,
        suggested_questions=suggested,
        jurisdiction=request.jurisdiction,
        category=request.category
    )


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("API_PORT", 8000))
    host = os.getenv("API_HOST", "127.0.0.1")
    uvicorn.run("main:app", host=host, port=port, reload=True)
