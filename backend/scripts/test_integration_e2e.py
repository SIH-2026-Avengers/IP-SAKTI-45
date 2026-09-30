import sys
import json
import urllib.request
from pathlib import Path

# Ensure UTF-8 output on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://127.0.0.1:8000"


def test_health():
    print("\n--- 1. Testing GET /api/health ---")
    req = urllib.request.urlopen(f"{BASE_URL}/api/health")
    assert req.status == 200, f"Expected 200, got {req.status}"
    data = json.loads(req.read().decode())
    print("Health response:", data)
    assert data["status"] == "healthy"
    assert data["vectors_count"] == 6352
    print("✓ Health Check Passed (6,352 vectors confirmed)")


def test_categories():
    print("\n--- 2. Testing GET /api/categories ---")
    req = urllib.request.urlopen(f"{BASE_URL}/api/categories")
    assert req.status == 200
    data = json.loads(req.read().decode())
    print("Categories count:", len(data["categories"]))
    assert len(data["categories"]) == 12
    assert "Patent" in data["categories"]
    assert "Ayurveda-Aahar" in data["categories"]
    print("✓ Categories Endpoint Passed (12 target categories confirmed)")


def test_classification():
    print("\n--- 3. Testing POST /api/classify ---")
    payload = {
        "product_name": "Standardized Ashwagandha Extract",
        "product_description": "Supercritical fluid extract of Withania somnifera standardized to 5% withanolides for adaptogenic stress relief.",
        "jurisdiction": "India",
        "features": {
            "subject_matter": "Invention",
            "primary_objective": "Get Protection",
            "technical_invention": "Yes",
            "brand_identifier": "No",
            "product_appearance": "No",
            "geographical_origin": "No",
            "creative_expression": "No",
            "bio_or_plant_matter": "Traditional Knowledge",
            "confidentiality": "No",
            "regulated_product_type": "Other"
        }
    }
    req = urllib.request.Request(
        f"{BASE_URL}/api/classify",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    res = urllib.request.urlopen(req)
    assert res.status == 200
    data = json.loads(res.read().decode())
    print("Predicted Category:", data["predicted_category"])
    print("Confidence:", f"{data['confidence'] * 100:.2f}%")
    print("Top-5 Predictions:")
    for idx, item in enumerate(data["top_predictions"], 1):
        print(f"  {idx}. {item['category']:<30} {item['probability'] * 100:.2f}%")
    print("Relevant Domains:", [d["domain"] for d in data["relevant_domains"]])
    
    assert data["predicted_category"] == "Patent"
    assert len(data["top_predictions"]) == 5
    assert len(data["relevant_domains"]) > 0
    print("✓ Classification & Dynamic Domains Passed")


def test_assessment_insight():
    print("\n--- 4. Testing POST /api/assessment/insight ---")
    payload = {
        "product_name": "Standardized Ashwagandha Extract",
        "product_description": "Supercritical fluid extract for adaptogenic wellness.",
        "jurisdiction": "India",
        "predicted_category": "Patent",
        "confidence": 0.586,
        "top_predictions": [
            {"category": "Patent", "probability": 0.586},
            {"category": "Biological Diversity", "probability": 0.401}
        ],
        "features": {
            "technical_invention": "Yes",
            "bio_or_plant_matter": "Traditional Knowledge"
        }
    }
    req = urllib.request.Request(
        f"{BASE_URL}/api/assessment/insight",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    res = urllib.request.urlopen(req)
    assert res.status == 200
    data = json.loads(res.read().decode())
    print("Insight Summary:", data["summary"][:120] + "...")
    print("Why it Matters:", data["why_it_matters"][:120] + "...")
    assert "Patent" in data["summary"]
    assert len(data["key_considerations"]) > 0
    print("✓ Assessment Insight Passed")


def test_rag_query_india():
    print("\n--- 5. Testing POST /api/rag/query (India + Patent) ---")
    payload = {
        "question": "What are the rules for filing a patent on an Ayurvedic formulation in India?",
        "jurisdiction": "India",
        "category": "Patent",
        "product_name": "Standardized Ashwagandha Extract"
    }
    req = urllib.request.Request(
        f"{BASE_URL}/api/rag/query",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    res = urllib.request.urlopen(req)
    assert res.status == 200
    data = json.loads(res.read().decode())
    print("RAG Answer Snippet:\n", data["answer"][:300] + "...\n")
    print(f"Sources retrieved: {len(data['sources'])}, Citations: {len(data['citations'])}")
    for cit in data["citations"]:
        print(f"  [{cit['citation_index']}] {cit['source_title']} ({cit.get('section', 'General')}) - Page {cit.get('page_start')}")
    assert len(data["sources"]) > 0
    assert len(data["citations"]) > 0
    assert data["category"] == "Patent"
    # Verify all retrieved sources belong to Patent category
    for src in data["sources"]:
        assert src["category"] == "Patent", f"Expected Patent category, got {src['category']}"
    print("✓ Real RAG Query & Hard Category Filtering Passed")


def test_rag_query_international():
    print("\n--- 6. Testing POST /api/rag/query (International - Boundary Check) ---")
    payload = {
        "question": "Can I patent this in the US or Europe?",
        "jurisdiction": "International",
        "category": "Patent",
        "product_name": "Standardized Ashwagandha Extract"
    }
    req = urllib.request.Request(
        f"{BASE_URL}/api/rag/query",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    res = urllib.request.urlopen(req)
    assert res.status == 200
    data = json.loads(res.read().decode())
    print("International Controlled Answer:", data["answer"])
    assert "International corpus is not yet available" in data["answer"]
    assert len(data["sources"]) == 0
    print("✓ Jurisdiction Boundary Enforcement Passed (No hallucination / no Indian leakage)")


def main():
    print("=" * 70)
    print("IP-SAKTI SAHAYAK - FULL INTEGRATION E2E TEST SUITE")
    print("=" * 70)
    test_health()
    test_categories()
    test_classification()
    test_assessment_insight()
    test_rag_query_india()
    test_rag_query_international()
    print("\n" + "=" * 70)
    print("ALL INTEGRATION TESTS PASSED SUCCESSFULLY! (100% GREEN)")
    print("=" * 70)


if __name__ == "__main__":
    main()
