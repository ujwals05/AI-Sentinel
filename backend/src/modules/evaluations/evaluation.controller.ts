import type {
    Request,
    Response,
} from "express";

import {
    evaluateConversation,
} from "./evaluation.service.js";

import {
    listEvaluations,
    findEvaluationById,
    type ListEvaluationsFilter,
} from "./evaluation.repository.js";

import {
    sendSuccess,
    sendError,
} from "../../utils/response.js";

export const evaluateConversationController =
    async (
        req: Request,
        res: Response
    ) => {

        try {

            const {
                conversationId,
            } = req.body;

            const result =
                await evaluateConversation(
                    conversationId
                );

            return sendSuccess(
                res,
                result,
                "Evaluation completed successfully",
                200
            );

        } catch (error) {

            console.error(
                "Evaluation error:",
                error
            );

            return sendError(
                res,
                error instanceof Error
                    ? error.message
                    : "Evaluation failed",
                500
            );
        }
    };

export const listEvaluationsController = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return sendError(res, "Unauthorized", 401);
        }

        const filter: ListEvaluationsFilter = {
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 20,
            ...(req.query.applicationId ? { applicationId: req.query.applicationId as string } : {}),
            ...(req.query.status ? { status: req.query.status as string } : {}),
        };

        const result = await listEvaluations(userId, filter);

        return sendSuccess(res, result, "Evaluations fetched successfully");
    } catch (error) {
        console.error("List evaluations error:", error);
        return sendError(
            res,
            error instanceof Error ? error.message : "Failed to fetch evaluations",
            500
        );
    }
};

export const getEvaluationController = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return sendError(res, "Unauthorized", 401);
        }

        const { evaluationId } = req.params;

        if (!evaluationId) {
            return sendError(res, "Invalid evaluation ID", 400);
        }

        const evaluation = await findEvaluationById(String(evaluationId), userId);

        if (!evaluation) {
            return sendError(res, "Evaluation not found", 404);
        }

        return sendSuccess(res, { evaluation }, "Evaluation fetched successfully");
    } catch (error) {
        console.error("Get evaluation error:", error);
        return sendError(
            res,
            error instanceof Error ? error.message : "Failed to fetch evaluation",
            500
        );
    }
};