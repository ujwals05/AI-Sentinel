import type { Request, Response } from "express";
import { registerUser, loginUser, refreshUserAccessToken } from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.schema.js";
import { setAuthCookies, clearAuthCookies } from "./auth.util.js";
import { sendSuccess, sendError } from "../../utils/response.js";

export const register = async (req: Request, res: Response) => {
    try {
        const parsed = registerSchema.safeParse(req.body);

        if (!parsed.success) {
            return sendError(
                res,
                "Validation failed",
                400,
                parsed.error.flatten()
            );
        }

        const user = await registerUser(parsed.data);

        return sendSuccess(
            res,
            user,
            "User registered successfully",
            201
        );
    } catch (error) {
        console.error("Register Error:", error);

        return sendError(
            res,
            error instanceof Error
                ? error.message
                : "Registration failed",
            400
        );
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const parsed =
            loginSchema.safeParse(req.body);

        if (!parsed.success) {
            return sendError(
                res,
                "Validation failed",
                400,
                parsed.error.flatten()
            );
        }

        const result =
            await loginUser(parsed.data);

        setAuthCookies(
            res,
            result.tokens.accessToken,
            result.tokens.refreshToken
        );

        return sendSuccess(
            res,
            {
                user: result.user,
            },
            "Login successful"
        );
    } catch (error) {
        console.error("Login Error:", error);

        return sendError(
            res,
            error instanceof Error
                ? error.message
                : "Login failed",
            401
        );
    }
}

export const logout = async (req: Request, res: Response) => {
    try {

        clearAuthCookies(res);
        return sendSuccess(
            res,
            null,
            "Logout successful"
        );
    } catch (error) {
        console.error("Logout Error:", error);

        return sendError(
            res,
            error instanceof Error
                ? error.message
                : "Logout failed",
            500
        );
    }
}

export const getCurrentUser = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return sendError(
                res,
                "Unauthorized",
                401
            );
        }

        return sendSuccess(
            res,
            {
                user: req.user,
            },
            "User fetched successfully"
        );

    } catch (error) {
        return sendError(
            res,
            "Failed to fetch user",
            500
        );
    }
};

export const refreshTokens = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return sendError(
                res,
                "Refresh token is missing",
                401
            );
        }
        const result = await refreshUserAccessToken(refreshToken);

        setAuthCookies(
            res,
            result.accessToken,
            result.refreshToken
        );

        return sendSuccess(
            res,
            null,
            "Access token refreshed"
        );

    } catch (error) {
        console.error("Refresh Token Error:", error);

        clearAuthCookies(res);

        return sendError(
            res,
            "Invalid or expired refresh token",
            401
        );
    }
}
