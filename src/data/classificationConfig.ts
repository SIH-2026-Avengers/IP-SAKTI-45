import type { ClassificationQuestionField } from '../types';

export const CLASSIFICATION_FIELDS: ClassificationQuestionField[] = [
  {
    key: 'subject_matter',
    label: 'Subject Matter',
    placeholder: 'Select subject matter...',
    options: [
      'Invention',
      'Biological/Plant Matter',
      'Regulated Product',
      'Product',
      'Brand',
      'Confidential Information',
      'Creative Work',
      'General Regulation',
      'Other'
    ],
    description: 'Identifies the primary nature of the asset or innovation (e.g. technical formulation, raw bio-matter, branding mark, or regulatory dossier).'
  },
  {
    key: 'primary_objective',
    label: 'Primary Objective',
    placeholder: 'Select primary objective...',
    options: [
      'Get Protection',
      'Compliance/Approval',
      'Registration',
      'Commercialization',
      'Enforcement/Dispute',
      'Other'
    ],
    description: 'Specifies your strategic goal (e.g. securing patent/IP monopoly, obtaining AYUSH manufacturing license, or product registration).'
  },
  {
    key: 'technical_invention',
    label: 'Technical Invention',
    placeholder: 'Select technical invention status...',
    options: ['Yes', 'No', 'Unclear'],
    description: 'Indicates whether your formulation or manufacturing technique involves a novel technical step, synergistic extraction, or inventive process.'
  },
  {
    key: 'brand_identifier',
    label: 'Brand Identifier',
    placeholder: 'Select brand identifier status...',
    options: ['Yes', 'No', 'Unclear'],
    description: 'Indicates whether distinctive commercial brand names, trade dress, slogans, or marks require clearance and trademark protection.'
  },
  {
    key: 'product_appearance',
    label: 'Product Appearance',
    placeholder: 'Select product appearance status...',
    options: ['Yes', 'No', 'Unclear'],
    description: 'Indicates whether the unique aesthetic design, shape, packaging bottle, or dispenser configuration warrants industrial design registration.'
  },
  {
    key: 'geographical_origin',
    label: 'Geographical Origin',
    placeholder: 'Select geographical origin status...',
    options: ['Yes', 'No', 'Unclear'],
    description: 'Indicates whether the botanical herbs or heritage recipe are tied to a specific geographical region (Geographical Indication).'
  },
  {
    key: 'creative_expression',
    label: 'Creative Expression',
    placeholder: 'Select creative expression status...',
    options: ['Yes', 'No', 'Unclear'],
    description: 'Indicates whether original artistic packaging artwork, descriptive wellness leaflets, or digital media require copyright protection.'
  },
  {
    key: 'bio_or_plant_matter',
    label: 'Biological / Plant Matter Nature',
    placeholder: 'Select biological matter type...',
    options: [
      'Traditional Knowledge',
      'Biological Resource',
      'Plant Variety',
      'None / Not Applicable'
    ],
    description: 'Specifies the nature of biological input. Triggers Biological Diversity Act 2002 (NBA approval) and Section 3(p) TKDL scrutiny.'
  },
  {
    key: 'confidentiality',
    label: 'Confidentiality / Know-How',
    placeholder: 'Select confidentiality status...',
    options: ['Yes', 'No', 'Unclear'],
    description: 'Indicates whether undisclosed manufacturing recipes, extraction ratios, or confidential business know-how must be protected as trade secrets.'
  },
  {
    key: 'regulated_product_type',
    label: 'Regulated Product Category',
    placeholder: 'Select product category...',
    options: [
      'Ayurveda-Aahar',
      'Drug',
      'Food',
      'Other',
      'None / Not Regulated'
    ],
    description: 'Identifies the statutory regulatory framework (Ayush Drug under DCA 1940, Ayurveda-Aahar under FSSAI 2022, or standard food regulation).'
  }
];
