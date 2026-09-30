import { apiService } from './api';
import type { RAGMessage, JurisdictionType } from '../types';

export async function sendAssistantQuery(
  query: string,
  jurisdiction: JurisdictionType,
  category: string = 'Patent',
  productName?: string
): Promise<RAGMessage> {
  const response = await apiService.queryRAG({
    question: query,
    jurisdiction: jurisdiction === 'INDIA' ? 'India' : 'International',
    category,
    product_name: productName
  });

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: response.answer,
    timestamp: new Date().toISOString(),
    confidenceLevel: 'high',
    jurisdictionContext: jurisdiction,
    citations: (response.citations || []).map((c) => ({
      citationIndex: c.citation_index,
      sourceId: c.source_id,
      sourceTitle: c.source_title,
      authority: (c.authority as any) || 'Government of India',
      section: c.section || 'Statutory Provision',
      excerpt: c.excerpt,
      jurisdiction
    })),
    suggestedFollowUps: response.suggested_questions,
    disclaimer: 'This guidance is synthesized from statutory frameworks and official guidelines for informational purposes and does not constitute formal legal counsel.'
  };
}
