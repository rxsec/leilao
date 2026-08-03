import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CirclePlay,
  CreditCard,
  Gavel,
  Headphones,
  MapPin,
  PackageCheck,
  Shield,
  Truck,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { NewsletterForm } from "@/components/newsletter-form";
import { siteConfig, trustItems } from "@/lib/branding";
import { getHomeData } from "@/lib/home-data";

export default async function Home() {
  const {
    categories,
    hasDatabase,
    premiumLots,
    propertyLots,
    usingFallbackData,
  } = await getHomeData();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eaf1f6_0%,#f4f8fb_16%,#f7f8fa_40%)]">
      <div className="w-full">
        <section className="hero-photo relative overflow-hidden bg-[#121212] text-white">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,9,0.97)_0%,rgba(10,10,10,0.9)_44%,rgba(10,10,10,0.36)_100%)]" />
          <div className="hero-grid" />
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
          <div className="relative grid min-h-[20rem] gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:px-10 xl:grid-cols-[minmax(0,46rem)_1fr] xl:gap-10 xl:px-12">
            <div className="max-w-[46rem]">
              <div className="inline-flex rounded-full border border-[#6cb0d5]/20 bg-[#6cb0d5]/10 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-[#8fc8e7]">
                Leilões Online
              </div>
              <h1 className="font-display mt-5 text-[2.55rem] font-extrabold leading-[1.02] tracking-[-0.06em] sm:text-[3.35rem] md:max-w-[36rem] lg:text-[4rem] xl:max-w-none xl:text-[5.1rem]">
                Os melhores produtos
                <br />
                com os{" "}
                <span className="text-[#6cb0d5]">menores preços!</span>
              </h1>
              <p className="mt-5 max-w-[40rem] text-[0.98rem] leading-7 text-white/84 sm:text-[1.05rem] sm:leading-8">
                Participe dos nossos leilões online e arremate produtos
                incríveis com segurança e transparência.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:flex xl:flex-row">
                <Link
                  href="/leiloes"
                  className="gold-button inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold shadow-[0_14px_30px_rgba(15,93,134,0.22)] transition hover:brightness-95 sm:px-6"
                >
                  <Gavel className="h-4 w-4" />
                  Ver Leilões Ativos
                </Link>
                <Link
                  href="#como-funciona"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/28 px-5 text-sm font-semibold text-white transition hover:bg-white/8 sm:px-6"
                >
                  <CirclePlay className="h-4 w-4" />
                  Como Funciona
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-4">
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
            </div>

            <div className="relative hidden min-h-[24rem] xl:block">
              <div className="absolute left-[8%] top-[8%] h-32 w-32 rounded-full border border-[#6cb0d5]/20 bg-[#6cb0d5]/8 backdrop-blur-sm animate-[pulse_5s_ease-in-out_infinite]" />
              <div className="absolute right-[12%] top-[18%] h-24 w-24 rounded-full border border-white/10 bg-white/4 animate-[pulse_7s_ease-in-out_infinite]" />
              <div className="absolute bottom-[12%] left-[18%] h-40 w-40 rounded-full border border-[#0f5d86]/18 bg-[#0f5d86]/10 blur-[2px] animate-[pulse_9s_ease-in-out_infinite]" />

              <div className="absolute right-[10%] top-[14%] w-[18rem] rounded-[1.4rem] border border-white/10 bg-white/6 p-5 backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.28em] text-[#6cb0d5]">
                  Leilões em destaque
                </p>
                <p className="mt-3 text-2xl font-bold text-white">
                  Imóveis, eletrônicos e itens premium
                </p>
                <p className="mt-3 text-sm leading-7 text-white/68">
                  Plataforma moderna com experiência organizada para o usuário
                  encontrar oportunidades com rapidez.
                </p>
              </div>

              <div className="absolute left-[12%] bottom-[10%] w-[16rem] rounded-[1.4rem] border border-white/10 bg-[#0f5d86]/18 p-5 backdrop-blur-md">
                <p className="text-sm font-semibold text-white/74">
                  Ambientes seguros, navegação simples e identidade visual mais
                  alinhada com a marca.
                </p>
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <div className="h-2 w-[72%] rounded-full bg-[#6cb0d5]" />
                </div>
              </div>
            </div>
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
              Enquanto o catálogo principal é montado, esta vitrine mostra itens
              de referência para manter a navegação ativa.
            </p>
          ) : null}

          <SectionHeader
            id="leiloes"
            title="Outros Imóveis"
            action="Ver todos imóveis"
            darkAction
            className="mt-10"
          />
          <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr_0.95fr]">
            {propertyLots.map((lot) => (
              <Link
                key={lot.title}
                href={`/leiloes/${lot.slug}`}
                className="section-card overflow-hidden rounded-[1rem] transition hover:-translate-y-1"
              >
                <div className="relative h-[10.2rem] overflow-hidden sm:h-[12rem]">
                  <Image
                    src={lot.image}
                    alt={lot.title}
                    fill
                    className="object-cover"
                    sizes="350px"
                  />
                  <span className="accent-button absolute left-4 top-4 rounded-full px-3 py-1 text-[0.68rem] font-bold">
                    {lot.tag}
                  </span>
                </div>
                <div className="space-y-3 p-4 sm:p-5">
                  <div>
                    <h3 className="text-[1.55rem] font-extrabold uppercase text-neutral-950">
                      {lot.title}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500">{lot.subtitle}</p>
                  </div>
                  <p className="flex items-center gap-2 text-sm text-neutral-500">
                    <MapPin className="h-4 w-4" />
                    {lot.location}
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs text-neutral-400">Lance atual</p>
                      <p className="mt-1 text-[2rem] font-extrabold text-neutral-950">
                        {lot.price}
                      </p>
                    </div>
                    <div className="text-left text-sm text-neutral-500 sm:text-right">
                      <p>{lot.bids}</p>
                      <p>{lot.ending}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            <aside className="rounded-[1rem] bg-[linear-gradient(160deg,#0b2230,#0f4f72)] p-5 text-white shadow-[0_18px_40px_rgba(15,93,134,0.18)]">
              <div className="grid-pattern flex h-full min-h-[17rem] flex-col justify-between rounded-[0.9rem] border border-white/10 p-6 sm:min-h-[19rem]">
                <PackageCheck className="h-11 w-11 text-[#d7eef8]" />
                <div>
                  <h3 className="text-[2rem] font-extrabold uppercase">
                    Outros Imóveis
                  </h3>
                  <p className="mt-4 max-w-[15rem] text-base leading-7 text-white/82">
                    Confira mais opções de imóveis disponíveis para leilão.
                  </p>
                  <Link
                    href="/leiloes"
                    className="accent-button mt-7 inline-flex h-11 items-center rounded-xl px-5 text-sm font-bold shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition hover:brightness-95"
                  >
                    Ver todos
                  </Link>
                </div>
              </div>
            </aside>
          </div>

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
                <div className="relative h-[10.5rem] overflow-hidden sm:h-[12rem]">
                  <Image
                    src={lot.image}
                    alt={lot.title}
                    fill
                    className="object-cover"
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

            <aside className="rounded-[1rem] bg-[linear-gradient(160deg,#0b2230,#0f4f72)] p-5 text-white shadow-[0_18px_40px_rgba(15,93,134,0.18)]">
              <div className="grid-pattern flex h-full min-h-[17rem] flex-col justify-between rounded-[0.9rem] border border-white/10 p-6 sm:min-h-[19rem]">
                <PackageCheck className="h-11 w-11 text-[#d7eef8]" />
                <div>
                  <h3 className="text-[2rem] font-extrabold uppercase">
                    Outros Itens
                  </h3>
                  <p className="mt-4 max-w-[15rem] text-base leading-7 text-white/82">
                    Descubra muito mais produtos incríveis para arrematar.
                  </p>
                  <Link
                    href="/leiloes"
                    className="accent-button mt-7 inline-flex h-11 items-center rounded-xl px-5 text-sm font-bold shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition hover:brightness-95"
                  >
                    Ver todos
                  </Link>
                </div>
              </div>
            </aside>
          </div>

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

          <section className="mt-10 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <div
              id="sobre-nos"
              className="section-card rounded-[1rem] px-5 py-6 sm:px-6"
            >
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0f5d86]">
                Sobre Nós
              </p>
              <h2 className="mt-3 text-[2rem] font-extrabold tracking-[-0.04em] text-neutral-950">
                Estrutura pronta para uma operação de leilões moderna
              </h2>
              <p className="mt-4 max-w-[42rem] text-[1rem] leading-8 text-neutral-600">
                Esta base foi organizada para servir como homepage institucional
                de leilões, com visual alinhado à marca, áreas de destaque para
                produtos, imóveis e itens de valor, além de uma estrutura fácil
                de conectar ao Supabase e publicar na Vercel.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <MiniStat label="Base visual" value="Pronta" />
                <MiniStat label="Supabase" value="Estruturado" />
                <MiniStat label="Deploy" value="Vercel Ready" />
              </div>
            </div>

            <div
              id="contato"
              className="rounded-[1rem] bg-[linear-gradient(160deg,#0b2230,#0f4f72)] p-5 text-white shadow-[0_18px_40px_rgba(15,93,134,0.18)]"
            >
              <div className="grid-pattern flex h-full flex-col justify-between rounded-[0.9rem] border border-white/10 p-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#bfe2f3]">
                    Contato
                  </p>
                  <h2 className="mt-3 text-[2rem] font-extrabold tracking-[-0.04em] text-white">
                    Central de atendimento
                  </h2>
                  <p className="mt-4 text-[1rem] leading-8 text-white/78">
                    Use esta área para captar leads, responder dúvidas e
                    direcionar visitantes para a equipe comercial.
                  </p>
                </div>
                <div className="mt-6 space-y-3 text-sm text-white/86">
                  <p>E-mail: {siteConfig.supportEmail}</p>
                  <p>Telefone: {siteConfig.phone}</p>
                  <p>Cidade: {siteConfig.city}</p>
                </div>
                <NewsletterForm enabled={hasDatabase} />
              </div>
            </div>
          </section>

          <footer className="mt-10 rounded-[1rem] bg-[#0f1720] px-5 py-6 text-white sm:px-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <BrandLogo className="h-12 w-[16rem] sm:h-14 sm:w-[18rem]" />
                <p className="mt-4 max-w-[28rem] text-sm leading-7 text-white/62">
                  {siteConfig.name} - plataforma institucional para leilões
                  online com identidade moderna, estrutura pronta para
                  integração com Supabase e publicação na Vercel.
                </p>
              </div>

              <div className="grid gap-3 text-sm text-white/70 sm:grid-cols-2 lg:text-right">
                <Link href="#categorias" className="transition hover:text-white">
                  Categorias
                </Link>
                <Link
                  href="#como-funciona"
                  className="transition hover:text-white"
                >
                  Como Funciona
                </Link>
                <Link href="#sobre-nos" className="transition hover:text-white">
                  Sobre Nós
                </Link>
                <Link href="#contato" className="transition hover:text-white">
                  Contato
                </Link>
              </div>
            </div>
          </footer>
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
        className={`inline-flex h-11 items-center gap-2 self-start rounded-full px-5 text-sm font-medium transition sm:self-auto ${
          darkAction
            ? "bg-[#111111] text-white hover:bg-[#1a1a1a]"
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
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-white">{icon}</div>
      <div>
        <p className="font-semibold text-white">{title}</p>
        <p className="text-sm text-white/66">{text}</p>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
        {label}
      </p>
      <p className="mt-2 text-lg font-extrabold text-[#0f5d86]">{value}</p>
    </div>
  );
}
