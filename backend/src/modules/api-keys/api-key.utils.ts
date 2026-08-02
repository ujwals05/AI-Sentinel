import crypto from "crypto";

const API_KEY_PREFIX = "sk_live_";

const RANDOM_BYTES = 32;

export const generateApiKey = (): string => {
    const randomPart = crypto
        .randomBytes(RANDOM_BYTES)
        .toString("hex");

    return `${API_KEY_PREFIX}${randomPart}`;
};


export const getApiKeyPrefix = (apiKey: string): string => {
    return apiKey.slice(0, 16);
};


export const hashApiKey = (apiKey: string): string => {
    return crypto
        .createHash("sha256")
        .update(apiKey)
        .digest("hex");
};


export const verifyApiKeyHash = (apiKey: string, storedHash: string): boolean => {
    const incomingHash = hashApiKey(apiKey);

    const incomingBuffer = Buffer.from(incomingHash, "hex");

    const storedBuffer = Buffer.from(storedHash, "hex");

    if (incomingBuffer.length !== storedBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(incomingBuffer, storedBuffer);
};