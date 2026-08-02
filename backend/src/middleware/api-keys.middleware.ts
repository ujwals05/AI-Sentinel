import type {
    Request,
    Response,
    NextFunction,
} from "express";

import { findApiKeyByPrefix, } from "../modules/api-keys/api-key.repository.js";

import {
    getApiKeyPrefix,
    verifyApiKeyHash,
} from "../modules/api-keys/api-key.utils.js";

import { sendError, } from "../utils/response.js";


export const verifyApiKey = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // 1. Get API key from request header
        const apiKey = req.header("X-API-Key");

        if (!apiKey) {
            return sendError(
                res,
                "API key is required",
                401
            );
        }

        // 2. Extract key prefix
        const keyPrefix = getApiKeyPrefix(apiKey);

        // 3. Find API key using prefix
        const storedApiKey = await findApiKeyByPrefix(keyPrefix);

        if (!storedApiKey) {
            return sendError(
                res,
                "Invalid API key",
                401
            );
        }

        // 4. Verify API key hash
        const isValid = await verifyApiKeyHash(
            apiKey,
            storedApiKey.keyHash
        );

        if (!isValid) {
            return sendError(
                res,
                "Invalid API key",
                401
            );
        }

        // 5. Check revoked API key
        if (storedApiKey.revokedAt) {
            return sendError(
                res,
                "API key has been revoked",
                401
            );
        }

        // 6. Check expired API key
        if (
            storedApiKey.expiresAt &&
            storedApiKey.expiresAt <= new Date()
        ) {
            return sendError(
                res,
                "API key has expired",
                401
            );
        }

        // 7. Attach API key to request
        req.apiKey = storedApiKey;

        // 8. Attach application to request
        req.application = {
            id: storedApiKey.application.id,
            name: storedApiKey.application.name,
            status: storedApiKey.application.status,
        };

        // 9. Continue request
        return next();

    } catch (error) {
        return next(error);
    }
};