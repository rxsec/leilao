import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function closeExpiredLots() {
  const now = new Date();
  const expiredLots = await prisma.lot.findMany({
    where: {
      status: "live",
      endsAt: {
        lte: now,
      },
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (expiredLots.length === 0) {
    return [];
  }

  const closedSlugs: string[] = [];

  for (const expiredLot of expiredLots) {
    const closedSlug = await prisma.$transaction(async (tx) =>
      closeLotInsideTransaction(tx, expiredLot.slug, now),
    );

    if (closedSlug) {
      closedSlugs.push(closedSlug);
    }
  }

  return closedSlugs;
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
