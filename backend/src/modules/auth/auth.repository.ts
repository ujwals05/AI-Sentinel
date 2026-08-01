import { prisma } from "../../lib/prisma.js";

export const findUserByEmail = async (email: string) => {
    const user = prisma.user.findUnique({
        where: {
            email,
        },
    });
    return user;
}

export const findUserById = async (userId: string) => {
    const user = prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });
    return user;
}

export const createUser = async (name: string, email: string, passwordHash: string) => {
    return prisma.user.create({
        data: {
            email,
            passwordHash,
            name,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });
};