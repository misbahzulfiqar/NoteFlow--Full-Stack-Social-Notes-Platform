"use client";

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useRegisterStore } from "@/features/auth/stores/register.store";


type RegisterFormValues = {
  username: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const router = useRouter();
  const registerAccount = useRegisterStore((s) => s.registerAccount);
  const serverError = useRegisterStore((s) => s.error);
  const backendFieldErrors = useRegisterStore((s) => s.fieldErrors);
  const clearRegisterError = useRegisterStore((s) => s.clearRegisterError);
  const onSubmit = async (data: RegisterFormValues) => {
    clearRegisterError();
    const ok = await registerAccount({
      email: data.email,
      password: data.password,
    });
    if (ok) router.push("/login");
  };
  const usernameError = errors.username?.message ?? backendFieldErrors?.username?.[0];
  const emailError = errors.email?.message ?? backendFieldErrors?.email?.[0];
  const passwordError = errors.password?.message ?? backendFieldErrors?.password?.[0];
  console.log("usernameError", usernameError);
  console.log("emailError", emailError);
  console.log("passwordError", passwordError);

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

        {/* Title + tagline */}
        <div className="mt-5 space-y-2 text-center">
          <h1 className="text-xl font-bold text-indigo-950 sm:text-2xl">
            Sign Up
          </h1>
          <p className="text-sm leading-relaxed text-indigo-900/80">
            Write and share notes, discover and save others.
          </p>
        </div>

        {/* Form */}
        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          {serverError ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-600">
              {serverError}
            </p>
          ) : null}
                
          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-indigo-950/90"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="yourname"
              className="w-full rounded-xl border border-white/60 bg-white px-3.5 py-2.5 text-sm text-indigo-950 shadow-md outline-none ring-indigo-300/40 placeholder:text-gray-400 focus:border-indigo-300 focus:ring-2"
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            {usernameError ? (
              <p className="text-xs text-red-500">{usernameError}</p>
            ) : null}
          </div>

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
            {emailError ? (
              <p className="text-xs text-red-500">{emailError}</p>
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
              autoComplete="new-password"
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
            {passwordError ? (
              <p className="text-xs text-red-500">{passwordError}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 w-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-400 py-2.5 text-center text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-indigo-900/80">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-violet-600 hover:text-violet-700"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}