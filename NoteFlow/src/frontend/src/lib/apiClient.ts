import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/authStore";
import { getApiBaseUrl } from "@/lib/getApiBaseUrl";
import type { AuthUser } from "@/store/authStore";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

let isRefreshing = false;
let queue: Array<(token: string | null) => void> = [];

function flushQueue(token: string | null) {
  queue.forEach((cb) => cb(token));
  queue = [];
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("[apiClient][request]", {
    url: config.url,
    method: config.method,
    hasToken: !!token,
    authHeader: config.headers?.Authorization ? "present" : "missing",
  });
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config;
    const status = error.response?.status;

    if (!original || original.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (status !== 401) {
      return Promise.reject(error);
    }

    if (original.headers["X-Retry"]) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push((token) => {
          if (!token) {
            reject(error);
            return;
          }
          original.headers.Authorization = `Bearer ${token}`;
          resolve(apiClient.request(original));
        });
      });
    }

    isRefreshing = true;
    try {
      const res = await axios.post<{ accessToken: string; user: AuthUser }>(
        `${baseURL}/auth/refresh`,
        {},
        { withCredentials: true }
      );
      
      useAuthStore.getState().setSession({
        accessToken: res.data.accessToken,
        user: res.data.user,
      });

      const accessToken = res.data.accessToken;
      useAuthStore.setState({ accessToken });

      original.headers.Authorization = `Bearer ${accessToken}`;
      original.headers["X-Retry"] = "1";

      flushQueue(accessToken);
      return apiClient.request(original);
    } catch (refreshErr) {
      useAuthStore.getState().setSession(null);
      flushQueue(null);
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);