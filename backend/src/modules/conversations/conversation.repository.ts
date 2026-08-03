import { prisma } from "./../../lib/prisma.js"
import type { Prisma } from "../../generated/prisma/client.js"; //This is for prisma transaction.

import type {
    CreateConversationInput,
    UpdateConversationInput,
} from "./conversation.types.js";

export const findConversationByExternalId = async (
    applicationId: string,
    externalId: string,
    db: Prisma.TransactionClient | typeof prisma = prisma // Transaction implemented
) => {
    //Transaction used
    return db.conversation.findUnique({
        where: {
            applicationId_externalId: {
                applicationId,
                externalId,
            },
        },
    });
};


export const createConversation = async (
    data: CreateConversationInput,
    db: Prisma.TransactionClient | typeof prisma = prisma
) => {
    return db.conversation.create({
        data: {
            applicationId: data.applicationId,
            externalId: data.externalId,

            ...(data.title !== undefined && {
                title: data.title,
            }),

            ...(data.metadata !== undefined && {
                metadata: data.metadata,
            }),
        },
    });
};

export const findConversationsByApplicationId = async (
    applicationId: string,
    options: {
        skip: number;
        take: number;
        status?: string;
        search?: string;
    }
) => {
    const where = {
        applicationId,

        ...(options.status
            ? {
                status: options.status as any,
            }
            : {}),

        ...(options.search
            ? {
                OR: [
                    {
                        title: {
                            contains: options.search,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        externalId: {
                            contains: options.search,
                            mode: "insensitive" as const,
                        },
                    },
                ],
            }
            : {}),
    };

    const [conversations, total] = await Promise.all([
        prisma.conversation.findMany({
            where,
            skip: options.skip,
            take: options.take,
            orderBy: {
                lastMessageAt: "desc",
            },
            include: {
                _count: {
                    select: {
                        messages: true,
                    },
                },
            },
        }),

        prisma.conversation.count({
            where,
        }),
    ]);

    return {
        conversations,
        total,
    };
};

export const updateConversation = async (
    conversationId: string,
    data: UpdateConversationInput,
    db: Prisma.TransactionClient | typeof prisma = prisma
) => {
    return db.conversation.update({
        where: {
            id: conversationId,
        },
        data: {
            ...(data.title !== undefined && {
                title: data.title,
            }),

            ...(data.status !== undefined && {
                status: data.status,
            }),

            ...(data.metadata !== undefined && {
                metadata: data.metadata,
            }),
        },
    });
};


export const updateLastMessageAt = async (
    conversationId: string,
    db: Prisma.TransactionClient | typeof prisma = prisma
) => {
    return db.conversation.update({
        where: {
            id: conversationId,
        },
        data: {
            lastMessageAt: new Date(),
        },
    });
};

export const findConversationById = async (
    conversationId: string,
    db: Prisma.TransactionClient | typeof prisma = prisma
) => {
    return db.conversation.findUnique({
        where: {
            id: conversationId,
        },

        include: {
            messages: {
                orderBy: {
                    sequence: "asc",
                },
            },
        },
    });
};
