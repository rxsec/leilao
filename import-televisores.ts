import { prisma } from "./src/lib/prisma";

async function main() {
  const category = await prisma.category.findUnique({
    where: { slug: "televisores" },
    select: { id: true },
  });

  if (!category) {
    throw new Error("Categoria televisores nao encontrada");
  }

  const now = new Date();
  const products = [
    {
      slug: "smart-tv-lg-50-pol",
      title: "Smart TV LG 50 Pol.",
      description:
        "Televisor LG de 50 polegadas com otimo apelo para sala e revenda.",
      currentBid: 500,
      minIncrement: 30,
      image: "/produtos/televisores/1/285657310753641.webp",
      featured: true,
      endsAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "smart-tv-tcl-42-pol",
      title: "Smart TV TCL 42 Pol.",
      description:
        "Smart TV TCL de 42 polegadas, lote competitivo para uso domestico.",
      currentBid: 300,
      minIncrement: 20,
      image: "/produtos/televisores/2/468088854_18046558349488028_7654286122449352166_n.jpg",
      featured: true,
      endsAt: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "smart-tv-philco-40-pol",
      title: "Smart TV Philco 40 Pol.",
      description:
        "Smart TV Philco de 40 polegadas com excelente custo de entrada.",
      currentBid: 300,
      minIncrement: 20,
      image: "/produtos/televisores/3/549606797143936.webp",
      featured: false,
      endsAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "smart-tv-lg-4k-60-pol",
      title: "Smart TV LG 4K 60 Pol.",
      description:
        "Modelo LG 4K de 60 polegadas com destaque para ambientes amplos.",
      currentBid: 800,
      minIncrement: 50,
      image: "/produtos/televisores/4/698616674556115.webp",
      featured: false,
      endsAt: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "smart-tv-samsung-crystal-4k-50-pol",
      title: "Smart TV Samsung Crystal 4K 50 Pol.",
      description:
        "Samsung Crystal 4K de 50 polegadas, lote premium da categoria televisores.",
      currentBid: 850,
      minIncrement: 50,
      image: "/produtos/televisores/5/840420306252771.webp",
      featured: false,
      endsAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
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

  console.log(JSON.stringify({ activeLots, lots }, null, 2));
}

main().finally(async () => {
  await prisma.$disconnect();
});
