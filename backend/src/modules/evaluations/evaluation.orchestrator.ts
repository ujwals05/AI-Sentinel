import { evaluationGraph, } from "../../ai/graph/evaluation.graph.js";

import type { EvaluationContext, } from "../../ai/core/judge.types.js";

export const runEvaluation = async (context: EvaluationContext) => {

    const result = await evaluationGraph.invoke({ context });

    if (
        !result.quality ||
        !result.safety ||
        !result.trust
    ) {
        throw new Error(
            "Evaluation workflow did not produce complete judge results"
        );
    }

    if (
        result.overallScore === undefined ||
        result.riskLevel === undefined ||
        result.decision === undefined ||
        result.summary === undefined
    ) {
        throw new Error(
            "Evaluation workflow did not produce complete aggregation results"
        );
    }

    return {
        quality: result.quality,

        safety: result.safety,

        trust: result.trust,

        overallScore:
            result.overallScore,

        riskLevel:
            result.riskLevel,

        decision:
            result.decision,

        summary:
            result.summary,
    };
};