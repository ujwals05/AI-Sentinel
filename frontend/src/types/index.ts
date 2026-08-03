// ─── Enums ────────────────────────────────────────────────────────────────────

export type ApplicationType = 'CHATBOT' | 'CODE_ASSISTANT' | 'AI_AGENT' | 'API' | 'OTHER';
export type ApplicationEnvironment = 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION';
export type ApplicationStatus = 'ACTIVE' | 'INACTIVE';

export type ConversationStatus = 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM' | 'TOOL';

export type EvaluationStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
export type EvaluationDecision = 'PASS' | 'REVIEW' | 'REJECT';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type JudgeType = 'QUALITY' | 'SAFETY' | 'TRUST';
export type JudgeExecutionStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

// ─── Models ───────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  userId: string;
  name: string;
  description?: string;
  type: ApplicationType;
  environment: ApplicationEnvironment;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  // Computed/aggregated (may come from backend in future)
  _count?: {
    conversations: number;
    events: number;
    evaluations: number;
    apiKeys: number;
  };
}

export interface ApiKey {
  id: string;
  applicationId: string;
  name: string;
  keyPrefix: string;
  lastUsedAt?: string;
  expiresAt?: string;
  revokedAt?: string;
  createdAt: string;
  updatedAt: string;
  // Computed
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
}

export interface ApiKeyCreated extends ApiKey {
  /** Shown once only */
  secret: string;
}

export interface Conversation {
  id: string;
  applicationId: string;
  externalId: string;
  title?: string;
  status: ConversationStatus;
  metadata?: Record<string, unknown>;
  startedAt: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
  _count?: {
    messages: number;
  };
}

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  sequence: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Evaluation {
  id: string;
  applicationId: string;
  conversationId: string;
  eventId?: string;
  status: EvaluationStatus;
  overallScore?: number;
  riskLevel?: RiskLevel;
  decision?: EvaluationDecision;
  summary?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  judgeExecutions?: JudgeExecution[];
  application?: Pick<Application, 'id' | 'name'>;
  conversation?: Pick<Conversation, 'id' | 'externalId' | 'title'>;
}

export interface JudgeExecution {
  id: string;
  evaluationId: string;
  judgeType: JudgeType;
  status: JudgeExecutionStatus;
  score?: number;
  riskLevel?: RiskLevel;
  result?: Record<string, unknown>;
  reasoning?: string;
  model?: string;
  provider?: string;
  latencyMs?: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

// ─── Playground ───────────────────────────────────────────────────────────────

export interface PlaygroundEvaluationRequest {
  applicationId: string;
  input: string;
  output: string;
  metadata?: Record<string, unknown>;
}

export interface PlaygroundEvaluationResult {
  overallScore: number;
  riskLevel: RiskLevel;
  decision: EvaluationDecision;
  summary: string;
  judgeExecutions: Array<{
    judgeType: JudgeType;
    score: number;
    riskLevel: RiskLevel;
    reasoning: string;
    decision: EvaluationDecision;
  }>;
}

// ─── API Response Wrapper ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
