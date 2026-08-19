import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const AUTH_COOKIE_NAME = "leilao_token";
export const PRIMARY_ADMIN_EMAIL = "admin@sodresantoro.com.br";

type JwtPayload = {
  sub: string;
  email: string;
  role: "admin" | "customer";
  name: string;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  isPrimaryAdmin: boolean;
  registrationSlug: string | null;
};

const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

export function resolveAccessRole(user: {
  email: string;
  role: "admin" | "customer";
}) {
  return user.role;
}

export function isPrimaryAdminEmail(email: string) {
  return email.toLowerCase() === PRIMARY_ADMIN_EMAIL;
}

export async function getSessionToken() {
  const store = await cookies();
  return store.get(AUTH_COOKIE_NAME)?.value ?? null;
}

export async function createSessionToken(user: SessionUser) {
  return new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(jwtSecret);
}

export async function persistSessionToken(token: string) {
  const store = await cookies();

  store.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionToken() {
  const store = await cookies();
  store.delete(AUTH_COOKIE_NAME);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = await getSessionToken();

  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(token, jwtSecret);
    const payload = verified.payload as JwtPayload;

    const user = await prisma.appUser.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        registrationSlug: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: resolveAccessRole(user),
      isPrimaryAdmin: isPrimaryAdminEmail(user.email),
      registrationSlug: user.registrationSlug,
    };
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/entrar");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();

  if (user.role !== "admin") {
    redirect("/");
  }

  return user;
}
