import api from "../lib/axios";

export interface HealthResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

export const checkBackendHealth = async (): Promise<HealthResponse> => {
  const response = await api.get<HealthResponse>("/api/v1/health");

  return response.data;
};