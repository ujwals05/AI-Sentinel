import { prisma } from "../../lib/prisma.js"
// import type { Prisma } from "../../generated/prisma/index.js";
import type { Prisma } from "../../generated/prisma/client.js";

export interface ListEvaluationsFilter {
    applicationId?: string;
    status?: string;
    page?: number;
    limit?: number;
}

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

export const listEvaluations = async (
    userId: string,
    filter: ListEvaluationsFilter = {}
) => {
    const { applicationId, status, page = 1, limit = 20 } = filter;
    const skip = (page - 1) * limit;

    const where: Prisma.EvaluationWhereInput = {
        application: { userId },
        ...(applicationId ? { applicationId } : {}),
        ...(status ? { status: status as any } : {}),
    };

    const [evaluations, total] = await Promise.all([
        prisma.evaluation.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                application: { select: { id: true, name: true } },
                conversation: { select: { id: true, externalId: true, title: true } },
                judgeExecutions: true,
            },
        }),
        prisma.evaluation.count({ where }),
    ]);

    return {
        evaluations,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const findEvaluationById = async (id: string, userId: string) => {
    return prisma.evaluation.findFirst({
        where: {
            id,
            application: { userId },
        },
        include: {
            application: { select: { id: true, name: true } },
            conversation: { select: { id: true, externalId: true, title: true } },
            judgeExecutions: true,
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