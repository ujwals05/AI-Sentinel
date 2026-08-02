import type {
    Request,
    Response,
    NextFunction,
} from "express";

import type { ZodType } from "zod";

import { sendError } from "../utils/response.js";

export const validate = (schema: ZodType) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const result = schema.safeParse(req.body);

            if (!result.success) {
                return sendError(
                    res,
                    "Validation failed",
                    400,
                    result.error.flatten()
                );
            }

            // Replace body with parsed/sanitized data
            req.body = result.data;

            return next();

        } catch (error) {
            return next(error);
        }
    };
};