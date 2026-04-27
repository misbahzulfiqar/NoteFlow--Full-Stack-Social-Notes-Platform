type BaseAuthField = "email" | "password";
type RegisterAuthField = BaseAuthField | "username";

export type LoginFieldErrors = Partial<Record<BaseAuthField, string[]>>;
export type RegisterFieldErrors = Partial<Record<RegisterAuthField, string[]>>;

export function getAuthErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const obj = err as Record<string, unknown>;
    if (typeof obj.message === "string") return obj.message;
    if (Array.isArray(obj.message)) {
      return obj.message.map(String).filter(Boolean).join(", ");
    }
    if (typeof obj.error === "string") return obj.error;
  }
  return "Something went wrong. Please try again.";
}

export function getAuthFieldErrors<T extends string>(
  err: unknown,
  allowedFields: readonly T[],
): Partial<Record<T, string[]>> | null {
  if (!err || typeof err !== "object") return null;

  const obj = err as Record<string, unknown>;
  const direct = obj.fieldErrors;
  const nested =
    obj.errors && typeof obj.errors === "object"
      ? (obj.errors as Record<string, unknown>).fieldErrors
      : undefined;

  const raw = direct ?? nested;
  if (!raw || typeof raw !== "object") return null;

  const record = raw as Record<string, unknown>;
  const output: Partial<Record<T, string[]>> = {};

  for (const field of allowedFields) {
    if (Array.isArray(record[field])) {
      output[field] = record[field].map(String);
    }
  }

  return Object.keys(output).length > 0 ? output : null;
}
