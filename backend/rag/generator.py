import os
import json
import logging
from pathlib import Path
from dotenv import load_dotenv

# Load from backend or parent root .env
load_dotenv(Path(__file__).resolve().parent.parent / ".env")
load_dotenv(Path(__file__).resolve().parent.parent.parent / ".env")

logger = logging.getLogger("RAGGenerator")


class RAGGenerator:

    def __init__(self):
        self.groq_key = os.getenv("GROQ_API_KEY")
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        self.groq_client = None
        self.gemini_client = None
        self.groq_model = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

        # 1. Primary Engine: Initialize Groq
        if self.groq_key and self.groq_key.strip() and not self.groq_key.startswith("gsk_placeholder") and not self.groq_key.startswith("your_"):
            try:
                from groq import Groq
                self.groq_client = Groq(api_key=self.groq_key.strip())

                configured_model = os.getenv("GROQ_MODEL")
                if configured_model and configured_model.strip():
                    self.groq_model = configured_model.strip()
                else:
                    try:
                        available = [m.id for m in self.groq_client.models.list().data]
                        for pref in ["openai/gpt-oss-120b", "llama-3.3-70b-versatile", "llama-3.1-8b-instant", "qwen/qwen3.8-27b"]:
                            if pref in available:
                                self.groq_model = pref
                                break
                        else:
                            self.groq_model = available[0] if available else "openai/gpt-oss-120b"
                    except Exception:
                        self.groq_model = "openai/gpt-oss-120b"

                print(f"[RAGGenerator] Initialized Groq ({self.groq_model}) as Primary RAG Generator.")
            except Exception as e:
                print(f"[RAGGenerator] Could not initialize Groq: {e}")

        # 2. Secondary Engine: Initialize Gemini
        if self.gemini_key and self.gemini_key.strip() and not self.gemini_key.startswith("your_"):
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.gemini_key.strip())
                gemini_model = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
                self.gemini_client = genai.GenerativeModel(gemini_model)
                print(f"[RAGGenerator] Initialized Google Gemini ({gemini_model}) for fallback RAG Generation.")
            except Exception as e:
                print(f"[RAGGenerator] Could not initialize Gemini: {e}")

        if not self.groq_client and not self.gemini_client:
            print("[RAGGenerator] Notice: Neither GROQ_API_KEY nor GEMINI_API_KEY is configured. Fallback statutory synthesis will be used.")

    def generate(
        self,
        question: str,
        context: str
    ) -> str:
        system_prompt = """You are IP-SAKTI Sahayak, an expert AI legal and regulatory assistant for intellectual property and regulatory compliance in India (focusing on AYUSH, Ayurvedic Formulations, Biological Diversity, Patents, Drugs & Cosmetics, and FSSAI regulations).

You must answer accurately and clearly based on the provided statutory context.
Rules:
1. Do not invent laws, sections, rules, dates, or authorities.
2. If the context is empty or lacks specific clauses, explicitly state the statutory guidance based on the general Indian IP & AYUSH legal framework.
3. Clearly cite the source documents (e.g. [Source 1, Page X] or official Act titles).
4. Provide structured, practical guidance with clear headings and bullet points.
5. Include a brief professional disclaimer reminding the user that this guidance is informational."""

        user_prompt = f"""QUESTION:
{question}

RETRIEVED STATUTORY CONTEXT:
{context}

Please provide a detailed, structured, and cited answer based on the Indian statutory context provided."""

        # Priority 1: Groq LLM (Ultra-fast LPU inference)
        if self.groq_client:
            try:
                response = self.groq_client.chat.completions.create(
                    model=self.groq_model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.2,
                    max_tokens=1500
                )
                if response and response.choices and response.choices[0].message.content:
                    return response.choices[0].message.content.strip()
            except Exception as e:
                print(f"[RAGGenerator] Groq ({self.groq_model}) generation failed: {e}. Attempting fallback...")

        # Priority 2: Gemini LLM
        if self.gemini_client:
            try:
                response = self.gemini_client.generate_content(
                    f"{system_prompt}\n\n{user_prompt}",
                    generation_config={"temperature": 0.2}
                )
                if response and response.text:
                    return response.text.strip()
            except Exception as e:
                print(f"[RAGGenerator] Gemini generation failed: {e}. Attempting synthesis fallback...")

        # Priority 3: Structured Statutory Synthesis Fallback
        return self._generate_context_synthesis(question, context)

    def _generate_context_synthesis(self, question: str, context: str) -> str:
        """Structured synthesis when external LLM APIs encounter network timeouts."""
        if not context or not context.strip():
            return (
                f"### Statutory Guidance: {question}\n\n"
                "**Overview:** Under Indian Intellectual Property and Regulatory frameworks (including the Patents Act 1970, "
                "Drugs & Cosmetics Act 1940, and Biological Diversity Act 2002), specific compliance pathways depend on "
                "novelty, traditional knowledge status, and therapeutic claims.\n\n"
                "**Key Compliance Considerations:**\n"
                "- **Section 3(p) of the Patents Act, 1970:** An invention which in effect is traditional knowledge or an aggregation/duplication of known properties is not patentable.\n"
                "- **National Biodiversity Authority (NBA):** Prior approval is mandatory under Section 3/Section 6 of the Biological Diversity Act 2002 before applying for IPR on biological resources from India.\n"
                "- **AYUSH Regulatory Approvals:** Manufacturing and licensing must comply with Schedule T (GMP) and Rule 158B of the Drugs and Cosmetics Rules, 1945.\n\n"
                "*Disclaimer: This statutory analysis is generated for informational and evaluation purposes and does not constitute formal legal counsel.*"
            )

        return (
            f"### Statutory Assessment & Evidence Synthesis\n\n"
            f"**Query:** {question}\n\n"
            f"**Statutory Context Excerpt:**\n{context[:600]}...\n\n"
            "**Key Statutory Findings:**\n"
            "- The retrieved statutory provisions establish procedural requirements under Indian IP and AYUSH regulatory standards.\n"
            "- Cross-reference the specific Section citations and source documents in the Evidence panel below.\n\n"
            "*Disclaimer: This analysis is informational and should be reviewed alongside official statutory gazettes.*"
        )