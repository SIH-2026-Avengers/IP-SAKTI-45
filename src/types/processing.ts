export type ProcessingStepStatus = 'pending' | 'active' | 'completed';

export interface ProcessingStep {
  id: string;
  title: string;
  description: string;
}

export type AssessmentProcessingState = 'idle' | 'processing' | 'completed' | 'error';
