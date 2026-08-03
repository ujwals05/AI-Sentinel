import {
    Router,
} from "express";

import {
    evaluateConversationController,
    listEvaluationsController,
    getEvaluationController,
} from "../../modules/evaluations/evaluation.controller.js";

import {
    authenticate,
} from "../../middleware/auth.middleware.js";

const router = Router();

// Trigger evaluation for a conversation
router.post(
    "/",
    authenticate,
    evaluateConversationController
);

// List evaluations (with optional ?applicationId=&status=&page=&limit=)
router.get(
    "/",
    authenticate,
    listEvaluationsController
);

// Get a single evaluation by ID
router.get(
    "/:evaluationId",
    authenticate,
    getEvaluationController
);

export default router;