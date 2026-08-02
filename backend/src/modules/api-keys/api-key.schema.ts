import { z } from "zod";

export const createApiKeySchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "API key name must be at least 2 characters long")
        .max(100, "API key name must not exceed 100 characters"),

    expiresAt: z
        .string()
        .datetime("Invalid expiration date")
        .optional(),
});