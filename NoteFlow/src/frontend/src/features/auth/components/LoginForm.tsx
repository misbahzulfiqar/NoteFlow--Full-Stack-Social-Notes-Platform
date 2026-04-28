"use client";

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { loginApi } from "../services/login.api";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginFormValues) => {
    await loginApi({ email: data.email, password: data.password });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-sky-100 via-indigo-50 to-violet-200 px-4 py-6">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        {/* Header */}
        <header className="flex items-center">
          <div className="relative h-12 w-12 overflow-hidden rounded-md">
            <Image
              src="/noteflow-logo.jpg"
              alt="NoteFlow logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <span className="text-xl font-bold tracking-wide text-[#287feb]">
            NoteFlow
          </span>
        </header>

        <div className="mt-5 space-y-2 text-center">
          <h1 className="text-xl font-bold text-indigo-950 sm:text-2xl">
            Welcome back
          </h1>
          <p className="text-sm leading-relaxed text-indigo-900/80">
            Write and share notes, discover and save others.
          </p>
        </div>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-indigo-950/90"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/60 bg-white px-3.5 py-2.5 text-sm text-indigo-950 shadow-md outline-none ring-indigo-300/40 placeholder:text-gray-400 focus:border-indigo-300 focus:ring-2"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email",
                },
              })}
            />
            {errors.email ? (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-indigo-950/90"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/60 bg-white px-3.5 py-2.5 text-sm text-indigo-950 shadow-md outline-none ring-indigo-300/40 placeholder:text-gray-400 focus:border-indigo-300 focus:ring-2"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password ? (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 w-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-400 py-2.5 text-center text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-4 flex flex-col items-center gap-3 text-center">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-violet-500 hover:text-violet-600"
          >
            Forgot password?
          </Link>

          <p className="text-sm text-indigo-900/80">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-violet-600 hover:text-violet-700"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}