import {
    findConversationByExternalId,
    createConversation,
    updateLastMessageAt,
} from "./conversation.repository.js";

import type {
    CreateConversationInput,
} from "./conversation.types.js";


export const getOrCreateConversation = async (
    data: CreateConversationInput
) => {

    // 1. Check whether conversation already exists
    const existingConversation =
        await findConversationByExternalId(
            data.applicationId,
            data.externalId
        );

    // 2. Return existing conversation
    if (existingConversation) {
        return {
            conversation: existingConversation,
            created: false,
        };
    }

    // 3. Create new conversation
    const conversation =
        await createConversation(data);

    return {
        conversation,
        created: true,
    };
};


export const touchConversation = async (
    conversationId: string
) => {
    return updateLastMessageAt(
        conversationId
    );
};