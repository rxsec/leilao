import { closeExpiredLots } from "@/lib/lot-closing";
import { prisma } from "@/lib/prisma";
import type { SessionUser } from "@/lib/auth";

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
  managed_by_admin_id: string | null;
  managed_by_admin_name: string | null;
  created_at: string;
};

export type AdminRegistrationLink = {
  id: string;
  name: string;
  email: string;
  registration_slug: string | null;
  customer_count: number;
};

export type AdminOrder = {
  id: string;
  user_name: string;
  user_email: string;
  lot_title: string;
  lot_slug: string;
  amount: number;
  status: "pending" | "paid" | "cancelled";
  created_at: string;
  paid_at: string | null;
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
  managedByAdminId: string | null;
  managerAdmin: {
    name: string;
  } | null;
  createdAt: Date;
};

type AdminOrderRecord = {
  id: string;
  amount: { toString(): string };
  status: "pending" | "paid" | "cancelled";
  createdAt: Date;
  paidAt: Date | null;
  user: {
    name: string;
    email: string;
  };
  lot: {
    title: string;
    slug: string;
  };
};

type AdminLinkRecord = {
  id: string;
  name: string;
  email: string;
  registrationSlug: string | null;
  managedCustomers: Array<{ id: string }>;
};

export async function getAdminPanelData(user: SessionUser) {
  await closeExpiredLots();

  const scopedCustomerFilter = user.isPrimaryAdmin
    ? { role: "customer" as const }
    : {
        role: "customer" as const,
        managedByAdminId: user.id,
      };
  const scopedOrderFilter = user.isPrimaryAdmin
    ? {}
    : {
        user: {
          managedByAdminId: user.id,
        },
      };
  const scopedResetFilter = user.isPrimaryAdmin
    ? {}
    : {
        email: {
          in: (
            await prisma.appUser.findMany({
              where: { managedByAdminId: user.id },
              select: { email: true },
            })
          ).map((customer) => customer.email),
        },
      };

  const [categories, lots, passwordResetRequests, customers, orders, registrationLinks]: [
    AdminCategory[],
    AdminLotRecord[],
    AdminPasswordResetRecord[],
    AdminCustomerRecord[],
    AdminOrderRecord[],
    AdminLinkRecord[],
  ] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true, activeLots: true },
    }),
    prisma.lot.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.passwordResetRequest.findMany({
      where: scopedResetFilter,
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.appUser.findMany({
      where: scopedCustomerFilter,
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
        managedByAdminId: true,
        managerAdmin: {
          select: {
            name: true,
          },
        },
        createdAt: true,
      },
    }),
    prisma.order.findMany({
      where: scopedOrderFilter,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        lot: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    }),
    prisma.appUser.findMany({
      where: user.isPrimaryAdmin ? { role: "admin" } : { id: user.id },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        registrationSlug: true,
        managedCustomers: {
          where: {
            role: "customer",
          },
          select: {
            id: true,
          },
        },
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
      managed_by_admin_id: customer.managedByAdminId,
      managed_by_admin_name: customer.managerAdmin?.name ?? null,
      created_at: customer.createdAt.toISOString(),
    })) as AdminCustomer[],
    orders: orders.map((order: AdminOrderRecord) => ({
      id: order.id,
      user_name: order.user.name,
      user_email: order.user.email,
      lot_title: order.lot.title,
      lot_slug: order.lot.slug,
      amount: Number(order.amount),
      status: order.status,
      created_at: order.createdAt.toISOString(),
      paid_at: order.paidAt ? order.paidAt.toISOString() : null,
    })) as AdminOrder[],
    registrationLinks: registrationLinks.map((admin: AdminLinkRecord) => ({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      registration_slug: admin.registrationSlug,
      customer_count: admin.managedCustomers.length,
    })) as AdminRegistrationLink[],
    hasDatabase: true,
  };
}
