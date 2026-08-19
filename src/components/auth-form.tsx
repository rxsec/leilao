"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useActionState, useState } from "react";
import { initialFormState } from "@/app/action-states";
import { loginUser, registerUser } from "@/app/actions";

export function AuthForm({
  mode,
  registrationSlug,
  helperText,
}: {
  mode: "login" | "register";
  registrationSlug?: string | null;
  helperText?: ReactNode;
}) {
  const [cpfValue, setCpfValue] = useState("");
  const [cepValue, setCepValue] = useState("");
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [whatsappValue, setWhatsappValue] = useState("");
  const action = mode === "login" ? loginUser : registerUser;
  const [state, formAction, isPending] = useActionState(
    action,
    initialFormState,
  );

  return (
    <form action={formAction} className="space-y-4">
      {mode === "register" && registrationSlug ? (
        <input type="hidden" name="registrationSlug" value={registrationSlug} />
      ) : null}

      {mode === "register" ? (
        <>
          {helperText ? (
            <div className="rounded-2xl border border-[#dce6ee] bg-[#f7fbfd] px-4 py-3 text-sm leading-6 text-neutral-600">
              {helperText}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome completo">
            <input
              type="text"
              name="name"
              required
              disabled={isPending}
              className={inputClassName}
              placeholder="Seu nome completo"
            />
          </Field>

          <Field label="Data de nascimento">
            <input
              type="date"
              name="birthDate"
              required
              disabled={isPending}
              className={inputClassName}
            />
          </Field>

          <Field label="CPF">
            <input
              type="text"
              name="cpf"
              required
              disabled={isPending}
              value={cpfValue}
              onChange={(event) => {
                setCpfValue(formatCpf(event.target.value));
              }}
              className={inputClassName}
              placeholder="000.000.000-00"
            />
          </Field>

          <Field label="CEP">
            <input
              type="text"
              name="cep"
              required
              disabled={isPending}
              value={cepValue}
              onChange={(event) => {
                setCepValue(formatCep(event.target.value));
              }}
              onBlur={async () => {
                const cep = cepValue.replace(/\D/g, "");

                if (cep.length !== 8) {
                  return;
                }

                try {
                  const response = await fetch(
                    `https://viacep.com.br/ws/${cep}/json/`,
                  );
                  const data = (await response.json()) as {
                    erro?: boolean;
                    logradouro?: string;
                    bairro?: string;
                    localidade?: string;
                    uf?: string;
                  };

                  if (data.erro) {
                    return;
                  }

                  setStreet(data.logradouro ?? "");
                  setNeighborhood(data.bairro ?? "");
                  setCity(data.localidade ?? "");
                  setStateValue(data.uf ?? "");
                } catch {
                  return;
                }
              }}
              className={inputClassName}
              placeholder="00000-000"
            />
          </Field>

          <Field label="Nome da rua">
            <input
              type="text"
              name="street"
              required
              disabled={isPending}
              value={street}
              onChange={(event) => setStreet(event.target.value)}
              className={inputClassName}
              placeholder="Rua"
            />
          </Field>

          <Field label="Número da residência">
            <input
              type="text"
              name="streetNumber"
              required
              disabled={isPending}
              className={inputClassName}
              placeholder="Número"
            />
          </Field>

          <Field label="Complemento">
            <input
              type="text"
              name="complement"
              required
              disabled={isPending}
              className={inputClassName}
              placeholder="Apartamento, bloco, referência"
            />
          </Field>

          <Field label="Bairro">
            <input
              type="text"
              name="neighborhood"
              required
              disabled={isPending}
              value={neighborhood}
              onChange={(event) => setNeighborhood(event.target.value)}
              className={inputClassName}
              placeholder="Bairro"
            />
          </Field>

          <Field label="Cidade">
            <input
              type="text"
              name="city"
              required
              disabled={isPending}
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className={inputClassName}
              placeholder="Cidade"
            />
          </Field>

          <Field label="Estado">
            <input
              type="text"
              name="state"
              required
              disabled={isPending}
              value={stateValue}
              onChange={(event) =>
                setStateValue(event.target.value.toUpperCase().slice(0, 2))
              }
              className={inputClassName}
              placeholder="UF"
              maxLength={2}
            />
          </Field>

          <Field label="WhatsApp">
            <input
              type="text"
              name="whatsapp"
              required
              disabled={isPending}
              value={whatsappValue}
              onChange={(event) => {
                setWhatsappValue(formatWhatsapp(event.target.value));
              }}
              className={inputClassName}
              placeholder="(11) 99999-9999"
            />
          </Field>
          </div>
        </>
      ) : null}

      <Field label="E-mail">
        <input
          type="email"
          name="email"
          required
          disabled={isPending}
          className={inputClassName}
          placeholder="voce@exemplo.com"
        />
      </Field>

      <Field label="Senha">
        <input
          type="password"
          name="password"
          required
          minLength={6}
          disabled={isPending}
          className={inputClassName}
          placeholder="Mínimo de 6 caracteres"
        />
      </Field>

      {mode === "login" ? (
        <div className="flex justify-end">
          <Link
            href="/recuperar-senha"
            className="text-sm font-semibold text-[#0f5d86]"
          >
            Esqueci minha senha
          </Link>
        </div>
      ) : null}

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
        {mode === "login" ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
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

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-neutral-900">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClassName =
  "h-12 w-full rounded-xl border border-[#d5e0e8] bg-white px-4 text-sm text-neutral-900 outline-none transition focus:border-[#0f5d86]";

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  }

  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(
    6,
    9,
  )}-${digits.slice(9)}`;
}

function formatCep(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 5) {
    return digits;
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function formatWhatsapp(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return digits.length > 0 ? `(${digits}` : "";
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}
