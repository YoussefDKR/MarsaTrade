import type { SessionUser } from "@/types/auth";
import { Sidebar } from "@/components/Sidebar";

export function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: SessionUser;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar user={user} />
      <main className="ml-60 min-h-screen">{children}</main>
    </div>
  );
}
