"use client";

import { useActionState } from "react";
import { initialFormState } from "@/app/action-states";
import { saveCategory } from "@/app/actions";
import type { AdminCategory } from "@/lib/admin-data";

export function AdminCategoryForm({
  category,
}: {
  category?: AdminCategory;
}) {
  const [state, formAction, isPending] = useActionState(
    saveCategory,
    initialFormState,
  );

  return (
    <form
      action={formAction}
      className="grid gap-4 rounded-[1.2rem] border border-[#d5e0e8] bg-white p-5"
    >
      <input type="hidden" name="categoryId" defaultValue={category?.id ?? ""} />

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nome">
          <input
            name="name"
            defaultValue={category?.name ?? ""}
            required
            disabled={isPending}
            className={inputClassName}
          />
        </Field>
        <Field label="Slug">
          <input
            name="slug"
            defaultValue={category?.slug ?? ""}
            required
            disabled={isPending}
            className={inputClassName}
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="gold-button inline-flex h-12 items-center justify-center rounded-xl px-5 text-sm font-bold transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending
          ? "Salvando..."
          : category
            ? "Atualizar categoria"
            : "Criar categoria"}
      </button>

      {state.status !== "idle" ? (
        <p
          className={`text-sm ${
            state.status === "success" ? "text-[#0f5d86]" : "text-[#9a4d00]"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-2">
      <span className="block text-sm font-semibold text-neutral-900">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClassName =
  "h-12 w-full rounded-xl border border-[#d5e0e8] bg-white px-4 text-sm text-neutral-900 outline-none transition focus:border-[#0f5d86]";
