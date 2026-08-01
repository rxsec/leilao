"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { FormState } from "@/app/action-states";
import {
  clearSessionToken,
  createSessionToken,
  getCurrentUser,
  persistSessionToken,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type TransactionClient = Pick<typeof prisma, "lot" | "bid" | "order">;

export async function subscribeToNewsletter(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    return { status: "error", message: "Informe um e-mail para continuar." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { status: "error", message: "Digite um e-mail valido." };
  }

  try {
    await prisma.newsletterSubscriber.create({ data: { email } });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        status: "success",
        message: "Este e-mail ja esta inscrito na newsletter.",
      };
    }

    return {
      status: "error",
      message: "Nao foi possivel concluir o cadastro agora.",
    };
  }

  return {
    status: "success",
    message: "Cadastro realizado. Voce recebera as novidades por e-mail.",
  };
}

export async function registerUser(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return { status: "error", message: "Preencha nome, e-mail e senha." };
  }

  if (password.length < 6) {
    return {
      status: "error",
      message: "A senha precisa ter pelo menos 6 caracteres.",
    };
  }

  try {
    const totalUsers = await prisma.appUser.count();
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.appUser.create({
      data: {
        name,
        email,
        passwordHash,
        role: totalUsers === 0 ? "admin" : "customer",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    const token = await createSessionToken(user);
    await persistSessionToken(token);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        status: "error",
        message: "Ja existe uma conta com este e-mail.",
      };
    }

    return {
      status: "error",
      message: "Nao foi possivel criar a conta agora.",
    };
  }

  revalidatePath("/");
  redirect("/meus-lances");
}

export async function loginUser(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { status: "error", message: "Informe e-mail e senha." };
  }

  const user = await prisma.appUser.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      passwordHash: true,
    },
  });

  if (!user) {
    return { status: "error", message: "Credenciais invalidas." };
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return { status: "error", message: "Credenciais invalidas." };
  }

  const token = await createSessionToken({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  await persistSessionToken(token);
  revalidatePath("/");
  redirect("/meus-lances");
}

export async function logoutUser() {
  await clearSessionToken();
  revalidatePath("/");
  redirect("/");
}

export async function placeBid(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  const lotSlug = String(formData.get("lotSlug") ?? "").trim();
  const amountRaw = String(formData.get("amount") ?? "").trim().replace(",", ".");
  const amount = Number(amountRaw);

  if (!user) {
    return {
      status: "error",
      message: "Entre na sua conta para enviar um lance.",
    };
  }

  if (!lotSlug) {
    return { status: "error", message: "Lote invalido." };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return { status: "error", message: "Informe um valor de lance valido." };
  }

  try {
    await prisma.$transaction(async (tx: TransactionClient) => {
      const lot = await tx.lot.findUnique({ where: { slug: lotSlug } });

      if (!lot) {
        throw new Error("Lote nao encontrado.");
      }

      if (lot.status !== "live") {
        throw new Error("Este lote nao esta recebendo lances.");
      }

      if (lot.endsAt && lot.endsAt.getTime() <= Date.now()) {
        throw new Error("Este lote ja foi encerrado.");
      }

      const currentBid = Number(lot.currentBid);
      const minIncrement = Number(lot.minIncrement);

      if (amount < currentBid + minIncrement) {
        throw new Error("O lance precisa respeitar o incremento minimo.");
      }

      const shouldClose =
        lot.buyNowPrice !== null && amount >= Number(lot.buyNowPrice);

      await tx.bid.create({
        data: {
          lotId: lot.id,
          userId: user.id,
          bidderName: user.name,
          amount,
        },
      });

      await tx.lot.update({
        where: { id: lot.id },
        data: {
          currentBid: amount,
          bidCount: { increment: 1 },
          winnerUserId: user.id,
          status: shouldClose ? "closed" : lot.status,
          closedAt: shouldClose ? new Date() : lot.closedAt,
        },
      });

      if (shouldClose) {
        await tx.order.upsert({
          where: {
            lotId: lot.id,
          },
          update: {
            userId: user.id,
            amount,
            status: "pending",
          },
          create: {
            lotId: lot.id,
            userId: user.id,
            amount,
            status: "pending",
          },
        });
      }
    });
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Nao foi possivel registrar o lance agora.",
    };
  }

  revalidatePath(`/leiloes/${lotSlug}`);
  revalidatePath("/leiloes");
  revalidatePath("/meus-lances");

  return {
    status: "success",
    message: "Lance registrado com sucesso.",
  };
}

