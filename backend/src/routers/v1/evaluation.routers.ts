import {
    Router,
} from "express";

import {
    evaluateConversationController
} from "../../modules/evaluations/evaluation.controller.js";

import {
    authenticate,
} from "../../middleware/auth.middleware.js";

const router = Router();

router.post(
    "/",
    authenticate,
    evaluateConversationController
);

export default router;