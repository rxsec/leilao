import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, Gavel, MapPin } from "lucide-react";
import {
  getAuctionFilterOptions,
  getAuctionLots,
  type AuctionFilterOption,
  type AuctionLot,
} from "@/lib/auction-data";

type SearchParams = {
  q?: string;
  category?: string;
  type?: string;
  status?: string;
  min?: string;
  max?: string;
  sort?: string;
};

export default async function LeiloesPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query = resolvedSearchParams?.q?.trim() ?? "";
  const category = resolvedSearchParams?.category?.trim() ?? "";
  const type = resolvedSearchParams?.type?.trim() ?? "";
  const status = resolvedSearchParams?.status?.trim() ?? "";
  const min = resolvedSearchParams?.min?.trim() ?? "";
  const max = resolvedSearchParams?.max?.trim() ?? "";
  const sort = resolvedSearchParams?.sort?.trim() ?? "ending";

  const [filterOptions, { lots }] = await Promise.all([
    getAuctionFilterOptions(),
    getAuctionLots({
      search: query,
      category,
      type: isLotType(type) ? type : "",
      status: isLotStatus(status) ? status : "",
      minPrice: min ? Number(min) : null,
      maxPrice: max ? Number(max) : null,
      sort: isSortOption(sort) ? sort : "ending",
    }),
  ]);
  const auctionLots: AuctionLot[] = lots;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef4f8_0%,#f7f8fa_40%,#f8f5ef_100%)] px-4 py-8 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#0c2331,#0f5d86)] px-6 py-8 text-white shadow-[0_20px_50px_rgba(15,93,134,0.2)] sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#bfe2f3]">
            Leilões
          </p>
          <h1 className="mt-3 max-w-[40rem] text-[2.3rem] font-extrabold tracking-[-0.05em] sm:text-[3.1rem]">
            Catálogo completo com busca e filtros avançados
          </h1>
          <p className="mt-4 max-w-[42rem] text-[1rem] leading-8 text-white/78">
            Explore os lotes por palavra-chave, categoria, tipo, faixa de preço
            e status para chegar mais rápido ao que faz sentido para você.
          </p>
          {query ? (
            <p className="mt-4 text-sm text-[#d8edf8]">
              Busca ativa para: <span className="font-semibold">{query}</span>
            </p>
          ) : null}
        </div>

        <section className="section-card mt-8 rounded-[1.4rem] p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0f5d86]">
                Filtros
              </p>
              <h2 className="mt-2 text-[1.8rem] font-extrabold tracking-[-0.04em] text-neutral-950">
                Refine sua busca
              </h2>
            </div>
            <Link
              href="/leiloes"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#d5e0e8] px-4 text-sm font-semibold text-neutral-700 transition hover:bg-[#f4f8fb]"
            >
              Limpar filtros
            </Link>
          </div>

          <form className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="Palavra-chave">
              <input
                name="q"
                defaultValue={query}
                placeholder="Ex.: iPhone, Galaxy, Xiaomi"
                className={inputClassName}
              />
            </Field>

            <Field label="Categoria">
              <select
                name="category"
                defaultValue={category}
                className={inputClassName}
              >
                <option value="">Todas</option>
                {filterOptions.map((option: AuctionFilterOption) => (
                  <option key={option.slug} value={option.slug}>
                    {option.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Tipo">
              <select name="type" defaultValue={type} className={inputClassName}>
                <option value="">Todos</option>
                <option value="property">Imóvel</option>
                <option value="electronics">Eletrônico</option>
                <option value="luxury">Luxo</option>
                <option value="other">Outro</option>
              </select>
            </Field>

            <Field label="Status">
              <select
                name="status"
                defaultValue={status}
                className={inputClassName}
              >
                <option value="">Todos</option>
                <option value="live">Ao vivo</option>
                <option value="scheduled">Agendado</option>
              </select>
            </Field>

            <Field label="Preço mínimo">
              <input
                type="number"
                min="0"
                step="0.01"
                name="min"
                defaultValue={min}
                className={inputClassName}
              />
            </Field>

            <Field label="Preço máximo">
              <input
                type="number"
                min="0"
                step="0.01"
                name="max"
                defaultValue={max}
                className={inputClassName}
              />
            </Field>

            <Field label="Ordenar por">
              <select name="sort" defaultValue={sort} className={inputClassName}>
                <option value="ending">Encerramento mais próximo</option>
                <option value="price-asc">Menor lance atual</option>
                <option value="price-desc">Maior lance atual</option>
                <option value="recent">Mais recentes</option>
              </select>
            </Field>

            <div className="flex items-end">
              <button
                type="submit"
                className="gold-button inline-flex h-12 w-full items-center justify-center rounded-xl px-5 text-sm font-bold transition hover:brightness-95"
              >
                Aplicar filtros
              </button>
            </div>
          </form>
        </section>

        {auctionLots.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {auctionLots.map((lot: AuctionLot) => (
              <article
                key={lot.slug}
                className="section-card overflow-hidden rounded-[1.2rem]"
              >
                <div className="relative h-56 bg-[#f8fbfd]">
                  <Image
                    src={lot.image}
                    alt={lot.title}
                    fill
                    className="object-contain p-3"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <span className="accent-button absolute left-4 top-4 rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase">
                    {lot.categoryName}
                  </span>
                </div>

                <div className="space-y-4 p-5">
                  <div>
                    <h2 className="text-[1.45rem] font-extrabold tracking-[-0.04em] text-neutral-950">
                      {lot.title}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-neutral-600">
                      {lot.description}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-neutral-500">
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#0f5d86]" />
                      {lot.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-[#0f5d86]" />
                      {lot.endsAtLabel}
                    </p>
                    <p className="flex items-center gap-2">
                      <Gavel className="h-4 w-4 text-[#0f5d86]" />
                      {lot.bidCount} {lot.bidCount === 1 ? "lance" : "lances"}
                    </p>
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                        Lance atual
                      </p>
                      <p className="mt-1 text-[1.9rem] font-extrabold text-neutral-950">
                        {lot.currentBid}
                      </p>
                    </div>

                    <Link
                      href={`/leiloes/${lot.slug}`}
                      className="gold-button inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-bold transition hover:brightness-95"
                    >
                      Ver lote
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="section-card mt-8 rounded-[1.4rem] p-8 text-center">
            <h2 className="text-[1.8rem] font-extrabold tracking-[-0.04em] text-neutral-950">
              Nenhum lote encontrado
            </h2>
            <p className="mt-3 text-sm leading-7 text-neutral-600">
              Ajuste os termos da busca ou volte ao catálogo completo para ver
              todos os lotes disponíveis.
            </p>
            <div className="mt-5">
              <Link
                href="/leiloes"
                className="gold-button inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-bold transition hover:brightness-95"
              >
                Ver catálogo completo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
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

const inputClassName =
  "h-12 w-full rounded-xl border border-[#d5e0e8] bg-white px-4 text-sm text-neutral-900 outline-none transition focus:border-[#0f5d86]";

function isLotType(
  value: string,
): value is "property" | "electronics" | "luxury" | "other" {
  return ["property", "electronics", "luxury", "other"].includes(value);
}

function isLotStatus(value: string): value is "live" | "scheduled" {
  return ["live", "scheduled"].includes(value);
}

function isSortOption(
  value: string,
): value is "ending" | "price-asc" | "price-desc" | "recent" {
  return ["ending", "price-asc", "price-desc", "recent"].includes(value);
}
