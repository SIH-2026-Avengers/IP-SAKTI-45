import type { ProductAssessmentInput, IPAssessmentSummary, RegulatoryAssessmentSummary } from '../../types';

export const DEFAULT_PRODUCT_INPUT: ProductAssessmentInput = {
  productName: '',
  productDescription: '',
  genericName: '',
  botanicalIngredients: [
    'Withania somnifera (Ashwagandha root)',
    'Piper nigrum (Maricha / Bio-enhancer)',
    'Centella asiatica (Mandukaparni)'
  ],
  productForm: 'Capsule / Tablet',
  intendedUse: 'Cognitive focus, adaptogenic stress resilience, and memory enhancement in working adults.',
  therapeuticClaims: 'Supports neurological endurance and modulates cortisol response via standardized withanolide glycosides.',
  classicalStatus: 'Modified Classical (Classical ingredients with modern extract/excipients)',
  sourcingOrigin: 'Domestic Cultivation / Sourced in India',
  jurisdiction: 'INDIA',
  targetExportMarkets: ['United States', 'European Union'],
  manufacturingProcessSummary: 'Supercritical CO2 and hydro-ethanolic multi-stage extraction followed by vacuum spray drying.',
  classificationAnswers: {}
};

export const MOCK_IP_SUMMARY: IPAssessmentSummary = {
  patentEligibility: {
    status: 'Conditional / Process Patent Potential',
    score: 42,
    notes: 'Direct composition claims over Withania somnifera or Piper nigrum combinations are severely vulnerable under Section 3(p) as traditional knowledge aggregations. Novel, non-obvious solvent recovery processes or specific stabilized bio-enhancement ratios with demonstrated unexpected synergy may sustain a process claim.',
    section3pImpact: 'High risk of TKDL (Traditional Knowledge Digital Library) citations referencing Charaka Samhita and Bhavaprakasha.'
  },
  trademarkStrategy: {
    suggestedClasses: [5, 30, 35],
    distinctivenessRisk: 'Medium',
    notes: 'Register coined arbitrary marks (e.g., "MEDHASATTVA") in Class 5 (Pharmaceutical/Ayurvedic) and Class 30 (Dietary). Avoid registering descriptive terms like "Ashwa-Stress-Relief".'
  },
  geographicalIndication: {
    applicable: false,
    registeredGIName: undefined,
    notes: 'No specific exclusive GI registration attached to standard cultivated Withania somnifera roots unless sourcing from specific GI zones like Nagori Ashwagandha.'
  },
  biodiversityABS: {
    nbaApprovalRequired: true,
    section3or4Applies: true,
    formApplicable: 'Form II (IPR Application)',
    notes: 'Mandatory requirement under Biological Diversity Act Section 6(1) to seek NBA Form II approval prior to filing any Indian or international patent application involving Indian bio-resources.'
  }
};

export const MOCK_REGULATORY_SUMMARY: RegulatoryAssessmentSummary = {
  primaryRoute: 'ASU Proprietary Medicine — Rule 158B (Drugs & Cosmetics Rules, 1945)',
  licensingAuthority: 'State Licensing Authority (SLA) under Ministry of AYUSH',
  statutoryRules: 'Section 3(h) of DCA 1940 & Rule 158B',
  clinicalDataRequirement: 'Published Literature Required',
  labelingRequirements: [
    'Clear display of "Ayurvedic Proprietary Medicine"',
    'Manufacturing License Number (Mfg. Lic. No. AYUSH-...)',
    'Full quantitative composition with botanical names',
    'Statutory caution: "To be taken under medical supervision" if applicable'
  ]
};
