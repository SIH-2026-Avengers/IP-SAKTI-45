import type { JurisdictionType } from './jurisdiction';

export type AuthorityType = 
  | 'Indian Patent Office (IPO)' 
  | 'National Biodiversity Authority (NBA)' 
  | 'Ministry of AYUSH' 
  | 'FSSAI' 
  | 'CDSCO' 
  | 'WIPO' 
  | 'US FDA' 
  | 'EMA / HMPC';

export type DocumentCategory = 
  | 'Act / Statute' 
  | 'Gazette Notification' 
  | 'Regulatory Guideline' 
  | 'Classical Text Citation' 
  | 'TKDL Prior Art' 
  | 'Judicial Precedent' 
  | 'Standard / Monograph';

export interface EvidenceSource {
  id: string;
  title: string;
  authority: AuthorityType;
  jurisdiction: JurisdictionType;
  category: DocumentCategory;
  sectionOrArticle: string;
  yearOrDate: string;
  excerpt: string;
  url?: string;
  relevanceScore: number; // 0.0 to 1.0
  tags: string[];
}

export interface Citation {
  citationIndex: number;
  sourceId: string;
  sourceTitle: string;
  authority: AuthorityType;
  section: string;
  excerpt: string;
  jurisdiction: JurisdictionType;
  url?: string;
}
