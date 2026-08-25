import {
  premiumLots as fallbackPremiumLots,
  propertyLots as fallbackPropertyLots,
} from "@/lib/branding";
import { getCategoryImage, getLotGallery } from "@/lib/catalog-images";
import { closeExpiredLots } from "@/lib/lot-closing";
import { prisma } from "@/lib/prisma";

type LotType = "property" | "electronics" | "luxury" | "other";
type LotStatus = "draft" | "scheduled" | "live" | "closed";

export type AuctionLot = {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: LotType;
  location: string;
  currentBid: string;
  currentBidValue: number;
  bidCount: number;
  image: string;
  images: string[];
  endsAtLabel: string;
  endsAtIso: string | null;
  status: LotStatus;
  categoryName: string;
  categorySlug: string;
  isFeatured: boolean;
  minIncrementValue: number;
  reservePriceValue: number | null;
  buyNowPriceValue: number | null;
};

export type BidHistoryItem = {
  id: string;
  amount: string;
  amountValue: number;
  createdAtLabel: string;
};

export type LotDetail = {
  lot: AuctionLot;
  bidHistory: BidHistoryItem[];
  relatedLots: AuctionLot[];
  usingFallbackData: boolean;
  hasDatabase: boolean;
};

export type AuctionLotsResult = {
  lots: AuctionLot[];
  hasDatabase: boolean;
  usingFallbackData: boolean;
};

export type AuctionFilterOption = {
  slug: string;
  name: string;
};

type GetAuctionLotsOptions = {
  search?: string;
  category?: string;
  type?: LotType | "";
  status?: "live" | "scheduled" | "closed" | "";
  minPrice?: number | null;
  maxPrice?: number | null;
  sort?: "ending" | "price-asc" | "price-desc" | "recent";
};

type FallbackLotSeed = {
  slug: string;
  title: string;
  subtitle: string;
  type: LotType;
  location: string;
  currentBidValue: number;
  bidCount: number;
  image: string;
  endsAtOffsetHours: number;
  categoryName: string;
  isFeatured: boolean;
};

const fallbackLotSeeds: FallbackLotSeed[] = [
  {
    slug: "terreno-area-nobre-sp",
    title: fallbackPropertyLots[0].title,
    subtitle: fallbackPropertyLots[0].subtitle,
    type: "property",
    location: fallbackPropertyLots[0].location,
    currentBidValue: 120000,
    bidCount: 12,
    image: fallbackPropertyLots[0].image,
    endsAtOffsetHours: 62,
    categoryName: "Imoveis",
    isFeatured: true,
  },
  {
    slug: "apartamento-3-quartos-rj",
    title: fallbackPropertyLots[1].title,
    subtitle: fallbackPropertyLots[1].subtitle,
    type: "property",
    location: fallbackPropertyLots[1].location,
    currentBidValue: 350000,
    bidCount: 28,
    image: fallbackPropertyLots[1].image,
    endsAtOffsetHours: 32,
    categoryName: "Imoveis",
    isFeatured: true,
  },
  {
    slug: "relogio-premium",
    title: fallbackPremiumLots[0].title,
    subtitle: "Peca premium com acabamento refinado.",
    type: "luxury",
    location: "Sao Paulo, SP",
    currentBidValue: 6800,
    bidCount: 6,
    image: fallbackPremiumLots[0].image,
    endsAtOffsetHours: 18,
    categoryName: "Joias e Relogios",
    isFeatured: false,
  },
  {
    slug: "aneis-colecao",
    title: fallbackPremiumLots[1].title,
    subtitle: "Conjunto com design classico e boa liquidez.",
    type: "luxury",
    location: "Curitiba, PR",
    currentBidValue: 4200,
    bidCount: 4,
    image: fallbackPremiumLots[1].image,
    endsAtOffsetHours: 40,
    categoryName: "Joias e Relogios",
    isFeatured: false,
  },
  {
    slug: "corrente-ouro",
    title: fallbackPremiumLots[2].title,
    subtitle: "Item de valor com procura recorrente em leiloes.",
    type: "luxury",
    location: "Belo Horizonte, MG",
    currentBidValue: 5100,
    bidCount: 7,
    image: fallbackPremiumLots[2].image,
    endsAtOffsetHours: 21,
    categoryName: "Joias e Relogios",
    isFeatured: false,
  },
  {
    slug: "lote-luxos-diversos",
    title: fallbackPremiumLots[3].title,
    subtitle: "Selecao de itens premium para arremate rapido.",
    type: "other",
    location: "Rio de Janeiro, RJ",
    currentBidValue: 8900,
    bidCount: 10,
    image: fallbackPremiumLots[3].image,
    endsAtOffsetHours: 54,
    categoryName: "Consoles",
    isFeatured: false,
  },
];

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

