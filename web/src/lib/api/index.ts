import { apiFetch, setAccessToken } from "./client";

export { apiFetch, clearTokens, getAccessToken, setAccessToken } from "./client";
import type {
  AIModel,
  LoginResponse,
  PromptHistoryItem,
  PromptResponse,
  UserStats,
} from "@/lib/types";

export const authAPI = {
  register: (email: string, password: string) =>
    apiFetch<{ message: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  login: async (email: string, password: string) => {
    const data = await apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setAccessToken(data.access_token);
    if (typeof window !== "undefined") {
      localStorage.setItem("refresh_token", data.refresh_token);
    }
    return data;
  },

  logout: () =>
    apiFetch<{ message: string }>("/auth/logout", { method: "POST" }),

  forgotPassword: (email: string) =>
    apiFetch<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (body: Record<string, string>) =>
    apiFetch<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getMe: () => apiFetch<{ email: string; id: string }>("/auth/me"),

  deleteAccount: () =>
    apiFetch<{ message: string }>("/auth/me", { method: "DELETE" }),
};

export const promptAPI = {
  generate: (inputText: string, targetModel: string) =>
    apiFetch<PromptResponse>("/api/generate", {
      method: "POST",
      body: JSON.stringify({ input_text: inputText, target_model: targetModel }),
    }),

  getHistory: (skip = 0, limit = 100) =>
    apiFetch<PromptHistoryItem[]>(`/api/history?skip=${skip}&limit=${limit}`),

  getStats: () => apiFetch<UserStats>("/api/stats"),
};

export const modelsAPI = {
  getAll: () => apiFetch<AIModel[]>("/api/models"),
};

export const healthAPI = {
  check: () => apiFetch<{ status: string }>("/health"),
};
