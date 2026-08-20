import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Gavel,
  Headphones,
  Shield,
  Truck,
} from "lucide-react";
import { BannerCarousel } from "@/components/banner-carousel";
import { trustItems } from "@/lib/branding";
import { CountdownLabel } from "@/components/countdown-label";
import { getHomeData } from "@/lib/home-data";

export default async function Home() {
  const {
    activeLots,
    categories,
    premiumLots,
    usingFallbackData,
  } = await getHomeData();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eaf1f6_0%,#f4f8fb_16%,#f7f8fa_40%)]">
      <div className="w-full">
        <BannerCarousel />

        <section className="bg-[#f6f8fb] px-4 pb-8 sm:px-6 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            <HeroMeta
              icon={<Shield className="h-4.5 w-4.5" />}
              title="100% Seguro"
              text="Seus dados protegidos"
            />
            <HeroMeta
              icon={<CreditCard className="h-4.5 w-4.5" />}
              title="Parcelamento"
              text="Em até 12x no cartão"
            />
            <HeroMeta
              icon={<BadgeCheck className="h-4.5 w-4.5" />}
              title="Transparência"
              text="Leilões certificados"
            />
          </div>
        </section>

        <section className="bg-[#f8f5ef] px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
          <SectionHeader
            id="categorias"
            title="Categorias em Destaque"
            action="Ver catálogo completo"
          />
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/leiloes?category=${category.slug}`}
                className="section-card rounded-[1rem] p-3 transition hover:-translate-y-1"
              >
                <div className="relative h-40 overflow-hidden rounded-[0.9rem] bg-white sm:h-44">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-contain p-3"
                    sizes="150px"
                  />
                </div>
                <div className="px-1 pb-1 pt-4">
                  <h3 className="text-center text-[0.95rem] font-extrabold uppercase text-neutral-950">
                    {category.name}
                  </h3>
                  <div className="mt-3 flex justify-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-soft)] bg-white px-3 py-1.5 text-[0.72rem] font-medium text-neutral-500">
                      <Gavel className="h-3 w-3 text-[var(--brand)]" />
                      {category.lots} Leilões ativos
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {usingFallbackData ? (
            <p className="mt-4 text-sm text-neutral-500">
              As categorias seguem visíveis enquanto novos produtos são
              organizados no catálogo.
            </p>
          ) : null}

          {activeLots.length > 0 ? (
            <>
              <SectionHeader
                id="leiloes"
                title="Leilões ativos"
                action="Ver todos leilões"
                darkAction
                className="mt-10"
              />
              <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {activeLots.map((lot) => (
                  <Link
                    key={lot.slug}
                    href={`/leiloes/${lot.slug}`}
                    className="section-card overflow-hidden rounded-[1rem] transition hover:-translate-y-1"
                  >
                    <div className="relative h-[10.2rem] overflow-hidden bg-[#f8fbfd] sm:h-[12rem]">
                      <Image
                        src={lot.image}
                        alt={lot.title}
                        fill
                        className="object-contain p-3"
                        sizes="350px"
                      />
                      <span className="accent-button absolute left-4 top-4 rounded-full px-3 py-1 text-[0.68rem] font-bold">
                        {lot.categoryName}
                      </span>
                      <span className="absolute right-4 top-4 rounded-full border border-[#d5e0e8] bg-white px-3 py-1 text-[0.68rem] font-bold uppercase text-neutral-700">
                        {translateHomeLotStatus(lot.status)}
                      </span>
                    </div>
                    <div className="space-y-3 p-4 sm:p-5">
                      <div>
                        <h3 className="text-[1.35rem] font-extrabold uppercase text-neutral-950">
                          {lot.title}
                        </h3>
                        <p className="mt-1 text-sm text-neutral-500">{lot.subtitle}</p>
                      </div>
                      <p className="text-sm text-neutral-500">{lot.location}</p>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <p className="text-xs text-neutral-400">Lance atual</p>
                          <p className="mt-1 text-[2rem] font-extrabold text-neutral-950">
                            {lot.price}
                          </p>
                        </div>
                        <div className="text-left text-sm text-neutral-500 sm:text-right">
                          <p>{lot.bids}</p>
                          <p>
                            <CountdownLabel
                              endsAtIso={lot.endsAtIso}
                              fallbackLabel={lot.ending}
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : null}

          {premiumLots.length > 0 ? (
            <>
              <SectionHeader
                id="itens"
                title="Outros Itens de Valor"
                action="Ver todos itens"
                className="mt-10"
              />
              <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_0.95fr]">
                {premiumLots.map((lot) => (
                  <Link
                    key={lot.title}
                    href={`/leiloes/${lot.slug}`}
                    className="section-card flex h-full flex-col overflow-hidden rounded-[1rem] transition hover:-translate-y-1"
                  >
                    <div className="relative h-[10.5rem] overflow-hidden bg-[#f8fbfd] sm:h-[12rem]">
                      <Image
                        src={lot.image}
                        alt={lot.title}
                        fill
                        className="object-contain p-3"
                        sizes="200px"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                      <h3 className="text-center text-[1.05rem] font-extrabold uppercase text-neutral-950">
                        {lot.title}
                      </h3>
                      <div className="mt-3 flex justify-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-soft)] bg-white px-3 py-1.5 text-[0.72rem] font-medium text-neutral-500">
                          <Gavel className="h-3 w-3 text-[var(--brand)]" />
                          {lot.lots} Leilões ativos
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : null}

          <section
            id="como-funciona"
            className="section-card mt-10 grid gap-5 rounded-[1rem] px-4 py-5 sm:px-6 sm:py-6 md:grid-cols-2 xl:grid-cols-4"
          >
            {trustItems.map((item, index) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="rounded-2xl bg-white p-3 text-neutral-950">
                  {index === 0 ? <Shield className="h-6 w-6" /> : null}
                  {index === 1 ? <Headphones className="h-6 w-6" /> : null}
                  {index === 2 ? <CreditCard className="h-6 w-6" /> : null}
                  {index === 3 ? <Truck className="h-6 w-6" /> : null}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-950">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-500">{item.text}</p>
                </div>
              </div>
            ))}
          </section>
        </section>
      </div>
    </main>
  );
}

function SectionHeader({
  id,
  title,
  action,
  darkAction = false,
  className = "",
}: {
  id?: string;
  title: string;
  action: string;
  darkAction?: boolean;
  className?: string;
}) {
  return (
    <div
      id={id}
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <h2 className="text-[2.1rem] font-extrabold tracking-[-0.04em] text-neutral-950">
        {title}
      </h2>
      <Link
        href={id ? `#${id}` : "#"}
        className={`inline-flex h-10 items-center gap-2 self-start rounded-full px-5 text-sm font-medium transition sm:self-auto ${
          darkAction
            ? "bg-[#0f5d86] text-white shadow-[0_10px_24px_rgba(15,93,134,0.18)] hover:brightness-95"
            : "border border-black/8 bg-white text-neutral-700 hover:border-black/15"
        }`}
      >
        {action}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function HeroMeta({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[1rem] border border-[#d8e4ec] bg-white px-4 py-4 shadow-[0_12px_30px_rgba(15,93,134,0.06)]">
      <div className="mt-1 text-[#0f5d86]">{icon}</div>
      <div>
        <p className="font-semibold text-[#102331]">{title}</p>
        <p className="text-sm text-[#61788b]">{text}</p>
      </div>
    </div>
  );
}

function translateHomeLotStatus(status: "live" | "scheduled" | "closed") {
  if (status === "live") {
    return "Ao vivo";
  }

  if (status === "scheduled") {
    return "Agendado";
  }

  return "Encerrado";
}
