"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { FormState } from "@/app/action-states";
import {
  clearSessionToken,
  createSessionToken,
  getCurrentUser,
  persistSessionToken,
  isPrimaryAdminEmail,
  resolveAccessRole,
} from "@/lib/auth";
import { closeLotInsideTransaction } from "@/lib/lot-closing";
import { prisma } from "@/lib/prisma";

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
  const birthDate = String(formData.get("birthDate") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const cpf = normalizeDigits(String(formData.get("cpf") ?? ""), 11);
  const cep = normalizeDigits(String(formData.get("cep") ?? ""), 8);
  const street = String(formData.get("street") ?? "").trim();
  const streetNumber = String(formData.get("streetNumber") ?? "").trim();
  const complement = String(formData.get("complement") ?? "").trim();
  const neighborhood = String(formData.get("neighborhood") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim().toUpperCase();
  const whatsapp = normalizeDigits(String(formData.get("whatsapp") ?? ""), 11);
  const password = String(formData.get("password") ?? "");
  const registrationSlug = nullableString(formData.get("registrationSlug"));

  if (
    !name ||
    !birthDate ||
    !email ||
    !cpf ||
    !cep ||
    !street ||
    !streetNumber ||
    !complement ||
    !neighborhood ||
    !city ||
    !state ||
    !whatsapp ||
    !password
  ) {
    return { status: "error", message: "Preencha todos os campos do cadastro." };
  }

  if (password.length < 6) {
    return {
      status: "error",
      message: "A senha precisa ter pelo menos 6 caracteres.",
    };
  }

  if (!isValidCpf(cpf)) {
    return {
      status: "error",
      message: "Digite um CPF valido.",
    };
  }

  if (cep.length !== 8) {
    return {
      status: "error",
      message: "Digite um CEP valido.",
    };
  }

  if (whatsapp.length < 10) {
    return {
      status: "error",
      message: "Digite um WhatsApp valido.",
    };
  }

  if (state.length !== 2) {
    return {
      status: "error",
      message: "Digite um estado valido com 2 letras.",
    };
  }

  let redirectPath = "/meus-lances";

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const ownerAdmin = registrationSlug
      ? await prisma.appUser.findFirst({
          where: {
            role: "admin",
            registrationSlug,
          },
          select: {
            id: true,
          },
        })
      : null;

    if (registrationSlug && !ownerAdmin) {
      return {
        status: "error",
        message: "O link de cadastro informado nao esta mais disponivel.",
      };
    }

    const user = await prisma.appUser.create({
      data: {
        name,
        birthDate: new Date(`${birthDate}T00:00:00.000Z`),
        email,
        cpf,
        cep,
        street,
        streetNumber,
        complement,
        neighborhood,
        city,
        state,
        whatsapp,
        passwordHash,
        role: "customer",
        managedByAdminId: ownerAdmin?.id ?? null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        registrationSlug: true,
      },
    });

    const token = await createSessionToken({
      ...user,
      isPrimaryAdmin: false,
    });
    await persistSessionToken(token);
    redirectPath = getPostLoginPath(user.role);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        status: "error",
        message: "Ja existe uma conta com este e-mail ou CPF.",
      };
    }

    return {
      status: "error",
      message: "Nao foi possivel criar a conta agora.",
    };
  }

  revalidatePath("/");
  redirect(redirectPath);
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
      registrationSlug: true,
    },
  });

  if (!user) {
    return { status: "error", message: "Credenciais invalidas." };
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return { status: "error", message: "Credenciais invalidas." };
  }

  const accessRole = resolveAccessRole(user);

  const token = await createSessionToken({
    id: user.id,
    name: user.name,
    email: user.email,
    role: accessRole,
    isPrimaryAdmin: isPrimaryAdminEmail(user.email),
    registrationSlug: user.registrationSlug,
  });

  await persistSessionToken(token);
  revalidatePath("/");
  redirect(getPostLoginPath(accessRole));
}

export async function requestPasswordReset(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const note = nullableString(formData.get("note"));

  if (!email) {
    return { status: "error", message: "Informe o e-mail da conta." };
  }

  const user = await prisma.appUser.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    return {
      status: "success",
      message:
        "Se existir uma conta com esse e-mail, a solicitação foi registrada para análise.",
    };
  }

  await prisma.passwordResetRequest.create({
    data: {
      email,
      note,
      status: "pending",
    },
  });

  revalidatePath("/admin");

  return {
    status: "success",
    message:
      "Solicitação enviada. O administrador poderá definir uma senha temporária para a conta.",
  };
}

export async function changePassword(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!user) {
    return { status: "error", message: "Entre na conta para trocar a senha." };
  }

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { status: "error", message: "Preencha todos os campos de senha." };
  }

  if (newPassword.length < 6) {
    return {
      status: "error",
      message: "A nova senha precisa ter pelo menos 6 caracteres.",
    };
  }

  if (newPassword !== confirmPassword) {
    return { status: "error", message: "A confirmação da senha não confere." };
  }

  const account = await prisma.appUser.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      passwordHash: true,
    },
  });

  if (!account) {
    return { status: "error", message: "Conta não encontrada." };
  }

  const passwordMatches = await bcrypt.compare(
    currentPassword,
    account.passwordHash,
  );

  if (!passwordMatches) {
    return { status: "error", message: "Senha atual incorreta." };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.appUser.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return {
    status: "success",
    message: "Senha atualizada com sucesso.",
  };
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
  const amountRaw = String(formData.get("amount") ?? "").trim();
  const amount = parseCurrencyInput(amountRaw);

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
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const lot = await tx.lot.findUnique({ where: { slug: lotSlug } });

      if (!lot) {
        throw new Error("Lote nao encontrado.");
      }

      if (lot.status !== "live") {
        throw new Error("Este lote nao esta recebendo lances.");
      }

      const currentBid = Number(lot.currentBid);
      const minIncrement = Number(lot.minIncrement);

      if (amount < currentBid + minIncrement) {
        throw new Error("O lance precisa respeitar o incremento minimo.");
      }

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
        },
      });
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

