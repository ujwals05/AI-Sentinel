import { Router } from "express";

import { register, login, refreshTokens, logout, getCurrentUser } from "../../modules/auth/auth.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();


router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshTokens);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getCurrentUser);

export default router;