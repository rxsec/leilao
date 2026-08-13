import { prisma } from "@/lib/prisma";

type LotType = "property" | "electronics" | "luxury" | "other";
type LotStatus = "draft" | "scheduled" | "live" | "closed";

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  activeLots: number;
};

export type AdminCustomer = {
  id: string;
  name: string;
  birth_date: string | null;
  email: string;
  cpf: string | null;
  cep: string | null;
  street: string | null;
  street_number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  whatsapp: string | null;
  role: "admin" | "customer";
  created_at: string;
};

export type AdminLot = {
  id: string;
  categoryId: string | null;
  title: string;
  slug: string;
  description: string | null;
  type: LotType;
  status: LotStatus;
  city: string | null;
  state: string | null;
  current_bid: number;
  min_increment: number;
  reserve_price: number | null;
  buy_now_price: number | null;
  image_url: string | null;
  is_featured: boolean;
  ends_at: string | null;
};

export type AdminPasswordResetRequest = {
  id: string;
  email: string;
  note: string | null;
  status: "pending" | "resolved";
  created_at: string;
  resolved_at: string | null;
};

type AdminLotRecord = {
  id: string;
  categoryId: string | null;
  title: string;
  slug: string;
  description: string | null;
  type: LotType;
  status: LotStatus;
  city: string | null;
  state: string | null;
  currentBid: { toString(): string };
  minIncrement: { toString(): string };
  reservePrice: { toString(): string } | null;
  buyNowPrice: { toString(): string } | null;
  imageUrl: string | null;
  isFeatured: boolean;
  endsAt: Date | null;
};

type AdminPasswordResetRecord = {
  id: string;
  email: string;
  note: string | null;
  status: "pending" | "resolved";
  createdAt: Date;
  resolvedAt: Date | null;
};

type AdminCustomerRecord = {
  id: string;
  name: string;
  birthDate: Date | null;
  email: string;
  cpf: string | null;
  cep: string | null;
  street: string | null;
  streetNumber: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  whatsapp: string | null;
  role: "admin" | "customer";
  createdAt: Date;
};

export async function getAdminPanelData() {
  const [categories, lots, passwordResetRequests, customers]: [
    AdminCategory[],
    AdminLotRecord[],
    AdminPasswordResetRecord[],
    AdminCustomerRecord[],
  ] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true, activeLots: true },
    }),
    prisma.lot.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.passwordResetRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.appUser.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        birthDate: true,
        email: true,
        cpf: true,
        cep: true,
        street: true,
        streetNumber: true,
        complement: true,
        neighborhood: true,
        city: true,
        state: true,
        whatsapp: true,
        role: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    categories,
    lots: lots.map((lot: AdminLotRecord) => ({
      id: lot.id,
      categoryId: lot.categoryId,
      title: lot.title,
      slug: lot.slug,
      description: lot.description,
      type: lot.type,
      status: lot.status,
      city: lot.city,
      state: lot.state,
      current_bid: Number(lot.currentBid),
      min_increment: Number(lot.minIncrement),
      reserve_price: lot.reservePrice ? Number(lot.reservePrice) : null,
      buy_now_price: lot.buyNowPrice ? Number(lot.buyNowPrice) : null,
      image_url: lot.imageUrl,
      is_featured: lot.isFeatured,
      ends_at: lot.endsAt ? lot.endsAt.toISOString() : null,
    })) as AdminLot[],
    passwordResetRequests: passwordResetRequests.map(
      (request: AdminPasswordResetRecord) => ({
        id: request.id,
        email: request.email,
        note: request.note,
        status: request.status,
        created_at: request.createdAt.toISOString(),
        resolved_at: request.resolvedAt ? request.resolvedAt.toISOString() : null,
      }),
    ) as AdminPasswordResetRequest[],
    customers: customers.map((customer: AdminCustomerRecord) => ({
      id: customer.id,
      name: customer.name,
      birth_date: customer.birthDate ? customer.birthDate.toISOString() : null,
      email: customer.email,
      cpf: customer.cpf,
      cep: customer.cep,
      street: customer.street,
      street_number: customer.streetNumber,
      complement: customer.complement,
      neighborhood: customer.neighborhood,
      city: customer.city,
      state: customer.state,
      whatsapp: customer.whatsapp,
      role: customer.role,
      created_at: customer.createdAt.toISOString(),
    })) as AdminCustomer[],
    hasDatabase: true,
  };
}
