export interface ClassifierFeaturesPayload {
  subject_matter: string;
  primary_objective: string;
  technical_invention: string;
  brand_identifier: string;
  product_appearance: string;
  geographical_origin: string;
  creative_expression: string;
  bio_or_plant_matter: string | null;
  confidentiality: string;
  regulated_product_type: string | null;
}

export interface BackendClassifyRequest {
  product_name: string;
  product_description: string;
  jurisdiction: string;
  features: ClassifierFeaturesPayload;
}

export interface BackendTopPrediction {
  category: string;
  probability: number;
}

export interface BackendRelevantDomain {
  domain: string;
  category: string;
  label: 'IP' | 'Regulatory' | 'Compliance' | string;
  reason: string;
  source_ids?: string[];
}

export interface BackendClassifyResponse {
  predicted_category: string;
  confidence: number;
  top_predictions: BackendTopPrediction[];
  jurisdiction: string;
  product_name: string;
  product_description: string;
  relevant_domains: BackendRelevantDomain[];
}

export interface BackendInsightRequest {
  product_name: string;
  product_description: string;
  jurisdiction: string;
  predicted_category: string;
  confidence: number;
  top_predictions: BackendTopPrediction[];
  features?: Record<string, any>;
}

export interface BackendInsightResponse {
  summary: string;
  why_it_matters: string;
  key_considerations: string[];
}

export interface BackendRAGRequest {
  question: string;
  jurisdiction: string;
  category: string;
  product_name?: string;
  product_description?: string;
  conversation_history?: Array<{ role: string; content: string }>;
}

export interface BackendRAGSource {
  chunk_id?: string;
  document: string;
  source_file: string;
  page_start?: number;
  page_end?: number;
  section?: string;
  jurisdiction: string;
  category: string;
  rerank_score?: number;
}

export interface BackendRAGCitation {
  citation_index: number;
  source_id: string;
  source_title: string;
  authority: string;
  section?: string;
  excerpt: string;
  page_start?: number;
  page_end?: number;
  jurisdiction: string;
}

export interface BackendRAGResponse {
  answer: string;
  sources: BackendRAGSource[];
  citations: BackendRAGCitation[];
  suggested_questions: string[];
  jurisdiction: string;
  category: string;
}
