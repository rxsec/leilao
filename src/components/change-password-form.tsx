"use client";

import { useActionState } from "react";
import { initialFormState } from "@/app/action-states";
import { changePassword } from "@/app/actions";

export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(
    changePassword,
    initialFormState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Senha atual">
        <input
          type="password"
          name="currentPassword"
          required
          minLength={6}
          disabled={isPending}
          className={inputClassName}
          placeholder="Digite sua senha atual"
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nova senha">
          <input
            type="password"
            name="newPassword"
            required
            minLength={6}
            disabled={isPending}
            className={inputClassName}
            placeholder="Mínimo de 6 caracteres"
          />
        </Field>

        <Field label="Confirmar nova senha">
          <input
            type="password"
            name="confirmPassword"
            required
            minLength={6}
            disabled={isPending}
            className={inputClassName}
            placeholder="Repita a nova senha"
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="gold-button inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-bold transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Atualizando..." : "Atualizar senha"}
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
