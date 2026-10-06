import { apiService } from './api';
import type { ProductAssessmentInput } from '../types';
import type {
  BackendClassifyResponse,
  ClassifierFeaturesPayload
} from '../types/backendApi';

export function buildClassifierFeatures(
  answers: ProductAssessmentInput['classificationAnswers'] = {}
): ClassifierFeaturesPayload {
  return {
    subject_matter: answers?.['subject_matter'] || 'Invention / Technical Solution',
    primary_objective: answers?.['primary_objective'] || 'Obtain New Protection',
    technical_invention: answers?.['technical_invention'] || 'Yes',
    brand_identifier: answers?.['brand_identifier'] || 'No',
    product_appearance: answers?.['product_appearance'] || 'No',
    geographical_origin: answers?.['geographical_origin'] || 'No',
    creative_expression: answers?.['creative_expression'] || 'No',
    bio_or_plant_matter: answers?.['bio_or_plant_matter'] || 'None / Not Applicable',
    confidentiality: answers?.['confidentiality'] || 'No',
    regulated_product_type: answers?.['regulated_product_type'] || 'Not Regulated'
  };
}

export async function assessProductClassification(
  input: ProductAssessmentInput
): Promise<BackendClassifyResponse> {
  const features = buildClassifierFeatures(input.classificationAnswers);

  return apiService.classifyProduct({
    product_name: input.productName,
    product_description: input.productDescription || '',
    jurisdiction: input.jurisdiction === 'INDIA' ? 'India' : 'International',
    features
  });
}
