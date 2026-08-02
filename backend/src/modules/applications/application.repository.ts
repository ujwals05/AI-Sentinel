import { ApplicationEnvironment, ApplicationStatus } from "../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";

import type {
    CreateApplicationInput,
    UpdateApplicationInput,
} from "./application.types.js";


export const createApplication = async (userId: string, data: CreateApplicationInput) => {
    return prisma.application.create({
        data: {
            userId,
            name: data.name,
            description: data.description ?? null,
            type: data.type,
            environment: data.environment ?? ApplicationEnvironment.DEVELOPMENT,
        },
    });
};

export const findApplicationsByUserId = async (userId: string) => {
    return prisma.application.findMany({
        where: {
            userId,
            status: ApplicationStatus.ACTIVE,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const findApplicationById = async (applicationId: string, userId: string) => {
    return prisma.application.findFirst({
        where: {
            id: applicationId,
            userId,
            status: ApplicationStatus.ACTIVE,
        },
    });
};

export const updateApplication = async (
    applicationId: string,
    userId: string,
    data: UpdateApplicationInput
) => {
    const updateData = {
        ...(data.name !== undefined && {
            name: data.name,
        }),

        ...(data.description !== undefined && {
            description: data.description,
        }),

        ...(data.type !== undefined && {
            type: data.type,
        }),

        ...(data.environment !== undefined && {
            environment: data.environment,
        }),
    };

    return prisma.application.updateMany({
        where: {
            id: applicationId,
            userId,
            status: ApplicationStatus.ACTIVE,
        },
        data: updateData,
    });
};

export const deactivateApplication = async (applicationId: string, userId: string) => {
    return prisma.application.updateMany({
        where: {
            id: applicationId,
            userId,
            status: ApplicationStatus.ACTIVE,
        },
        data: {
            status: ApplicationStatus.INACTIVE,
        },
    });
};