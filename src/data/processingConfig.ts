import type { JurisdictionType } from '../types';
import type { ProcessingStep } from '../types/processing';

export function getProcessingSteps(jurisdiction: JurisdictionType): ProcessingStep[] {
  return [
    {
      id: 'step-review-product',
      title: 'Reviewing product information',
      description: 'Processing your product name, description, and assessment details'
    },
    {
      id: 'step-classification-profile',
      title: 'Preparing classification profile',
      description: 'Structuring the product attributes for classification'
    },
    {
      id: 'step-run-classification',
      title: 'Running product classification',
      description: 'Identifying the most relevant product and regulatory categories'
    },
    {
      id: 'step-map-domains',
      title: 'Mapping IP and regulatory domains',
      description: 'Determining the areas of intellectual property and regulation that may apply'
    },
    {
      id: 'step-apply-jurisdiction',
      title: 'Applying jurisdiction context',
      description:
        jurisdiction === 'INDIA'
          ? 'Preparing the assessment for the Indian jurisdiction'
          : 'Preparing the assessment for the international jurisdiction'
    },
    {
      id: 'step-prepare-evidence',
      title: 'Preparing evidence context',
      description: 'Organizing the relevant sources and evidence categories for your assessment'
    },
    {
      id: 'step-build-assessment',
      title: 'Building your assessment',
      description: 'Combining the classification and regulatory context into your workspace'
    }
  ];
}
