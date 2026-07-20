import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import {
  getUserByEmail,
  getUserById,
  createUser,
  seedDemoUsers,
} from "@/lib/store";
import type { SessionUser, User } from "@/types/auth";

const COOKIE_NAME = "marsatrade_session";
const SESSION_TTL = 60 * 60 * 24 * 7;

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET ?? "marsatrade-dev-secret-change-in-production";
  return new TextEncoder().encode(secret);
}

export async function ensureSeeded(): Promise<void> {
  await seedDemoUsers();
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function toSessionUser(user: User): SessionUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    company: user.company,
    role: user.role,
    plan: user.plan,
    trialEndsAt: user.trialEndsAt,
    billingEndsAt: user.billingEndsAt,
    cancelAtPeriodEnd: user.cancelAtPeriodEnd,
  };
}

export async function createSession(user: User): Promise<string> {
  const token = await new SignJWT({ sub: user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL}s`)
    .sign(getSecret());
  return token;
}

export async function setSessionCookie(token: string): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL,
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  await ensureSeeded();
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const userId = payload.sub;
    if (!userId) return null;
    const user = await getUserById(userId);
    if (!user) return null;
    return toSessionUser(user);
  } catch {
    return null;
  }
}

export async function login(
  email: string,
  password: string
): Promise<SessionUser | null> {
  await ensureSeeded();
  const user = await getUserByEmail(email);
  if (!user) return null;
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;
  const token = await createSession(user);
  await setSessionCookie(token);
  return toSessionUser(user);
}

export async function signup(data: {
  email: string;
  password: string;
  name: string;
  company: string;
}): Promise<{ user: SessionUser } | { error: string }> {
  await ensureSeeded();

  if (await getUserByEmail(data.email)) {
    return { error: "An account with this email already exists" };
  }

  if (data.password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const trialEnds = new Date();
  trialEnds.setDate(trialEnds.getDate() + 7);

  const user = await createUser({
    email: data.email.toLowerCase(),
    passwordHash: await hashPassword(data.password),
    name: data.name,
    company: data.company,
    role: "user",
    plan: "trial",
    trialEndsAt: trialEnds.toISOString(),
  });

  const token = await createSession(user);
  await setSessionCookie(token);
  return { user: toSessionUser(user) };
}

export async function logout(): Promise<void> {
  await clearSessionCookie();
}
