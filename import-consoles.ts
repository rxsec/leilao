import { prisma } from "./src/lib/prisma";

async function main() {
  const category = await prisma.category.findUnique({
    where: { slug: "outros" },
    select: { id: true },
  });

  if (!category) {
    throw new Error("Categoria outros nao encontrada");
  }

  await prisma.category.update({
    where: { id: category.id },
    data: { name: "Consoles" },
  });

  const now = new Date();
  const products = [
    {
      slug: "ps5-completo",
      title: "PS5 Completo",
      description:
        "Console PlayStation 5 completo, lote premium da categoria Consoles.",
      currentBid: 1400,
      minIncrement: 100,
      image: "/produtos/consoles/1/641386e0f1c5309dd6488049e3a35313.jpg",
      featured: true,
      endsAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "xbox-one",
      title: "Xbox One",
      description:
        "Console Xbox One com excelente oportunidade de arremate para uso ou revenda.",
      currentBid: 950,
      minIncrement: 50,
      image: "/produtos/consoles/2/641386e0f1c5309dd6488049e3a35313.jpg",
      featured: true,
      endsAt: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "xbox-series-x",
      title: "Xbox Series X",
      description:
        "Console Xbox Series X com alto valor percebido e ótima liquidez na categoria.",
      currentBid: 1300,
      minIncrement: 100,
      image: "/produtos/consoles/3/images.jpeg",
      featured: false,
      endsAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const product of products) {
    await prisma.lot.upsert({
      where: { slug: product.slug },
      update: {
        categoryId: category.id,
        title: product.title,
        description: product.description,
        type: "electronics",
        status: "live",
        city: "Sao Paulo",
        state: "SP",
        currentBid: product.currentBid,
        bidCount: 0,
        minIncrement: product.minIncrement,
        reservePrice: product.currentBid,
        buyNowPrice: product.currentBid,
        imageUrl: product.image,
        isFeatured: product.featured,
        endsAt: product.endsAt,
        closedAt: null,
        winnerUserId: null,
      },
      create: {
        categoryId: category.id,
        title: product.title,
        slug: product.slug,
        description: product.description,
        type: "electronics",
        status: "live",
        city: "Sao Paulo",
        state: "SP",
        currentBid: product.currentBid,
        bidCount: 0,
        minIncrement: product.minIncrement,
        reservePrice: product.currentBid,
        buyNowPrice: product.currentBid,
        imageUrl: product.image,
        isFeatured: product.featured,
        endsAt: product.endsAt,
        images: {
          create: [{ url: product.image, sortOrder: 0 }],
        },
      },
    });

    const lot = await prisma.lot.findUnique({
      where: { slug: product.slug },
      select: { id: true },
    });

    if (!lot) {
      continue;
    }

    await prisma.lotImage.deleteMany({
      where: { lotId: lot.id, NOT: { url: product.image } },
    });

    const imageExists = await prisma.lotImage.findFirst({
      where: { lotId: lot.id, url: product.image },
    });

    if (!imageExists) {
      await prisma.lotImage.create({
        data: { lotId: lot.id, url: product.image, sortOrder: 0 },
      });
    }
  }

  const activeLots = await prisma.lot.count({
    where: { categoryId: category.id, status: { in: ["live", "scheduled"] } },
  });

  await prisma.category.update({
    where: { id: category.id },
    data: { activeLots },
  });

  const updatedCategory = await prisma.category.findUnique({
    where: { id: category.id },
    select: { name: true, slug: true, activeLots: true },
  });

  const lots = await prisma.lot.findMany({
    where: { categoryId: category.id },
    orderBy: { createdAt: "asc" },
    select: {
      title: true,
      slug: true,
      currentBid: true,
      imageUrl: true,
      status: true,
    },
  });

  console.log(JSON.stringify({ category: updatedCategory, lots }, null, 2));
}

main().finally(async () => {
  await prisma.$disconnect();
});
