import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { ProductAssessmentInput, JurisdictionType } from '../types';
import type {
  BackendTopPrediction,
  BackendRelevantDomain,
  BackendInsightResponse,
  BackendClassifyResponse
} from '../types/backendApi';
import { apiService } from '../services/api';

export const INITIAL_PRODUCT_INPUT: ProductAssessmentInput = {
  productName: '',
  productDescription: '',
  botanicalIngredients: [],
  productForm: 'Capsule / Tablet',
  intendedUse: '',
  therapeuticClaims: '',
  classicalStatus: 'Novel Proprietary Formulation (New botanical combinations/processes)',
  sourcingOrigin: 'Domestic Cultivation / Sourced in India',
  jurisdiction: 'INDIA',
  classificationAnswers: {}
};

interface AssessmentContextType {
  input: ProductAssessmentInput;
  setInput: React.Dispatch<React.SetStateAction<ProductAssessmentInput>>;
  updateInput: (fields: Partial<ProductAssessmentInput>) => void;
  
  // Real Backend Data
  classificationData: BackendClassifyResponse | null;
  predictedCategory: string;
  confidence: number;
  topPredictions: BackendTopPrediction[];
  relevantDomains: BackendRelevantDomain[];
  assessmentInsight: BackendInsightResponse | null;
  activeRagCategory: string;
  setActiveRagCategory: (category: string) => void;

  // Workflow states
  isAssessing: boolean;
  assessmentError: string | null;
  isDashboardActive: boolean;
  setIsDashboardActive: (val: boolean) => void;

  // Actions
  runAssessment: (jurisdiction: JurisdictionType) => Promise<void>;
  resetAssessment: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [input, setInput] = useState<ProductAssessmentInput>(INITIAL_PRODUCT_INPUT);
  const [classificationData, setClassificationData] = useState<BackendClassifyResponse | null>(null);
  const [assessmentInsight, setAssessmentInsight] = useState<BackendInsightResponse | null>(null);
  const [activeRagCategory, setActiveRagCategory] = useState<string>('Patent');
  const [isAssessing, setIsAssessing] = useState<boolean>(false);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);
  const [isDashboardActive, setIsDashboardActive] = useState<boolean>(false);

  const updateInput = useCallback((fields: Partial<ProductAssessmentInput>) => {
    setInput((prev) => ({ ...prev, ...fields }));
  }, []);

  const runAssessment = useCallback(async (jurisdiction: JurisdictionType) => {
    setIsAssessing(true);
    setAssessmentError(null);

    const answers = input.classificationAnswers || {};

    const featuresPayload = {
      subject_matter: answers['subject_matter'] || 'Invention',
      primary_objective: answers['primary_objective'] || 'Get Protection',
      technical_invention: answers['technical_invention'] || 'Yes',
      brand_identifier: answers['brand_identifier'] || 'No',
      product_appearance: answers['product_appearance'] || 'No',
      geographical_origin: answers['geographical_origin'] || 'No',
      creative_expression: answers['creative_expression'] || 'No',
      bio_or_plant_matter:
        answers['bio_or_plant_matter'] === 'None / Not Applicable'
          ? null
          : answers['bio_or_plant_matter'] || 'Traditional Knowledge',
      confidentiality: answers['confidentiality'] || 'No',
      regulated_product_type:
        answers['regulated_product_type'] === 'None / Not Regulated'
          ? null
          : answers['regulated_product_type'] || 'Drug'
    };

    try {
      // 1. Run Real Classifier API
      const classifyRes = await apiService.classifyProduct({
        product_name: input.productName || 'Herbal Formulation',
        product_description:
          input.productDescription ||
          'Standardized Ayurvedic formulation evaluated for IP protection and regulatory compliance.',
        jurisdiction: jurisdiction === 'INDIA' ? 'India' : 'International',
        features: featuresPayload
      });

      setClassificationData(classifyRes);
      setActiveRagCategory(classifyRes.predicted_category);

      // 2. Run Real Assessment Insight API
      try {
        const insightRes = await apiService.getAssessmentInsight({
          product_name: input.productName,
          product_description: input.productDescription || '',
          jurisdiction: jurisdiction === 'INDIA' ? 'India' : 'International',
          predicted_category: classifyRes.predicted_category,
          confidence: classifyRes.confidence,
          top_predictions: classifyRes.top_predictions,
          features: featuresPayload
        });
        setAssessmentInsight(insightRes);
      } catch (insightErr) {
        console.warn('Insight API fallback:', insightErr);
        // Resilient fallback so classification still displays
        setAssessmentInsight({
          summary: `Based on the structured classification model, this product aligns with ${classifyRes.predicted_category} (${Math.round(classifyRes.confidence * 100)}% match).`,
          why_it_matters: `This classification governs how traditional knowledge, licensing pathways, and patent eligibility under Indian statutes are evaluated.`,
          key_considerations: [
            `Evaluate ${classifyRes.predicted_category} compliance pathways under applicable Indian statutes.`,
            'Ensure distinction between classical traditional heritage elements and novel technical improvements.'
          ]
        });
      }
    } catch (err: any) {
      console.error('Assessment execution failed:', err);
      const msg = err?.message || 'Unable to execute product assessment. Please check backend connection.';
      setAssessmentError(msg);
      throw err;
    } finally {
      setIsAssessing(false);
    }
  }, [input]);

  const resetAssessment = useCallback(() => {
    setInput(INITIAL_PRODUCT_INPUT);
    setClassificationData(null);
    setAssessmentInsight(null);
    setActiveRagCategory('Patent');
    setAssessmentError(null);
    setIsDashboardActive(false);
  }, []);

  const predictedCategory = classificationData?.predicted_category || 'Patent';
  const confidence = classificationData?.confidence ?? 0.0;
  const topPredictions = classificationData?.top_predictions || [];
  const relevantDomains = classificationData?.relevant_domains || [];

  return (
    <AssessmentContext.Provider
      value={{
        input,
        setInput,
        updateInput,
        classificationData,
        predictedCategory,
        confidence,
        topPredictions,
        relevantDomains,
        assessmentInsight,
        activeRagCategory,
        setActiveRagCategory,
        isAssessing,
        assessmentError,
        isDashboardActive,
        setIsDashboardActive,
        runAssessment,
        resetAssessment
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = (): AssessmentContextType => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};
