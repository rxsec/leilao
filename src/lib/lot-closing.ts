import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function closeExpiredLots() {
  return [];
}

export async function closeLotInsideTransaction(
  tx: Prisma.TransactionClient,
  lotSlug: string,
  closedAt = new Date(),
) {
  const lot = await tx.lot.findUnique({
    where: { slug: lotSlug },
    include: {
      bids: {
        orderBy: [{ amount: "desc" }, { createdAt: "desc" }],
        take: 1,
      },
    },
  });

  if (!lot) {
    throw new Error("Lote nao encontrado.");
  }

  if (lot.status === "closed") {
    return null;
  }

  const winningBid = lot.bids[0];

  await tx.lot.update({
    where: { id: lot.id },
    data: {
      status: "closed",
      closedAt,
      winnerUserId: winningBid?.userId ?? null,
    },
  });

  if (winningBid?.userId) {
    await tx.order.upsert({
      where: {
        lotId: lot.id,
      },
      update: {
        userId: winningBid.userId,
        amount: winningBid.amount,
        status: "pending",
      },
      create: {
        lotId: lot.id,
        userId: winningBid.userId,
        amount: winningBid.amount,
        status: "pending",
      },
    });
  }

  return lot.slug;
}
