import api from "../lib/axios";
import type {
  Application,
  ApiKey,
  ApiResponse,
  ApplicationType,
  ApplicationEnvironment,
  PlaygroundEvaluationRequest,
} from "../types";

// ─── Applications ─────────────────────────────────────────────────────────────

export interface CreateApplicationInput {
  name: string;
  description?: string;
  type: ApplicationType;
  environment: ApplicationEnvironment;
}

export interface UpdateApplicationInput {
  name?: string;
  description?: string;
  type?: ApplicationType;
  environment?: ApplicationEnvironment;
  status?: "ACTIVE" | "INACTIVE";
}

export const getApplicationsApi = async (): Promise<ApiResponse<{ applications: Application[] }>> => {
  const response = await api.get<ApiResponse<{ applications: Application[] }>>("/api/v1/applications");
  return response.data;
};

export const getApplicationApi = async (id: string): Promise<ApiResponse<{ application: Application }>> => {
  const response = await api.get<ApiResponse<{ application: Application }>>(`/api/v1/applications/${id}`);
  return response.data;
};

export const createApplicationApi = async (
  input: CreateApplicationInput
): Promise<ApiResponse<{ application: Application }>> => {
  const response = await api.post<ApiResponse<{ application: Application }>>("/api/v1/applications", input);
  return response.data;
};

export const updateApplicationApi = async (
  id: string,
  input: UpdateApplicationInput
): Promise<ApiResponse<{ application: Application }>> => {
  const response = await api.patch<ApiResponse<{ application: Application }>>(`/api/v1/applications/${id}`, input);
  return response.data;
};

export const deleteApplicationApi = async (id: string): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/api/v1/applications/${id}`);
  return response.data;
};

// ─── API Keys ─────────────────────────────────────────────────────────────────

export interface CreateApiKeyInput {
  name: string;
  expiresAt?: string;
}

export interface CreateApiKeyResponse {
  apiKey: ApiKey;
  secret: string;
}

export const createApiKeyApi = async (
  applicationId: string,
  input: CreateApiKeyInput
): Promise<ApiResponse<CreateApiKeyResponse>> => {
  const response = await api.post<ApiResponse<CreateApiKeyResponse>>(
    `/api/v1/applications/${applicationId}/api-keys`,
    input
  );
  return response.data;
};

export const listApiKeysApi = async (
  applicationId: string
): Promise<ApiResponse<{ apiKeys: ApiKey[] }>> => {
  const response = await api.get<ApiResponse<{ apiKeys: ApiKey[] }>>(
    `/api/v1/applications/${applicationId}/api-keys`
  );
  return response.data;
};

export const revokeApiKeyApi = async (
  applicationId: string,
  apiKeyId: string
): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(
    `/api/v1/applications/${applicationId}/api-keys/${apiKeyId}`
  );
  return response.data;
};

// ─── Conversations ────────────────────────────────────────────────────────────

export interface ConversationListQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface ConversationListItem {
  id: string;
  applicationId: string;
  externalId: string;
  title: string | null;
  status: string;
  messageCount: number;
  lastMessageAt: string | null;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ConversationListResponse {
  conversations: ConversationListItem[];
  pagination: PaginationMeta;
}

export interface ConversationDetail {
  id: string;
  applicationId: string;
  externalId: string;
  title: string | null;
  status: string;
  metadata: unknown;
  startedAt: string;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
  messages: any[];
}

export const getConversationsApi = async (
  applicationId: string,
  query?: ConversationListQuery
): Promise<ApiResponse<ConversationListResponse>> => {
  const params = new URLSearchParams();
  if (query?.page) params.set("page", String(query.page));
  if (query?.limit) params.set("limit", String(query.limit));
  if (query?.status) params.set("status", query.status);
  if (query?.search) params.set("search", query.search);

  const response = await api.get<ApiResponse<ConversationListResponse>>(
    `/api/v1/applications/${applicationId}/conversations`,
    { params }
  );
  return response.data;
};

export const getConversationApi = async (
  conversationId: string
): Promise<ApiResponse<ConversationDetail>> => {
  const response = await api.get<ApiResponse<ConversationDetail>>(
    `/api/v1/conversations/${conversationId}`
  );
  return response.data;
};

// ─── Playground ───────────────────────────────────────────────────────────────

export interface PlaygroundEvaluationResponse {
  applicationId: string;
  overallScore: number;
  riskLevel: string;
  decision: string;
  summary: string;
  judges: {
    quality?: JudgeResult;
    safety?: JudgeResult;
    trust?: JudgeResult;
  };
}

export interface JudgeResult {
  score: number;
  riskLevel: string;
  decision: string;
  reasoning: string;
  issues: string[];
  recommendations: string[];
}

export const evaluatePlaygroundApi = async (
  input: PlaygroundEvaluationRequest
): Promise<ApiResponse<PlaygroundEvaluationResponse>> => {
  const response = await api.post<ApiResponse<PlaygroundEvaluationResponse>>(
    "/api/v1/playground/evaluate",
    input
  );
  return response.data;
};

// ─── Evaluations ──────────────────────────────────────────────────────────────

export interface EvaluationListQuery {
  applicationId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface EvaluationListItem {
  id: string;
  applicationId: string;
  conversationId: string;
  status: string;
  overallScore?: number;
  riskLevel?: string;
  decision?: string;
  summary?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  application?: { id: string; name: string };
  conversation?: { id: string; externalId: string; title?: string | null };
  judgeExecutions?: any[];
}

export interface EvaluationListResponse {
  evaluations: EvaluationListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getEvaluationsApi = async (
  query?: EvaluationListQuery
): Promise<ApiResponse<EvaluationListResponse>> => {
  const params = new URLSearchParams();
  if (query?.applicationId) params.set("applicationId", query.applicationId);
  if (query?.status) params.set("status", query.status);
  if (query?.page) params.set("page", String(query.page));
  if (query?.limit) params.set("limit", String(query.limit));

  const response = await api.get<ApiResponse<EvaluationListResponse>>(
    "/api/v1/evaluations",
    { params }
  );
  return response.data;
};

export const getEvaluationApi = async (
  evaluationId: string
): Promise<ApiResponse<{ evaluation: EvaluationListItem }>> => {
  const response = await api.get<ApiResponse<{ evaluation: EvaluationListItem }>>(
    `/api/v1/evaluations/${evaluationId}`
  );
  return response.data;
};
