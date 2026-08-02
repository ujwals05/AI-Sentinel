import { z } from "zod";

export const createEventSchema = z.object({
    conversationId: z
        .string()
        .uuid()
        .optional(),

    externalEventId: z
        .string()
        .min(1, "External event ID is required")
        .max(255, "External event ID is too long"),

    type: z.enum([
        "LLM_REQUEST",
        "LLM_RESPONSE",
        "TOOL_CALL",
        "TOOL_RESPONSE",
        "AGENT_ACTION",
        "EVALUATION_STARTED",
        "EVALUATION_COMPLETED",
        "POLICY_VIOLATION",
        "SAFETY_VIOLATION",
        "HIGH_RISK_DETECTED",
    ]),

    payload: z
        .record(
            z.string(),
            z.unknown()
        ),

    metadata: z
        .record(
            z.string(),
            z.unknown()
        )
        .optional(),

    occurredAt: z
        .coerce
        .date(),
});