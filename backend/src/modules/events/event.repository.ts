import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";

import type { CreateEventInput, } from "./event.types.js";

type DatabaseClient = Prisma.TransactionClient | typeof prisma;

export const findEventByExternalId = async (
    applicationId: string,
    externalEventId: string,
    db: DatabaseClient = prisma
) => {
    return db.event.findUnique({
        where: {
            applicationId_externalEventId: {
                applicationId,
                externalEventId,
            },
        },
    });
};


export const createEvent = async (data: CreateEventInput, db: DatabaseClient = prisma) => {
    return db.event.create({
        data: {
            applicationId:
                data.applicationId,

            externalEventId:
                data.externalEventId,

            type:
                data.type,

            payload:
                data.payload,

            occurredAt:
                data.occurredAt,

            ...(data.conversationId !== undefined && {
                conversationId:
                    data.conversationId,
            }),

            ...(data.metadata !== undefined && {
                metadata:
                    data.metadata,
            }),
        },
    });
};

export const findEventById = async (
    eventId: string,
    db: DatabaseClient = prisma
) => {
    return db.event.findUnique({
        where: {
            id: eventId,
        },
    });
};