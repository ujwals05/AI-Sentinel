import {
    createApiKey as createApiKeyRepository,
    findApiKeysByApplicationId,
    findApiKeyById,
    revokeApiKey as revokeApiKeyRepository,
} from "./api-key.repository.js";

import {
    generateApiKey,
    getApiKeyPrefix,
    hashApiKey,
} from "./api-key.utils.js";

import type { CreateApiKeyInput } from "./api-key.types.js";

import { ApiError } from "../../utils/apiError.js";

export const createApiKey = async (
    applicationId: string,
    data: CreateApiKeyInput
) => {
    const secret = generateApiKey();

    const keyPrefix = getApiKeyPrefix(secret);

    const keyHash = hashApiKey(secret);

    const expiresAt = data.expiresAt ?? null;

    const apiKey = await createApiKeyRepository(
        applicationId,
        data.name,
        keyPrefix,
        keyHash,
        expiresAt
    );

    return {
        apiKey: {
            id: apiKey.id,
            applicationId: apiKey.applicationId,
            name: apiKey.name,
            keyPrefix: apiKey.keyPrefix,
            expiresAt: apiKey.expiresAt,
            revokedAt: apiKey.revokedAt,
            createdAt: apiKey.createdAt,
        },

        // Return this ONLY ONCE
        secret,
    };
};

export const listApiKeys = async (applicationId: string) => {
    return findApiKeysByApplicationId(applicationId);
};


export const revokeApiKey = async (
    apiKeyId: string,
    applicationId: string
) => {
    const apiKey = await findApiKeyById(
        apiKeyId,
        applicationId
    );

    if (!apiKey) {
        // throw new Error("API key not found");
        throw new ApiError(
            401,
            "API key not found"
        )
    }

    if (apiKey.revokedAt) {
        // throw new Error(
        //     "API key is already revoked"
        // );
        throw new ApiError(
            401,
            "API key is already revoked"
        )
    }

    return revokeApiKeyRepository(
        apiKeyId,
        applicationId
    );
};