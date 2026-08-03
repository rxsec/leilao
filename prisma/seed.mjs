import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { buildCatalogSeed } from "./catalog-data.mjs";

dotenv.config({ path: ".env.local" });
dotenv.config();

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL ou DIRECT_URL nao configurada.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const catalog = buildCatalogSeed();

  await prisma.bid.deleteMany();
  await prisma.order.deleteMany();
  await prisma.lotImage.deleteMany();
  await prisma.lot.deleteMany();
  await prisma.category.deleteMany();

  for (const category of catalog) {
    await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        activeLots: category.products.length,
      },
    });
  }

  const categoryMap = Object.fromEntries(
    (await prisma.category.findMany({
      select: { id: true, slug: true },
    })).map((category) => [category.slug, category.id]),
  );

  for (const category of catalog) {
    for (const product of category.products) {
      await prisma.lot.create({
        data: {
          categoryId: categoryMap[category.slug],
          title: product.title,
          slug: product.slug,
          description: product.description,
          type: category.type,
          status: "live",
          city: product.city,
          state: product.state,
          currentBid: product.openingBid,
          bidCount: product.bidCount,
          minIncrement: product.minIncrement,
          reservePrice: product.auctionValue,
          buyNowPrice: product.auctionValue,
          imageUrl: product.imageUrl,
          isFeatured: product.isFeatured,
          endsAt: product.endsAt,
          images: {
            create: product.gallery.map((url, index) => ({
              url,
              sortOrder: index,
            })),
          },
        },
      });
    }
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
