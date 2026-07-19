import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/user-utils";
import { DashboardShell } from "@/components/DashboardShell";
import { Header } from "@/components/Header";

type Props = {
  children: React.ReactNode;
  requireSubscription?: boolean;
};

export async function DashboardPage({
  children,
  requireSubscription = true,
}: Props) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  if (requireSubscription && !hasActiveSubscription(user)) {
    redirect("/settings?expired=1");
  }

  return (
    <DashboardShell user={user}>
      <Header user={user} />
      {children}
    </DashboardShell>
  );
}
