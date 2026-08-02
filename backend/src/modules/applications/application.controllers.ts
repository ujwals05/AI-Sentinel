import type { Request, Response, NextFunction } from "express";

import { sendSuccess, sendError } from "../../utils/response.js";

import { createApplicationSchema, updateApplicationSchema, applicationIdSchema } from "./application.schema.js";

import {
    createApplication,
    getApplications,
    getApplication,
    updateApplication,
    deactivateApplication,
} from "./application.service.js";

export const createApplicationController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const parsed = createApplicationSchema.safeParse(req.body);

        if (!parsed.success) {
            return sendError(
                res,
                "Validation failed",
                400,
                parsed.error.flatten()
            );
        }

        const userId = req.user?.id;

        if (!userId) {
            return sendError(
                res,
                "Unauthorized",
                401
            );
        }

        const application = await createApplication(userId, parsed.data);

        return sendSuccess(
            res,
            { application },
            "Application created successfully",
            201
        );

    } catch (error) {
        next(error);
    }
};

export const getApplicationsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return sendError(
                res,
                "Unauthorized",
                401
            );
        }

        const applications = await getApplications(userId);

        return sendSuccess(
            res,
            { applications },
            "Applications fetched successfully"
        );

    } catch (error) {
        next(error);
    }
};

export const getApplicationController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return sendError(
                res,
                "Unauthorized",
                401
            );
        }

        const parsedParams = applicationIdSchema.safeParse(req.params);

        if (!parsedParams.success) {
            return sendError(
                res,
                "Invalid application ID",
                400,
                parsedParams.error.flatten()
            );
        }

        const { applicationId, } = parsedParams.data;

        const application = await getApplication(applicationId, userId);

        return sendSuccess(
            res,
            { application },
            "Application fetched successfully"
        );

    } catch (error) {
        next(error);
    }
};

export const updateApplicationController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return sendError(
                res,
                "Unauthorized",
                401
            );
        }

        const parsedParams =
            applicationIdSchema.safeParse(
                req.params
            );

        if (!parsedParams.success) {
            return sendError(
                res,
                "Invalid application ID",
                400,
                parsedParams.error.flatten()
            );
        }

        const {
            applicationId,
        } = parsedParams.data;

        const parsedBody =
            updateApplicationSchema.safeParse(
                req.body
            );

        if (!parsedBody.success) {
            return sendError(
                res,
                "Validation failed",
                400,
                parsedBody.error.flatten()
            );
        }

        const application =
            await updateApplication(
                applicationId,
                userId,
                parsedBody.data
            );

        return sendSuccess(
            res,
            { application },
            "Application updated successfully"
        );

    } catch (error) {
        next(error);
    }
};

export const deleteApplicationController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return sendError(
                res,
                "Unauthorized",
                401
            );
        }

        const parsedParams =
            applicationIdSchema.safeParse(
                req.params
            );

        if (!parsedParams.success) {
            return sendError(
                res,
                "Invalid application ID",
                400,
                parsedParams.error.flatten()
            );
        }

        const {
            applicationId,
        } = parsedParams.data;

        await deactivateApplication(
            applicationId,
            userId
        );

        return sendSuccess(
            res,
            null,
            "Application deactivated successfully"
        );

    } catch (error) {
        next(error);
    }
};