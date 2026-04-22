import { create } from "zustand";

import { registerApi } from "@/features/auth/services/register.api";

type AuthFieldErrors = Partial<Record<"username" | "email" | "password", string[]>>;

function getErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const o = err as Record<string, unknown>;
    if (typeof o.message === "string") return o.message;
    if (Array.isArray(o.message)) {
      return o.message.map(String).filter(Boolean).join(", ");
    }
    if (typeof o.error === "string") return o.error;
  }
  return "Something went wrong. Please try again.";
}

function getFieldErrors(err: unknown): AuthFieldErrors | null {
  if (!err || typeof err !== "object") return null;

  const o = err as Record<string, unknown>;
  const direct = o.fieldErrors;
  const nested =
    o.errors && typeof o.errors === "object"
      ? (o.errors as Record<string, unknown>).fieldErrors
      : undefined;

  const raw = direct ?? nested;
  if (!raw || typeof raw !== "object") return null;

  const rec = raw as Record<string, unknown>;
  const out: AuthFieldErrors = {};

  if (Array.isArray(rec.username)) out.username = rec.username.map(String);
  if (Array.isArray(rec.email)) out.email = rec.email.map(String);
  if (Array.isArray(rec.password)) out.password = rec.password.map(String);

  return Object.keys(out).length > 0 ? out : null;
}

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
      await registerApi(payload);
      return true;
    } catch (e) {
      const fieldErrors = getFieldErrors(e);
      set({
        fieldErrors,
        error: fieldErrors ? null : getErrorMessage(e),
      });
      return false;
    }
  },
}));