import { findUserByEmail, findUserById, createUser } from "./auth.repository.js";
import { hashedPassword, comparePassword } from "../../utils/hash.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";

import type {
    RegisterInput,
    LoginInput,
    AuthResponse,
} from "./auth.types.js";


export const registerUser = async (input: RegisterInput) => {
    const { name, email, password } = input;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new Error(
            "User with this email already exists"
        );
    }

    const passwordHash = await hashedPassword(password);

    const user = await createUser(name, email, passwordHash);

    return {
        id: user.id,
        email: user.email,
        role: user.role,
    };
};

export const loginUser = async (input: LoginInput) => {
    const { email, password } = input;

    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };

    const accessToken =
        signAccessToken(payload);

    const refreshToken =
        signRefreshToken(payload);

    return {
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        tokens: {
            accessToken,
            refreshToken,
        },
    };
};

export const refreshUserAccessToken = async (refreshToken: string) => {
    const decoded = verifyRefreshToken(refreshToken);

    const user = await findUserById(decoded.userId);

    if (!user) {
        throw new Error("User no longer exists");
    }

    const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };

    const newAccessToken = signAccessToken(payload);

    const newRefreshToken = signRefreshToken(payload);

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
};