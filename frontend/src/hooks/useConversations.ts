import { useQuery } from "@tanstack/react-query";
import {
  getConversationsApi,
  getConversationApi,
  type ConversationListQuery,
} from "../services/api.service";

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const conversationKeys = {
  list: (appId: string, query?: ConversationListQuery) =>
    ["conversations", appId, query ?? {}] as const,
  detail: (id: string) => ["conversations", "detail", id] as const,
};

// ─── useConversations ────────────────────────────────────────────────────────

export const useConversations = (
  applicationId: string | undefined,
  query?: ConversationListQuery
) => {
  return useQuery({
    queryKey: conversationKeys.list(applicationId ?? "", query),
    queryFn: async () => {
      const res = await getConversationsApi(applicationId!, query);
      return res.data;
    },
    enabled: !!applicationId,
  });
};

// ─── useConversation ─────────────────────────────────────────────────────────

export const useConversation = (conversationId: string | undefined) => {
  return useQuery({
    queryKey: conversationKeys.detail(conversationId ?? ""),
    queryFn: async () => {
      const res = await getConversationApi(conversationId!);
      return res.data;
    },
    enabled: !!conversationId,
  });
};
