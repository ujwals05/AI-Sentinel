import { Router } from "express";

import {
    listApplicationConversationsController,
    getConversationController,
} from "../../modules/conversations/conversation.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.get(
    "/applications/:applicationId/conversations",
    authenticate,
    listApplicationConversationsController
);

router.get(
    "/conversations/:conversationId",
    authenticate,
    getConversationController
);

export default router;