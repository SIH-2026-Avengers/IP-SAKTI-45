import type {
  BackendClassifyRequest,
  BackendClassifyResponse,
  BackendInsightRequest,
  BackendInsightResponse,
  BackendRAGRequest,
  BackendRAGResponse
} from '../types/backendApi';

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8000';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

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
      throw new ApiError(errorMessage, response.status);
    }

    return (await response.json()) as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(
      `Unable to connect to IP-SAKTI Sahayak backend at ${API_BASE_URL}. Please ensure the backend server is running.`
    );
  }
}

export const apiService = {
  async checkHealth(): Promise<any> {
    return request<any>('/api/health');
  },

  async classifyProduct(payload: BackendClassifyRequest): Promise<BackendClassifyResponse> {
    return request<BackendClassifyResponse>('/api/classify', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getAssessmentInsight(payload: BackendInsightRequest): Promise<BackendInsightResponse> {
    return request<BackendInsightResponse>('/api/assessment/insight', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async queryRAG(payload: BackendRAGRequest): Promise<BackendRAGResponse> {
    return request<BackendRAGResponse>('/api/rag/query', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
};
