import { Annotation } from "@langchain/langgraph";

import type {
    EvaluationContext,
    JudgeResult,
    RiskLevel,
    EvaluationDecision,
} from "../core/judge.types.js";

export const EvaluationState = Annotation.Root({
    // Input
    context: Annotation<EvaluationContext>(),

    // Individual judge results
    quality: Annotation<JudgeResult | undefined>(),

    safety: Annotation<JudgeResult | undefined>(),

    trust: Annotation<JudgeResult | undefined>(),

    // Final aggregated result
    overallScore: Annotation<number | undefined>(),

    riskLevel: Annotation<RiskLevel | undefined>(),

    decision: Annotation<EvaluationDecision | undefined>(),

    summary: Annotation<string | undefined>(),
});

export type EvaluationStateType =
    typeof EvaluationState.State;