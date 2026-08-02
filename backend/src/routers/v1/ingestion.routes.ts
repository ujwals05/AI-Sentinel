import { Router } from "express";
import { verifyApiKey } from "../../middleware/api-keys.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { ingestController } from "../../modules/ingestion/ingestion.controller.js";
import { ingestionSchema } from "../../modules/ingestion/ingestion.schema.js";

const router = Router();

router.post("/", verifyApiKey, validate(ingestionSchema), ingestController);

export default router;