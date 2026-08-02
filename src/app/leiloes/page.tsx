import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, Gavel, MapPin } from "lucide-react";
import { getAuctionLots, type AuctionLot } from "@/lib/auction-data";

export default async function LeiloesPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query = resolvedSearchParams?.q?.trim() ?? "";
  const { lots } = await getAuctionLots({ search: query });
  const auctionLots: AuctionLot[] = lots;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef4f8_0%,#f7f8fa_40%,#f8f5ef_100%)] px-4 py-8 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#0c2331,#0f5d86)] px-6 py-8 text-white shadow-[0_20px_50px_rgba(15,93,134,0.2)] sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#bfe2f3]">
            Leiloes
          </p>
          <h1 className="mt-3 max-w-[40rem] text-[2.3rem] font-extrabold tracking-[-0.05em] sm:text-[3.1rem]">
            Catalogo de lotes com pagina de detalhe e envio de lances
          </h1>
          <p className="mt-4 max-w-[42rem] text-[1rem] leading-8 text-white/78">
            Agora o projeto ja cobre a jornada principal do usuario: explorar
            lotes, abrir um item e seguir para o lance.
          </p>
          {query ? (
            <p className="mt-4 text-sm text-[#d8edf8]">
              Busca ativa para: <span className="font-semibold">{query}</span>
            </p>
          ) : null}
        </div>

        {auctionLots.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {auctionLots.map((lot: AuctionLot) => (
              <article
                key={lot.slug}
                className="section-card overflow-hidden rounded-[1.2rem]"
              >
                <div className="relative h-56 bg-white">
                  <Image
                    src={lot.image}
                    alt={lot.title}
                    fill
                    className="object-cover"
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
