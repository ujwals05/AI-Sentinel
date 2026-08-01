import type { Request, Response, NextFunction } from "express";

import { verifyAccessToken } from "../utils/jwt.js";

import { sendError } from "../utils/response.js";

import { findUserById } from "../modules/auth/auth.repository.js";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            return sendError(
                res,
                "Unauthorized: No access token",
                401
            );
        }

        let decoded;

        try {
            decoded = verifyAccessToken(token);
        } catch (error) {
            return sendError(
                res,
                "Unauthorized: Invalid or expired access token",
                401
            );
        }

        // Find user in database
        const user = await findUserById(decoded.userId);

        if (!user) {
            return sendError(
                res,
                "Unauthorized: User not found",
                401
            );
        }

        // Attach authenticated user to request
        req.user = {
            name: user.name,
            id: user.id,
            email: user.email,
            role: user.role,
        };

        // Continue request
        next();

    } catch (error) {
        console.error(
            "Authentication middleware error:",
            error
        );

        return sendError(
            res,
            "Internal server error",
            500
        );
    }
}