import {
    findConversationByExternalId,
    createConversation,
    updateLastMessageAt,
    findConversationsByApplicationId,
    findConversationById
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

export const getApplicationConversations = async (
    applicationId: string,
    query: {
        page?: number;
        limit?: number;
        status?: string;
        search?: string;
    }
) => {

    const page = Math.max(query.page ?? 1, 1);

    const limit = Math.min(
        Math.max(query.limit ?? 20, 1),
        100
    );

    const skip = (page - 1) * limit;

    const result = await findConversationsByApplicationId(
        applicationId,
        {
            skip,
            take: limit,

            ...(query.status !== undefined && {
                status: query.status,
            }),

            ...(query.search !== undefined && {
                search: query.search,
            }),
        }
    );

    return {
        conversations: result.conversations.map(
            (conversation) => ({
                id: conversation.id,
                applicationId: conversation.applicationId,
                externalId: conversation.externalId,
                title: conversation.title,
                status: conversation.status,
                messageCount: conversation._count.messages,
                lastMessageAt: conversation.lastMessageAt,
                createdAt: conversation.createdAt,
            })
        ),

        pagination: {
            page,
            limit,
            total: result.total,
            totalPages: Math.ceil(
                result.total / limit
            ),
        },
    };
};

export const getConversationById = async (
    conversationId: string
) => {

    const conversation =
        await findConversationById(conversationId);

    if (!conversation) {
        throw new Error("Conversation not found");
    }

    return {
        id: conversation.id,
        applicationId: conversation.applicationId,
        externalId: conversation.externalId,
        title: conversation.title,
        status: conversation.status,
        metadata: conversation.metadata,
        startedAt: conversation.startedAt,
        lastMessageAt: conversation.lastMessageAt,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        messages: conversation.messages,
    };
};