import type {
    Request,
    Response,
    NextFunction,
} from "express";

import { sendError } from "../utils/response.js";
import { ApiError } from "../utils/apiError.js";

export const errorMiddleware = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(
        `[ERROR] ${req.method} ${req.originalUrl}`,
        err
    );

    if (err instanceof ApiError) {
        return sendError(
            res,
            err.message,
            err.statusCode,
            err.errors
        );
    }

    return sendError(
        res,
        "Internal server error",
        500
    );
};