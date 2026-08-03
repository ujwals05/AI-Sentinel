import api from "../lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    role: string;
  };
}

// ─── API Calls ────────────────────────────────────────────────────────────────

export const registerApi = async (input: RegisterInput): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>("/api/v1/auth/register", input);
  return response.data;
};

export const loginApi = async (input: LoginInput): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/v1/auth/login", input);
  return response.data;
};

export const logoutApi = async (): Promise<void> => {
  await api.post("/api/v1/auth/logout");
};

export const getMeApi = async (): Promise<AuthResponse> => {
  const response = await api.get<AuthResponse>("/api/v1/auth/me");
  return response.data;
};

export const refreshApi = async (): Promise<void> => {
  await api.post("/api/v1/auth/refresh-token");
};
