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