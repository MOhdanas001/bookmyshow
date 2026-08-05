import apiClient from "@/lib/api-client";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokenResponse {
  token: string;
}

const TOKEN_KEY = "bms_admin_token";

export const authService = {
  async login(credentials: LoginCredentials): Promise<string> {
    const { data } = await apiClient.post<AuthTokenResponse>("/auth/login", credentials);
    const token = data?.token;
    if (!token) {
      throw new Error("No token received from server");
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
    }
    return token;
  },

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  },
};
