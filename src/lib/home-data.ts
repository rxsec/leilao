import {
  spotlightCategories as fallbackSpotlightCategories,
} from "@/lib/branding";
import {
  featuredHomeLotSlugs,
  featuredPremiumLotSlugs,
  getCategoryImage,
  getLotCoverImage,
} from "@/lib/catalog-images";
import { prisma } from "@/lib/prisma";

type SpotlightCategory = {
  name: string;
  slug: string;
  lots: number;
  image: string;
};

type ActiveLot = {
  slug: string;
  title: string;
  subtitle: string;
  location: string;
  price: string;
  bids: string;
  ending: string;
  image: string;
  categoryName: string;
};

type PremiumLot = {
  slug: string;
  title: string;
  lots: number;
  image: string;
};

export type HomeData = {
  categories: SpotlightCategory[];
  activeLots: ActiveLot[];
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
  category: {
    name: string;
    slug: string;
  } | null;
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
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
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
      activeLots: [],
      premiumLots: [],
      hasDatabase: false,
      usingFallbackData: true,
    };
  }

  const spotlightCategories = categories.map((category: HomeCategoryRecord) => ({
    name: category.name,
    slug: category.slug,
    lots: category.activeLots,
    image: getCategoryImage(category.slug),
  })).sort(
    (left, right) =>
      preferredCategoryOrder.indexOf(left.slug) -
      preferredCategoryOrder.indexOf(right.slug),
  );

  const activeLots = sortLotsBySlugOrder(lots, featuredHomeLotSlugs)
    .slice(0, 6)
    .map((lot: HomeLotRecord) => ({
      slug: lot.slug,
      title: lot.title,
      subtitle: lot.description ?? "Oportunidade em leilao",
      location: [lot.city, lot.state].filter(Boolean).join(", ") || "Brasil",
      price: formatCurrency(Number(lot.currentBid)),
      bids: `${lot.bidCount} ${lot.bidCount === 1 ? "lance" : "lances"}`,
      ending: formatEndsAt(lot.endsAt ? lot.endsAt.toISOString() : null),
      image: getLotCoverImage(lot.category?.slug ?? inferCategorySlug(lot.type), lot.slug),
      categoryName: lot.category?.name ?? inferCategoryName(lot.type),
    }));

  const premiumLots = lots
    .filter((lot) => lot.type !== "property")
    .sort((left, right) => compareLotSlugs(left.slug, right.slug, featuredPremiumLotSlugs))
    .slice(0, 4)
    .map((lot: HomeLotRecord) => ({
      slug: lot.slug,
      title: lot.title,
      lots: 1,
      image: getLotCoverImage(lot.category?.slug ?? inferCategorySlug(lot.type), lot.slug),
    }));

  return {
    categories:
      spotlightCategories.length > 0
        ? spotlightCategories
        : fallbackSpotlightCategories,
    activeLots,
    premiumLots,
    hasDatabase: true,
    usingFallbackData: false,
  };
}

function inferCategoryName(type: HomeLotRecord["type"]) {
  if (type === "property") {
    return "Imoveis";
  }

  if (type === "luxury") {
    return "Artigos de Luxo";
  }

  if (type === "electronics") {
    return "Eletronicos";
  }

  return "Consoles";
}

function inferCategorySlug(type: HomeLotRecord["type"]) {
  if (type === "property") {
    return "imoveis";
  }

  if (type === "luxury") {
    return "artigos-de-luxo";
  }

  if (type === "electronics") {
    return "outros";
  }

  return "outros";
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

function sortLotsBySlugOrder(lots: HomeLotRecord[], orderedSlugs: string[]) {
  return [...lots].sort((left, right) =>
    compareLotSlugs(left.slug, right.slug, orderedSlugs),
  );
}

function compareLotSlugs(leftSlug: string, rightSlug: string, orderedSlugs: string[]) {
  const leftIndex = orderedSlugs.indexOf(leftSlug);
  const rightIndex = orderedSlugs.indexOf(rightSlug);

  if (leftIndex === -1 && rightIndex === -1) {
    return leftSlug.localeCompare(rightSlug);
  }

  if (leftIndex === -1) {
    return 1;
  }

  if (rightIndex === -1) {
    return -1;
  }

  return leftIndex - rightIndex;
}
