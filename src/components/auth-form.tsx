"use client";

import Link from "next/link";
import { useActionState } from "react";
import { initialFormState } from "@/app/action-states";
import { loginUser, registerUser } from "@/app/actions";

export function AuthForm({
  mode,
}: {
  mode: "login" | "register";
}) {
  const action = mode === "login" ? loginUser : registerUser;
  const [state, formAction, isPending] = useActionState(
    action,
    initialFormState,
  );

  return (
    <form action={formAction} className="space-y-4">
      {mode === "register" ? (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-neutral-900">
            Nome
          </label>
          <input
            type="text"
            name="name"
            required
            disabled={isPending}
            className="h-12 w-full rounded-xl border border-[#d5e0e8] bg-white px-4 text-sm text-neutral-900 outline-none transition focus:border-[#0f5d86]"
            placeholder="Seu nome"
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-neutral-900">
          E-mail
        </label>
        <input
          type="email"
          name="email"
          required
          disabled={isPending}
          className="h-12 w-full rounded-xl border border-[#d5e0e8] bg-white px-4 text-sm text-neutral-900 outline-none transition focus:border-[#0f5d86]"
          placeholder="voce@exemplo.com"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-neutral-900">
          Senha
        </label>
        <input
          type="password"
          name="password"
          required
          minLength={6}
          disabled={isPending}
          className="h-12 w-full rounded-xl border border-[#d5e0e8] bg-white px-4 text-sm text-neutral-900 outline-none transition focus:border-[#0f5d86]"
          placeholder="Minimo de 6 caracteres"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="gold-button inline-flex h-12 w-full items-center justify-center rounded-xl px-5 text-sm font-bold transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending
          ? mode === "login"
            ? "Entrando..."
            : "Criando conta..."
          : mode === "login"
            ? "Entrar"
            : "Criar conta"}
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

      <p className="text-sm text-neutral-500">
        {mode === "login" ? "Ainda nao tem conta?" : "Ja tem conta?"}{" "}
        <Link
          href={mode === "login" ? "/cadastro" : "/entrar"}
          className="font-semibold text-[#0f5d86]"
        >
          {mode === "login" ? "Cadastre-se" : "Entrar"}
        </Link>
      </p>
    </form>
  );
}
