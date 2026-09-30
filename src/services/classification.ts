import { apiService } from './api';
import type { ProductAssessmentInput } from '../types';
import type { BackendClassifyResponse } from '../types/backendApi';

export async function assessProductClassification(
  input: ProductAssessmentInput
): Promise<BackendClassifyResponse> {
  const answers = input.classificationAnswers || {};

  const features = {
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

  return apiService.classifyProduct({
    product_name: input.productName,
    product_description: input.productDescription || '',
    jurisdiction: input.jurisdiction === 'INDIA' ? 'India' : 'International',
    features
  });
}
