import type {
    Request,
    Response,
} from "express";

import {
    getApplicationConversations,
    getConversationById,
} from "./conversation.service.js";

import { sendSuccess } from "../../utils/response.js";

export const listApplicationConversationsController =
    async (
        req: Request,
        res: Response
    ) => {

        const {
            applicationId,
        } = req.params;

        // Validate applicationId
        if (typeof applicationId !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid application ID",
            });
        }

        const result =
            await getApplicationConversations(
                applicationId,
                {
                    page: Number(req.query.page) || 1,
                    limit: Number(req.query.limit) || 20,

                    ...(typeof req.query.status === "string" && {
                        status: req.query.status,
                    }),

                    ...(typeof req.query.search === "string" && {
                        search: req.query.search,
                    }),
                }
            );
        return sendSuccess(
            res,
            result,
            "Conversations fetched successfully"
        );
    };


export const getConversationController =
    async (
        req: Request,
        res: Response
    ) => {

        const {
            conversationId,
        } = req.params;

        // Validate conversationId
        if (typeof conversationId !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid conversation ID",
            });
        }

        const conversation =
            await getConversationById(
                conversationId
            );

        return sendSuccess(
            res,
            conversation,
            "Conversation fetched successfully"
        );
    };