import "server-only";
import bcrypt from "bcryptjs";
import type { User as PrismaUser } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { User, SubscriptionPlan, UserRole } from "@/types/auth";
import type { FreightRoute, Species, SpeciesPricePoint } from "@/types";
import { species as defaultSpecies, freightRoutes as defaultFreight, DATA_LAST_UPDATED } from "@/data/defaults";

function mapUser(row: PrismaUser): User {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.passwordHash,
    name: row.name,
    company: row.company,
    role: row.role as UserRole,
    plan: row.plan as SubscriptionPlan,
    stripeCustomerId: row.stripeCustomerId ?? undefined,
    stripeSubscriptionId: row.stripeSubscriptionId ?? undefined,
    trialEndsAt: row.trialEndsAt?.toISOString(),
    billingEndsAt: row.billingEndsAt?.toISOString(),
    cancelAtPeriodEnd: row.cancelAtPeriodEnd,
    createdAt: row.createdAt.toISOString(),
  };
}

function mapSpecies(row: {
  id: string;
  name: string;
  displayName: string;
  unit: string;
  currentPrice: number;
  change24h: number;
  fobPriceEur: number;
  dutyRate: number;
  vatRate: number;
  history: unknown;
}): Species {
  return {
    id: row.id as Species["id"],
    name: row.name,
    displayName: row.displayName,
    unit: row.unit,
    currentPrice: row.currentPrice,
    change24h: row.change24h,
    fobPriceEur: row.fobPriceEur,
    dutyRate: row.dutyRate,
    vatRate: row.vatRate,
    history: row.history as SpeciesPricePoint[],
  };
}

function mapFreight(row: {
  id: string;
  origin: string;
  destination: string;
  rateUsd: number;
  change7d: number;
  containerType: string;
  history: unknown;
  lastUpdated: string;
}): FreightRoute {
  return {
    id: row.id,
    origin: row.origin,
    destination: row.destination,
    rateUsd: row.rateUsd,
    change7d: row.change7d,
    containerType: row.containerType,
    history: row.history as number[],
    lastUpdated: row.lastUpdated,
  };
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const row = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  return row ? mapUser(row) : undefined;
}

export async function getUserById(id: string): Promise<User | undefined> {
  const row = await prisma.user.findUnique({ where: { id } });
  return row ? mapUser(row) : undefined;
}

export async function getUserByStripeCustomerId(
  customerId: string
): Promise<User | undefined> {
  const row = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });
  return row ? mapUser(row) : undefined;
}

export async function saveUser(user: User): Promise<User> {
  const row = await prisma.user.upsert({
    where: { id: user.id },
    create: {
      id: user.id,
      email: user.email.toLowerCase(),
      passwordHash: user.passwordHash,
      name: user.name,
      company: user.company,
      role: user.role,
      plan: user.plan,
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId,
      trialEndsAt: user.trialEndsAt ? new Date(user.trialEndsAt) : null,
      billingEndsAt: user.billingEndsAt ? new Date(user.billingEndsAt) : null,
      cancelAtPeriodEnd: user.cancelAtPeriodEnd ?? false,
      createdAt: new Date(user.createdAt),
    },
    update: {
      email: user.email.toLowerCase(),
      passwordHash: user.passwordHash,
      name: user.name,
      company: user.company,
      role: user.role,
      plan: user.plan,
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId,
      trialEndsAt: user.trialEndsAt ? new Date(user.trialEndsAt) : null,
      billingEndsAt: user.billingEndsAt ? new Date(user.billingEndsAt) : null,
      cancelAtPeriodEnd: user.cancelAtPeriodEnd ?? false,
    },
  });
  return mapUser(row);
}

export async function createUser(
  data: Omit<User, "id" | "createdAt" | "passwordHash"> & { passwordHash: string }
): Promise<User> {
  const row = await prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      name: data.name,
      company: data.company,
      role: data.role,
      plan: data.plan,
      trialEndsAt: data.trialEndsAt ? new Date(data.trialEndsAt) : null,
      billingEndsAt: data.billingEndsAt ? new Date(data.billingEndsAt) : null,
    },
  });
  return mapUser(row);
}

export async function getSpeciesData(): Promise<Species[]> {
  const rows = await prisma.species.findMany({ orderBy: { id: "asc" } });
  if (rows.length === 0) return defaultSpecies;
  return rows.map(mapSpecies);
}

export async function getFreightData(): Promise<FreightRoute[]> {
  const rows = await prisma.freightRoute.findMany({ orderBy: { id: "asc" } });
  if (rows.length === 0) return defaultFreight;
  return rows.map(mapFreight);
}

export async function getDataLastUpdated(): Promise<string> {
  const meta = await prisma.marketMeta.findUnique({ where: { id: "singleton" } });
  return meta?.dataLastUpdated ?? DATA_LAST_UPDATED;
}

