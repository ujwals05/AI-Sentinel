import { prisma } from "../../lib/prisma.js"
// import type { Prisma } from "../../generated/prisma/index.js";
import type { Prisma } from "../../generated/prisma/client.js";

export const findConversationForEvaluation =
    async (
        conversationId: string
    ) => {

        return prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },

            include: {
                messages: {
                    orderBy: {
                        sequence: "asc",
                    },
                },
            },
        });
    };

export const createEvaluation = async (
    data: Prisma.EvaluationUncheckedCreateInput
) => {
    return prisma.evaluation.create({
        data,
    });
};

export const updateEvaluation = async (
    id: string,
    data: Prisma.EvaluationUpdateInput
) => {
    return prisma.evaluation.update({
        where: { id },
        data,
    });
};

export const createJudgeExecutions = async (
    data: Prisma.JudgeExecutionCreateManyInput[]
) => {
    return prisma.judgeExecution.createMany({
        data,
    });
};