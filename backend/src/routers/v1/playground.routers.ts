import { Router } from "express";

import { evaluatePlaygroundController } from "../../modules/playground/playground.controller.js";
import {
    validate,
} from "../../middleware/validation.middleware.js";

import { playgroundEvaluationSchema } from "../../modules/playground/playground.schema.js";
import {
    authenticate,
} from "../../middleware/auth.middleware.js";

const router = Router();

router.post(
    "/evaluate",
    authenticate,
    validate(playgroundEvaluationSchema),
    evaluatePlaygroundController
);

export default router;