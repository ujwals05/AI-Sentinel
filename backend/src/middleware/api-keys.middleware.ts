import type {
    Request,
    Response,
    NextFunction,
} from "express";

import {
    findApiKeyByPrefix,
} from "../modules/api-keys/api-key.repository.js";

import {
    getApiKeyPrefix,
    verifyApiKeyHash,
} from "../modules/api-keys/api-key.utils.js";

import {
    sendError,
} from "../utils/response.js";


export const verifyApiKey = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const apiKey = req.header("X-API-Key");

        if (!apiKey) {
            return sendError(
                res,
                "API key is required",
                401
            );
        }

        const keyPrefix = getApiKeyPrefix(apiKey);

        const storedApiKey = await findApiKeyByPrefix(keyPrefix);

        if (!storedApiKey) {
            return sendError(
                res,
                "Invalid API key",
                401
            );
        }

        const isValid = verifyApiKeyHash(apiKey, storedApiKey.keyHash);

        if (!isValid) {
            return sendError(
                res,
                "Invalid API key",
                401
            );
        }

        if (storedApiKey.revokedAt) {
            return sendError(
                res,
                "API key has been revoked",
                401
            );
        }

        if (
            storedApiKey.expiresAt &&
            storedApiKey.expiresAt <
            new Date()
        ) {
            return sendError(
                res,
                "API key has expired",
                401
            );
        }

        req.apiKey = storedApiKey;

        next();

    } catch (error) {
        next(error);
    }
};