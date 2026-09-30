import type { EvidenceSource } from './evidence';

export type ProductClassificationCategory =
  | 'ASU Classical Formulation'
  | 'ASU Proprietary Medicine'
  | 'Ayurveda Aahar (Food Product)'
  | 'Herbal Cosmetic / Personal Care'
  | 'Phytopharmaceutical Drug'
  | 'Dietary Supplement / Nutraceutical (Export)'
  | 'Herbal Medicinal Product (Export / THMPD)';

export interface ClassificationCandidate {
  category: ProductClassificationCategory;
  probability: number; // 0.0 to 1.0
  rationale: string;
  keyDistinctions: string[];
  governingFramework: string;
}

export interface ClassificationResult {
  id: string;
  productId: string;
  topCategory: ProductClassificationCategory;
  confidence: number;
  candidates: ClassificationCandidate[];
  summaryExplanation: string;
  primaryRiskFactors: string[];
  recommendedPathway: string;
  supportingEvidence: EvidenceSource[];
  assessedAt: string;
}

export interface ClassificationQuestionField {
  key: string;
  label: string;
  options: string[];
  description: string;
  placeholder?: string;
}

export type ClassificationAnswers = Record<string, string>;
