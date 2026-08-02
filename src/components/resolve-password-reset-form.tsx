"use client";

import { useActionState } from "react";
import { initialFormState } from "@/app/action-states";
import { resolvePasswordReset } from "@/app/actions";

export function ResolvePasswordResetForm({
  requestId,
  disabled,
}: {
  requestId: string;
  disabled: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    resolvePasswordReset,
    initialFormState,
  );

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="requestId" value={requestId} />
      <input
        type="password"
        name="temporaryPassword"
        minLength={6}
        required
        disabled={disabled || isPending}
        className="h-11 w-full rounded-xl border border-[#d5e0e8] bg-white px-4 text-sm text-neutral-900 outline-none transition focus:border-[#0f5d86]"
        placeholder="Definir senha temporária"
      />
      <button
        type="submit"
        disabled={disabled || isPending}
        className="inline-flex h-10 items-center justify-center rounded-lg border border-[#d5e0e8] bg-white px-4 text-sm font-semibold text-neutral-800 transition hover:bg-[#f4f8fb] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Salvando..." : "Resolver solicitação"}
      </button>
      {state.status !== "idle" ? (
        <p
          className={`text-xs ${
            state.status === "success" ? "text-[#0f5d86]" : "text-neutral-500"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
