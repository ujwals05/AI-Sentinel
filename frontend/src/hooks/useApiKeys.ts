import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  listApiKeysApi,
  createApiKeyApi,
  revokeApiKeyApi,
  type CreateApiKeyInput,
} from "../services/api.service";

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const apiKeyKeys = {
  list: (appId: string) => ["api-keys", appId] as const,
};

// ─── useApiKeys ──────────────────────────────────────────────────────────────

export const useApiKeys = (applicationId: string | undefined) => {
  return useQuery({
    queryKey: apiKeyKeys.list(applicationId ?? ""),
    queryFn: async () => {
      const res = await listApiKeysApi(applicationId!);
      return res.data.apiKeys;
    },
    enabled: !!applicationId,
  });
};

// ─── useCreateApiKey ─────────────────────────────────────────────────────────

export const useCreateApiKey = (applicationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateApiKeyInput) => createApiKeyApi(applicationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.list(applicationId) });
      toast.success("API key generated!");
    },
    onError: (error: Error) => {
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ??
        error.message ??
        "Failed to generate API key.";
      toast.error(message);
    },
  });
};

// ─── useRevokeApiKey ─────────────────────────────────────────────────────────

export const useRevokeApiKey = (applicationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (apiKeyId: string) => revokeApiKeyApi(applicationId, apiKeyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.list(applicationId) });
      toast.success("API key revoked.");
    },
    onError: (error: Error) => {
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ??
        error.message ??
        "Failed to revoke API key.";
      toast.error(message);
    },
  });
};
