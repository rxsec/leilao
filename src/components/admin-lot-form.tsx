"use client";

import { useActionState } from "react";
import { initialFormState } from "@/app/action-states";
import { saveLot } from "@/app/actions";
import type { AdminCategory, AdminLot } from "@/lib/admin-data";

export function AdminLotForm({
  categories,
  lot,
}: {
  categories: AdminCategory[];
  lot?: AdminLot;
}) {
  const [state, formAction, isPending] = useActionState(
    saveLot,
    initialFormState,
  );

  return (
    <form action={formAction} className="grid gap-4 rounded-[1.2rem] border border-[#d5e0e8] bg-white p-5">
      <input type="hidden" name="lotId" defaultValue={lot?.id ?? ""} />

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Titulo">
          <input
            name="title"
            defaultValue={lot?.title ?? ""}
            required
            disabled={isPending}
            className={inputClassName}
          />
        </Field>
        <Field label="Slug">
          <input
            name="slug"
            defaultValue={lot?.slug ?? ""}
            required
            disabled={isPending}
            className={inputClassName}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Categoria">
          <select
            name="categorySlug"
            defaultValue={findCategorySlug(categories, lot?.categoryId)}
            required
            disabled={isPending}
            className={inputClassName}
          >
            <option value="">Selecione</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tipo">
          <select
            name="type"
            defaultValue={lot?.type ?? "other"}
            disabled={isPending}
            className={inputClassName}
          >
            <option value="property">Imovel</option>
            <option value="electronics">Eletronico</option>
            <option value="luxury">Luxo</option>
            <option value="other">Outro</option>
          </select>
        </Field>
        <Field label="Status">
          <select
            name="status"
            defaultValue={lot?.status ?? "draft"}
            disabled={isPending}
            className={inputClassName}
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="live">Live</option>
            <option value="closed">Closed</option>
          </select>
        </Field>
      </div>

      <Field label="Descricao">
        <textarea
          name="description"
          defaultValue={lot?.description ?? ""}
          disabled={isPending}
          className="min-h-28 w-full rounded-xl border border-[#d5e0e8] bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#0f5d86]"
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Cidade">
          <input
            name="city"
            defaultValue={lot?.city ?? ""}
            disabled={isPending}
            className={inputClassName}
          />
        </Field>
        <Field label="Estado">
          <input
            name="state"
            defaultValue={lot?.state ?? ""}
            disabled={isPending}
            className={inputClassName}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Field label="Lance atual">
          <input
            type="number"
            step="0.01"
            name="currentBid"
            defaultValue={lot?.current_bid ?? 0}
            disabled={isPending}
            className={inputClassName}
          />
        </Field>
        <Field label="Incremento minimo">
          <input
            type="number"
            step="0.01"
            name="minIncrement"
            defaultValue={lot?.min_increment ?? 100}
            disabled={isPending}
            className={inputClassName}
          />
        </Field>
        <Field label="Preco de reserva">
          <input
            type="number"
            step="0.01"
            name="reservePrice"
            defaultValue={lot?.reserve_price ?? ""}
            disabled={isPending}
            className={inputClassName}
          />
        </Field>
        <Field label="Compra imediata">
          <input
            type="number"
            step="0.01"
            name="buyNowPrice"
            defaultValue={lot?.buy_now_price ?? ""}
            disabled={isPending}
            className={inputClassName}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Imagem por URL">
          <input
            name="imageUrl"
            defaultValue={lot?.image_url ?? ""}
            disabled={isPending}
            className={inputClassName}
          />
        </Field>
        <Field label="Upload de imagem">
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            disabled={isPending}
            className={inputClassName}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Encerramento">
          <input
            type="datetime-local"
            name="endsAt"
            defaultValue={formatDateTimeLocal(lot?.ends_at ?? null)}
            disabled={isPending}
            className={inputClassName}
          />
        </Field>
        <label className="flex items-center gap-3 rounded-xl border border-[#d5e0e8] bg-[#f8fbfd] px-4 py-3 text-sm font-semibold text-neutral-700">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={lot?.is_featured ?? false}
            disabled={isPending}
          />
          Destacar lote na vitrine
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="gold-button inline-flex h-12 items-center justify-center rounded-xl px-5 text-sm font-bold transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Salvando..." : lot ? "Atualizar lote" : "Criar lote"}
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

function findCategorySlug(categories: AdminCategory[], categoryId?: string | null) {
  return categories.find((category) => category.id === categoryId)?.slug ?? "";
}


function formatDateTimeLocal(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

const inputClassName =
  "h-12 w-full rounded-xl border border-[#d5e0e8] bg-white px-4 text-sm text-neutral-900 outline-none transition focus:border-[#0f5d86]";
