import {prisma} from "../lib/prisma.js"

export interface EvaluationContext {

    application: {
        id: string;
        name: string;
        type: string;
        environment: string;
    };

    conversation: {
        id: string;
        externalId: string;
        title: string | null;
    };

    messages: {
        role: string;
        content: string;
        sequence: number;
    }[];

    metadata?: Record<string, unknown>;
}

export const buildEvaluationContext = async (
    evaluationId: string
): Promise<EvaluationContext> => {

    const evaluation =
        await prisma.evaluation.findUnique({
            where: {
                id: evaluationId,
            },

            include: {
                application: true,

                conversation: {
                    include: {
                        messages: {
                            orderBy: {
                                sequence: "asc",
                            },
                        },
                    },
                },

                event: true,
            },
        });

    if (!evaluation) {
        throw new Error(
            "Evaluation not found"
        );
    }

    return {
        application: {
            id: evaluation.application.id,
            name: evaluation.application.name,
            type: evaluation.application.type,
            environment:
                evaluation.application.environment,
        },

        conversation: {
            id: evaluation.conversation.id,
            externalId:
                evaluation.conversation.externalId,
            title:
                evaluation.conversation.title,
        },

        messages:
            evaluation.conversation.messages.map(
                (message) => ({
                    role: message.role,
                    content: message.content,
                    sequence: message.sequence,
                })
            ),
    };
};