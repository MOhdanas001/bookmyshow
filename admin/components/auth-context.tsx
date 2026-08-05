"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authService, type LoginCredentials } from "@/services/auth.service";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedToken = authService.getToken();
    setToken(storedToken);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const authenticated = Boolean(token);
    const isLoginPage = pathname === "/login";

    if (!authenticated && !isLoginPage) {
      router.replace("/login");
    } else if (authenticated && isLoginPage) {
      router.replace("/dashboard");
    }
  }, [token, isLoading, pathname, router]);

  const login = async (credentials: LoginCredentials) => {
    const receivedToken = await authService.login(credentials);
    setToken(receivedToken);
    router.replace("/dashboard");
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: Boolean(token),
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
