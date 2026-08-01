import { prisma } from "@/lib/prisma";

type LotType = "property" | "electronics" | "luxury" | "other";
type LotStatus = "draft" | "scheduled" | "live" | "closed";

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  activeLots: number;
};

export type AdminLot = {
  id: string;
  categoryId: string | null;
  title: string;
  slug: string;
  description: string | null;
  type: LotType;
  status: LotStatus;
  city: string | null;
  state: string | null;
  current_bid: number;
  min_increment: number;
  reserve_price: number | null;
  buy_now_price: number | null;
  image_url: string | null;
  is_featured: boolean;
  ends_at: string | null;
};

type AdminLotRecord = {
  id: string;
  categoryId: string | null;
  title: string;
  slug: string;
  description: string | null;
  type: LotType;
  status: LotStatus;
  city: string | null;
  state: string | null;
  currentBid: { toString(): string };
  minIncrement: { toString(): string };
  reservePrice: { toString(): string } | null;
  buyNowPrice: { toString(): string } | null;
  imageUrl: string | null;
  isFeatured: boolean;
  endsAt: Date | null;
};

export async function getAdminPanelData() {
  const [categories, lots]: [AdminCategory[], AdminLotRecord[]] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true, activeLots: true },
    }),
    prisma.lot.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    categories,
    lots: lots.map((lot: AdminLotRecord) => ({
      id: lot.id,
      categoryId: lot.categoryId,
      title: lot.title,
      slug: lot.slug,
      description: lot.description,
      type: lot.type,
      status: lot.status,
      city: lot.city,
      state: lot.state,
      current_bid: Number(lot.currentBid),
      min_increment: Number(lot.minIncrement),
      reserve_price: lot.reservePrice ? Number(lot.reservePrice) : null,
      buy_now_price: lot.buyNowPrice ? Number(lot.buyNowPrice) : null,
      image_url: lot.imageUrl,
      is_featured: lot.isFeatured,
      ends_at: lot.endsAt ? lot.endsAt.toISOString() : null,
    })) as AdminLot[],
    hasDatabase: true,
  };
}
