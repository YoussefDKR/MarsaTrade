export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function hasActiveSubscription(user: {
  plan: string;
  trialEndsAt?: string;
  billingEndsAt?: string;
}): boolean {
  if (user.plan === "pro") {
    if (!user.billingEndsAt) return true;
    return new Date(user.billingEndsAt) > new Date();
  }
  if (user.plan === "trial" && user.trialEndsAt) {
    return new Date(user.trialEndsAt) > new Date();
  }
  return false;
}
