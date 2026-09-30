
from dataclasses import dataclass
from typing import Optional


@dataclass
class RetrievalRequest:
    """
    Represents a retrieval request coming from
    the classification layer.
    """

    query: str
    jurisdiction: str
    category: str
    top_k: int = 5


@dataclass
class RetrievedChunk:
    """
    Represents one chunk returned by the retriever.
    """

    chunk_id: str
    content: str
    score: float

    document_id: Optional[str] = None
    document_title: Optional[str] = None
    jurisdiction: Optional[str] = None
    category: Optional[str] = None
    source_file: Optional[str] = None

    page_number: Optional[int] = None

    page_start: Optional[int] = None
    page_end: Optional[int] = None

    section: Optional[str] = None

    rerank_score: Optional[float] = None