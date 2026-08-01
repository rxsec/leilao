import {
  premiumLots as fallbackPremiumLots,
  propertyLots as fallbackPropertyLots,
  spotlightCategories as fallbackSpotlightCategories,
} from "@/lib/branding";
import { prisma } from "@/lib/prisma";

type SpotlightCategory = {
  name: string;
  lots: number;
  image: string;
};

type PropertyLot = {
  slug: string;
  tag: string;
  title: string;
  subtitle: string;
  location: string;
  price: string;
  bids: string;
  ending: string;
  image: string;
};

type PremiumLot = {
  slug: string;
  title: string;
  lots: number;
  image: string;
};

export type HomeData = {
  categories: SpotlightCategory[];
  propertyLots: PropertyLot[];
  premiumLots: PremiumLot[];
  hasDatabase: boolean;
  usingFallbackData: boolean;
};

const categoryImages: Record<string, string> = {
  imoveis: "/reference-assets/property-terreno.png",
  eletronicos: "/reference-assets/cat-notebook.png",
  "joias-e-relogios": "/reference-assets/item-relogio.png",
  outros: "/reference-assets/item-luxos.png",
};

const lotImagesBySlug: Record<string, string> = {
  "apartamento-3-quartos-rj": "/reference-assets/property-apartamento.png",
  "terreno-area-nobre-sp": "/reference-assets/property-terreno.png",
  "notebook-premium": "/reference-assets/cat-notebook.png",
};

const premiumImagesByTitle: Record<string, string> = {
  relogio: "/reference-assets/item-relogio.png",
  aneis: "/reference-assets/item-aneis.png",
  corrente: "/reference-assets/item-corrente.png",
  luxos: "/reference-assets/item-luxos.png",
  notebook: "/reference-assets/cat-notebook.png",
};

export async function getHomeData(): Promise<HomeData> {
  const [categories, lots] = await Promise.all([
    prisma.category.findMany({
      orderBy: { activeLots: "desc" },
      take: 7,
    }),
    prisma.lot.findMany({
      where: { status: "live" },
      orderBy: [{ isFeatured: "desc" }, { endsAt: "asc" }],
      take: 12,
    }),
  ]);

  if (categories.length === 0 && lots.length === 0) {
    return {
      categories: fallbackSpotlightCategories,
      propertyLots: fallbackPropertyLots,
      premiumLots: fallbackPremiumLots,
      hasDatabase: false,
      usingFallbackData: true,
    };
  }

  const spotlightCategories = categories.map((category) => ({
    name: category.name,
    lots: category.activeLots,
    image: categoryImages[category.slug] ?? "/reference-assets/item-luxos.png",
  }));

  const propertyLots = lots
    .filter((lot) => lot.type === "property")
    .slice(0, 2)
    .map((lot, index) => ({
      slug: lot.slug,
      tag: index === 0 ? "Destaque" : "Popular",
      title: lot.title,
      subtitle: lot.description ?? "Oportunidade em leilao",
      location: [lot.city, lot.state].filter(Boolean).join(", ") || "Brasil",
      price: formatCurrency(Number(lot.currentBid)),
      bids: `${lot.bidCount} ${lot.bidCount === 1 ? "lance" : "lances"}`,
      ending: formatEndsAt(lot.endsAt ? lot.endsAt.toISOString() : null),
      image:
        lot.imageUrl ??
        lotImagesBySlug[lot.slug] ??
        "/reference-assets/property-terreno.png",
    }));

  const premiumLots = lots
    .filter((lot) => lot.type !== "property")
    .slice(0, 4)
    .map((lot) => ({
      slug: lot.slug,
      title: lot.title,
      lots: 1,
      image:
        lot.imageUrl ??
        resolvePremiumImage(lot.title) ??
        "/reference-assets/item-luxos.png",
    }));

  return {
    categories:
      spotlightCategories.length > 0
        ? spotlightCategories
        : fallbackSpotlightCategories,
    propertyLots:
      propertyLots.length > 0 ? propertyLots : fallbackPropertyLots,
    premiumLots: premiumLots.length > 0 ? premiumLots : fallbackPremiumLots,
    hasDatabase: true,
    usingFallbackData: false,
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatEndsAt(value: string | null) {
  if (!value) {
    return "Encerramento em breve";
  }

  const endsAt = new Date(value);
  const diff = endsAt.getTime() - Date.now();

  if (diff <= 0) {
    return "Encerrado";
  }

  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (days > 0) {
    return `Termina em ${days}d ${String(hours).padStart(2, "0")}h`;
  }

  return `Termina em ${String(hours).padStart(2, "0")}h`;
}

function resolvePremiumImage(title: string) {
  const normalizedTitle = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  return Object.entries(premiumImagesByTitle).find(([key]) =>
    normalizedTitle.includes(key),
  )?.[1];
}
