import type {
    Request,
    Response,
} from "express";

import {
    evaluateConversation,
} from "./evaluation.service.js";

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