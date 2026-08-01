import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL ou DIRECT_URL nao configurada.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const categories = [
    { name: "Imoveis", slug: "imoveis", activeLots: 2 },
    { name: "Eletronicos", slug: "eletronicos", activeLots: 1 },
    { name: "Joias e Relogios", slug: "joias-e-relogios", activeLots: 0 },
    { name: "Outros", slug: "outros", activeLots: 0 },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        activeLots: category.activeLots,
      },
      create: category,
    });
  }

  const categoryMap = Object.fromEntries(
    (await prisma.category.findMany({
      select: { id: true, slug: true },
    })).map((category) => [category.slug, category.id]),
  );

  const lots = [
    {
      categoryId: categoryMap.imoveis,
      title: "Apartamento 3 quartos",
      slug: "apartamento-3-quartos-rj",
      description: "Apartamento residencial com 3 quartos e vaga de garagem.",
      type: "property",
      status: "live",
      city: "Rio de Janeiro",
      state: "RJ",
      currentBid: 350000,
      bidCount: 28,
      minIncrement: 1000,
      isFeatured: true,
      endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      imageUrl: "/reference-assets/property-apartamento.png",
    },
    {
      categoryId: categoryMap.imoveis,
      title: "Terreno em area nobre",
      slug: "terreno-area-nobre-sp",
      description: "Terreno amplo em localizacao valorizada.",
      type: "property",
      status: "live",
      city: "Sao Paulo",
      state: "SP",
      currentBid: 120000,
      bidCount: 12,
      minIncrement: 1000,
      isFeatured: true,
      endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      imageUrl: "/reference-assets/property-terreno.png",
    },
    {
      categoryId: categoryMap.eletronicos,
      title: "Notebook premium",
      slug: "notebook-premium",
      description: "Notebook de alta performance com acabamento premium.",
      type: "electronics",
      status: "live",
      city: "Campinas",
      state: "SP",
      currentBid: 4800,
      bidCount: 15,
      minIncrement: 100,
      isFeatured: false,
      endsAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      imageUrl: "/reference-assets/cat-notebook.png",
    },
  ];

  for (const lot of lots) {
    await prisma.lot.upsert({
      where: { slug: lot.slug },
      update: lot,
      create: lot,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
