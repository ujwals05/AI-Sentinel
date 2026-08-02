import type {
    Request,
    Response,
    NextFunction,
} from "express";

import { ingestInteraction, } from "./ingestion.service.js";

import { sendSuccess, } from "../../utils/response.js";

import { ApiError } from "../../utils/apiError.js";


export const ingestController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        /*
        |--------------------------------------------------------------------------
        | Application Context
        |--------------------------------------------------------------------------
        */

        if (!req.application) {
            throw new ApiError(
                401,
                "Application authentication context missing"
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Idempotency Key
        |--------------------------------------------------------------------------
        */

        const externalEventId = req.header("Idempotency-Key");


        if (!externalEventId) {
            throw new ApiError(
                400,
                "Idempotency-Key header is required"
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Ingestion
        |--------------------------------------------------------------------------
        */

        const result = await ingestInteraction(
            req.body,
            {
                applicationId:
                    req.application.id,
            },
            externalEventId
        );


        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        const statusCode =
            result.status === "DUPLICATE"
                ? 200
                : 201;


        return sendSuccess(
            res,
            result,
            result.status === "DUPLICATE"
                ? "Event already ingested"
                : "Interaction ingested successfully",
            statusCode
        );

    } catch (error) {

        next(error);

    }
};