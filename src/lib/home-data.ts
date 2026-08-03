import {
  premiumLots as fallbackPremiumLots,
  propertyLots as fallbackPropertyLots,
  spotlightCategories as fallbackSpotlightCategories,
} from "@/lib/branding";
import { prisma } from "@/lib/prisma";

type SpotlightCategory = {
  name: string;
  slug: string;
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

type HomeCategoryRecord = {
  name: string;
  slug: string;
  activeLots: number;
};

type HomeLotRecord = {
  slug: string;
  title: string;
  description: string | null;
  type: "property" | "electronics" | "luxury" | "other";
  city: string | null;
  state: string | null;
  currentBid: { toString(): string };
  bidCount: number;
  imageUrl: string | null;
  images: Array<{ url: string }>;
  endsAt: Date | null;
};

const categoryImages: Record<string, string> = {
  celulares: "/catalog/celulares/1.jpg",
  televisores: "/catalog/televisores/1.jpg",
  eletrodomesticos: "/catalog/eletrodomesticos/1.jpg",
  "ar-condicionado": "/catalog/ar-condicionado/1.jpg",
  notebooks: "/catalog/notebooks/1.jpg",
  "computadores-gamer": "/catalog/computadores-gamer/1.jpg",
  outros: "/catalog/outros/1.jpg",
  terrenos: "/catalog/terrenos/1.jpg",
  imoveis: "/catalog/imoveis/1.jpg",
  relogios: "/catalog/relogios/1.jpg",
  joias: "/catalog/joias/1.jpg",
  "artigos-de-luxo": "/catalog/artigos-de-luxo/1.jpg",
};

const preferredCategoryOrder = [
  "celulares",
  "televisores",
  "eletrodomesticos",
  "ar-condicionado",
  "notebooks",
  "computadores-gamer",
  "outros",
  "terrenos",
  "imoveis",
  "relogios",
  "joias",
  "artigos-de-luxo",
];

export async function getHomeData(): Promise<HomeData> {
  const [categories, lots]: [HomeCategoryRecord[], HomeLotRecord[]] = await Promise.all([
    prisma.category.findMany({
      orderBy: { createdAt: "asc" },
      take: 12,
    }),
    prisma.lot.findMany({
      where: { status: "live" },
      orderBy: [{ isFeatured: "desc" }, { endsAt: "asc" }],
      take: 12,
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
          select: { url: true },
        },
      },
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

  const spotlightCategories = categories.map((category: HomeCategoryRecord) => ({
    name: category.name,
    slug: category.slug,
    lots: category.activeLots,
    image: categoryImages[category.slug] ?? "/catalog/outros/1.jpg",
  })).sort(
    (left, right) =>
      preferredCategoryOrder.indexOf(left.slug) -
      preferredCategoryOrder.indexOf(right.slug),
  );

  const propertyLots = lots
    .filter((lot) => lot.type === "property")
    .slice(0, 2)
    .map((lot: HomeLotRecord, index: number) => ({
      slug: lot.slug,
      tag: index === 0 ? "Destaque" : "Popular",
      title: lot.title,
      subtitle: lot.description ?? "Oportunidade em leilao",
      location: [lot.city, lot.state].filter(Boolean).join(", ") || "Brasil",
      price: formatCurrency(Number(lot.currentBid)),
      bids: `${lot.bidCount} ${lot.bidCount === 1 ? "lance" : "lances"}`,
      ending: formatEndsAt(lot.endsAt ? lot.endsAt.toISOString() : null),
      image: lot.imageUrl ?? lot.images[0]?.url ?? "/catalog/imoveis/1.jpg",
    }));

  const premiumLots = lots
    .filter((lot) => lot.type !== "property")
    .slice(0, 4)
    .map((lot: HomeLotRecord) => ({
      slug: lot.slug,
      title: lot.title,
      lots: 1,
      image: lot.imageUrl ?? lot.images[0]?.url ?? "/catalog/outros/1.jpg",
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
