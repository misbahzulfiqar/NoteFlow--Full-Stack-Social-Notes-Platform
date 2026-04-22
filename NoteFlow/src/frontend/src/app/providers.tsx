"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());

  useEffect(() => {
    const token = useAuthStore.getState().accessToken;
    if (token) return;

    axios
      .post<{ accessToken: string }>(`${baseURL}/auth/refresh`, {}, { withCredentials: true })
      .then((res) => {
        useAuthStore.setState({ accessToken: res.data.accessToken });
      })
      .catch(() => {
        // not logged in / refresh expired
      });
  }, []);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}