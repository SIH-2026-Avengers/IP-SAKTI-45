import type { JurisdictionType } from './jurisdiction';
import type { ClassificationAnswers } from './classification';

export type ProductForm = 
  | 'Capsule / Tablet'
  | 'Liquid / Syrup / Asava-Arishta'
  | 'Powder / Churna'
  | 'Oil / Taila / Ghrita'
  | 'Topical Cream / Gel / Lepa'
  | 'Beverage / Ready-to-drink'
  | 'Solid Food / Granules';

export type ClassicalReferenceStatus = 
  | 'Strictly Classical (Formulary text specified in DCA First Schedule)'
  | 'Modified Classical (Classical ingredients with modern extract/excipients)'
  | 'Novel Proprietary Formulation (New botanical combinations/processes)'
  | 'Single Herb Extract / Phytochemical isolate';

export type BiologicalSourcingOrigin = 
  | 'Domestic Cultivation / Sourced in India'
  | 'Wild Sourced / Forest Produce in India'
  | 'Imported Botanical Raw Material'
  | 'Mixed Domestic & Imported';

export interface ProductAssessmentInput {
  productName: string;
  productDescription?: string;
  genericName?: string;
  botanicalIngredients: string[];
  productForm: ProductForm;
  intendedUse: string;
  therapeuticClaims: string;
  classicalStatus: ClassicalReferenceStatus;
  sourcingOrigin: BiologicalSourcingOrigin;
  jurisdiction: JurisdictionType;
  targetExportMarkets?: string[];
  manufacturingProcessSummary?: string;
  classificationAnswers?: ClassificationAnswers;
}

export interface IPAssessmentSummary {
  patentEligibility: {
    status: 'High Risk - Section 3(p)' | 'Conditional / Process Patent Potential' | 'Non-Eligible Classical TK';
    score: number; // 0-100
    notes: string;
    section3pImpact: string;
  };
  trademarkStrategy: {
    suggestedClasses: number[];
    distinctivenessRisk: 'Low' | 'Medium' | 'High (Descriptive / Ayurvedic terms)';
    notes: string;
  };
  geographicalIndication: {
    applicable: boolean;
    registeredGIName?: string;
    notes: string;
  };
  biodiversityABS: {
    nbaApprovalRequired: boolean;
    section3or4Applies: boolean;
    formApplicable: 'Form I (Foreign entity/export)' | 'Form II (IPR Application)' | 'Form III (Commercialization)' | 'None';
    notes: string;
  };
}

export interface RegulatoryAssessmentSummary {
  primaryRoute: string;
  licensingAuthority: string;
  statutoryRules: string;
  clinicalDataRequirement: 'Exempted' | 'Published Literature Required' | 'Phase III Trials Required' | 'Safety Toxicology Only';
  labelingRequirements: string[];
}
