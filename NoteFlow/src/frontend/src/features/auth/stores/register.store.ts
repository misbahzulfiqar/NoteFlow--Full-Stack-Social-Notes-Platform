import { create } from "zustand";

import { registerApi } from "@/features/auth/services/register.api";
import {
  getAuthErrorMessage,
  getAuthFieldErrors,
  type RegisterFieldErrors,
} from "@/features/auth/stores/authErrorUtils";
import { useAuthStore } from "@/store/authStore";

type AuthFieldErrors = RegisterFieldErrors;

type RegisterState = {
  error: string | null;
  fieldErrors: AuthFieldErrors | null;
  clearRegisterError: () => void;
  registerAccount: (payload: { email: string; password: string }) => Promise<boolean>;
};

export const useRegisterStore = create<RegisterState>((set) => ({
  error: null,
  fieldErrors: null,

  clearRegisterError: () => set({ error: null, fieldErrors: null }),

  registerAccount: async (payload) => {
    set({ error: null, fieldErrors: null });
    try {
      const data = await registerApi(payload);
      useAuthStore.getState().setSession({
        accessToken: data.accessToken,
        user: data.user,
      });
      return true;
    } catch (e) {
      const fieldErrors = getAuthFieldErrors(e, ["username", "email", "password"]);
      set({
        fieldErrors,
        error: fieldErrors ? null : getAuthErrorMessage(e),
      });
      return false;
    }
  },
}));