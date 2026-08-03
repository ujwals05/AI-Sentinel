export type JudgeName =
    | "QUALITY"
    | "SAFETY"
    | "TRUST";

export type RiskLevel =
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";

export type EvaluationDecision =
    | "PASS"
    | "REVIEW"
    | "REJECT";

export interface EvaluationMessage {
    role: string;
    content: string;
}

export interface EvaluationContext {
    applicationId: string;
    conversationId: string;

    conversation: {
        externalId: string;
        title?: string | null;
    };

    messages: EvaluationMessage[];

    metadata?: Record<string, unknown> | null;
}

export interface JudgeResult {
    judge: JudgeName;

    score: number;

    riskLevel: RiskLevel;

    passed: boolean;

    reasoning: string;

    findings: string[];

    recommendations: string[];
}

export interface AggregationResult {
    overallScore: number;

    riskLevel: RiskLevel;

    decision: EvaluationDecision;

    summary: string;
}