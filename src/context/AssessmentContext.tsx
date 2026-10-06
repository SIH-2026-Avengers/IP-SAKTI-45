import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import type { ProductAssessmentInput, JurisdictionType } from '../types';
import type {
  BackendTopPrediction,
  BackendRelevantDomain,
  BackendInsightResponse,
  BackendClassifyResponse,
  BackendRAGSource,
  ClassifierFeaturesPayload
} from '../types/backendApi';
import { apiService } from '../services/api';
import { buildClassifierFeatures } from '../services/classification';

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
  latestRagSources: BackendRAGSource[];
  setLatestRagSources: (sources: BackendRAGSource[]) => void;
  assessmentInsight: BackendInsightResponse | null;
  activeRagCategory: string;
  selectRagCategory: (category: string) => void;
  submitPendingClassifierFeedback: (category: string) => Promise<boolean>;

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
  const [classifierFeatures, setClassifierFeatures] = useState<ClassifierFeaturesPayload | null>(null);
  const [assessmentInsight, setAssessmentInsight] = useState<BackendInsightResponse | null>(null);
  const [activeRagCategory, setActiveRagCategoryState] = useState<string>('Patent');
  const [latestRagSources, setLatestRagSources] = useState<BackendRAGSource[]>([]);
  const [isAssessing, setIsAssessing] = useState<boolean>(false);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);
  const [isDashboardActive, setIsDashboardActive] = useState<boolean>(false);
  const pendingClassifierFeedbackRef = useRef<{ feedbackId: string; category: string } | null>(null);
  const classifierFeedbackPromiseRef = useRef<{
    feedbackId: string;
    promise: Promise<boolean>;
  } | null>(null);

  const updateInput = useCallback((fields: Partial<ProductAssessmentInput>) => {
    setInput((prev) => ({ ...prev, ...fields }));
  }, []);

  const selectRagCategory = useCallback((category: string) => {
    if (category === activeRagCategory) return;
    setActiveRagCategoryState(category);
    pendingClassifierFeedbackRef.current = {
      feedbackId: globalThis.crypto.randomUUID(),
      category
    };
    setLatestRagSources([]);
  }, [activeRagCategory]);

  const submitPendingClassifierFeedback = useCallback((category: string) => {
    const pending = pendingClassifierFeedbackRef.current;
    if (!pending || pending.category !== category || !classifierFeatures) {
      return Promise.resolve(false);
    }

    const existing = classifierFeedbackPromiseRef.current;
    if (existing?.feedbackId === pending.feedbackId) {
      return existing.promise;
    }

    const promise = apiService.updateClassifier({
      feedback_id: pending.feedbackId,
      target_category: pending.category,
      features: classifierFeatures
    }).then((response) => {
      if (pendingClassifierFeedbackRef.current?.feedbackId === pending.feedbackId) {
        pendingClassifierFeedbackRef.current = null;
      }
      return response.updated;
    }).finally(() => {
      if (classifierFeedbackPromiseRef.current?.feedbackId === pending.feedbackId) {
        classifierFeedbackPromiseRef.current = null;
      }
    });

    classifierFeedbackPromiseRef.current = {
      feedbackId: pending.feedbackId,
      promise
    };
    return promise;
  }, [classifierFeatures]);

  const runAssessment = useCallback(async (jurisdiction: JurisdictionType) => {
    setIsAssessing(true);
    setAssessmentError(null);

    const featuresPayload = buildClassifierFeatures(input.classificationAnswers);

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
      setClassifierFeatures(featuresPayload);
      pendingClassifierFeedbackRef.current = null;
      setActiveRagCategoryState(classifyRes.predicted_category);

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
    setClassifierFeatures(null);
    setAssessmentInsight(null);
    pendingClassifierFeedbackRef.current = null;
    setActiveRagCategoryState('Patent');
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
        latestRagSources,
        setLatestRagSources,
        assessmentInsight,
        activeRagCategory,
        selectRagCategory,
        submitPendingClassifierFeedback,
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
