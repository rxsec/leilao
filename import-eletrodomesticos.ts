import { prisma } from "./src/lib/prisma";

async function main() {
  const category = await prisma.category.findUnique({
    where: { slug: "eletrodomesticos" },
    select: { id: true },
  });

  if (!category) {
    throw new Error("Categoria eletrodomesticos nao encontrada");
  }

  const now = new Date();
  const products = [
    {
      slug: "geladeira-electrolux",
      title: "Geladeira Electrolux",
      description:
        "Geladeira Electrolux com excelente apelo para uso residencial e revenda.",
      currentBid: 600,
      minIncrement: 30,
      image: "/produtos/eletrodomesticos/1/images.jpeg",
      featured: true,
      endsAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "lavadora-frontal-10-5kg-samsung",
      title: "Lavadora frontal 10,5kg - Samsung",
      description:
        "Lavadora frontal Samsung 10,5kg, lote com boa liquidez e alto valor percebido.",
      currentBid: 400,
      minIncrement: 20,
      image: "/produtos/eletrodomesticos/2/Lavadora-frontal-105kg-120000-1.webp",
      featured: true,
      endsAt: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "maquina-de-lavar-11kg-brastemp",
      title: "Maquina de lavar 11kg - Brastemp",
      description:
        "Maquina de lavar Brastemp 11kg com excelente custo de entrada para arremate.",
      currentBid: 350,
      minIncrement: 20,
      image: "/produtos/eletrodomesticos/3/Maquina-de-lavar-Brastemp-11kg-68000-1.webp",
      featured: false,
      endsAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "microondas-electrolux",
      title: "Microondas Electrolux",
      description:
        "Microondas Electrolux com perfil domestico e oportunidade de arremate rapido.",
      currentBid: 150,
      minIncrement: 10,
      image: "/produtos/eletrodomesticos/4/WhatsApp-Image-2026-03-17-at-11.58.11-3.jpeg",
      featured: false,
      endsAt: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "fogao-de-piso-electrolux-6-bocas",
      title: "Fogao de Piso Electrolux de 6 bocas",
      description:
        "Fogao Electrolux de 6 bocas com boa atratividade para uso residencial.",
      currentBid: 250,
      minIncrement: 20,
      image: "/produtos/eletrodomesticos/5/570661314074680.webp",
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
