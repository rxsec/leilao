import { prisma } from "./src/lib/prisma";

async function main() {
  const category = await prisma.category.findUnique({
    where: { slug: "ar-condicionado" },
    select: { id: true },
  });

  if (!category) {
    throw new Error("Categoria ar-condicionado nao encontrada");
  }

  const now = new Date();
  const products = [
    {
      slug: "ar-condicionado-split-consul",
      title: "Ar condicionado Split CONSUL",
      description:
        "Ar condicionado Split Consul com boa procura para ambientes residenciais.",
      currentBid: 250,
      minIncrement: 20,
      image: "/produtos/ar-condicionado/1/556460087576341.webp",
      featured: true,
      endsAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "ar-condicionado-split-tcl-t-pro-2-0-18000-btus-inverter",
      title: "Ar condicionado SPLIT TCL T-PRO 2.0 18000 BTUS INVERTER",
      description:
        "Modelo TCL T-PRO inverter 18000 BTUs com perfil premium da categoria.",
      currentBid: 850,
      minIncrement: 50,
      image: "/produtos/ar-condicionado/2/164559034011651.webp",
      featured: true,
      endsAt: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "ar-condicionado-split-gree-18000-btus",
      title: "Ar-condicionado Split GREE 18000 BTUs",
      description:
        "Ar-condicionado Split GREE 18000 BTUs com excelente atratividade para revenda.",
      currentBid: 850,
      minIncrement: 50,
      image: "/produtos/ar-condicionado/3/764508328937544.webp",
      featured: false,
      endsAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "ar-condicionado-elgin-12-mil-btus",
      title: "Ar Condicionado Elgin 12 mil BTUs",
      description:
        "Equipamento Elgin 12 mil BTUs com custo de entrada competitivo.",
      currentBid: 450,
      minIncrement: 30,
      image: "/produtos/ar-condicionado/4/502604189260404.webp",
      featured: false,
      endsAt: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
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