export async function saveLot(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return { status: "error", message: "Acesso restrito ao administrador." };
  }

  const lotId = nullableString(formData.get("lotId"));
  const categorySlug = String(formData.get("categorySlug") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const type = String(formData.get("type") ?? "").trim() as
    | "property"
    | "electronics"
    | "luxury"
    | "other";
  const status = String(formData.get("status") ?? "").trim() as
    | "draft"
    | "scheduled"
    | "live"
    | "closed";
  const city = String(formData.get("city"));
  const state = String(formData.get("state"));
  const currentBid = nullableNumber(formData.get("currentBid"));
  const minIncrement = nullableNumber(formData.get("minIncrement")) ?? 100;
  const reservePrice = nullableNumber(formData.get("reservePrice"));
  const buyNowPrice = nullableNumber(formData.get("buyNowPrice"));
  const featured = formData.get("isFeatured") === "on";
  const endsAtValue = nullableString(formData.get("endsAt"));
  const imageUrlField = nullableString(formData.get("imageUrl"));
  const imageFile = formData.get("imageFile");

  if (!categorySlug || !title || !slug || !type || !status) {
    return {
      status: "error",
      message: "Preencha categoria, titulo, slug, tipo e status.",
    };
  }

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    select: { id: true },
  });

  if (!category) {
    return { status: "error", message: "Categoria invalida." };
  }

  let imageUrl = imageUrlField;

  if (imageFile instanceof File && imageFile.size > 0) {
    imageUrl = await storeUploadedImage(imageFile);
  }

  try {
    if (lotId) {
      await prisma.lot.update({
        where: { id: lotId },
        data: {
          categoryId: category.id,
          title,
          slug,
          description: description || null,
          type,
          status,
          city: city || null,
          state: state || null,
          currentBid: currentBid ?? 0,
          minIncrement,
          reservePrice,
          buyNowPrice,
          imageUrl,
          isFeatured: featured,
          endsAt: endsAtValue ? new Date(endsAtValue) : null,
        },
      });
    } else {
      await prisma.lot.create({
        data: {
          categoryId: category.id,
          title,
          slug,
          description: description || null,
          type,
          status,
          city: city || null,
          state: state || null,
          currentBid: currentBid ?? 0,
          minIncrement,
          reservePrice,
          buyNowPrice,
          imageUrl,
          isFeatured: featured,
          endsAt: endsAtValue ? new Date(endsAtValue) : null,
        },
      });
    }

    await recalculateCategoryCounts();
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        status: "error",
        message: "Ja existe um lote com este slug.",
      };
    }

    return {
      status: "error",
      message: "Nao foi possivel salvar o lote.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/leiloes");
  revalidatePath("/");

  return {
    status: "success",
    message: "Lote salvo com sucesso.",
  };
}

export async function closeLot(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  const lotSlug = String(formData.get("lotSlug") ?? "").trim();

  if (!user || user.role !== "admin") {
    return { status: "error", message: "Acesso restrito ao administrador." };
  }

  if (!lotSlug) {
    return { status: "error", message: "Nao foi possivel fechar o lote." };
  }

  try {
    await prisma.$transaction(async (tx: TransactionClient) => {
      const lot = await tx.lot.findUnique({
        where: { slug: lotSlug },
        include: {
          bids: {
            orderBy: [{ amount: "desc" }, { createdAt: "asc" }],
            take: 1,
          },
        },
      });

      if (!lot) {
        throw new Error("Lote nao encontrado.");
      }

      const winningBid = lot.bids[0];

      await tx.lot.update({
        where: { id: lot.id },
        data: {
          status: "closed",
          closedAt: new Date(),
          winnerUserId: winningBid?.userId ?? null,
        },
      });

      if (winningBid?.userId) {
        await tx.order.upsert({
          where: {
            lotId: lot.id,
          },
          update: {
            userId: winningBid.userId,
            amount: winningBid.amount,
            status: "pending",
          },
          create: {
            lotId: lot.id,
            userId: winningBid.userId,
            amount: winningBid.amount,
            status: "pending",
          },
        });
      }
    });
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Falha ao fechar lote.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/leiloes");
  revalidatePath(`/leiloes/${lotSlug}`);
  revalidatePath("/meus-lances");

  return { status: "success", message: "Lote encerrado com sucesso." };
}

export async function payOrder(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  const orderId = String(formData.get("orderId") ?? "").trim();

  if (!user || !orderId) {
    return { status: "error", message: "Pedido invalido." };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!order || order.userId !== user.id) {
    return { status: "error", message: "Pedido nao encontrado." };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "paid",
      paidAt: new Date(),
    },
  });

  revalidatePath("/meus-lances");
  return { status: "success", message: "Pagamento confirmado com sucesso." };
}

async function storeUploadedImage(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const extension = path.extname(file.name) || ".png";
  const fileName = `${randomUUID()}${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), buffer);

  return `/uploads/${fileName}`;
}

async function recalculateCategoryCounts() {
  const categories = await prisma.category.findMany({
    select: { id: true },
  });

  await Promise.all(
    categories.map(async (category) => {
      const activeLots = await prisma.lot.count({
        where: {
          categoryId: category.id,
          status: "live",
        },
      });

      await prisma.category.update({
        where: { id: category.id },
        data: { activeLots },
      });
    }),
  );
}

function nullableNumber(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim().replace(",", ".");

  if (!raw) {
    return null;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function nullableString(value: FormDataEntryValue | null) {
  const parsed = String(value ?? "").trim();
  return parsed ? parsed : null;
}

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}
