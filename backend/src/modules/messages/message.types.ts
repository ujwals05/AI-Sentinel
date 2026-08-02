import type { MessageRole } from "../../generated/prisma/enums.js";
import type { Prisma } from "../../generated/prisma/client.js";

export interface CreateMessageInput {
    conversationId: string;
    role: MessageRole;
    content: string;
    sequence: number;
    metadata?: Prisma.InputJsonValue;
}

export interface CreateMessagesInput {
    conversationId: string;
    messages: Array<{
        role: MessageRole;
        content: string;
        metadata?: Prisma.InputJsonValue;
    }>;
}

export interface MessageWithSequence {
    role: MessageRole;
    content: string;
    sequence: number;
    metadata?: Prisma.InputJsonValue;
}