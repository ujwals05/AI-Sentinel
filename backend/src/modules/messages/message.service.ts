import { prisma } from "../../lib/prisma.js"

import type { Prisma } from "../../generated/prisma/client.js";

import {
    findLastMessageByConversation,
    createMessages,
} from "./message.repository.js";

import type {
    CreateMessagesInput,
    CreateMessageInput,
} from "./message.types.js";


type DatabaseClient = Prisma.TransactionClient | typeof prisma;


export const addMessagesToConversation =
    async (
        data: CreateMessagesInput,
        db: DatabaseClient = prisma
    ) => {

        
        //Find Last Message

        const lastMessage =
            await findLastMessageByConversation(
                data.conversationId,
                db
            );


        //Determine Starting Sequence

        const startingSequence =
            lastMessage
                ? lastMessage.sequence + 1
                : 1;


        // Assign Sequence Numbers
        const messages:
            CreateMessageInput[] =
            data.messages.map(
                (message, index) => ({
                    conversationId:
                        data.conversationId,

                    role:
                        message.role,

                    content:
                        message.content,

                    sequence:
                        startingSequence + index,

                    ...(message.metadata !== undefined && {
                        metadata:
                            message.metadata,
                    }),
                })
            );


        // Create Messages

        const result =
            await createMessages(
                messages,
                db
            );


        return {
            messages,

            count:
                result.count,
        };
    };