"use client";

import { useActionState } from "react";
import { initialFormState } from "@/app/action-states";
import { closeLot } from "@/app/actions";

export function CloseLotForm({ lotSlug }: { lotSlug: string }) {
  const [state, formAction, isPending] = useActionState(
    closeLot,
    initialFormState,
  );

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="lotSlug" value={lotSlug} />
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-10 items-center justify-center rounded-lg border border-[#d5e0e8] bg-white px-4 text-sm font-semibold text-neutral-800 transition hover:bg-[#f4f8fb] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Encerrando..." : "Encerrar lote"}
      </button>
      {state.status !== "idle" ? (
        <p className="text-xs text-neutral-500">{state.message}</p>
      ) : null}
    </form>
  );
}
