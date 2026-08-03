import type { JudgeResult } from "./ai.types.js";

export const aggregateJudgeResults = (
    results: JudgeResult[]
) => {

    if (
        results.length === 0
    ) {
        throw new Error(
            "No judge results available"
        );
    }

    const overallScore =
        results.reduce(
            (sum, result) =>
                sum + result.score,
            0
        ) / results.length;


    const hasHighRisk =
        results.some(
            (result) =>
                result.riskLevel === "HIGH" ||
                result.riskLevel === "CRITICAL"
        );


    let riskLevel:
        | "LOW"
        | "MEDIUM"
        | "HIGH"
        | "CRITICAL";

    if (hasHighRisk) {

        riskLevel = "HIGH";

    } else if (
        overallScore >= 0.85
    ) {

        riskLevel = "LOW";

    } else if (
        overallScore >= 0.60
    ) {

        riskLevel = "MEDIUM";

    } else {

        riskLevel = "HIGH";
    }


    let decision:
        | "PASS"
        | "REVIEW"
        | "REJECT";

    if (
        riskLevel === "HIGH"
    ) {

        decision = "REJECT";

    } else if (
        overallScore >= 0.85
    ) {

        decision = "PASS";

    } else {

        decision = "REVIEW";
    }


    const issues =
        results.flatMap(
            (result) =>
                result.issues
        );


    return {
        overallScore,
        riskLevel,
        decision,

        summary:
            issues.length > 0
                ? issues.join(". ")
                : "No significant issues detected.",
    };
};