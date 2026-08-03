import type {
    EvaluationDecision,
    EvaluationStatus,
    RiskLevel,
} from "../../generated/prisma/enums.js";

import type { Conversation, Event, Message } from "../../generated/prisma/client.js";

export interface CreateEvaluationInput {
    applicationId: string;
    conversationId: string;
    eventId?: string;
}

export interface EvaluationResult {
    overallScore: number;
    riskLevel: RiskLevel;
    decision: EvaluationDecision;
    summary: string;
}

export interface EvaluationResponse {
    id: string;
    applicationId: string;
    conversationId: string;
    eventId: string | null;
    status: EvaluationStatus;
    overallScore: number | null;
    riskLevel: RiskLevel | null;
    decision: EvaluationDecision | null;
    summary: string | null;
}

export interface EvaluationContext {
    applicationId: string;
    conversationId: string;
    eventId: string;

    conversation: Conversation;
    messages: Message[];
    event: Event;
}