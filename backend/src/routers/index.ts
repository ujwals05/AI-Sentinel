import { Router } from "express";
import healthRouter from "./v1/health.routers.js";
import authRouter from "./v1/auth.routers.js";
import applicationRouter from "./v1/application.routers.js"
import apiKeyRouter from "./v1/api-key.routers.js";
import ingestRouter from "./v1/ingestion.routes.js"
import evaluationRouter from "./v1/evaluation.routers.js";
import conversationRouter from "./v1/conversation.routes.js";
import playgroundRouter from "./v1/playground.routers.js";

const router = Router();

router.use("/v1/health", healthRouter);
router.use("/v1/auth", authRouter);
router.use("/v1/applications", applicationRouter);
router.use("/v1/applications/:applicationId/api-keys", apiKeyRouter);
router.use("/v1/ingest", ingestRouter)
router.use("/v1/evaluations", evaluationRouter)
router.use("/v1", conversationRouter);
router.use("/v1/playground", playgroundRouter);

export default router;