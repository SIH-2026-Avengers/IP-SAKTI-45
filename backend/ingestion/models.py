from dataclasses import dataclass, asdict
from typing import Optional


@dataclass
class DocumentMetadata:
    document_id: str
    document_title: str
    jurisdiction: str
    category: str
    document_type: str
    language: str
    version: Optional[str]
    effective_date: Optional[str]
    source_file: str
    source_url: Optional[str]
    file_hash: str

    def to_dict(self):
        return asdict(self)


@dataclass
class ChunkMetadata:
    chunk_id: str
    document_id: str
    document_title: str
    jurisdiction: str
    category: str
    document_type: str
    language: str
    page_number: Optional[int]
    section: Optional[str]
    chunk_index: int
    source_file: str

    def to_dict(self):
        return asdict(self)