import type { ClassificationResult } from '../../types';
import { MOCK_EVIDENCE_SOURCES } from './evidence.mock';

export const MOCK_CLASSIFICATION_RESULTS: Record<string, ClassificationResult> = {
  'prod-ashwagandha-extract': {
    id: 'cls-ashwa-001',
    productId: 'prod-ashwagandha-extract',
    topCategory: 'ASU Proprietary Medicine',
    confidence: 0.88,
    candidates: [
      {
        category: 'ASU Proprietary Medicine',
        probability: 0.88,
        rationale: 'Standardized botanical extract containing Withania somnifera processed via hydro-ethanolic extraction with novel quantitative biomarker specifications, intended for stress and cognitive support.',
        keyDistinctions: ['Formulation uses classical herb with proprietary modern extraction ratio (10:1)', 'Labelled with therapeutic claims necessitating State AYUSH Licensing Authority approval under Rule 158B'],
        governingFramework: 'Drugs & Cosmetics Act 1940, Section 3(h) & Rule 158B'
      },
      {
        category: 'Ayurveda Aahar (Food Product)',
        probability: 0.08,
        rationale: 'Could potentially qualify under FSSAI Ayurveda Aahar if packaged strictly as a dietary food preparation without direct therapeutic disease claims.',
        keyDistinctions: ['Requires FSSAI Expert Committee clearance for high-potency standardized extract forms', 'Must use the official Ayurveda Aahar logo and comply with food labeling guidelines'],
        governingFramework: 'Food Safety and Standards (Ayurveda Aahar) Regulations, 2022'
      },
      {
        category: 'Dietary Supplement / Nutraceutical (Export)',
        probability: 0.03,
        rationale: 'For international export to the US market under DSHEA regulations or EU botanicals framework.',
        keyDistinctions: ['Requires 21 CFR Part 111 cGMP compliance for US FDA entry', 'Requires removal of Indian statutory drug claims and reclassification as dietary supplement'],
        governingFramework: 'US FDA DSHEA / EU Novel Foods or Botanical Food Supplements'
      },
      {
        category: 'ASU Classical Formulation',
        probability: 0.01,
        rationale: 'Not an unaltered classical recipe listed in the First Schedule authoritative texts (e.g. Sharangadhara Samhita, Charaka Samhita).',
        keyDistinctions: ['Deviates from classical Anubhuta / Shastra reference due to modern solvent fractionation'],
        governingFramework: 'Drugs & Cosmetics Act 1940, Section 3(a)'
      }
    ],
    summaryExplanation: 'The submitted product is formulated with a standardized hydro-ethanolic extract of Withania somnifera. Because it introduces modified extraction kinetics and makes structured cognitive support claims, the primary domestic classification in India is an ASU Proprietary Medicine under Section 3(h) of the Drugs & Cosmetics Act. For IP protection, Section 3(p) of the Patents Act strictly prohibits patenting the plant\'s known therapeutic uses, though a novel, non-obvious synergistic extraction process may seek process patent protection accompanied by mandatory NBA approval under Section 6 of the Biological Diversity Act.',
    primaryRiskFactors: [
      'High rejection risk for composition patent claims under Section 3(p) of the Patents Act due to known prior art in TKDL',
      'Mandatory prior approval from the National Biodiversity Authority (NBA Form II/III) before commercialization or IP filing',
      'Requires State Licensing Authority AYUSH manufacturing license with Rule 158B stability & safety documentation'
    ],
    recommendedPathway: 'Pursue ASU Proprietary Drug license in India + File NBA Form II before any patent application + Register trademark under Class 5 + Prepare cGMP documentation for US DSHEA export pathway.',
    supportingEvidence: [
      MOCK_EVIDENCE_SOURCES[0], // Sec 3(p)
      MOCK_EVIDENCE_SOURCES[1], // NBA Sec 6
      MOCK_EVIDENCE_SOURCES[2], // DCA Sec 3(a)/3(h)
      MOCK_EVIDENCE_SOURCES[4], // US FDA DSHEA
    ],
    assessedAt: '2026-09-30T07:00:00.000Z'
  }
};
