import type { SessionUser } from "@/types/auth";
import { NavProvider } from "@/context/NavContext";
import { Sidebar } from "@/components/Sidebar";
import { AppFooter } from "@/components/AppFooter";

export function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: SessionUser;
}) {
  return (
    <NavProvider>
      <div className="min-h-screen bg-slate-100">
        <Sidebar user={user} />
        <div className="flex min-h-screen flex-col lg:ml-60">
          <div className="flex-1">{children}</div>
          <AppFooter />
        </div>
      </div>
    </NavProvider>
  );
}
