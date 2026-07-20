export type SubscriptionPlan = "trial" | "pro" | "none";
export type UserRole = "user" | "admin";

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  company: string;
  role: UserRole;
  plan: SubscriptionPlan;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  trialEndsAt?: string;
  billingEndsAt?: string;
  cancelAtPeriodEnd?: boolean;
  createdAt: string;
};

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  company: string;
  role: UserRole;
  plan: SubscriptionPlan;
  trialEndsAt?: string;
  billingEndsAt?: string;
  cancelAtPeriodEnd?: boolean;
};

export type MarketStore = {
  dataLastUpdated: string;
  species: import("@/types").Species[];
  freightRoutes: import("@/types").FreightRoute[];
};

export type AppStore = {
  users: User[];
  market: MarketStore;
};
