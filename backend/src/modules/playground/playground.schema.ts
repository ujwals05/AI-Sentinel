import { z } from "zod";

export const playgroundEvaluationSchema = z.object({
    applicationId: z
        .string()
        .uuid("Invalid application ID"),

    input: z
        .string()
        .min(1, "Input is required")
        .max(10000, "Input is too long"),

    output: z
        .string()
        .min(1, "Output is required")
        .max(20000, "Output is too long"),

    metadata: z
        .record(z.string(), z.any())
        .optional(),
});

export type PlaygroundEvaluationRequest = z.infer<
    typeof playgroundEvaluationSchema
>;