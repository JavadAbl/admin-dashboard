// api/axios-instance.ts
import axios, {
  type AxiosRequestConfig,
  AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { Mutex } from "async-mutex";
import { HttpStatusCode } from "axios";
import { storage } from "../Storage";
import { toast } from "sonner";
import { authActions } from "../../Features/Auth/AuthSlice";
import { store } from "../../Store/Store";

const BASE_ADDRESS = "http://localhost:3000/";
const mutex = new Mutex();

export interface ApiRequestOptions extends Omit<AxiosRequestConfig, "data"> {
  data?: unknown;
  skipSuccessToast?: boolean;
  skipErrorToast?: boolean;
}

// Helper to parse error messages (same as your original)
const getErrorMessage = (errorData: any): string => {
  if (typeof errorData === "string") return errorData;
  if (errorData && typeof errorData === "object") {
    if ("message" in errorData) return (errorData as any).message;
    if ("detail" in errorData) return (errorData as any).detail;
  }
  return "Server error";
};

// Create axios instance
export const apiClient = axios.create({
  baseURL: BASE_ADDRESS,
  /*  headers: {
    "Content-Type": "application/json",
  }, */
});

// ─────────────────────────────────────────────────────
// REQUEST INTERCEPTOR: Inject auth token & config
// ─────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = storage.getAccessToken();

    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }

    // Auto-serialize JSON body (axios does this by default, but explicit for FormData check)
    if (
      config.data &&
      typeof config.data === "object" &&
      !(config.data instanceof FormData) &&
      !config.headers.get("Content-Type")
    ) {
      config.headers.set("Content-Type", "application/json");
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ─────────────────────────────────────────────────────
// RESPONSE INTERCEPTOR: Handle success, errors, 401 refresh
// ─────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  // ✅ Success Handler
  (response: AxiosResponse) => {
    const config = response.config as InternalAxiosRequestConfig & {
      skipSuccessToast?: boolean;
      originalMethod?: string;
    };
    const { skipSuccessToast } = config;

    if (!skipSuccessToast) {
      const method = (
        config.originalMethod ||
        config.method ||
        "GET"
      ).toUpperCase();
      if (
        (method === "POST" && response.status === HttpStatusCode.Created) ||
        ((method === "PUT" || method === "PATCH") &&
          response.status === HttpStatusCode.Ok) ||
        (method === "DELETE" && response.status === HttpStatusCode.NoContent)
      ) {
        toast.success("Operation successful");
      }
    }

    // Return empty object for 204 No Content (matches your original behavior)
    if (response.status === HttpStatusCode.NoContent) {
      return {} as any;
    }

    return response.data;
  },

  // ❌ Error Handler
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & {
      skipErrorToast?: boolean;
      _retry?: boolean;
      originalMethod?: string;
    };

    // ───── 401 Unauthorized: Token Refresh Flow ─────
    if (
      error.response?.status === HttpStatusCode.Unauthorized &&
      !config._retry
    ) {
      config._retry = true;

      try {
        await mutex.waitForUnlock();

        if (!mutex.isLocked()) {
          const release = await mutex.acquire();
          try {
            // Re-check store state in case another request already refreshed
            const refreshToken = storage.getRefreshToken();

            if (refreshToken) {
              // 🔁 Refresh token request (using raw fetch to avoid interceptor loop)
              const refreshRes = await fetch(
                `${BASE_ADDRESS}Auth-Api/Auth/Refresh`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ refreshToken }),
                },
              );

              if (refreshRes.ok) {
                const data = await refreshRes.json();
                storage.setTokens(data.accessToken, data.refreshToken);

                // Update axios defaults for future requests
                apiClient.defaults.headers.common["Authorization"] =
                  `Bearer ${data.accessToken}`;

                // 🔁 Retry original request with new token
                if (config.headers) {
                  config.headers.set(
                    "Authorization",
                    `Bearer ${data.accessToken}`,
                  );
                }
                return apiClient(config);
              } else {
                // Refresh failed → logout
                store.dispatch(authActions.logout());
                return Promise.reject(
                  new Error("Session expired. Please login again."),
                );
              }
            } else {
              store.dispatch(authActions.logout());
              return Promise.reject(new Error("No refresh token available."));
            }
          } finally {
            release();
          }
        } else {
          // Another request is refreshing → wait and retry
          await mutex.waitForUnlock();
          return apiClient(config);
        }
      } catch (refreshError) {
        store.dispatch(authActions.logout());
        return Promise.reject(refreshError);
      }
    }

    // ───── Parse Error Response ─────
    const errorData = error.response?.data;
    const errorMessage = getErrorMessage(errorData);

    // ───── Show Error Toast (unless skipped or 401) ─────
    const { skipErrorToast } = config;
    if (
      !skipErrorToast &&
      error.response?.status !== HttpStatusCode.Unauthorized
    ) {
      toast.error(errorMessage);
    }

    // ───── Final 401 Fallback (if refresh wasn't attempted) ─────
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      store.dispatch(authActions.logout());
    }

    // Attach metadata for debugging (React Query, etc.)
    const enhancedError: any = new Error(errorMessage);
    enhancedError.status = error.response?.status;
    enhancedError.data = errorData;
    enhancedError.originalError = error;

    return Promise.reject(enhancedError);
  },
);
