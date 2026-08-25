"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { initialFormState } from "@/app/action-states";
import { placeBid } from "@/app/actions";

export function PlaceBidForm({
  lotSlug,
  enabled,
  minimumBid,
  closed = false,
  signedIn,
}: {
  lotSlug: string;
  enabled: boolean;
  minimumBid: number;
  closed?: boolean;
  signedIn: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    placeBid,
    initialFormState,
  );
  const [displayAmount, setDisplayAmount] = useState("");

  const minimumBidLabel = useMemo(
    () =>
      formatCurrency(minimumBid + 1),
    [minimumBid],
  );
  const normalizedAmount = useMemo(
    () => normalizeCurrencyInput(displayAmount),
    [displayAmount],
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="lotSlug" value={lotSlug} />
      <input type="hidden" name="amount" value={normalizedAmount} />

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-neutral-900">
          Valor do lance
        </label>
        <input
          type="text"
          inputMode="decimal"
          placeholder={`Minimo ${minimumBidLabel}`}
          disabled={!enabled || closed || isPending || !signedIn}
          required
          value={displayAmount}
          onChange={(event) => {
            setDisplayAmount(event.target.value);
          }}
          onBlur={() => {
            const parsedAmount = parseCurrencyInput(displayAmount);

            if (parsedAmount !== null) {
              setDisplayAmount(formatCurrency(parsedAmount));
            }
          }}
          className="h-12 w-full rounded-xl border border-[#d5e0e8] bg-white px-4 text-sm text-neutral-900 outline-none transition focus:border-[#0f5d86]"
        />
      </div>

      <button
        type="submit"
        disabled={!enabled || closed || isPending || !signedIn}
        className="gold-button inline-flex h-12 w-full items-center justify-center rounded-xl px-5 text-sm font-bold transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Enviando lance..." : "Enviar lance"}
      </button>

      <p className="text-sm leading-7 text-[#5f7f92]">
        {closed
          ? "Este lote foi encerrado e permanece visivel apenas para consulta."
          : !signedIn
          ? "Cadastre-se ou entre na sua conta para liberar o envio de lances."
          : enabled
          ? "O novo lance precisa ser maior que o valor atual e respeitar o incremento minimo."
          : "Entre na conta e finalize a configuracao operacional para liberar o envio real de lances."}
      </p>

      {!signedIn ? (
        <div className="flex flex-wrap gap-3">
          <Link
            href="/cadastro"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0f5d86] px-5 text-sm font-semibold text-white transition hover:bg-[#0c4f72]"
          >
            Criar cadastro
          </Link>
          <Link
            href="/entrar"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#d5e0e8] bg-white px-5 text-sm font-semibold text-neutral-800 transition hover:bg-[#f4f8fb]"
          >
            Entrar
          </Link>
        </div>
      ) : null}

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

function parseCurrencyInput(value: string) {
  const sanitized = value.replace(/[^\d,.]/g, "").trim();

  if (!sanitized) {
    return null;
  }

  const lastComma = sanitized.lastIndexOf(",");
  const lastDot = sanitized.lastIndexOf(".");
  const separatorIndex = Math.max(lastComma, lastDot);

  if (separatorIndex === -1) {
    const integerValue = Number(sanitized.replace(/\D/g, ""));
    return Number.isFinite(integerValue) ? integerValue : null;
  }

  const integerPart = sanitized
    .slice(0, separatorIndex)
    .replace(/[^\d]/g, "");
  const decimalPart = sanitized
    .slice(separatorIndex + 1)
    .replace(/[^\d]/g, "");
  const normalized = `${integerPart || "0"}.${decimalPart}`;
  const amount = Number(normalized);

  return Number.isFinite(amount) ? amount : null;
}

function normalizeCurrencyInput(value: string) {
  const amount = parseCurrencyInput(value);

  return amount === null ? "" : amount.toFixed(2);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
