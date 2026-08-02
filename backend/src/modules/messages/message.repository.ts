import { prisma } from "../../lib/prisma.js";

import type { Prisma } from "../../generated/prisma/client.js";

import type {
    CreateMessageInput,
} from "./message.types.js";

type DatabaseClient = Prisma.TransactionClient | typeof prisma;



export const findLastMessageByConversation =
    async (
        conversationId: string,
        db: DatabaseClient = prisma
    ) => {
        return db.message.findFirst({
            where: {
                conversationId,
            },

            orderBy: {
                sequence: "desc",
            },
        });
    };


export const createMessage = async (
    data: CreateMessageInput,
    db: DatabaseClient = prisma
) => {
    return db.message.create({
        data: {
            conversationId:
                data.conversationId,

            role: data.role,

            content: data.content,

            sequence: data.sequence,

            ...(data.metadata !== undefined && {
                metadata: data.metadata,
            }),
        },
    });
};


export const createMessages = async (
    data: CreateMessageInput[],
    db: DatabaseClient = prisma
) => {
    return db.message.createMany({
        data: data.map((message) => ({
            conversationId:
                message.conversationId,

            role: message.role,

            content: message.content,

            sequence: message.sequence,

            ...(message.metadata !== undefined && {
                metadata: message.metadata,
            }),
        })),
    });
};


export const findMessagesByConversation =
    async (
        conversationId: string,
        db: DatabaseClient = prisma
    ) => {
        return db.message.findMany({
            where: {
                conversationId,
            },

            orderBy: {
                sequence: "asc",
            },
        });
    };