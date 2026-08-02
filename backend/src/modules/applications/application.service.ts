import { ApiError } from "../../utils/apiError.js";

import {
    createApplication as createApplicationRepository, findApplicationsByUserId,
    findApplicationById,
    updateApplication as updateApplicationRepository,
    deactivateApplication as deactivateApplicationRepository,
} from "./application.repository.js";

import type { CreateApplicationInput, UpdateApplicationInput } from "./application.types.js";

export const createApplication = async (userId: string, data: CreateApplicationInput) => {
    const application = await createApplicationRepository(userId, data);
    return application;
};
export const getApplications = async (userId: string) => {
    return findApplicationsByUserId(userId);
};

export const getApplication = async (applicationId: string, userId: string) => {
    const application = await findApplicationById(applicationId, userId);

    if (!application) {
        throw new ApiError(
            404,
            "Application not found"
        );
    }

    return application;
};

export const updateApplication = async (
    applicationId: string,
    userId: string,
    data: UpdateApplicationInput
) => {
    const application = await findApplicationById(applicationId, userId);

    if (!application) {
        throw new ApiError(
            404,
            "Application not found"
        );
    }

    const updatedApplication = await updateApplicationRepository(applicationId, userId, data);

    if (updatedApplication.count === 0) {
        throw new ApiError(
            500,
            "Failed to update application"
        );
    }

    return findApplicationById(applicationId, userId);
};

export const deactivateApplication = async (applicationId: string, userId: string) => {
    const application = await findApplicationById(applicationId, userId);

    if (!application) {
        throw new ApiError(
            404,
            "Application not found"
        );
    }

    const result =await deactivateApplicationRepository(applicationId,userId);

    if (result.count === 0) {
        throw new ApiError(
            500,
            "Failed to deactivate application"
        );
    }

    return {
        id: applicationId,
    };
};