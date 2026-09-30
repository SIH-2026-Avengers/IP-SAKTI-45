import type { EvidenceSource } from '../../types';

export const MOCK_EVIDENCE_SOURCES: EvidenceSource[] = [
  {
    id: 'ev-pat-sec3p',
    title: 'The Patents Act, 1970 — Section 3(p)',
    authority: 'Indian Patent Office (IPO)',
    jurisdiction: 'INDIA',
    category: 'Act / Statute',
    sectionOrArticle: 'Section 3(p)',
    yearOrDate: '1970 (amended 2005)',
    excerpt: 'An invention which in effect, is traditional knowledge or which is an aggregation or duplication of known properties of traditionally known component or components is not an invention within the meaning of this Act.',
    url: 'https://ipindia.gov.in/patents-act.htm',
    relevanceScore: 0.98,
    tags: ['Patents', 'Section 3(p)', 'Traditional Knowledge', 'TKDL']
  },
  {
    id: 'ev-bda-sec6',
    title: 'Biological Diversity Act, 2002 — Section 6',
    authority: 'National Biodiversity Authority (NBA)',
    jurisdiction: 'INDIA',
    category: 'Act / Statute',
    sectionOrArticle: 'Section 6(1)',
    yearOrDate: '2002 (amended 2023)',
    excerpt: 'No person shall apply for any intellectual property right, by whatever name called, in or outside India for any invention based on any research or information on a biological resource obtained from India without obtaining the previous approval of the National Biodiversity Authority before grant of such IPR.',
    url: 'http://nbaindia.org/act',
    relevanceScore: 0.95,
    tags: ['Biodiversity', 'ABS', 'NBA Approval', 'Form II', 'Biological Resources']
  },
  {
    id: 'ev-dca-sec3a',
    title: 'Drugs and Cosmetics Act, 1940 — Section 3(a) & 3(h)',
    authority: 'Ministry of AYUSH',
    jurisdiction: 'INDIA',
    category: 'Act / Statute',
    sectionOrArticle: 'Section 3(a) & 3(h)',
    yearOrDate: '1940 (amended)',
    excerpt: '"Ayurvedic, Siddha or Unani drug" includes all medicines intended for internal or external use for or in the diagnosis, treatment, mitigation or prevention of disease or disorder in human beings or animals, manufactured exclusively in accordance with the formulae described in the authoritative books of Ayurvedic, Siddha and Unani systems specified in the First Schedule.',
    url: 'https://ayush.gov.in/acts-rules',
    relevanceScore: 0.92,
    tags: ['Drugs & Cosmetics', 'First Schedule', 'Classical Formulation', 'Proprietary ASU']
  },
  {
    id: 'ev-fssai-aahar-2022',
    title: 'Food Safety and Standards (Ayurveda Aahar) Regulations, 2022',
    authority: 'FSSAI',
    jurisdiction: 'INDIA',
    category: 'Gazette Notification',
    sectionOrArticle: 'Regulation 3 & Schedule A/B',
    yearOrDate: '2022',
    excerpt: 'Ayurveda Aahar means food prepared in accordance with the recipes/methods/processes described in the authoritative books of Ayurveda listed in Schedule A, but shall not include Ayurvedic drugs, proprietary medicines, cosmetics, or narcotic/psychotropic substances. Prior approval of the Expert Committee is mandatory for novel recipes.',
    url: 'https://fssai.gov.in/ayurveda-aahar',
    relevanceScore: 0.89,
    tags: ['Food Regulation', 'Ayurveda Aahar', 'FSSAI', 'Dietary']
  },
  {
    id: 'ev-usfda-dshea',
    title: 'Dietary Supplement Health and Education Act of 1994 (DSHEA)',
    authority: 'US FDA',
    jurisdiction: 'INTERNATIONAL',
    category: 'Regulatory Guideline',
    sectionOrArticle: '21 CFR Part 111 (cGMP)',
    yearOrDate: '1994 / 2007',
    excerpt: 'Herbal ingredients such as Withania somnifera and Terminalia chebula are regulated as dietary supplements under US law provided structure/function claims are made rather than therapeutic disease treatment claims. Requires mandatory adherence to 21 CFR Part 111 cGMP and FDA facility registration.',
    url: 'https://www.fda.gov/food/dietary-supplements',
    relevanceScore: 0.86,
    tags: ['US Export', 'DSHEA', 'Dietary Supplements', 'FDA cGMP']
  },
  {
    id: 'ev-ema-thmpd',
    title: 'Directive 2004/24/EC — Traditional Herbal Medicinal Products (THMPD)',
    authority: 'EMA / HMPC',
    jurisdiction: 'INTERNATIONAL',
    category: 'Regulatory Guideline',
    sectionOrArticle: 'Articles 16a-16i',
    yearOrDate: '2004',
    excerpt: 'Simplified registration procedure for traditional herbal medicinal products requiring evidence of at least 30 years of traditional medicinal use, including at least 15 years within the European Union, accompanied by safety documentation and herbal monographs.',
    url: 'https://www.ema.europa.eu/en/human-regulatory/herbal-medicinal-products',
    relevanceScore: 0.83,
    tags: ['EU Export', 'THMPD', 'EMA', 'Herbal Medicines']
  }
];
