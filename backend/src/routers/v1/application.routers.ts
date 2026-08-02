import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";

import { createApplicationController, getApplicationController, getApplicationsController, updateApplicationController, deleteApplicationController } from "../../modules/applications/application.controllers.js";

const router = Router();
router.use(authenticate);
router.post("/", createApplicationController);
router.get("/", getApplicationsController);
router.get("/:applicationId", getApplicationController);
router.patch("/:applicationId", updateApplicationController);
router.delete("/:applicationId", deleteApplicationController);

export default router;