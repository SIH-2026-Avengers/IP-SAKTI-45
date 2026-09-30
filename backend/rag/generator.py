import os
from pathlib import Path
from dotenv import load_dotenv
from groq import Groq

load_dotenv(Path(__file__).resolve().parent.parent / ".env")
load_dotenv(Path(__file__).resolve().parent.parent.parent / ".env")


class RAGGenerator:

    def __init__(self):

        api_key = os.getenv(
            "GROQ_API_KEY"
        )

        if not api_key:

            raise ValueError(
                "GROQ_API_KEY is not set "
                "in the .env file."
            )

        self.model = os.getenv(
            "GROQ_MODEL",
            "llama-3.3-70b-versatile"
        )

        self.client = Groq(
            api_key=api_key
        )

    def generate(
        self,
        question,
        context
    ):

        system_prompt = """
You are IP-SAKTI Sahayak, an AI assistant
for intellectual property and regulatory
guidance related to Ayurveda.

You must answer ONLY using the provided
retrieved context.

Rules:

1. Do not invent laws, sections, rules,
   dates, requirements, or sources.

2. If the context does not contain enough
   information, explicitly say that the
   available sources are insufficient.

3. Do not make assumptions about legal
   applicability.

4. Clearly distinguish what the source
   states from any explanation you provide.

5. Cite the provided sources using:
   [Source N, Page X]

6. Keep the answer structured and clear.

7. For legal or regulatory questions,
   remind the user that the answer is
   informational and should not replace
   advice from a qualified professional
   where appropriate.
"""

        user_prompt = f"""
QUESTION:

{question}


RETRIEVED CONTEXT:

{context}


Answer the question using only the
retrieved context.
"""

        response = (
            self.client
            .chat.completions.create(

                model=self.model,

                messages=[

                    {
                        "role": "system",
                        "content":
                            system_prompt
                    },

                    {
                        "role": "user",
                        "content":
                            user_prompt
                    }
                ],

                temperature=0.1,

                max_tokens=1000
            )
        )

        return (
            response
            .choices[0]
            .message
            .content
        )