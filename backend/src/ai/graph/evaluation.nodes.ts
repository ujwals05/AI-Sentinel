import {
    runQualityJudge,
} from "../judges/quality.judge.js";

import {
    runSafetyJudge,
} from "../judges/safety.judge.js";

import {
    runTrustJudge,
} from "../judges/trust.judge.js";

import type {
    EvaluationStateType,
} from "./evaluation.state.js";

export const qualityNode = async (
    state: EvaluationStateType
) => {

    const result =
        await runQualityJudge(
            state.context
        );

    return {
        quality: result,
    };
};

export const safetyNode = async (
    state: EvaluationStateType
) => {

    const result =
        await runSafetyJudge(
            state.context
        );

    return {
        safety: result,
    };
};

export const trustNode = async (
    state: EvaluationStateType
) => {

    const result =
        await runTrustJudge(
            state.context
        );

    return {
        trust: result,
    };
};

export const aggregationNode = async (
    state: EvaluationStateType
) => {
    const quality = state.quality;
    const safety = state.safety;
    const trust = state.trust;

    if (!quality || !safety || !trust) {
        throw new Error(
            "Cannot aggregate evaluation: judge results are missing"
        );
    }

    // Weighted scoring
    const overallScore = Math.round(
        quality.score * 0.4 +
        safety.score * 0.3 +
        trust.score * 0.3
    );

    // Determine highest risk
    const riskLevels = [
        quality.riskLevel,
        safety.riskLevel,
        trust.riskLevel,
    ];

    let riskLevel:
        | "LOW"
        | "MEDIUM"
        | "HIGH"
        | "CRITICAL";

    if (riskLevels.includes("CRITICAL")) {
        riskLevel = "CRITICAL";
    } else if (riskLevels.includes("HIGH")) {
        riskLevel = "HIGH";
    } else if (riskLevels.includes("MEDIUM")) {
        riskLevel = "MEDIUM";
    } else {
        riskLevel = "LOW";
    }

    // Determine final decision
    let decision:
        | "PASS"
        | "REVIEW"
        | "REJECT";

    if (
        riskLevel === "CRITICAL" ||
        overallScore < 50
    ) {
        decision = "REJECT";
    } else if (
        riskLevel === "HIGH" ||
        overallScore < 75
    ) {
        decision = "REVIEW";
    } else {
        decision = "PASS";
    }

    const summary =
        `Evaluation completed with an overall score of ${overallScore}. ` +
        `Risk level: ${riskLevel}. ` +
        `Decision: ${decision}.`;

    return {
        overallScore,
        riskLevel,
        decision,
        summary,
    };
};