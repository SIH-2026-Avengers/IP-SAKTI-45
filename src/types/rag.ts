import type { Citation, EvidenceSource } from './evidence';
import type { JurisdictionType } from './jurisdiction';

export type MessageRole = 'user' | 'assistant' | 'system';

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'insufficient_evidence';

export interface RAGMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  citations?: Citation[];
  retrievedSources?: EvidenceSource[];
  confidenceLevel?: ConfidenceLevel;
  jurisdictionContext?: JurisdictionType;
  suggestedFollowUps?: string[];
  disclaimer?: string;
}

export interface AssistantConversation {
  id: string;
  productId?: string;
  productName?: string;
  jurisdiction: JurisdictionType;
  messages: RAGMessage[];
  createdAt: string;
  updatedAt: string;
}
