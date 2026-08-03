import type {
    Request,
    Response,
    NextFunction,
} from "express";

import { evaluatePlaygroundResponse } from "./playground.service.js";

import {
    sendSuccess,
} from "../../utils/response.js";

export const evaluatePlaygroundController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const result = await evaluatePlaygroundResponse(req.body);

        return sendSuccess(
            res,
            result,
            "Playground evaluation completed successfully",
            200
        );

    } catch (error) {
        next(error);
    }
};