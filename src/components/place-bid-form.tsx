"use client";

import { useActionState } from "react";
import { initialFormState } from "@/app/action-states";
import { placeBid } from "@/app/actions";

export function PlaceBidForm({
  lotSlug,
  enabled,
  minimumBid,
}: {
  lotSlug: string;
  enabled: boolean;
  minimumBid: number;
}) {
  const [state, formAction, isPending] = useActionState(
    placeBid,
    initialFormState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="lotSlug" value={lotSlug} />

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-neutral-900">
          Valor do lance
        </label>
        <input
          type="number"
          name="amount"
          min={Math.ceil(minimumBid + 1)}
          step="0.01"
          placeholder={`Minimo ${new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(minimumBid + 1)}`}
          disabled={!enabled || isPending}
          required
          className="h-12 w-full rounded-xl border border-[#d5e0e8] bg-white px-4 text-sm text-neutral-900 outline-none transition focus:border-[#0f5d86]"
        />
      </div>

      <button
        type="submit"
        disabled={!enabled || isPending}
        className="gold-button inline-flex h-12 w-full items-center justify-center rounded-xl px-5 text-sm font-bold transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Enviando lance..." : "Enviar lance"}
      </button>

      <p className="text-sm text-neutral-500">
        {enabled
          ? "O novo lance precisa ser maior que o valor atual e respeitar o incremento minimo."
          : "Entre na conta e configure o Supabase para liberar o envio real de lances."}
      </p>

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
