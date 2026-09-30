import React from 'react';
import type { JurisdictionType, ClassificationAnswers } from '../../types';
import { ProductSummarySection } from './ProductSummarySection';
import { PrimaryClassificationCard } from './PrimaryClassificationCard';
import { AssessmentInsightPanel } from './AssessmentInsightPanel';
import { ClassificationDistributionChart } from './ClassificationDistributionChart';
import { RelevantDomainsSection } from './RelevantDomainsSection';
import { cn } from '../../utils/cn';
import { useLanguage } from '../../context/LanguageContext';
import { useAssessment } from '../../context/AssessmentContext';

interface AssessmentDashboardProps {
  productName: string;
  productDescription: string;
  jurisdiction: JurisdictionType;
  classificationAnswers?: ClassificationAnswers;
  onRestart: () => void;
  className?: string;
}

export const AssessmentDashboard: React.FC<AssessmentDashboardProps> = ({
  productName,
  productDescription,
  jurisdiction,
  onRestart,
  className
}) => {
  const { t } = useLanguage();
  const {
    predictedCategory,
    confidence,
    topPredictions,
    relevantDomains,
    assessmentInsight,
    setActiveRagCategory
  } = useAssessment();

  const confidenceScore = Math.round(confidence * 100);

  return (
    <div className={cn('max-w-6xl mx-auto space-y-7 animate-pop relative pb-16', className)}>
      {/* 1. Dashboard Header */}
      <div className="space-y-1 pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs font-mono uppercase tracking-widest text-neutral-500">
            IP-SAKTI Sahayak
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {t('dashboard_header_title', 'Assessment Overview')}
        </h1>
        <p className="text-xs sm:text-sm text-foreground-muted">
          {t('dashboard_header_desc', "A structured assessment of your product's potential IP and regulatory considerations.")}
        </p>
      </div>

      {/* 2. Product Summary Section */}
      <ProductSummarySection
        productName={productName}
        productDescription={productDescription}
        jurisdiction={jurisdiction}
        onRestart={onRestart}
      />

      {/* 3. Primary Classification (Left) & Top-5 Distribution (Right) Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <PrimaryClassificationCard
          category={predictedCategory}
          score={confidenceScore}
          className="h-full"
        />
        <ClassificationDistributionChart
          candidates={topPredictions}
          onSelectCategory={setActiveRagCategory}
          className="h-full"
        />
      </div>

      {/* 4. Assessment Insight Panel */}
      <AssessmentInsightPanel
        summary={assessmentInsight?.summary}
        whyThisMatters={assessmentInsight?.why_it_matters}
        keyConsiderations={assessmentInsight?.key_considerations}
      />

      {/* 5. Relevant IP & Regulatory Domains */}
      <RelevantDomainsSection domains={relevantDomains} />
    </div>
  );
};
