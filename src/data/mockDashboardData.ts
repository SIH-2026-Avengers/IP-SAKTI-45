import type { Citation } from '../types';

export interface ClassificationCandidateScore {
  category: string;
  score: number; // Classification score (0-100)
  description: string;
}

export interface AssessmentInsightData {
  summary: string;
  whyThisMatters: string;
  disclaimer: string;
}

export interface RelevantDomainInfo {
  name: string;
  description: string;
  category: 'IP' | 'Regulatory' | 'Biodiversity';
}

export interface MockRAGQA {
  question: string;
  answer: string;
  citations: Citation[];
  suggestedFollowUps: string[];
}

export const MOCK_TOP5_DISTRIBUTION: ClassificationCandidateScore[] = [
  {
    category: 'Classical Ayurvedic Medicine',
    score: 82,
    description: 'Formulations matching recipes in authoritative books listed in the First Schedule of the Drugs & Cosmetics Act.'
  },
  {
    category: 'Proprietary Ayurvedic Medicine',
    score: 46,
    description: 'Formulations incorporating classical ingredients with modified extraction ratios, novel delivery forms, or excipients.'
  },
  {
    category: 'Phytopharmaceutical',
    score: 31,
    description: 'Purified and standardized fractions of medicinal plants evaluated through modern preclinical characterization.'
  },
  {
    category: 'Ayurveda-Aahar',
    score: 18,
    description: 'Dietary food preparations complying with FSSAI Ayurveda Aahar Regulations 2022 without direct therapeutic claims.'
  },
  {
    category: 'Herbal Cosmetic',
    score: 11,
    description: 'Topical preparations intended solely for cleansing, beautifying, or altering external appearance.'
  }
];

export const MOCK_ASSESSMENT_INSIGHT: AssessmentInsightData = {
  summary:
    'Based on the information provided, this product appears to align most closely with the Classical Ayurvedic Medicine category. This classification directly impacts how its traditional knowledge, formulation basis, statutory licensing pathway, and potential IP protections are evaluated.',
  whyThisMatters:
    'Because classical formulations draw directly from recognized traditional knowledge (such as Charaka Samhita and the Ayurvedic Pharmacopoeia of India), the system must distinguish between known traditional heritage elements and genuinely novel technical processes when assessing intellectual property strategies.',
  disclaimer:
    'Classification is an AI-assisted assessment based on the information provided and should not be treated as a legal or regulatory determination.'
};

export const MOCK_RELEVANT_DOMAINS: RelevantDomainInfo[] = [
  {
    name: 'Patent (Section 3(p))',
    description: 'Bar on traditional knowledge aggregations; process patent potential for novel extraction methods.',
    category: 'IP'
  },
  {
    name: 'Trademark (Class 5 / Class 30)',
    description: 'Brand name protection avoiding purely descriptive Ayurvedic Sanskrit terminology.',
    category: 'IP'
  },
  {
    name: 'Drug Regulation (DCA 1940)',
    description: 'State AYUSH Licensing Authority manufacturing license and pharmacopoeial compliance.',
    category: 'Regulatory'
  },
  {
    name: 'Biological Diversity (NBA / ABS)',
    description: 'Mandatory statutory approval under Section 6 before filing IPRs using Indian biological resources.',
    category: 'Biodiversity'
  },
  {
    name: 'Traditional Knowledge (TKDL)',
    description: 'Prior art defense verification against CSIR Traditional Knowledge Digital Library databases.',
    category: 'IP'
  }
];

export const MOCK_RAG_SUGGESTIONS: string[] = [
  'Can this product be patented?',
  'What IP protections may apply?',
  'Could traditional knowledge affect protection?',
  'What regulatory requirements should I review?',
  'Does biological diversity compliance apply?'
];