export async function getAuctionLots(
  options?: GetAuctionLotsOptions,
): Promise<AuctionLotsResult> {
  await closeExpiredLots();

  const search = options?.search?.trim() ?? "";
  const category = options?.category?.trim() ?? "";
  const type = options?.type ?? "";
  const status = options?.status ?? "";
  const minPrice = options?.minPrice ?? null;
  const maxPrice = options?.maxPrice ?? null;
  const sort = options?.sort ?? "ending";
  const defaultStatuses: Array<"live" | "scheduled" | "closed"> = [
    "live",
    "scheduled",
    "closed",
  ];
  const statusFilter = status
    ? { status: status as "live" | "scheduled" | "closed" }
    : { status: { in: defaultStatuses } };
  const typeFilter = type ? { type } : {};
  const lots = await prisma.lot.findMany({
    where: {
      ...statusFilter,
      ...(category ? { category: { is: { slug: category } } } : {}),
      ...typeFilter,
      ...(minPrice !== null ? { currentBid: { gte: minPrice } } : {}),
      ...(maxPrice !== null ? { currentBid: { lte: maxPrice } } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { city: { contains: search, mode: "insensitive" } },
              { state: { contains: search, mode: "insensitive" } },
              {
                category: {
                  is: {
                    OR: [
                      { name: { contains: search, mode: "insensitive" } },
                      { slug: { contains: search, mode: "insensitive" } },
                    ],
                  },
                },
              },
            ],
          }
        : {}),
    },
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
    orderBy: resolveLotOrder(sort),
  });

  if (lots.length === 0) {
    return {
      lots: [],
      hasDatabase: true,
      usingFallbackData: false,
    };
  }

  return {
    lots: lots.map((lot) => mapLotRecord(lot)).sort(compareVisibleLots),
    hasDatabase: true,
    usingFallbackData: false,
  };
}

export async function getAuctionFilterOptions(): Promise<AuctionFilterOption[]> {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      slug: true,
      name: true,
    },
  });

  return categories.sort(
    (left, right) =>
      preferredCategoryOrder.indexOf(left.slug) -
      preferredCategoryOrder.indexOf(right.slug),
  );
}

