import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import { mockApiAdapter } from "@/services/api/mock-backend";
import { tokenStorage } from "@/services/api/token-storage";
import { sanitizeObject, containsSuspiciousContent } from "@/lib/security/sanitize";
import type { ApiEnvelope, ApiErrorPayload } from "@/types/domain.types";

export interface RequestConfig {
  auth?: boolean;
  skipRefresh?: boolean;
  timeoutMs?: number;
  params?: Record<string, string | number | boolean | undefined>;
}

type AxiosMetaConfig = InternalAxiosRequestConfig & {
  _auth?: boolean;
  _skipRefresh?: boolean;
  _retry?: boolean;
};

export class ApiClientError extends Error {
  status: number;
  code: string;
  details?: Record<string, unknown>;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = "ApiClientError";
    this.status = payload.status;
    this.code = payload.code;
    this.details = payload.details;
  }
}

let refreshHandler: (() => Promise<boolean>) | null = null;
let unauthorizedHandler: (() => void) | null = null;
let refreshPromise: Promise<boolean> | null = null;
let unauthorizedFired = false;

const toApiError = (error: unknown): ApiClientError => {
  if (error instanceof ApiClientError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const responsePayload = error.response?.data as ApiErrorPayload | undefined;
    return new ApiClientError(
      responsePayload ?? {
        status: error.response?.status ?? 500,
        code: error.code ?? "network_error",
        message: error.message || "Request failed.",
      }
    );
  }

  if (error instanceof Error) {
    return new ApiClientError({
      status: 500,
      code: "unknown",
      message: error.message,
    });
  }

  return new ApiClientError({
    status: 500,
    code: "unknown",
    message: "Unknown API error.",
  });
};

const buildAxiosConfig = (config?: RequestConfig): AxiosRequestConfig => {
  const axiosConfig: AxiosRequestConfig = {
    params: config?.params,
    timeout: config?.timeoutMs,
  };

  const metaConfig = axiosConfig as AxiosMetaConfig;
  metaConfig._auth = config?.auth;
  metaConfig._skipRefresh = config?.skipRefresh;

  return axiosConfig;
};

const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 8_000,
  adapter: env.mockApiEnabled ? mockApiAdapter : undefined,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const requestConfig = config as AxiosMetaConfig;

  // Auth-exempt routes (login, register, refresh) must be returned immediately
  // before sanitization — their payloads include passwords and tokens that must
  // not be transformed by stripHtmlTags (which would corrupt e.g. "P@ss<1>word").
  if (requestConfig._auth === false) {
    return requestConfig;
  }

  // Sanitize authenticated request bodies only
  if (requestConfig.data && typeof requestConfig.data === "object") {
    const hasSuspiciousContent = Object.values(requestConfig.data as Record<string, unknown>).some(
      (value) => typeof value === "string" && containsSuspiciousContent(value)
    );
    if (hasSuspiciousContent) {
      throw new ApiClientError({
        status: 400,
        code: "security_violation",
        message: "Request contains potentially dangerous content.",
      });
    }
    requestConfig.data = sanitizeObject(requestConfig.data as Record<string, unknown>);
  }

  // Sanitize URL parameters
  if (requestConfig.params) {
    requestConfig.params = sanitizeObject(requestConfig.params as Record<string, unknown>);
  }

  const accessToken = tokenStorage.getAccessToken();
  if (accessToken) {
    requestConfig.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return requestConfig;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosMetaConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      originalRequest._auth !== false &&
      !originalRequest._skipRefresh &&
      !originalRequest._retry &&
      refreshHandler
    ) {
      originalRequest._retry = true;

      // Deduplicate concurrent refresh requests
      if (!refreshPromise) {
        refreshPromise = refreshHandler().finally(() => {
          refreshPromise = null;
        });
      }

      const didRefresh = await refreshPromise;

      if (didRefresh) {
        const accessToken = tokenStorage.getAccessToken();
        if (accessToken) {
          originalRequest.headers.set("Authorization", `Bearer ${accessToken}`);
        }
        return apiClient.request(originalRequest);
      }

      // Refresh failed — clear session and signal the app before throwing.
      // Guard against multiple concurrent 401s each calling the handler.
      if (!unauthorizedFired) {
        unauthorizedFired = true;
        unauthorizedHandler?.();
      }
      throw toApiError(error);
    }

    throw toApiError(error);
  }
);

export const registerAuthHandlers = (handlers: {
  refresh: () => Promise<boolean>;
  onUnauthorized: () => void;
}) => {
  refreshHandler = handlers.refresh;
  unauthorizedHandler = handlers.onUnauthorized;
  unauthorizedFired = false; // reset for new session
};

/** Call after a successful login to allow unauthorizedHandler to fire again. */
export const resetAuthState = () => {
  unauthorizedFired = false;
};

export const httpClient = {
  async get<T>(path: string, config?: RequestConfig): Promise<T> {
    const response = await apiClient.get<ApiEnvelope<T>>(path, buildAxiosConfig(config));
    return response.data.data;
  },

  async post<T>(path: string, body?: unknown, config?: RequestConfig): Promise<T> {
    const response = await apiClient.post<ApiEnvelope<T>>(path, body, buildAxiosConfig(config));
    return response.data.data;
  },

  async patch<T>(path: string, body?: unknown, config?: RequestConfig): Promise<T> {
    const response = await apiClient.patch<ApiEnvelope<T>>(path, body, buildAxiosConfig(config));
    return response.data.data;
  },

  async delete<T>(path: string, config?: RequestConfig): Promise<T> {
    const response = await apiClient.delete<ApiEnvelope<T>>(path, buildAxiosConfig(config));
    return response.data.data;
  },
};
