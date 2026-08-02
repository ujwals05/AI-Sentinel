import type { Prisma } from "../../generated/prisma/client.js";
import type { EventType } from "../../generated/prisma/enums.js";

export interface CreateEventInput {
    applicationId: string;
    conversationId?: string;
    externalEventId: string;

    type: EventType;

    payload: Prisma.InputJsonValue;

    metadata?: Prisma.InputJsonValue;

    occurredAt: Date;
}