import { Router } from "express";
import healthRouter from "./v1/health.routes.js";
import authRouter from "./v1/auth.routers.js";
import applicationRouter from "./v1/application.routers.js"

const router = Router();

router.use("/v1/health", healthRouter);
router.use("/v1/auth", authRouter);
router.use("/v1/applications", applicationRouter);

export default router;