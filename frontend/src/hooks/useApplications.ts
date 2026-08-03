import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getApplicationsApi,
  getApplicationApi,
  createApplicationApi,
  deleteApplicationApi,
  type CreateApplicationInput,
} from "../services/api.service";

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const applicationKeys = {
  all: ["applications"] as const,
  detail: (id: string) => ["applications", id] as const,
};

// ─── useApplications ─────────────────────────────────────────────────────────

export const useApplications = () => {
  return useQuery({
    queryKey: applicationKeys.all,
    queryFn: async () => {
      const res = await getApplicationsApi();
      return res.data.applications;
    },
  });
};

// ─── useApplication ──────────────────────────────────────────────────────────

export const useApplication = (id: string | undefined) => {
  return useQuery({
    queryKey: applicationKeys.detail(id ?? ""),
    queryFn: async () => {
      const res = await getApplicationApi(id!);
      // Backend returns { success, message, data: { application } }
      return (res.data as any).application ?? res.data;
    },
    enabled: !!id,
  });
};

// ─── useCreateApplication ────────────────────────────────────────────────────

export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateApplicationInput) => createApplicationApi(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
      toast.success(data.message || "Application created successfully!");
    },
    onError: (error: Error) => {
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ??
        error.message ??
        "Failed to create application.";
      toast.error(message);
    },
  });
};

// ─── useDeleteApplication ────────────────────────────────────────────────────

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteApplicationApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
      toast.success("Application deleted.");
    },
    onError: (error: Error) => {
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ??
        error.message ??
        "Failed to delete application.";
      toast.error(message);
    },
  });
};
