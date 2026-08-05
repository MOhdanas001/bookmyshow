import axios, { AxiosError, type AxiosInstance } from "axios";

// Centralized Axios instance for the Spring Boot REST API.
// Base URL is read from an env var so the same code works across
// local, staging, and production backends without changes.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Attach auth token (JWT) if present. Swap for your real auth storage later.
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("bms_admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Normalize response data if wrapped in Spring Boot ApiResponse<T>
apiClient.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      typeof response.data === "object" &&
      "success" in response.data &&
      "data" in response.data
    ) {
      response.data = response.data.data;
    }
    return response;
  },
  (error: AxiosError<{ message?: string; errors?: Record<string, string> }>) => {
    const status = error.response?.status ?? 500;
    const message =
      error.response?.data?.message ?? error.message ?? "Something went wrong";
    return Promise.reject({
      status,
      message,
      errors: error.response?.data?.errors,
    });
  }
);

export default apiClient;
