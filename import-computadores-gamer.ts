import { prisma } from "./src/lib/prisma";

async function main() {
  const category = await prisma.category.findUnique({
    where: { slug: "computadores-gamer" },
    select: { id: true },
  });

  if (!category) {
    throw new Error("Categoria computadores-gamer nao encontrada");
  }

  const now = new Date();
  const products = [
    {
      slug: "pc-gamer-ryzen-5-5600gt-vega-7-16gb",
      title: "PC Gamer Ryzen 5 5600GT - VEGA 7 16GB",
      description:
        "PC Gamer com Ryzen 5 5600GT, grafico Vega 7 e 16GB de memoria RAM.",
      currentBid: 900,
      minIncrement: 50,
      image: "/produtos/computadores-gamer/1/928604798483730.webp",
      featured: true,
      endsAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "pc-gamer-completo-rx-5500-8gb-all-black-rgb",
      title: "Pc Gamer Completo RX 5500 8Gb All Black com RGB",
      description:
        "Setup gamer completo com RX 5500 8GB, acabamento all black e iluminacao RGB.",
      currentBid: 950,
      minIncrement: 50,
      image: "/produtos/computadores-gamer/2/429630910920251.webp",
      featured: true,
      endsAt: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "pc-gamer-completo-rx-7600-8gb-32gb-ram",
      title: "PC Gamer Completo RX 7600 8GB + 32GB RAM",
      description:
        "PC Gamer de alto desempenho com RX 7600 8GB e 32GB de memoria RAM.",
      currentBid: 1900,
      minIncrement: 100,
      image: "/produtos/computadores-gamer/3/212691677367708.webp",
      featured: false,
      endsAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "pc-gamer-completo-ryzen-5-4500-gtx-1660-evga-16gb-ram",
      title: "PC Gamer Completo Ryzen 5 4500 - GTX 1660 EVGA - 16GB RAM",
      description:
        "Computador gamer com Ryzen 5 4500, GTX 1660 EVGA e 16GB de RAM.",
      currentBid: 1200,
      minIncrement: 50,
      image: "/produtos/computadores-gamer/4/202679313242818.webp",
      featured: false,
      endsAt: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "i5-3470-3-20ghz-12gb-geforce-gt-610",
      title: "i5-3470 3.20GHz - 12GB - GeForce GT 610",
      description:
        "Desktop com i5-3470, 12GB de RAM e placa GeForce GT 610 para entrada na categoria gamer.",
      currentBid: 1000,
      minIncrement: 50,
      image: "/produtos/computadores-gamer/5/172675780895935.webp",
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
