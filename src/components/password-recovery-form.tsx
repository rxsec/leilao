"use client";

import { useActionState } from "react";
import { initialFormState } from "@/app/action-states";
import { requestPasswordReset } from "@/app/actions";

export function PasswordRecoveryForm() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordReset,
    initialFormState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <Field label="E-mail da conta">
        <input
          type="email"
          name="email"
          required
          disabled={isPending}
          className={inputClassName}
          placeholder="voce@exemplo.com"
        />
      </Field>

      <Field label="Observação opcional">
        <textarea
          name="note"
          disabled={isPending}
          className="min-h-28 w-full rounded-xl border border-[#d5e0e8] bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#0f5d86]"
          placeholder="Ex.: perdi acesso e preciso de uma senha temporária."
        />
      </Field>

      <button
        type="submit"
        disabled={isPending}
        className="gold-button inline-flex h-12 w-full items-center justify-center rounded-xl px-5 text-sm font-bold transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Enviando..." : "Solicitar recuperação"}
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
