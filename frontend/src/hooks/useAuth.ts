import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../stores/auth.store";
import {
  loginApi,
  logoutApi,
  registerApi,
  getMeApi,
  refreshApi,
  type LoginInput,
  type RegisterInput,
} from "../services/auth.service";

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const authKeys = {
  me: ["auth", "me"] as const,
};

// ─── useCurrentUser ───────────────────────────────────────────────────────────
// Fetches the currently authenticated user from the backend (via cookie).

export const useCurrentUser = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  const query = useQuery({
    queryKey: authKeys.me,
    queryFn: async () => {
      const res = await getMeApi();
      setUser(res.data.user);
      return res.data.user;
    },
    enabled: true, // Always verify session with backend on mount
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // TanStack Query v5: handle errors outside useQuery options
  useEffect(() => {
    if (query.isError) {
      clearUser();
    }
  }, [query.isError, clearUser]);

  return query;
};

// ─── useLogin ─────────────────────────────────────────────────────────────────

export const useLogin = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginInput) => loginApi(input),
    onSuccess: (data) => {
      setUser(data.data.user);
      queryClient.setQueryData(authKeys.me, data.data.user);
      toast.success("Welcome back!");
      navigate("/");
    },
    onError: (error: Error) => {
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ??
        error.message ??
        "Login failed. Please check your credentials.";
      toast.error(message);
    },
  });
};

// ─── useRegister ──────────────────────────────────────────────────────────────

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: RegisterInput) => registerApi(input),
    onSuccess: () => {
      toast.success("Account created! Please sign in.");
      navigate("/login");
    },
    onError: (error: Error) => {
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ??
        error.message ??
        "Registration failed. Please try again.";
      toast.error(message);
    },
  });
};

// ─── useLogout ────────────────────────────────────────────────────────────────

export const useLogout = () => {
  const clearUser = useAuthStore((s) => s.clearUser);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      clearUser();
      queryClient.clear();
      toast.success("Signed out successfully.");
      navigate("/login");
    },
    onError: () => {
      // Force clear even on error
      clearUser();
      queryClient.clear();
      navigate("/login");
    },
  });
};

// ─── useRefresh ───────────────────────────────────────────────────────────────

export const useRefresh = () => {
  return useMutation({
    mutationFn: refreshApi,
    onSuccess: () => {
      toast.success("Session refreshed successfully.");
    },
    onError: (error: Error) => {
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ??
        error.message ??
        "Failed to refresh session.";
      toast.error(message);
    },
  });
};