function parseCurrencyInput(value: string) {
  const sanitized = value.replace(/[^\d,.]/g, "").trim();

  if (!sanitized) {
    return Number.NaN;
  }

  const lastComma = sanitized.lastIndexOf(",");
  const lastDot = sanitized.lastIndexOf(".");
  const separatorIndex = Math.max(lastComma, lastDot);

  if (separatorIndex === -1) {
    return Number(sanitized.replace(/\D/g, ""));
  }

  const integerPart = sanitized
    .slice(0, separatorIndex)
    .replace(/[^\d]/g, "");
  const decimalPart = sanitized
    .slice(separatorIndex + 1)
    .replace(/[^\d]/g, "");

  return Number(`${integerPart || "0"}.${decimalPart}`);
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

export async function saveCategory(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return { status: "error", message: "Acesso restrito ao administrador." };
  }

  const categoryId = nullableString(formData.get("categoryId"));
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();

  if (!name || !slug) {
    return {
      status: "error",
      message: "Preencha nome e slug da categoria.",
    };
  }

  try {
    if (categoryId) {
      await prisma.category.update({
        where: { id: categoryId },
        data: {
          name,
          slug,
        },
      });
    } else {
      await prisma.category.create({
        data: {
          name,
          slug,
        },
      });
    }

    await recalculateCategoryCounts();
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        status: "error",
        message: "Ja existe uma categoria com este slug.",
      };
    }

    return {
      status: "error",
      message: "Nao foi possivel salvar a categoria.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/leiloes");
  revalidatePath("/");

  return {
    status: "success",
    message: "Categoria salva com sucesso.",
  };
}

export async function deleteCategory(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return { status: "error", message: "Acesso restrito ao administrador." };
  }

  const categoryId = String(formData.get("categoryId") ?? "").trim();

  if (!categoryId) {
    return { status: "error", message: "Categoria invalida." };
  }

  const lotsCount = await prisma.lot.count({
    where: { categoryId },
  });

  if (lotsCount > 0) {
    return {
      status: "error",
      message: "Remova ou troque os lotes vinculados antes de excluir a categoria.",
    };
  }

  try {
    await prisma.category.delete({
      where: { id: categoryId },
    });
  } catch {
    return {
      status: "error",
      message: "Nao foi possivel excluir a categoria.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/leiloes");
  revalidatePath("/");

  return {
    status: "success",
    message: "Categoria excluida com sucesso.",
  };
}

export async function resolvePasswordReset(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  const requestId = String(formData.get("requestId") ?? "").trim();
  const temporaryPassword = String(formData.get("temporaryPassword") ?? "");

  if (!user || user.role !== "admin") {
    return { status: "error", message: "Acesso restrito ao administrador." };
  }

  if (!requestId || !temporaryPassword) {
    return {
      status: "error",
      message: "Informe a solicitação e a senha temporária.",
    };
  }

  if (temporaryPassword.length < 6) {
    return {
      status: "error",
      message: "A senha temporária precisa ter pelo menos 6 caracteres.",
    };
  }

  const request = await prisma.passwordResetRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    return { status: "error", message: "Solicitação não encontrada." };
  }

  const account = await prisma.appUser.findUnique({
    where: { email: request.email },
    select: { id: true },
  });

  if (!account) {
    return {
      status: "error",
      message: "Não existe conta vinculada a esse e-mail.",
    };
  }

  const passwordHash = await bcrypt.hash(temporaryPassword, 10);

  await prisma.$transaction([
    prisma.appUser.update({
      where: { id: account.id },
      data: { passwordHash },
    }),
    prisma.passwordResetRequest.update({
      where: { id: requestId },
      data: {
        status: "resolved",
        resolvedAt: new Date(),
      },
    }),
  ]);

  revalidatePath("/admin");

  return {
    status: "success",
    message: "Senha temporária definida e solicitação concluída.",
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
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await closeLotInsideTransaction(tx, lotSlug);
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
  const categories: Array<{ id: string }> = await prisma.category.findMany({
    select: { id: true },
  });

  for (const category of categories) {
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
  }
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

function normalizeDigits(value: string, maxLength: number) {
  return value.replace(/\D/g, "").slice(0, maxLength);
}

function isValidCpf(value: string) {
  if (value.length !== 11 || /^(\d)\1+$/.test(value)) {
    return false;
  }

  const digits = value.split("").map(Number);
  const calculateDigit = (length: number) => {
    const sum = digits
      .slice(0, length)
      .reduce((accumulator, digit, index) => accumulator + digit * (length + 1 - index), 0);
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return calculateDigit(9) === digits[9] && calculateDigit(10) === digits[10];
}

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

function getPostLoginPath(role: "admin" | "customer") {
  return role === "admin" ? "/admin" : "/meus-lances";
}
