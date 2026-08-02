import { Router } from "express";


import { createApiKeyController, listApiKeysController, revokeApiKeyController } from "../../modules/api-keys/api-key.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router({
    mergeParams: true,
});
router.post(
    "/",
    authenticate,
    createApiKeyController
);


router.get(
    "/",
    authenticate,
    listApiKeysController
);


router.delete(
    "/:apiKeyId",
    authenticate,
    revokeApiKeyController
);

export default router;