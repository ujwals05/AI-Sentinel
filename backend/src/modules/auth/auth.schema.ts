import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters long")
        .max(50, "Name must not exceed 50 characters"),

    email: z
        .string()
        .email("Please provide a valid email address")
        .trim()
        .toLowerCase(),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
});

export const loginSchema = z.object({
    email: z
        .string()
        .email("Please provide a valid email address")
        .trim()
        .toLowerCase(),

    password: z
        .string()
        .min(1, "Password is required"),
});

export type RegisterSchemaInput = z.infer<typeof registerSchema>;
export type LoginSchemaInput = z.infer<typeof loginSchema>;