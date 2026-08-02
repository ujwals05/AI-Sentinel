import { prisma } from "../../lib/prisma.js";

export const createApiKey = async (
    applicationId: string,
    name: string,
    keyPrefix: string,
    keyHash: string,
    expiresAt: Date | null
) => {
    return prisma.apiKey.create({
        data: {
            applicationId,
            name,
            keyPrefix,
            keyHash,
            expiresAt,
        },
    });
};

export const findApiKeyByPrefix = async (keyPrefix: string) => {
    return prisma.apiKey.findFirst({
        where: {
            keyPrefix,
        },
        include: {
            application: true,
        },
    });
};

export const findApiKeysByApplicationId = async (applicationId: string) => {
    return prisma.apiKey.findMany({
        where: {
            applicationId,
        },
        select: {
            id: true,
            applicationId: true,
            name: true,
            keyPrefix: true,
            lastUsedAt: true,
            expiresAt: true,
            revokedAt: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const findApiKeyById = async (
    apiKeyId: string,
    applicationId: string
) => {
    return prisma.apiKey.findFirst({
        where: {
            id: apiKeyId,
            applicationId,
        },
    });
};

export const revokeApiKey = async (
    apiKeyId: string,
    applicationId: string
) => {
    return prisma.apiKey.updateMany({
        where: {
            id: apiKeyId,
            applicationId,
            revokedAt: null,
        },
        data: {
            revokedAt: new Date(),
        },
    });
};

export const updateLastUsedAt = async (apiKeyId: string) => {
    return prisma.apiKey.update({
        where: {
            id: apiKeyId,
        },
        data: {
            lastUsedAt: new Date(),
        },
    });
};