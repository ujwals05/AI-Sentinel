import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  evaluatePlaygroundApi,
  type PlaygroundEvaluationResponse,
} from "../services/api.service";
import type { PlaygroundEvaluationRequest, ApiResponse } from "../types";

// ─── useEvaluatePlayground ───────────────────────────────────────────────────

export const useEvaluatePlayground = () => {
  return useMutation({
    mutationFn: async (
      input: PlaygroundEvaluationRequest
    ): Promise<ApiResponse<PlaygroundEvaluationResponse>> => {
      return evaluatePlaygroundApi(input);
    },
    onError: (error: Error) => {
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ??
        error.message ??
        "Evaluation failed. Please try again.";
      toast.error(message);
    },
  });
};
