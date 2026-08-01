import {
  premiumLots as fallbackPremiumLots,
  propertyLots as fallbackPropertyLots,
  spotlightCategories,
} from "@/lib/branding";
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
  endsAtLabel: string;
  endsAtIso: string | null;
  status: LotStatus;
  categoryName: string;
  isFeatured: boolean;
  minIncrementValue: number;
  reservePriceValue: number | null;
  buyNowPriceValue: number | null;
};

export type BidHistoryItem = {
  id: string;
  bidderName: string;
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
    categoryName: "Outros",
    isFeatured: false,
  },
];

const categoryImageByName: Record<string, string> = Object.fromEntries(
  spotlightCategories.map((category) => [category.name, category.image]),
);

const categoryImageBySlug: Record<string, string> = {
  imoveis: fallbackPropertyLots[0].image,
  eletronicos:
    categoryImageByName["Notebook"] ?? "/reference-assets/cat-notebook.png",
  "joias-e-relogios": fallbackPremiumLots[0].image,
  outros: fallbackPremiumLots[3].image,
};

export async function getAuctionLots(): Promise<AuctionLotsResult> {
  const lots = await prisma.lot.findMany({
    where: { status: { in: ["live", "scheduled"] } },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    orderBy: [{ isFeatured: "desc" }, { endsAt: "asc" }],
  });

  if (lots.length === 0) {
    return {
      lots: buildFallbackLots(),
      hasDatabase: false,
      usingFallbackData: true,
    };
  }

  return {
    lots: lots.map((lot) => mapLotRecord(lot)),
    hasDatabase: true,
    usingFallbackData: false,
  };
}

export async function getLotDetail(slug: string): Promise<LotDetail | null> {
  const lot = await prisma.lot.findUnique({
    where: { slug },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
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
    },
    orderBy: [{ isFeatured: "desc" }, { endsAt: "asc" }],
  });

  const mappedLot = mapLotRecord(lot);

  return {
    lot: mappedLot,
    bidHistory: lot.bids.map((bid) => ({
      id: bid.id,
      bidderName: bid.bidderName,
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
    endsAtLabel: formatEndsAt(
      new Date(Date.now() + lot.endsAtOffsetHours * 60 * 60 * 1000).toISOString(),
    ),
    endsAtIso: new Date(
      Date.now() + lot.endsAtOffsetHours * 60 * 60 * 1000,
    ).toISOString(),
    status: "live",
    categoryName: lot.categoryName,
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
        bidderName: "Participante A",
        amount: formatCurrency(lot.currentBidValue),
        amountValue: lot.currentBidValue,
        createdAtLabel: "Agora mesmo",
      },
      {
        id: `${slug}-2`,
        bidderName: "Participante B",
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
  isFeatured: boolean;
  endsAt: Date | null;
  status: LotStatus;
  minIncrement: { toString(): string };
  reservePrice: { toString(): string } | null;
  buyNowPrice: { toString(): string } | null;
  category: { name: string; slug: string } | null;
}) {
  const categoryName = lot.category?.name ?? inferCategoryName(lot.type);

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
    image:
      lot.imageUrl ??
      categoryImageBySlug[lot.category?.slug ?? ""] ??
      fallbackPremiumLots[3].image,
    endsAtLabel: formatEndsAt(lot.endsAt ? lot.endsAt.toISOString() : null),
    endsAtIso: lot.endsAt ? lot.endsAt.toISOString() : null,
    status: lot.status,
    categoryName,
    isFeatured: lot.isFeatured,
    minIncrementValue: Number(lot.minIncrement),
    reservePriceValue: lot.reservePrice ? Number(lot.reservePrice) : null,
    buyNowPriceValue: lot.buyNowPrice ? Number(lot.buyNowPrice) : null,
  } satisfies AuctionLot;
}

function inferCategoryName(type: LotType) {
  if (type === "property") {
    return "Imoveis";
  }

  if (type === "electronics") {
    return "Eletronicos";
  }

  if (type === "luxury") {
    return "Joias e Relogios";
  }

  return "Outros";
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
