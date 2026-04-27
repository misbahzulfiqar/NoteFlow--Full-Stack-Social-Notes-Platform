import { create } from "zustand";
import { loginApi } from "@/features/auth/services/login.api";
import {
  getAuthErrorMessage,
  getAuthFieldErrors,
  type LoginFieldErrors,
} from "@/features/auth/stores/authErrorUtils";
import { useAuthStore } from "@/store/authStore";

/** Backend may throw a parsed JSON object, not an Error instance */
type AuthFieldErrors = LoginFieldErrors;

type LoginState = {
  error: string | null;
  fieldErrors: AuthFieldErrors | null;
  clearLoginError: () => void;
  loginAccount: (payload: {
    email: string;
    password: string;
  }) => Promise<boolean>;
};

export const useLoginStore = create<LoginState>((set) => ({
  error: null,
  fieldErrors: null,

  clearLoginError: () => set({ error: null, fieldErrors: null }),

  loginAccount: async (payload) => {
    set({ error: null, fieldErrors: null });
    try {
      const data = await loginApi(payload);

      useAuthStore.getState().setSession({
        accessToken: data.accessToken,
        user: data.user,
      });

      return true;      
    } catch (e) {
      const fieldErrors = getAuthFieldErrors(e, ["email", "password"]);
      set({
        fieldErrors,
        error: fieldErrors ? null : getAuthErrorMessage(e),
      });
      return false;
    }
  },
}));