import type {
    ConversationStatus,
} from "../../generated/prisma/enums.js";

import type {
    InputJsonValue,
} from "../../generated/prisma/internal/prismaNamespace.js";


export interface CreateConversationInput {
    applicationId: string;
    externalId: string;
    title?: string;
    metadata?: InputJsonValue;
}


export interface UpdateConversationInput {
    title?: string;
    status?: ConversationStatus;
    metadata?: InputJsonValue;
}


export interface ConversationLookupInput {
    applicationId: string;
    externalId: string;
}

export interface ConversationListQuery {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
}

export interface ConversationListItem {
    id: string;
    applicationId: string;
    externalId: string;
    title: string | null;
    status: string;
    messageCount: number;
    lastMessageAt: Date | null;
    createdAt: Date;
}

export interface ConversationDetails {
    id: string;
    applicationId: string;
    externalId: string;
    title: string | null;
    status: string;
    metadata: unknown;
    startedAt: Date;
    lastMessageAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    messageCount: number;
}