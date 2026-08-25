"use client";

import { useActionState } from "react";
import { initialFormState } from "@/app/action-states";
import { resetLots } from "@/app/actions";

export function ResetLotsForm() {
  const [state, formAction, isPending] = useActionState(
    resetLots,
    initialFormState,
  );

  return (
    <form action={formAction} className="space-y-2">
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0f5d86] px-5 text-sm font-semibold text-white transition hover:bg-[#0c4f72] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Zerando lotes..." : "Zerar lotes"}
      </button>
      <p className="text-xs text-neutral-500">
        Reabre todos os lotes, apaga os lances e limpa os arremates vinculados.
      </p>
      {state.status !== "idle" ? (
        <p className="text-xs text-neutral-500">{state.message}</p>
      ) : null}
    </form>
  );
}
