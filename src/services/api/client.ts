import { tokenManager } from "@/src/services/auth/tokenManager";
import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.gobusly.com";

type RefreshCallback = () => Promise<boolean>;
type LogoutCallback = () => Promise<void>;

class ApiClient {
  private instance: AxiosInstance;
  private refreshTokenCallback?: RefreshCallback;
  private logoutCallback?: LogoutCallback;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  // Inject store functions to avoid circular imports
  setAuthCallbacks(refreshCb: RefreshCallback, logoutCb: LogoutCallback) {
    this.refreshTokenCallback = refreshCb;
    this.logoutCallback = logoutCb;
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      async (config) => {
        const token = await tokenManager.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            if (this.refreshTokenCallback) {
              const refreshed = await this.refreshTokenCallback();
              if (refreshed) {
                const token = await tokenManager.getAccessToken();
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return this.instance(originalRequest);
              }
            }
          } catch (refreshError) {
            if (this.logoutCallback) {
              await this.logoutCallback();
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.instance.get<T>(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.post<T>(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.put<T>(url, data, config);
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.patch<T>(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.instance.delete<T>(url, config);
  }

  async clearCache(): Promise<void> {
    // Optional: clear any caching here
  }
}

export const apiClient = new ApiClient();
