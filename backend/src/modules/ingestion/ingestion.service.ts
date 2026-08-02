import { prisma } from "../../lib/prisma.js"

import {
    findConversationByExternalId,
    createConversation,
    updateLastMessageAt,
} from "../conversations/conversation.repository.js";

import {
    addMessagesToConversation,
} from "../messages/message.service.js";

import {
    findEventByExternalId,
    createEvent,
} from "../events/event.repository.js";

import type {
    IngestionInput,
    IngestionResult,
} from "./ingestion.types.js";


interface IngestContext {
    applicationId: string;
}


export const ingestInteraction =
    async (
        data: IngestionInput,
        context: IngestContext,
        externalEventId: string
    ): Promise<IngestionResult> => {

        const {
            applicationId,
        } = context;


        /*
        |--------------------------------------------------------------------------
        | Start Transaction
        |--------------------------------------------------------------------------
        */

        return prisma.$transaction(
            async (tx) => {

                /*
                |--------------------------------------------------------------------------
                | STEP 1: Idempotency Check
                |--------------------------------------------------------------------------
                */

                const existingEvent =
                    await findEventByExternalId(
                        applicationId,
                        externalEventId,
                        tx
                    );


                if (existingEvent) {

                    return {
                        applicationId,

                        conversationId:
                            existingEvent.conversationId
                            ?? "",

                        externalConversationId:
                            data.conversation.externalId,

                        eventId:
                            existingEvent.id,

                        messageCount:
                            0,

                        status:
                            "DUPLICATE",
                    };
                }


                /*
                |--------------------------------------------------------------------------
                | STEP 2: Find Conversation
                |--------------------------------------------------------------------------
                */

                let conversation =
                    await findConversationByExternalId(
                        applicationId,
                        data.conversation.externalId,
                        tx
                    );


                /*
                |--------------------------------------------------------------------------
                | STEP 3: Create Conversation
                |--------------------------------------------------------------------------
                */

                if (!conversation) {

                    conversation =
                        await createConversation(
                            {
                                applicationId,

                                externalId:
                                    data.conversation.externalId,

                                ...(data.conversation.title !== undefined && {
                                    title:
                                        data.conversation.title,
                                }),

                                ...(data.conversation.metadata !== undefined && {
                                    metadata:
                                        data.conversation.metadata,
                                }),
                            },
                            tx
                        );
                }


                /*
                |--------------------------------------------------------------------------
                | STEP 4: Create Messages
                |--------------------------------------------------------------------------
                */

                const messageResult =
                    await addMessagesToConversation(
                        {
                            conversationId:
                                conversation.id,

                            messages:
                                data.messages,
                        },
                        tx
                    );


                /*
                |--------------------------------------------------------------------------
                | STEP 5: Create Event
                |--------------------------------------------------------------------------
                */

                const event =
                    await createEvent(
                        {
                            applicationId,

                            conversationId:
                                conversation.id,

                            externalEventId,

                            type:
                                "LLM_RESPONSE",

                            payload: {
                                conversation: {
                                    externalId: data.conversation.externalId,

                                    ...(data.conversation.title !== undefined
                                        ? {
                                            title: data.conversation.title,
                                        }
                                        : {}),

                                    ...(data.conversation.metadata !== undefined
                                        ? {
                                            metadata: data.conversation.metadata,
                                        }
                                        : {}),
                                },

                                messages: data.messages.map((message) => ({
                                    role: message.role,
                                    content: message.content,

                                    ...(message.metadata !== undefined
                                        ? {
                                            metadata: message.metadata,
                                        }
                                        : {}),
                                })),
                            },

                            ...(data.metadata !== undefined && {
                                metadata:
                                    data.metadata,
                            }),

                            occurredAt:
                                new Date(),
                        },
                        tx
                    );


                /*
                |--------------------------------------------------------------------------
                | STEP 6: Update Conversation
                |--------------------------------------------------------------------------
                */

                await updateLastMessageAt(
                    conversation.id,
                    tx
                );


                /*
                |--------------------------------------------------------------------------
                | STEP 7: Return Result
                |--------------------------------------------------------------------------
                */

                return {
                    applicationId,

                    conversationId:
                        conversation.id,

                    externalConversationId:
                        data.conversation.externalId,

                    eventId:
                        event.id,

                    messageCount:
                        messageResult.count,

                    status:
                        "INGESTED",
                };
            }
        );
    };