export const MOCK_RAG_RESPONSES: Record<string, MockRAGQA> = {
  'Can this product be patented?': {
    question: 'Can this product be patented?',
    answer:
      'The patentability of this product depends strictly on whether the claimed features represent a novel, non-obvious technical contribution or are already part of established traditional knowledge.\n\nFor a formulation rooted in classical Ayurvedic traditions, composition-of-matter claims face statutory restrictions under Section 3(p) of the Patents Act, 1970 [1]. However, a separate assessment can be pursued for genuinely novel, non-obvious extraction processes, stabilized delivery mechanisms, or unexpected synergistic ratios demonstrating measurable clinical superiority [2].',
    citations: [
      {
        citationIndex: 1,
        sourceId: 'src-pat-3p',
        sourceTitle: 'The Patents Act, 1970',
        authority: 'Indian Patent Office (IPO)',
        section: 'Section 3(p)',
        excerpt:
          'Inventions which in effect are traditional knowledge or an aggregation or duplication of known properties of traditionally known component(s) are not patentable.',
        jurisdiction: 'INDIA'
      },
      {
        citationIndex: 2,
        sourceId: 'src-tkdl-ref',
        sourceTitle: 'Traditional Knowledge Digital Library (TKDL)',
        authority: 'Ministry of AYUSH',
        section: 'Prior-Art Documentation',
        excerpt:
          'Documented formulations from classical compendia constitute prior art for novelty and inventive step examinations.',
        jurisdiction: 'INDIA'
      }
    ],
    suggestedFollowUps: [
      'What data is required to prove synergy under Section 3(e)?',
      'Can we file a process patent for our extraction technique?'
    ]
  },
  'What IP protections may apply?': {
    question: 'What IP protections may apply?',
    answer:
      'For an Ayurvedic product of this nature, a multi-layered intellectual property strategy is typically recommended:\n\n1. **Trademarks (Nice Class 5 & 30)**: Protect coined, non-descriptive brand names and logos against infringement [1].\n\n2. **Trade Secrets**: Maintain confidential proprietary extraction ratios, fermentation kinetics, and specialized processing know-how [2].\n\n3. **Process Patents**: Protect novel, non-obvious manufacturing methods provided prior approval is secured under the Biological Diversity Act.',
    citations: [
      {
        citationIndex: 1,
        sourceId: 'src-tm-act',
        sourceTitle: 'The Trade Marks Act, 1999',
        authority: 'Indian Patent Office (IPO)',
        section: 'Section 9(1)(b)',
        excerpt:
          'Marks that designate the kind, quality, or intended purpose without distinctive character are subject to refusal.',
        jurisdiction: 'INDIA'
      },
      {
        citationIndex: 2,
        sourceId: 'src-wipo-secrets',
        sourceTitle: 'WIPO Trade Secrets Framework',
        authority: 'WIPO',
        section: 'Article 39 TRIPS',
        excerpt:
          'Protection of undisclosed information having commercial value because it is secret and subject to reasonable steps to keep it secret.',
        jurisdiction: 'INTERNATIONAL'
      }
    ],
    suggestedFollowUps: [
      'How to choose a strong non-descriptive trademark?',
      'What are the requirements for NBA Form II approval?'
    ]
  },
  'Could traditional knowledge affect protection?': {
    question: 'Could traditional knowledge affect protection?',
    answer:
      'Yes. In India, traditional knowledge is formally indexed in the Traditional Knowledge Digital Library (TKDL). If the formulation, botanical combination, or therapeutic use is documented in classical treatises (such as Charaka Samhita or Sushruta Samhita), patent examiners will cite this prior art to reject composition claims under Section 3(p) [1].\n\nTo overcome this, applicants must demonstrate a distinct technical leap that is not obvious to an Ayurvedic practitioner.',
    citations: [
      {
        citationIndex: 1,
        sourceId: 'src-pat-3p',
        sourceTitle: 'The Patents Act, 1970',
        authority: 'Indian Patent Office (IPO)',
        section: 'Section 3(p)',
        excerpt:
          'An invention which in effect is traditional knowledge is not patentable.',
        jurisdiction: 'INDIA'
      }
    ],
    suggestedFollowUps: [
      'How do examiners search the TKDL database?',
      'Can modified delivery systems overcome Section 3(p)?'
    ]
  },
  'What regulatory requirements should I review?': {
    question: 'What regulatory requirements should I review?',
    answer:
      'The regulatory pathway is governed primarily by the Drugs and Cosmetics Act, 1940 and Rules 1945 [1]. Key obligations include:\n\n1. **Manufacturing License**: Issued by the State AYUSH Licensing Authority under Rule 158 / Rule 158B.\n2. **Pharmacopoeial Standards**: Compliance with Ayurvedic Pharmacopoeia of India (API) monographs for raw material identity and purity.\n3. **Labeling**: Mandatory display of "Ayurvedic Proprietary Medicine" or classical text reference.',
    citations: [
      {
        citationIndex: 1,
        sourceId: 'src-dca-1940',
        sourceTitle: 'Drugs and Cosmetics Act, 1940',
        authority: 'Ministry of AYUSH',
        section: 'Section 3(a) & Rule 158B',
        excerpt:
          'Standards and licensing provisions for Ayurvedic, Siddha, and Unani drugs.',
        jurisdiction: 'INDIA'
      }
    ],
    suggestedFollowUps: [
      'What is the difference between AYUSH licensing and FSSAI Ayurveda Aahar?',
      'Are clinical trials required for classical formulations?'
    ]
  },
  'Does biological diversity compliance apply?': {
    question: 'Does biological diversity compliance apply?',
    answer:
      'Yes. Under Section 6 of the Biological Diversity Act, 2002, any person or entity applying for an intellectual property right (in India or abroad) based on research or information on a biological resource obtained from India must obtain previous approval from the National Biodiversity Authority (NBA Form II) before grant of such IPR [1].\n\nAdditionally, commercial utilization may trigger Access and Benefit Sharing (ABS) compliance with the State Biodiversity Board.',
    citations: [
      {
        citationIndex: 1,
        sourceId: 'src-bda-sec6',
        sourceTitle: 'Biological Diversity Act, 2002',
        authority: 'National Biodiversity Authority (NBA)',
        section: 'Section 6(1)',
        excerpt:
          'Mandatory prior approval from the NBA before grant of any IPR for inventions based on Indian biological resources.',
        jurisdiction: 'INDIA'
      }
    ],
    suggestedFollowUps: [
      'When should NBA Form II be submitted in the patent lifecycle?',
      'Are Indian citizens exempt from certain NBA provisions?'
    ]
  }
};
