import React, { useState, useEffect, useRef } from 'react';
import type { JurisdictionType } from '../../types';
import { getProcessingSteps } from '../../data/processingConfig';
import { Card, Button } from '../ui';
import { Check, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAssessment } from '../../context/AssessmentContext';

interface ProcessingScreenProps {
  jurisdiction: JurisdictionType;
  onComplete: () => void;
  onErrorRetry?: () => void;
}

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({
  jurisdiction,
  onComplete,
  onErrorRetry
}) => {
  const { runAssessment } = useAssessment();
  const steps = getProcessingSteps(jurisdiction);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isAssessmentFinishedRef = useRef<boolean>(false);
  const hasStartedAssessmentRef = useRef<boolean>(false);

  // Trigger real backend assessment API once
  useEffect(() => {
    if (hasStartedAssessmentRef.current) return;
    hasStartedAssessmentRef.current = true;

    runAssessment(jurisdiction)
      .then(() => {
        isAssessmentFinishedRef.current = true;
      })
      .catch((err: any) => {
        setErrorMessage(
          err?.message || 'Unable to complete AI assessment. Please verify backend server connection.'
        );
      });
  }, [runAssessment, jurisdiction]);

  // Step advancement timer
  useEffect(() => {
    if (errorMessage) return;

    if (currentStepIndex < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      // If visual steps finished, wait until real API finishes if still pending
      const checkInterval = setInterval(() => {
        if (isAssessmentFinishedRef.current) {
          clearInterval(checkInterval);
          onComplete();
        }
      }, 150);

      return () => clearInterval(checkInterval);
    }
  }, [currentStepIndex, steps.length, errorMessage, onComplete]);

  // Error State fallback
  if (errorMessage) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-6 animate-pop">
        <div className="w-12 h-12 rounded-full bg-status-error-bg text-status-error-text flex items-center justify-center mx-auto border border-status-error-border">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Assessment could not be completed</h2>
          <p className="text-xs text-foreground-muted max-w-sm mx-auto">
            {errorMessage}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setErrorMessage(null);
            setCurrentStepIndex(0);
            hasStartedAssessmentRef.current = false;
            onErrorRetry?.();
          }}
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Active Sequential Processing Screen
  const progressPercent = Math.round((currentStepIndex / steps.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-pop">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Preparing your IP-SAKTI assessment
        </h2>
        <p className="text-xs sm:text-sm text-foreground-muted max-w-lg mx-auto leading-relaxed">
          Analyzing your product information and preparing the relevant IP and regulatory context.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-foreground-muted font-mono">
          <span>Assessment progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden border border-border-subtle">
          <div
            className="h-full bg-neutral-900 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Sequential Operations Checklist Card */}
      <Card className="p-6 sm:p-8 bg-background-surface border-border shadow-subtle divide-y divide-border">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isActive = idx === currentStepIndex;
          const isPending = idx > currentStepIndex;

          return (
            <div
              key={step.id}
              className={cn(
                'py-4 first:pt-0 last:pb-0 flex items-start gap-4 transition-all duration-300',
                isActive && 'opacity-100',
                isCompleted && 'opacity-75',
                isPending && 'opacity-40'
              )}
            >
              {/* Step Status Icon */}
              <div className="mt-0.5 flex-shrink-0">
                {isCompleted ? (
                  <div className="w-5 h-5 rounded-full bg-status-success-bg text-status-success-text flex items-center justify-center border border-status-success-border">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                ) : isActive ? (
                  <div className="w-5 h-5 rounded-full border-2 border-neutral-900 border-t-transparent animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-neutral-300 bg-background-subtle" />
                )}
              </div>

              {/* Step Text */}
              <div className="space-y-0.5 flex-1 min-w-0">
                <h3
                  className={cn(
                    'text-sm font-semibold transition-colors',
                    isActive ? 'text-foreground' : isCompleted ? 'text-foreground-subtle' : 'text-neutral-500'
                  )}
                >
                  {step.title}
                </h3>
                <p
                  className={cn(
                    'text-xs transition-colors leading-relaxed',
                    isActive ? 'text-foreground-subtle' : 'text-foreground-muted'
                  )}
                >
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
};
