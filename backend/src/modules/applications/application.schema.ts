import z from "zod";

import { ApplicationType, ApplicationEnvironment } from "../../generated/prisma/enums.js";

export const createApplicationSchema = z.object({
    name: z
        .string()
        .trim()
        .min(
            2,
            "Application name must be at least 2 characters long"
        )
        .max(
            100,
            "Application name must not exceed 100 characters"
        ),

    description: z
        .string()
        .trim()
        .max(
            500,
            "Description must not exceed 500 characters"
        )
        .optional(),

    type: z.nativeEnum(ApplicationType),

    environment: z
        .nativeEnum(ApplicationEnvironment)
        .default(ApplicationEnvironment.DEVELOPMENT),
})

export const updateApplicationSchema = z.object({
        name: z
            .string()
            .trim()
            .min(
                2,
                "Application name must be at least 2 characters long"
            )
            .max(
                100,
                "Application name must not exceed 100 characters"
            )
            .optional(),

        description: z
            .string()
            .trim()
            .max(
                500,
                "Description must not exceed 500 characters"
            )
            .optional(),

        type: z
            .nativeEnum(ApplicationType)
            .optional(),

        environment: z
            .nativeEnum(ApplicationEnvironment)
            .optional(),
    })
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message:
                "At least one field must be provided for update",
        }
    );


export const applicationIdSchema = z.object({
    applicationId: z
        .string()
        .uuid("Invalid application ID"),
});