import { closeExpiredLots } from "@/lib/lot-closing";
import { prisma } from "@/lib/prisma";

export type UserBidItem = {
  bidId: string;
  lotId: string;
  lotSlug: string;
  lotTitle: string;
  amount: string;
  amountValue: number;
  createdAtLabel: string;
  lotStatus: string;
  currentBid: string;
  isWinning: boolean;
};

export type UserOrderItem = {
  orderId: string;
  lotSlug: string;
  lotTitle: string;
  amount: string;
  amountValue: number;
  status: "pending" | "paid" | "cancelled";
  createdAtLabel: string;
  paidAtLabel: string | null;
};

type DashboardBidRecord = {
  id: string;
  amount: { toString(): string };
  createdAt: Date;
  lot: {
    id: string;
    slug: string;
    title: string;
    status: string;
    currentBid: { toString(): string };
    winnerUserId: string | null;
  };
};

type DashboardOrderRecord = {
  id: string;
  amount: { toString(): string };
  status: "pending" | "paid" | "cancelled";
  createdAt: Date;
  paidAt: Date | null;
  lot: {
    slug: string;
    title: string;
  };
};

export async function getUserDashboardData(userId: string) {
  await closeExpiredLots();

  const [bids, orders]: [DashboardBidRecord[], DashboardOrderRecord[]] =
    await Promise.all([
    prisma.bid.findMany({
      where: { userId },
      include: {
        lot: {
          select: {
            id: true,
            slug: true,
            title: true,
            status: true,
            currentBid: true,
            winnerUserId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      where: { userId },
      include: {
        lot: {
          select: {
            slug: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    ]);

  return {
    bids: bids.map((bid: DashboardBidRecord) => ({
      bidId: bid.id,
      lotId: bid.lot.id,
      lotSlug: bid.lot.slug,
      lotTitle: bid.lot.title,
      amount: formatCurrency(Number(bid.amount)),
      amountValue: Number(bid.amount),
      createdAtLabel: formatDateTime(bid.createdAt),
      lotStatus: bid.lot.status,
      currentBid: formatCurrency(Number(bid.lot.currentBid)),
      isWinning: bid.lot.winnerUserId === userId,
    })) as UserBidItem[],
    orders: orders.map((order: DashboardOrderRecord) => ({
      orderId: order.id,
      lotSlug: order.lot.slug,
      lotTitle: order.lot.title,
      amount: formatCurrency(Number(order.amount)),
      amountValue: Number(order.amount),
      status: order.status,
      createdAtLabel: formatDateTime(order.createdAt),
      paidAtLabel: order.paidAt ? formatDateTime(order.paidAt) : null,
    })) as UserOrderItem[],
    hasDatabase: true,
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(value);
}
