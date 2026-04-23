"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { getApiBaseUrl } from "@/lib/getApiBaseUrl";
import type { AuthUser } from "@/store/authStore";
import { useAuthStore } from "@/store/authStore";

const baseURL = getApiBaseUrl();

let bootRefresh: Promise<void> | null = null;

function runBootRefresh() {
  const { accessToken, user } = useAuthStore.getState();
  if (accessToken && user) return Promise.resolve();

  if (!bootRefresh) {
    bootRefresh = axios
      .post<{ accessToken: string; user: AuthUser }>(
        `${baseURL}/auth/refresh`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        useAuthStore.getState().setSession({
          accessToken: res.data.accessToken,
          user: res.data.user,
        });
      })
      .catch(() => {})
      .finally(() => {
        bootRefresh = null;
      });
  }
  return bootRefresh;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());

  useEffect(() => {
    void runBootRefresh();
  }, []);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}