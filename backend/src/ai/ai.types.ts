import type {
    JudgeType,
    RiskLevel,
} from "../generated/prisma/enums.js";

export interface JudgeResult {

    judgeType: JudgeType;

    score: number;

    riskLevel: RiskLevel;

    reasoning: string;

    issues: string[];

    metadata?: Record<
        string,
        unknown
    >;
}