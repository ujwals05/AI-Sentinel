import {
    z,
} from "zod";


export const qualityCriterionSchema =
    z.object({

        criterion:
            z.enum([
                "correctness",
                "relevance",
                "completeness",
                "instruction_adherence",
            ]),

        score:
            z.number()
                .min(0)
                .max(100),

        maxScore:
    z.number(),

        passed:
            z.boolean(),

        explanation:
            z.string(),

        confidence:
            z.number()
                .min(0)
                .max(1),

        classification:
            z.enum([
                "PASS",
                "FAIL",
                "REVIEW",
            ]),

        recommendation:
            z.string(),
    });


export const qualityJudgeOutputSchema =
    z.object({

        overallScore:
            z.number()
                .min(0)
                .max(100),

        summary:
            z.string(),

        criteria:
            z.array(
                qualityCriterionSchema
            ),

        overallClassification:
            z.enum([
                "PASS",
                "FAIL",
                "REVIEW",
            ]),

        overallConfidence:
            z.number()
                .min(0)
                .max(1),

        recommendation:
            z.string(),
    });


export type QualityJudgeOutput =
    z.infer<
        typeof qualityJudgeOutputSchema
    >;