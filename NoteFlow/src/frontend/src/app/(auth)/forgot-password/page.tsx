"use client";

import Link from "next/link";
import { useState } from "react";

type ForgotResponse = {
  message: string;
  resetUrl?: string;
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ForgotResponse | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as ForgotResponse;
      if (!res.ok) {
        throw new Error(data.message || "Failed to create reset request");
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
      <div className="w-full rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-indigo-950">Forgot password</h1>
        <p className="mt-2 text-sm text-indigo-900/80">
          Enter your account email and we&apos;ll generate a password reset link.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-indigo-950/90">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-xl border border-white/60 bg-white px-3.5 py-2.5 text-sm text-indigo-950 shadow-md outline-none ring-indigo-300/40 placeholder:text-gray-400 focus:border-indigo-300 focus:ring-2"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {result ? (
            <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
              <p>{result.message}</p>
              {result.resetUrl ? (
                <p className="mt-2 break-all">
                  Reset link:{" "}
                  <a href={result.resetUrl} className="font-semibold underline">
                    {result.resetUrl}
                  </a>
                </p>
              ) : null}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-400 py-2.5 text-sm font-semibold text-white disabled:opacity-70"
          >
            {submitting ? "Generating link..." : "Generate reset link"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-indigo-900/80">
          Remembered your password?{" "}
          <Link href="/login" className="font-semibold text-violet-600 hover:text-violet-700">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
