import type { RAGMessage } from '../../types';
import { MOCK_EVIDENCE_SOURCES } from './evidence.mock';

export const INITIAL_ASSISTANT_MESSAGES: RAGMessage[] = [
  {
    id: 'msg-welcome-001',
    role: 'assistant',
    content: 'Namaste. I am your IP-SAKTI Regulatory & IP Guidance Assistant. I can help evaluate patentability risks under Section 3(p), Biological Diversity Act (NBA/ABS) compliance, AYUSH vs. FSSAI Ayurveda Aahar regulatory pathways, and export requirements for your Ayurvedic product.\n\nHow can I assist your product evaluation today?',
    timestamp: '2026-09-30T07:05:00.000Z',
    confidenceLevel: 'high',
    jurisdictionContext: 'INDIA',
    suggestedFollowUps: [
      'Can we patent a novel extraction method for Ashwagandha?',
      'Do we need NBA Form II approval before filing an Indian patent?',
      'What is the difference between ASU Proprietary Medicine and Ayurveda Aahar?',
      'What are the labeling and cGMP requirements for US FDA export?'
    ]
  },
  {
    id: 'msg-sample-q',
    role: 'user',
    content: 'Can we file a patent for our standardized Ashwagandha and Piperine formulation in India?',
    timestamp: '2026-09-30T07:06:00.000Z'
  },
  {
    id: 'msg-sample-a',
    role: 'assistant',
    content: 'Under the Indian patent regime, filing a patent for an Ashwagandha (*Withania somnifera*) and Piperine (*Piper nigrum*) composition faces severe statutory hurdles:\n\n1. **Section 3(p) of the Patents Act, 1970**: The law explicitly bars patenting inventions that are essentially traditional knowledge or an aggregation of known properties of traditionally known plants [1]. Both Ashwagandha and Maricha/Piperine are heavily documented in the Traditional Knowledge Digital Library (TKDL) and classical texts (Charaka Samhita, Bhavaprakasha).\n\n2. **Section 3(e) - Mere Admixture**: Combining two known herbs is considered a mere admixture unless you can prove an unexpected synergistic therapeutic effect through rigorous comparative experimental data demonstrating efficacy beyond the additive sum of individual components.\n\n3. **Biological Diversity Act, 2002 (Section 6)**: Because your formulation utilizes biological resources sourced from India, obtaining prior approval from the National Biodiversity Authority (NBA Form II) is mandatory before the grant of any IPR [2].\n\n**Strategic Recommendation**: Focus patent claims strictly on novel, non-obvious *process/extraction technologies* or specific stabilized delivery formulations rather than composition of matter, while building strong Trademark (Class 5) and Trade Secret protection around proprietary extraction parameters.',
    timestamp: '2026-09-30T07:06:05.000Z',
    confidenceLevel: 'high',
    jurisdictionContext: 'INDIA',
    citations: [
      {
        citationIndex: 1,
        sourceId: 'ev-pat-sec3p',
        sourceTitle: MOCK_EVIDENCE_SOURCES[0].title,
        authority: MOCK_EVIDENCE_SOURCES[0].authority,
        section: MOCK_EVIDENCE_SOURCES[0].sectionOrArticle,
        excerpt: MOCK_EVIDENCE_SOURCES[0].excerpt,
        jurisdiction: 'INDIA',
        url: MOCK_EVIDENCE_SOURCES[0].url
      },
      {
        citationIndex: 2,
        sourceId: 'ev-bda-sec6',
        sourceTitle: MOCK_EVIDENCE_SOURCES[1].title,
        authority: MOCK_EVIDENCE_SOURCES[1].authority,
        section: MOCK_EVIDENCE_SOURCES[1].sectionOrArticle,
        excerpt: MOCK_EVIDENCE_SOURCES[1].excerpt,
        jurisdiction: 'INDIA',
        url: MOCK_EVIDENCE_SOURCES[1].url
      }
    ],
    retrievedSources: [
      MOCK_EVIDENCE_SOURCES[0],
      MOCK_EVIDENCE_SOURCES[1]
    ],
    suggestedFollowUps: [
      'What experimental data is required to overcome Section 3(e) synergy objections?',
      'How long does the NBA Form II approval process typically take?',
      'Should we position this product as Ayurveda Aahar instead to bypass AYUSH licensing?'
    ],
    disclaimer: 'This guidance is synthesized from statutory frameworks and official guidelines for informational purposes and does not constitute formal legal counsel.'
  }
];
