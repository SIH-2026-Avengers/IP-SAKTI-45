import type {
  BackendClassifyRequest,
  BackendClassifyResponse,
  BackendInsightRequest,
  BackendInsightResponse,
  BackendRAGRequest,
  BackendRAGResponse
} from '../types/backendApi';

const rawUrl = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8000';
export const API_BASE_URL = rawUrl.trim().replace(/\/+$/, '');

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function requestWithRetry<T>(endpoint: string, options: RequestInit = {}, retries = 2): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData?.detail) {
            errorMessage = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
          }
        } catch {
          // Fallback to generic message
        }

        // If backend returned 503 (still warming up), retry after short delay
        if (response.status === 503 && attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, 2500));
          continue;
        }

        throw new ApiError(errorMessage, response.status);
      }

      return (await response.json()) as T;
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      if (attempt < retries) {
        // Wait before retrying (e.g. backend waking up from idle)
        await new Promise((resolve) => setTimeout(resolve, 2000));
        continue;
      }
      throw new Error(
        `Unable to connect to backend at ${API_BASE_URL}. (${error?.message || 'Network Error'}). Please verify VITE_API_BASE_URL and ensure backend is live.`
      );
    }
  }

  throw new Error(`Failed to reach backend at ${API_BASE_URL}`);
}

export const apiService = {
  async checkHealth(): Promise<any> {
    return requestWithRetry<any>('/api/health');
  },

  async classifyProduct(payload: BackendClassifyRequest): Promise<BackendClassifyResponse> {
    return requestWithRetry<BackendClassifyResponse>('/api/classify', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getAssessmentInsight(payload: BackendInsightRequest): Promise<BackendInsightResponse> {
    return requestWithRetry<BackendInsightResponse>('/api/assessment/insight', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async queryRAG(payload: BackendRAGRequest): Promise<BackendRAGResponse> {
    return requestWithRetry<BackendRAGResponse>('/api/rag/query', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
};
