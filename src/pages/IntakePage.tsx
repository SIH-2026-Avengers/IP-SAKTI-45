import React, { useState, useEffect } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { useJurisdiction } from '../context/JurisdictionContext';
import { IntakeStageOne } from '../components/intake/IntakeStageOne';
import { ClassificationStageTwo } from '../components/intake/ClassificationStageTwo';
import { ProcessingScreen } from '../components/processing/ProcessingScreen';
import { AssessmentDashboard } from '../components/dashboard/AssessmentDashboard';
import type { JurisdictionType, ClassificationAnswers } from '../types';

export const IntakePage: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3 | 4>(1);
  const { input, updateInput, resetAssessment, setIsDashboardActive } = useAssessment();
  const { jurisdiction, setJurisdiction } = useJurisdiction();

  useEffect(() => {
    setIsDashboardActive(currentStage === 4);
    return () => setIsDashboardActive(false);
  }, [currentStage, setIsDashboardActive]);

  const isStageOneFilled = Boolean(
    input.productName && input.productName.trim() &&
    input.productDescription && input.productDescription.trim()
  );

  const handleUpdate = (fields: {
    productName?: string;
    productDescription?: string;
    jurisdiction?: JurisdictionType;
  }) => {
    if (fields.jurisdiction && fields.jurisdiction !== jurisdiction) {
      setJurisdiction(fields.jurisdiction);
    }
    updateInput(fields);
  };

  const handleAnswerChange = (key: string, value: string) => {
    const updatedAnswers: ClassificationAnswers = {
      ...(input.classificationAnswers || {}),
      [key]: value
    };
    updateInput({ classificationAnswers: updatedAnswers });
  };

  const handleSelectStage = (stage: 1 | 2) => {
    if (stage === 2 && !isStageOneFilled) {
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStage(stage);
  };

  const handleStageOneNext = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStage(2);
  };

  const handleStageTwoBack = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStage(1);
  };

  const handleStageTwoContinue = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStage(3);
  };

  const handleProcessingComplete = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStage(4);
  };

  const handleRestart = () => {
    resetAssessment();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStage(1);
  };

  return (
    <div className="py-2 sm:py-6">
      {currentStage === 1 && (
        <IntakeStageOne
          productName={input.productName}
          productDescription={input.productDescription || ''}
          jurisdiction={jurisdiction}
          canNavigateToStage2={isStageOneFilled}
          onSelectStage={handleSelectStage}
          onUpdate={handleUpdate}
          onNext={handleStageOneNext}
        />
      )}

      {currentStage === 2 && (
        <ClassificationStageTwo
          answers={input.classificationAnswers || {}}
          onAnswerChange={handleAnswerChange}
          onSelectStage={handleSelectStage}
          onBack={handleStageTwoBack}
          onContinue={handleStageTwoContinue}
        />
      )}

      {currentStage === 3 && (
        <ProcessingScreen
          jurisdiction={jurisdiction}
          onComplete={handleProcessingComplete}
          onErrorRetry={() => setCurrentStage(2)}
        />
      )}

      {currentStage === 4 && (
        <AssessmentDashboard
          productName={input.productName}
          productDescription={input.productDescription || ''}
          jurisdiction={jurisdiction}
          classificationAnswers={input.classificationAnswers}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};
