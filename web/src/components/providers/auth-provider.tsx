"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { authAPI, clearTokens, setAccessToken } from "@/lib/api";
import type { AuthUser } from "@/lib/types";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; emailNotVerified?: boolean }>;
  register: (email: string, password: string) => Promise<{ success: boolean; needsVerification?: boolean; error?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean }>;
  resetPassword: (body: Record<string, string>) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const restoring = useRef(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user_info");
    const accessToken = localStorage.getItem("access_token");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        /* ignore */
      }
    }
    if (accessToken) {
      setAccessToken(accessToken);
      setIsAuthenticated(true);
    }
    restoreSession(!!accessToken);
  }, []);

  const restoreSession = async (background = false) => {
    if (restoring.current && !background) return;
    restoring.current = true;
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        setIsLoading(false);
        return;
      }
      const response = await fetch("/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        setIsAuthenticated(true);
        if (!background) {
          try {
            const me = await authAPI.getMe();
            const fullUser = { email: me.email, id: me.id, authenticated: true };
            setUser(fullUser);
            localStorage.setItem("user_info", JSON.stringify(fullUser));
          } catch {
            setUser({ authenticated: true });
          }
        }
      } else {
        clearTokens();
        setIsAuthenticated(false);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
      restoring.current = false;
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await authAPI.login(email, password);
      setIsAuthenticated(true);
      const userInfo: AuthUser = {
        email: data.user?.email || email,
        id: data.user?.id,
        authenticated: true,
      };
      setUser(userInfo);
      localStorage.setItem("user_info", JSON.stringify(userInfo));
      return { success: true };
    } catch (err) {
      const status = (err as { status?: number }).status;
      const detail = (err as { detail?: string }).detail || "Login failed";
      if (status === 403) {
        setError("Veuillez vérifier votre email avant de vous connecter.");
        return { success: false, error: detail, emailNotVerified: true };
      }
      setError(String(detail));
      return { success: false, error: String(detail) };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await authAPI.register(email, password);
      return { success: true, needsVerification: true };
    } catch (err) {
      const detail = (err as { detail?: string }).detail || "Registration failed";
      setError(String(detail));
      return { success: false, error: String(detail) };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch {
      /* ignore */
    }
    clearTokens();
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    setError(null);
    try {
      await authAPI.forgotPassword(email);
    } catch {
      /* prevent enumeration */
    }
    return { success: true };
  }, []);

  const resetPassword = useCallback(async (body: Record<string, string>) => {
    setError(null);
    try {
      await authAPI.resetPassword(body);
      return { success: true };
    } catch (err) {
      const detail = (err as { detail?: string }).detail || "Password reset failed";
      setError(String(detail));
      return { success: false, error: String(detail) };
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    setError(null);
    try {
      await authAPI.deleteAccount();
      await logout();
      return { success: true };
    } catch (err) {
      const detail = (err as { detail?: string }).detail || "Account deletion failed";
      setError(String(detail));
      return { success: false, error: String(detail) };
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        deleteAccount,
        clearError: () => setError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
