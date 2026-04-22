import { create } from "zustand";

export type AuthUser = {
  id: string;
  email: string;
};

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  setSession: (session: { accessToken: string; user: AuthUser } | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setSession: (session) =>
    set({
      accessToken: session?.accessToken ?? null,
      user: session?.user ?? null,
    }),
}));