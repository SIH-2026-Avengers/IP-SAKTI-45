import React from 'react';
import type { ClassificationAnswers } from '../../types';
import { CLASSIFICATION_FIELDS } from '../../data/classificationConfig';
import { Card, Button, CustomSelect, TooltipPopover } from '../ui';
import { AssessmentProgress } from './AssessmentProgress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ClassificationStageTwoProps {
  answers: ClassificationAnswers;
  onAnswerChange: (key: string, value: string) => void;
  onSelectStage: (stage: 1 | 2) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const ClassificationStageTwo: React.FC<ClassificationStageTwoProps> = ({
  answers,
  onAnswerChange,
  onSelectStage,
  onBack,
  onContinue
}) => {
  const { t } = useLanguage();
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const totalCount = CLASSIFICATION_FIELDS.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-pop">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {t('questionnaire_title', 'Classification Questionnaire')}
        </h2>
        <p className="text-xs sm:text-sm text-foreground-muted max-w-xl mx-auto leading-relaxed">
          {t('questionnaire_desc', 'Specify the therapeutic context, botanical basis, and formulation parameters of your product.')}
        </p>
      </div>

      <AssessmentProgress
        currentStage={2}
        canNavigateToStage2={true}
        onSelectStage={onSelectStage}
      />

      {/* Structured Questionnaire Form Card */}
      <Card className="p-6 sm:p-8 bg-background-surface border-border shadow-subtle space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 2-Column Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            {CLASSIFICATION_FIELDS.map((field) => {
              const currentValue = answers[field.key] || '';

              return (
                <div key={field.key} className="space-y-1">
                  <CustomSelect
                    label={field.label}
                    placeholder={field.placeholder || 'Select an option'}
                    options={field.options}
                    value={currentValue}
                    onChange={(val) => onAnswerChange(field.key, val)}
                    infoTooltip={
                      <TooltipPopover content={field.description} />
                    }
                  />
                </div>
              );
            })}
          </div>

          {/* Bottom Controls Bar */}
          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onBack}
              className="w-full sm:w-auto flex items-center justify-center gap-2 order-2 sm:order-1 transition-transform active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('btn_back', 'Back to Product Details')}</span>
            </Button>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end order-1 sm:order-2">
              <span className="text-xs font-mono text-foreground-muted">
                {answeredCount} of {totalCount} answered
              </span>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="flex items-center justify-center gap-2 px-6 transition-transform active:scale-95"
              >
                <span>{t('btn_continue', 'Begin Assessment')}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};
