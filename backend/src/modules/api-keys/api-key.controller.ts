import type {
    Request,
    Response,
    NextFunction,
} from "express";

import {
    createApiKey,
    listApiKeys,
    revokeApiKey,
} from "./api-key.service.js";

import { createApiKeySchema, } from "./api-key.schema.js";

import { sendSuccess, sendError, } from "../../utils/response.js";

import { prisma, } from "../../lib/prisma.js";

export const createApiKeyController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return sendError(
                res,
                "Unauthorized",
                401
            );
        }

        const applicationId = req.params.applicationId;

        if (typeof applicationId !== "string") {
            return sendError(
                res,
                "Invalid application ID",
                400
            );
        }

        const parsed = createApiKeySchema.safeParse(req.body);

        if (!parsed.success) {
            return sendError(
                res,
                "Validation failed",
                400,
                parsed.error.flatten()
            );
        }

        const application = await prisma.application.findFirst({
            where: {
                id: applicationId,
                userId,
                status: "ACTIVE",
            },
        });

        if (!application) {
            return sendError(
                res,
                "Application not found",
                404
            );
        }

        const result = await createApiKey(
            applicationId,
            {
                name: parsed.data.name,
                ...(parsed.data.expiresAt
                    ? {
                        expiresAt: new Date(
                            parsed.data.expiresAt
                        ),
                    }
                    : {}),
            }
        );

        return sendSuccess(
            res,
            result,
            "API key created successfully",
            201
        );

    } catch (error) {
        next(error);
    }
};

export const listApiKeysController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return sendError(
                res,
                "Unauthorized",
                401
            );
        }

        const applicationId = req.params.applicationId;

        if (typeof applicationId !== "string") {
            return sendError(
                res,
                "Invalid application ID",
                400
            );
        }

        const application = await prisma.application.findFirst({
            where: {
                id: applicationId,
                userId,
                status: "ACTIVE",
            },
        });

        if (!application) {
            return sendError(
                res,
                "Application not found",
                404
            );
        }

        const apiKeys = await listApiKeys(applicationId);

        return sendSuccess(
            res,
            { apiKeys },
            "API keys fetched successfully"
        );

    } catch (error) {
        next(error);
    }
};

export const revokeApiKeyController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return sendError(
                res,
                "Unauthorized",
                401
            );
        }

        const { applicationId, apiKeyId } = req.params;

        if (
            typeof applicationId !==
            "string" ||
            typeof apiKeyId !==
            "string"
        ) {
            return sendError(
                res,
                "Invalid ID",
                400
            );
        }

        const application = await prisma.application.findFirst({
            where: {
                id: applicationId,
                userId,
                status: "ACTIVE",
            },
        });

        if (!application) {
            return sendError(
                res,
                "Application not found",
                404
            );
        }

        await revokeApiKey(apiKeyId, applicationId);

        return sendSuccess(
            res,
            null,
            "API key revoked successfully"
        );

    } catch (error) {
        next(error);
    }
};