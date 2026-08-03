// import type { JsonValue } from "@prisma/client/runtime/library";
import type { JsonValue } from "@prisma/client/runtime/client";

import type {
    JudgeResult,
} from "../../ai/core/judge.types.js";

export interface PlaygroundEvaluationInput {
    applicationId: string;
    input: string;
    output: string;
    metadata?: Record<string, JsonValue>;
}

export interface PlaygroundEvaluationResult {
    evaluationId?: string;

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