export async function getLotDetail(slug: string): Promise<LotDetail | null> {
  await closeExpiredLots();

  const lot = await prisma.lot.findUnique({
    where: { slug },
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
      bids: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!lot) {
    return buildFallbackDetail(slug);
  }

  const allLots = await prisma.lot.findMany({
    where: { id: { not: lot.id }, status: { in: ["live", "scheduled"] } },
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
    orderBy: [{ isFeatured: "desc" }, { endsAt: "asc" }],
  });

  const mappedLot = mapLotRecord(lot);

  return {
    lot: mappedLot,
    bidHistory: lot.bids.map((bid) => ({
      id: bid.id,
      amount: formatCurrency(Number(bid.amount)),
      amountValue: Number(bid.amount),
      createdAtLabel: formatDateTime(bid.createdAt),
    })),
    relatedLots: allLots
      .map((item) => mapLotRecord(item))
      .filter(
        (item) =>
          item.type === mappedLot.type || item.categoryName === mappedLot.categoryName,
      )
      .slice(0, 3),
    usingFallbackData: false,
    hasDatabase: true,
  };
}

function buildFallbackLots(): AuctionLot[] {
  return fallbackLotSeeds.map((lot) => ({
    id: lot.slug,
    slug: lot.slug,
    title: lot.title,
    description: lot.subtitle,
    type: lot.type,
    location: lot.location,
    currentBid: formatCurrency(lot.currentBidValue),
    currentBidValue: lot.currentBidValue,
    bidCount: lot.bidCount,
    image: lot.image,
    images: [lot.image, lot.image, lot.image],
    endsAtLabel: formatEndsAt(
      new Date(Date.now() + lot.endsAtOffsetHours * 60 * 60 * 1000).toISOString(),
    ),
    endsAtIso: new Date(
      Date.now() + lot.endsAtOffsetHours * 60 * 60 * 1000,
    ).toISOString(),
    status: "live",
    categoryName: lot.categoryName,
    categorySlug: slugify(lot.categoryName),
    isFeatured: lot.isFeatured,
    minIncrementValue: 100,
    reservePriceValue: null,
    buyNowPriceValue: null,
  }));
}

function buildFallbackDetail(slug: string): LotDetail | null {
  const lots = buildFallbackLots();
  const lot = lots.find((item) => item.slug === slug);

  if (!lot) {
    return null;
  }

  return {
    lot,
    bidHistory: [
      {
        id: `${slug}-1`,
        amount: formatCurrency(lot.currentBidValue),
        amountValue: lot.currentBidValue,
        createdAtLabel: "Agora mesmo",
      },
      {
        id: `${slug}-2`,
        amount: formatCurrency(Math.max(lot.currentBidValue - 500, 100)),
        amountValue: Math.max(lot.currentBidValue - 500, 100),
        createdAtLabel: "Ha 2 horas",
      },
    ],
    relatedLots: lots.filter((item) => item.slug !== slug).slice(0, 3),
    usingFallbackData: true,
    hasDatabase: false,
  };
}

function mapLotRecord(lot: {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  type: LotType;
  city: string | null;
  state: string | null;
  currentBid: { toString(): string };
  bidCount: number;
  imageUrl: string | null;
  images: Array<{ url: string }>;
  isFeatured: boolean;
  endsAt: Date | null;
  status: LotStatus;
  minIncrement: { toString(): string };
  reservePrice: { toString(): string } | null;
  buyNowPrice: { toString(): string } | null;
  category: { name: string; slug: string } | null;
}) {
  const categoryName = lot.category?.name ?? inferCategoryName(lot.type);
  const categorySlug = lot.category?.slug ?? slugify(categoryName);
  const defaultGallery = getLotGallery(categorySlug, lot.slug);
  const gallery =
    lot.images.length > 0 &&
    !isGenericCatalogGallery(lot.images.map((image) => image.url), categorySlug)
      ? lot.images.map((image) => image.url)
      : defaultGallery;
  const coverImage =
    lot.imageUrl && !isGenericCatalogImage(lot.imageUrl, categorySlug)
      ? lot.imageUrl
      : gallery[0] ?? getCategoryImage(categorySlug) ?? fallbackPremiumLots[3].image;

  return {
    id: lot.id,
    slug: lot.slug,
    title: lot.title,
    description: lot.description ?? "Oportunidade disponivel para arremate.",
    type: lot.type,
    location: [lot.city, lot.state].filter(Boolean).join(", ") || "Brasil",
    currentBid: formatCurrency(Number(lot.currentBid)),
    currentBidValue: Number(lot.currentBid),
    bidCount: lot.bidCount,
    image: coverImage,
    images: gallery.length > 0 ? gallery : [coverImage],
    endsAtLabel: formatEndsAt(lot.endsAt ? lot.endsAt.toISOString() : null),
    endsAtIso: lot.endsAt ? lot.endsAt.toISOString() : null,
    status: lot.status,
    categoryName,
    categorySlug,
    isFeatured: lot.isFeatured,
    minIncrementValue: Number(lot.minIncrement),
    reservePriceValue: lot.reservePrice ? Number(lot.reservePrice) : null,
    buyNowPriceValue: lot.buyNowPrice ? Number(lot.buyNowPrice) : null,
  } satisfies AuctionLot;
}

function isGenericCatalogImage(url: string, categorySlug: string) {
  return url.startsWith(`/catalog/${categorySlug}/`);
}

function isGenericCatalogGallery(urls: string[], categorySlug: string) {
  return urls.length > 0 && urls.every((url) => isGenericCatalogImage(url, categorySlug));
}

function inferCategoryName(type: LotType) {
  if (type === "property") {
    return "Imóveis";
  }

  if (type === "electronics") {
    return "Eletrônicos";
  }

  if (type === "luxury") {
    return "Artigo de Luxos";
  }

  return "Consoles";
}

function resolveLotOrder(sort: GetAuctionLotsOptions["sort"]) {
  switch (sort) {
    case "price-asc":
      return [{ currentBid: "asc" as const }, { endsAt: "asc" as const }];
    case "price-desc":
      return [{ currentBid: "desc" as const }, { endsAt: "asc" as const }];
    case "recent":
      return [{ createdAt: "desc" as const }];
    case "ending":
    default:
      return [{ isFeatured: "desc" as const }, { endsAt: "asc" as const }];
  }
}

function compareVisibleLots(left: AuctionLot, right: AuctionLot) {
  const leftPriority = getStatusPriority(left.status);
  const rightPriority = getStatusPriority(right.status);

  if (leftPriority !== rightPriority) {
    return leftPriority - rightPriority;
  }

  const leftEndsAt = left.endsAtIso ? new Date(left.endsAtIso).getTime() : Number.MAX_SAFE_INTEGER;
  const rightEndsAt = right.endsAtIso ? new Date(right.endsAtIso).getTime() : Number.MAX_SAFE_INTEGER;

  return leftEndsAt - rightEndsAt;
}

function getStatusPriority(status: LotStatus) {
  if (status === "live") {
    return 0;
  }

  if (status === "scheduled") {
    return 1;
  }

  return 2;
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

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(value);
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");
}
