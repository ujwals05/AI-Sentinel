import { z } from "zod";

export const ingestionSchema = z.object({
    conversation: z.object({
        externalId: z
            .string()
            .trim()
            .min(
                1,
                "Conversation externalId is required"
            )
            .max(
                255,
                "Conversation externalId is too long"
            ),

        title: z
            .string()
            .trim()
            .max(
                255,
                "Conversation title is too long"
            )
            .optional(),
    }),

    messages: z
        .array(
            z.object({
                role: z.enum([
                    "USER",
                    "ASSISTANT",
                    "SYSTEM",
                    "TOOL",
                ]),

                content: z
                    .string()
                    .trim()
                    .min(
                        1,
                        "Message content is required"
                    ),
            })
        )
        .min(
            1,
            "At least one message is required"
        ),

    metadata: z
        .record(
            z.string(),
            z.unknown()
        )
        .optional(),
});

export type IngestionSchemaInput =
    z.infer<typeof ingestionSchema>;