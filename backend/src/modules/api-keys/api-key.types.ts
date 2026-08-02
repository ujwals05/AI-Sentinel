export interface CreateApiKeyInput {
    name: string;
    expiresAt?: Date;
}

export interface ApiKeyResponse {
    id: string;
    applicationId: string;
    name: string;
    keyPrefix: string;
    lastUsedAt: Date | null;
    expiresAt: Date | null;
    revokedAt: Date | null;
    createdAt: Date;
}

export interface CreatedApiKeyResponse {
    apiKey: ApiKeyResponse;
    secret: string;
}