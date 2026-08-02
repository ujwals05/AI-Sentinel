import { z } from "zod";

export const conversationLookupSchema = z.object({
    externalId: z
        .string()
        .trim()
        .min(1)
        .max(255),
});