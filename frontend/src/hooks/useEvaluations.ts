import { useQuery } from "@tanstack/react-query";
import {
  getEvaluationsApi,
  getEvaluationApi,
  type EvaluationListQuery,
} from "../services/api.service";

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const evaluationKeys = {
  all: ["evaluations"] as const,
  list: (query?: EvaluationListQuery) => ["evaluations", "list", query] as const,
  detail: (id: string) => ["evaluations", "detail", id] as const,
};

// ─── useEvaluations ──────────────────────────────────────────────────────────

export const useEvaluations = (query?: EvaluationListQuery) => {
  return useQuery({
    queryKey: evaluationKeys.list(query),
    queryFn: async () => {
      const res = await getEvaluationsApi(query);
      return res.data;
    },
  });
};

// ─── useEvaluation ───────────────────────────────────────────────────────────

export const useEvaluation = (id: string | undefined) => {
  return useQuery({
    queryKey: evaluationKeys.detail(id ?? ""),
    queryFn: async () => {
      const res = await getEvaluationApi(id!);
      return res.data.evaluation;
    },
    enabled: !!id,
  });
};
