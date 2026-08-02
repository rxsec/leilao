"use client";

import { useActionState } from "react";
import { initialFormState } from "@/app/action-states";
import { subscribeToNewsletter } from "@/app/actions";

export function NewsletterForm({ enabled }: { enabled: boolean }) {
  const [state, formAction, isPending] = useActionState(
    subscribeToNewsletter,
    initialFormState,
  );

  return (
    <form action={formAction} className="mt-6 space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          name="email"
          placeholder="Seu melhor e-mail"
          className="h-12 w-full rounded-xl border border-white/14 bg-white/8 px-4 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-[#8fc8e7] focus:bg-white/12"
          disabled={!enabled || isPending}
          required
        />
        <button
          type="submit"
          className="accent-button inline-flex h-12 items-center justify-center rounded-xl px-5 text-sm font-bold transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!enabled || isPending}
        >
          {isPending ? "Enviando..." : "Receber novidades"}
        </button>
      </div>

      <p className="text-sm text-white/78">
        {enabled
          ? "Cadastre-se para receber novos lotes e oportunidades em destaque."
          : "A newsletter sera ativada assim que a base principal estiver pronta para receber inscricoes."}
      </p>

      {state.status !== "idle" ? (
        <p
          className={`text-sm ${
            state.status === "success" ? "text-[#bfe2f3]" : "text-[#ffd4a8]"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
