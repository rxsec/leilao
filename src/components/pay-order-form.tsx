"use client";

import { useActionState } from "react";
import { initialFormState } from "@/app/action-states";
import { payOrder } from "@/app/actions";

export function PayOrderForm({ orderId }: { orderId: string }) {
  const [state, formAction, isPending] = useActionState(
    payOrder,
    initialFormState,
  );

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="orderId" value={orderId} />
      <button
        type="submit"
        disabled={isPending}
        className="gold-button inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-bold transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Processando..." : "Pagar agora"}
      </button>
      {state.status !== "idle" ? (
        <p className="text-xs text-neutral-500">{state.message}</p>
      ) : null}
    </form>
  );
}
