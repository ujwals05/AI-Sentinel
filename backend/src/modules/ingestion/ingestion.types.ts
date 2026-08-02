import type { MessageRole } from "../../generated/prisma/enums.js";
import type { EventType } from "../../generated/prisma/enums.js";
import type { Prisma } from "../../generated/prisma/client.js";

export interface IngestionMessageInput {
    role: MessageRole;
    content: string;
    metadata?: Prisma.InputJsonValue;
}

export interface IngestionConversationInput {
    externalId: string;
    title?: string;
    metadata?: Prisma.InputJsonValue;
}

export interface IngestionInput {
    conversation: IngestionConversationInput;

    messages: IngestionMessageInput[];

    metadata?: Prisma.InputJsonValue;
}

export interface IngestionResult {
    applicationId: string;

    conversationId: string;

    externalConversationId: string;

    eventId: string;

    messageCount: number;

    status: "INGESTED" | "DUPLICATE";
}