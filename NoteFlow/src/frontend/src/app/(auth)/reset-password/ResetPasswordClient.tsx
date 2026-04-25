"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

type ResetResponse = {
  message: string;
};

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Reset token is missing. Please open the full reset link.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = (await res.json()) as ResetResponse;
      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password");
      }
      setSuccess(data.message);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
      <div className="w-full rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-indigo-950">Reset password</h1>
        <p className="mt-2 text-sm text-indigo-900/80">
          Set a new password for your account.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-indigo-950/90">
              New password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-white/60 bg-white px-3.5 py-2.5 text-sm text-indigo-950 shadow-md outline-none ring-indigo-300/40 placeholder:text-gray-400 focus:border-indigo-300 focus:ring-2"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-indigo-950/90">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-white/60 bg-white px-3.5 py-2.5 text-sm text-indigo-950 shadow-md outline-none ring-indigo-300/40 placeholder:text-gray-400 focus:border-indigo-300 focus:ring-2"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-700">{success}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-400 py-2.5 text-sm font-semibold text-white disabled:opacity-70"
          >
            {submitting ? "Resetting..." : "Reset password"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-indigo-900/80">
          <Link href="/login" className="font-semibold text-violet-600 hover:text-violet-700">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
