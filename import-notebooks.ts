import { prisma } from "./src/lib/prisma";

async function main() {
  const category = await prisma.category.findUnique({
    where: { slug: "notebooks" },
    select: { id: true },
  });

  if (!category) {
    throw new Error("Categoria notebooks nao encontrada");
  }

  const now = new Date();
  const products = [
    {
      slug: "notebook-lenovo-intel-i5-12a-ssd-512gb-16gb-ram-ddr4",
      title: "Notebook Lenovo Intel i5 12a SSD 512GB 16GB RAM DDR4",
      description:
        "Notebook Lenovo com processador Intel i5 de 12a geracao, SSD de 512GB e 16GB de RAM DDR4.",
      currentBid: 900,
      minIncrement: 50,
      image:
        "/produtos/notebooks/1/D_NQ_NP_757832-MLB105697427263_012026-O-notebook-lenovo-intel-i5-12a-ssd-512gb-16gb-ram-ddr4.webp",
      featured: true,
      endsAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "notebook-acer-nitro-i7-11th-16gb-ram-rtx-3050",
      title: "Notebook Acer Nitro i7 11th - 16GB RAM - RTX 3050",
      description:
        "Notebook gamer Acer Nitro com i7 11th, 16GB de RAM e GPU RTX 3050.",
      currentBid: 1000,
      minIncrement: 50,
      image: "/produtos/notebooks/2/images.jpeg",
      featured: true,
      endsAt: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "macbook-pro-15-i9-32gb-2tb-pro-vega",
      title: "MacBook Pro 15 i9 32GB 2TB Pro Vega",
      description:
        "MacBook Pro 15 com Intel i9, 32GB de memoria, SSD de 2TB e GPU Pro Vega.",
      currentBid: 4500,
      minIncrement: 100,
      image: "/produtos/notebooks/3/808576730717013.webp",
      featured: false,
      endsAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "macbook-pro-m2-impecavel",
      title: "MacBook Pro M2 impecavel",
      description:
        "MacBook Pro com chip M2 em excelente estado, lote premium da categoria.",
      currentBid: 1800,
      minIncrement: 100,
      image: "/produtos/notebooks/4/121628410533542.webp",
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
