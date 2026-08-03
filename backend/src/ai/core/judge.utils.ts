import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

export const judgeResultSchema = z.object({
    score: z.number().min(0).max(100),

    passed: z.boolean(),

    riskLevel: z.enum([
        "LOW",
        "MEDIUM",
        "HIGH",
        "CRITICAL",
    ]),

    reasoning: z.string(),

    findings: z.array(z.string()),

    recommendations: z.array(z.string()),
});

export const judgeParser =
    StructuredOutputParser.fromZodSchema(
        judgeResultSchema
    );