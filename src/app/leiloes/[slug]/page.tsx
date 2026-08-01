import Image from "next/image";
import Link from "next/link";
import { Clock3, Gavel, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { PlaceBidForm } from "@/components/place-bid-form";
import { getLotDetail } from "@/lib/auction-data";

export default async function LotDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getLotDetail(slug);

  if (!detail) {
    notFound();
  }

  const { lot, bidHistory, relatedLots, hasDatabase, usingFallbackData } =
    detail;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef4f8_0%,#f7f8fa_38%,#f8f5ef_100%)] px-4 py-8 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <Link
          href="/leiloes"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f5d86] transition hover:text-[#0a4b6d]"
        >
          Voltar para leiloes
        </Link>

        <div className="mt-5 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <article className="section-card overflow-hidden rounded-[1.4rem]">
            <div className="relative h-[22rem] bg-white sm:h-[28rem]">
              <Image
                src={lot.image}
                alt={lot.title}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 60vw"
              />
            </div>

            <div className="space-y-5 p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="accent-button rounded-full px-3 py-1 text-[0.72rem] font-bold uppercase">
                  {lot.categoryName}
                </span>
                <span className="rounded-full border border-[#d5e0e8] bg-white px-3 py-1 text-[0.72rem] font-semibold uppercase text-neutral-600">
                  {lot.status}
                </span>
                {usingFallbackData ? (
                  <span className="rounded-full border border-[#d5e0e8] bg-[#eef5fa] px-3 py-1 text-[0.72rem] font-semibold uppercase text-[#0f5d86]">
                    Demo
                  </span>
                ) : null}
              </div>

              <div>
                <h1 className="text-[2.3rem] font-extrabold tracking-[-0.05em] text-neutral-950 sm:text-[3rem]">
                  {lot.title}
                </h1>
                <p className="mt-3 max-w-[46rem] text-[1rem] leading-8 text-neutral-600">
                  {lot.description}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <InfoPill
                  icon={<MapPin className="h-4 w-4" />}
                  label={lot.location}
                />
                <InfoPill
                  icon={<Clock3 className="h-4 w-4" />}
                  label={lot.endsAtLabel}
                />
                <InfoPill
                  icon={<Gavel className="h-4 w-4" />}
                  label={`${lot.bidCount} ${
                    lot.bidCount === 1 ? "lance" : "lances"
                  }`}
                />
              </div>

              <div className="rounded-[1.2rem] bg-[#0f1720] p-5 text-white">
                <p className="text-xs uppercase tracking-[0.22em] text-white/55">
                  Lance atual
                </p>
                <p className="mt-2 text-[2.2rem] font-extrabold tracking-[-0.04em]">
                  {lot.currentBid}
                </p>
              </div>
            </div>
          </article>

          <aside className="space-y-5">
            <div className="section-card rounded-[1.4rem] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0f5d86]">
                Enviar lance
              </p>
              <h2 className="mt-3 text-[1.8rem] font-extrabold tracking-[-0.04em] text-neutral-950">
                Participe deste lote
              </h2>
              <p className="mt-3 text-sm leading-7 text-neutral-600">
                O valor enviado precisa superar o lance atual para ser aceito.
              </p>

              <div className="mt-5">
                <PlaceBidForm
                  lotSlug={lot.slug}
                  enabled={hasDatabase}
                  minimumBid={lot.currentBidValue}
                />
              </div>
            </div>

            <div className="section-card rounded-[1.4rem] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0f5d86]">
                Historico
              </p>
              <h2 className="mt-3 text-[1.6rem] font-extrabold tracking-[-0.04em] text-neutral-950">
                Ultimos lances
              </h2>
              <div className="mt-5 space-y-3">
                {bidHistory.length > 0 ? (
                  bidHistory.map((bid) => (
                    <div
                      key={bid.id}
                      className="rounded-xl border border-[#d5e0e8] bg-white px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-neutral-950">
                          {bid.bidderName}
                        </p>
                        <p className="font-extrabold text-[#0f5d86]">
                          {bid.amount}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-neutral-500">
                        {bid.createdAtLabel}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500">
                    Este lote ainda nao recebeu lances.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>

        {relatedLots.length > 0 ? (
          <section className="mt-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0f5d86]">
                Relacionados
              </p>
              <h2 className="mt-2 text-[2rem] font-extrabold tracking-[-0.04em] text-neutral-950">
                Outros lotes para explorar
              </h2>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {relatedLots.map((relatedLot) => (
                <Link
                  key={relatedLot.slug}
                  href={`/leiloes/${relatedLot.slug}`}
                  className="section-card overflow-hidden rounded-[1.2rem] transition hover:-translate-y-1"
                >
                  <div className="relative h-48 bg-white">
                    <Image
                      src={relatedLot.image}
                      alt={relatedLot.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="space-y-2 p-4">
                    <h3 className="text-xl font-extrabold tracking-[-0.03em] text-neutral-950">
                      {relatedLot.title}
                    </h3>
                    <p className="text-sm text-neutral-500">
                      {relatedLot.location}
                    </p>
                    <p className="text-lg font-extrabold text-[#0f5d86]">
                      {relatedLot.currentBid}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}

function InfoPill({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[#d5e0e8] bg-white px-4 py-3 text-sm text-neutral-600">
      <span className="text-[#0f5d86]">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
