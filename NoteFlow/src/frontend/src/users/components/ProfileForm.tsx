"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateProfile } from "@/app/features/users/services/users.service";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { useAuthStore } from "@/store/authStore";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(120),
});

type FormValues = z.infer<typeof schema>;

type ProfileFormProps = {
  open: boolean;
  onClose: () => void;
};

export function ProfileForm({ open, onClose }: ProfileFormProps) {
  const user = useAuthStore((s) => s.user);
  const [serverError, setServerError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (!open || !user) return;
    reset({
      name: user.name?.trim() || user.email.split("@")[0] || "",
    });
    setAvatarFile(null);
    setPreviewUrl(null);
    setServerError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [open, user, reset]);

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  if (!open) return null;

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const { user: nextUser } = await updateProfile({
        name: values.name,
        avatarFile,
      });
      const token = useAuthStore.getState().accessToken;
      if (token) {
        useAuthStore.getState().setSession({
          accessToken: token,
          user: nextUser,
        });
      }
      onClose();
    } catch (e) {
      setServerError(getErrorMessage(e));
    }
  };

  const displayPreview =
    previewUrl || user?.avatar || null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-form-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="profile-form-title" className="text-lg font-bold text-slate-900">
            Edit profile
          </h2>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          {serverError ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {serverError}
            </p>
          ) : null}

          <div className="flex flex-col items-center gap-3">
            <div className="relative h-24 w-24 overflow-hidden rounded-full bg-slate-100 ring-2 ring-slate-200">
              {displayPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={displayPreview}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                  No photo
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              id="profile-avatar-input"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setAvatarFile(f);
                setPreviewUrl((prev) => {
                  if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
                  return f ? URL.createObjectURL(f) : null;
                });
              }}
            />
            <label
              htmlFor="profile-avatar-input"
              className="cursor-pointer text-sm font-semibold text-[#8e78ff] underline"
            >
              Change photo
            </label>
          </div>

          <div>
            <label htmlFor="profile-name" className="mb-1 block text-sm font-medium text-slate-700">
              Display name
            </label>
            <input
              id="profile-name"
              type="text"
              autoComplete="name"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-slate-200 focus:ring-2"
              {...register("name")}
            />
            {errors.name ? (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-gradient-to-r from-[#8e78ff] to-[#c48edf] px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
            >
              {isSubmitting ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}