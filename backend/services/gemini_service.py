import os
import json
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

# Load from backend or parent root .env
load_dotenv(Path(__file__).resolve().parent.parent / ".env")
load_dotenv(Path(__file__).resolve().parent.parent.parent / ".env")

logger = logging.getLogger("GeminiInsightService")


class GeminiInsightService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
        self.client = None

        if self.api_key and self.api_key.strip() and not self.api_key.startswith("your_"):
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key.strip())
                self.client = genai.GenerativeModel(self.model_name)
                print(f"[GeminiInsightService] Live Gemini model initialized ({self.model_name})")
            except Exception as e:
                print(f"[GeminiInsightService] Failed to initialize Gemini API: {e}. Fallback enabled.")
                self.client = None
        else:
            print("[GeminiInsightService] No active GEMINI_API_KEY detected. Using deterministic legal synthesis fallback.")

    def generate_insight(
        self,
        product_name: str,
        product_description: str,
        jurisdiction: str,
        predicted_category: str,
        confidence: float,
        top_predictions: List[Dict[str, Any]],
        features: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Generates an assessment insight grounded in the product's classification,
        confidence, and statutory attributes using Gemini (with deterministic fallback).
        """
        features = features or {}
        confidence_pct = round(confidence * 100, 1)

        # -------------------------------------------------------------
        # 1. Attempt Live Gemini API Generation if Client is Ready
        # -------------------------------------------------------------
        if self.client:
            try:
                prompt = self._build_gemini_prompt(
                    product_name=product_name,
                    product_description=product_description,
                    jurisdiction=jurisdiction,
                    predicted_category=predicted_category,
                    confidence_pct=confidence_pct,
                    top_predictions=top_predictions,
                    features=features
                )

                response = self.client.generate_content(
                    prompt,
                    generation_config={
                        "temperature": 0.3,
                        "response_mime_type": "application/json"
                    }
                )

                if response and response.text:
                    parsed = json.loads(response.text)
                    if "summary" in parsed and "why_it_matters" in parsed:
                        return {
                            "summary": parsed["summary"],
                            "why_it_matters": parsed["why_it_matters"],
                            "key_considerations": parsed.get("key_considerations", [])
                        }
            except Exception as e:
                print(f"[GeminiInsightService] Gemini call failed ({e}). Falling back to deterministic synthesis.")

        # -------------------------------------------------------------
        # 2. High-Quality Deterministic Legal Synthesis Fallback
        # -------------------------------------------------------------
        return self._generate_deterministic_insight(
            product_name=product_name,
            product_description=product_description,
            jurisdiction=jurisdiction,
            predicted_category=predicted_category,
            confidence_pct=confidence_pct,
            top_predictions=top_predictions,
            features=features
        )

    def _build_gemini_prompt(
        self,
        product_name: str,
        product_description: str,
        jurisdiction: str,
        predicted_category: str,
        confidence_pct: float,
        top_predictions: List[Dict[str, Any]],
        features: Dict[str, Any]
    ) -> str:
        return f"""
You are the Chief IP and Regulatory Strategist for IP-SAKTI Sahayak, specializing in Indian and international Intellectual Property and AYUSH/Ayurveda regulatory frameworks.

An assessment was conducted with the following parameters:
- **Product Name:** {product_name or 'Unspecified Formulation'}
- **Product Description:** {product_description or 'Traditional/Herbal product under assessment'}
- **Jurisdiction:** {jurisdiction}
- **Primary AI Classification:** {predicted_category} ({confidence_pct}% confidence match)
- **Top Category Distribution:** {json.dumps(top_predictions)}
- **Specific Feature Flags:** {json.dumps(features, indent=2)}

Task:
Generate a legally accurate, nuanced, and actionable assessment insight for the user's dashboard.

Output JSON format strictly with three keys:
{{
  "summary": "A comprehensive 2-3 paragraph overview of the product, explaining the technical and statutory reasoning for its primary classification ({predicted_category}), how its features (e.g. biological source, classical text adherence, novel extraction, or branding) shaped this prediction, and the immediate operational roadmap.",
  "why_it_matters": "A concise, authoritative explanation of the critical legal implications (e.g., cite specific statutory frameworks like Drugs and Cosmetics Act 1940 Schedule T GMP & Rule 153/154/158, Patents Act 1970 Section 3(p) TKDL scrutiny, FSSAI Ayurveda Aahar Regulations 2022, or Biological Diversity Act 2002 Section 3/6 NBA approvals).",
  "key_considerations": [
    "Actionable regulatory/IP consideration 1",
    "Actionable regulatory/IP consideration 2",
    "Actionable regulatory/IP consideration 3"
  ]
}}
"""

    def _generate_deterministic_insight(
        self,
        product_name: str,
        product_description: str,
        jurisdiction: str,
        predicted_category: str,
        confidence_pct: float,
        top_predictions: List[Dict[str, Any]],
        features: Dict[str, Any]
    ) -> Dict[str, Any]:
        summary = (
            f"Based on the structured intake parameters and trained classification model, "
            f"**{product_name or 'the product'}** aligns most strongly with the **{predicted_category}** "
            f"framework with an AI confidence match of **{confidence_pct}%**.\n\n"
            f"This classification directly informs its statutory licensing route, intellectual property strategy, "
            f"and compliance considerations in the **{jurisdiction}** regulatory regime."
        )

        why_it_matters_map = {
            "Patent": (
                f"Because the product incorporates technological formulation or extraction parameters ({features.get('technical_invention', 'Yes')}), "
                f"it must be assessed under the Indian Patents Act, 1970. Key statutory gates include vetting against "
                f"**Section 3(p)** traditional knowledge exclusions, TKDL prior art citations, and securing National Biodiversity Authority (**NBA**) approval."
            ),
            "Ayurveda-Aahar": (
                f"Because the formulation pertains to dietary wellness/food categories, it falls within the scope of the "
                f"**FSSAI Ayurveda Aahar Regulations, 2022**. It is critical to ensure that marketing and labeling do not contain "
                f"direct disease treatment or cure claims, which would shift the regulatory burden to the Drugs and Cosmetics Act."
            ),
            "Drug Regulation": (
                f"Classical and proprietary Ayurvedic medicines are regulated under **Chapter IV-A of the Drugs and Cosmetics Act, 1940** and Rules 1945. "
                f"The licensing pathway (**Rule 153, Form 24-D / 25-D**) depends heavily on whether ingredients strictly conform to authoritative "
                f"texts in the First Schedule or incorporate novel extracts and dosage forms."
            ),
            "Biological Diversity": (
                f"Products utilizing Indian biological resources or traditional heritage knowledge require compliance with the "
                f"**Biological Diversity Act, 2002**. Prior approval under **Section 6** from the National Biodiversity Authority (**NBA**) "
                f"is mandatory before applying for any intellectual property right in India or abroad."
            ),
            "Trademark": (
                f"Distinctive commercial nomenclature and brand elements must be evaluated under the **Trade Marks Act, 1999**. "
                f"Descriptive or generic Ayurvedic Sanskrit terminology cannot be monopolized under Section 9, requiring "
                f"distinctive coining of brand identity."
            ),
            "Geographical Indication": (
                f"Where raw botanicals or processing heritage are rooted in a specific geographic terroir in India, "
                f"protection under the **Geographical Indications of Goods Act, 1999** provides collective regional protection."
            ),
            "Design": (
                f"Novel external product containers, packaging structures, and aesthetic applicators may be protected "
                f"under the **Designs Act, 2000**, distinct from the internal chemical or botanical formulation."
            ),
            "Trade Secret": (
                f"Proprietary extraction ratios, standard manufacturing procedures, and confidential formulations "
                f"can be maintained through rigorous non-disclosure agreements and internal trade secret governance."
            ),
            "Copyright": (
                f"Original literary formulations in instruction leaflets, artwork, and educational wellness brochures "
                f"are protectable under the **Copyright Act, 1957**."
            ),
            "Plant Variety Protection": (
                f"Specific bred or harvested medicinal plant varieties may be registered under the **Protection of Plant Varieties "
                f"and Farmers' Rights Act, 2001** for distinctness, uniformity, and stability."
            ),
            "Food Regulation": (
                f"Nutraceuticals and functional food supplements are governed under **FSSAI standards**, "
                f"requiring adherence to recommended daily allowances (RDA) and ingredient schedules."
            ),
            "Regulatory": (
                f"General statutory compliance applies across the manufacturing standards, labeling norms, and "
                f"good manufacturing practices (**Schedule T GMP**) prescribed for AYUSH industrial units."
            )
        }

        why_it_matters = why_it_matters_map.get(
            predicted_category,
            f"This classification impacts how traditional knowledge, formulation basis, statutory licensing, and potential IP protections are evaluated under Indian law."
        )

        key_considerations = [
            f"Evaluate {predicted_category} compliance pathways against applicable Indian statutory compendia.",
            "Distinguish between classical traditional heritage elements (TKDL prior art) and novel technical improvements.",
            "Verify whether biological resources require National Biodiversity Authority (NBA) Form II / Section 6 clearance."
        ]

        return {
            "summary": summary,
            "why_it_matters": why_it_matters,
            "key_considerations": key_considerations
        }