export async function updateSpeciesData(
  species: Species[],
  updatedAt: string
): Promise<void> {
  await prisma.$transaction([
    ...species.map((s) =>
      prisma.species.upsert({
        where: { id: s.id },
        create: {
          id: s.id,
          name: s.name,
          displayName: s.displayName,
          unit: s.unit,
          currentPrice: s.currentPrice,
          change24h: s.change24h,
          fobPriceEur: s.fobPriceEur,
          dutyRate: s.dutyRate,
          vatRate: s.vatRate,
          history: s.history,
        },
        update: {
          name: s.name,
          displayName: s.displayName,
          unit: s.unit,
          currentPrice: s.currentPrice,
          change24h: s.change24h,
          fobPriceEur: s.fobPriceEur,
          dutyRate: s.dutyRate,
          vatRate: s.vatRate,
          history: s.history,
        },
      })
    ),
    prisma.marketMeta.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", dataLastUpdated: updatedAt },
      update: { dataLastUpdated: updatedAt },
    }),
  ]);
}

export async function updateFreightData(
  routes: FreightRoute[],
  updatedAt: string
): Promise<void> {
  await prisma.$transaction([
    ...routes.map((r) =>
      prisma.freightRoute.upsert({
        where: { id: r.id },
        create: {
          id: r.id,
          origin: r.origin,
          destination: r.destination,
          rateUsd: r.rateUsd,
          change7d: r.change7d,
          containerType: r.containerType,
          history: r.history,
          lastUpdated: updatedAt,
        },
        update: {
          origin: r.origin,
          destination: r.destination,
          rateUsd: r.rateUsd,
          change7d: r.change7d,
          containerType: r.containerType,
          history: r.history,
          lastUpdated: updatedAt,
        },
      })
    ),
    prisma.marketMeta.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", dataLastUpdated: updatedAt },
      update: { dataLastUpdated: updatedAt },
    }),
  ]);
}

export async function seedMarketData(): Promise<void> {
  const count = await prisma.species.count();
  if (count > 0) return;

  await prisma.$transaction([
    ...defaultSpecies.map((s) =>
      prisma.species.create({
        data: {
          id: s.id,
          name: s.name,
          displayName: s.displayName,
          unit: s.unit,
          currentPrice: s.currentPrice,
          change24h: s.change24h,
          fobPriceEur: s.fobPriceEur,
          dutyRate: s.dutyRate,
          vatRate: s.vatRate,
          history: s.history,
        },
      })
    ),
    ...defaultFreight.map((r) =>
      prisma.freightRoute.create({
        data: {
          id: r.id,
          origin: r.origin,
          destination: r.destination,
          rateUsd: r.rateUsd,
          change7d: r.change7d,
          containerType: r.containerType,
          history: r.history,
          lastUpdated: r.lastUpdated,
        },
      })
    ),
    prisma.marketMeta.create({
      data: { id: "singleton", dataLastUpdated: DATA_LAST_UPDATED },
    }),
  ]);
}

export async function seedDemoUsers(): Promise<void> {
  await seedMarketData();

  const count = await prisma.user.count();
  if (count > 0) return;

  const billingEnd = new Date();
  billingEnd.setMonth(billingEnd.getMonth() + 1);

  const demoUsers = [
    {
      email: "youssef@marsatrade.com",
      password: "demo123",
      name: "Youssef",
      company: "Oceanic Exports SARL",
      role: "user" as const,
      plan: "pro" as const,
      billingEndsAt: billingEnd,
    },
    {
      email: "admin@marsatrade.com",
      password: "admin123",
      name: "Admin",
      company: "MarsaTrade",
      role: "admin" as const,
      plan: "pro" as const,
      billingEndsAt: new Date("2027-01-01T00:00:00Z"),
    },
  ];

  for (const u of demoUsers) {
    await prisma.user.create({
      data: {
        email: u.email,
        passwordHash: await bcrypt.hash(u.password, 10),
        name: u.name,
        company: u.company,
        role: u.role,
        plan: u.plan,
        billingEndsAt: u.billingEndsAt,
      },
    });
  }
}

export async function updateUserProfile(
  userId: string,
  data: { name: string; company: string; email: string }
): Promise<User | { error: string }> {
  const email = data.email.toLowerCase().trim();
  if (!email.includes("@")) return { error: "Invalid email address" };
  if (!data.name.trim()) return { error: "Name is required" };
  if (!data.company.trim()) return { error: "Company is required" };

  const existing = await prisma.user.findFirst({
    where: { email, NOT: { id: userId } },
  });
  if (existing) return { error: "Email is already in use" };

  try {
    const row = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name.trim(),
        company: data.company.trim(),
        email,
      },
    });
    return mapUser(row);
  } catch {
    return { error: "Failed to update profile" };
  }
}

export async function updateUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ ok: true } | { error: string }> {
  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters" };
  }

  const user = await getUserById(userId);
  if (!user) return { error: "User not found" };

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) return { error: "Current password is incorrect" };

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: await bcrypt.hash(newPassword, 10) },
  });
  return { ok: true };
}

export async function updateUserStripe(
  userId: string,
  data: Partial<
    Pick<
      User,
      "stripeCustomerId" | "stripeSubscriptionId" | "plan" | "billingEndsAt" | "cancelAtPeriodEnd"
    >
  >
): Promise<User | undefined> {
  try {
    const row = await prisma.user.update({
      where: { id: userId },
      data: {
        stripeCustomerId: data.stripeCustomerId,
        stripeSubscriptionId: data.stripeSubscriptionId,
        plan: data.plan,
        billingEndsAt: data.billingEndsAt ? new Date(data.billingEndsAt) : undefined,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd,
      },
    });
    return mapUser(row);
  } catch {
    return undefined;
  }
}
