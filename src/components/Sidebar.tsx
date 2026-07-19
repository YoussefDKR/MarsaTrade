"use client";

import {
  LayoutDashboard,
  TrendingUp,
  Ship,
  Newspaper,
  FileText,
  Settings,
  Crown,
  BarChart3,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { SessionUser } from "@/types/auth";
import { formatBillingDate, getPlanLabel } from "@/lib/subscription-utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/intelligence", label: "Market Intelligence", icon: BarChart3 },
  { href: "/prices", label: "Prices & Trends", icon: TrendingUp },
  { href: "/freight", label: "Freight Rates", icon: Ship },
  { href: "/news", label: "News & Updates", icon: Newspaper },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

type Props = {
  user: SessionUser;
};

export function Sidebar({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const billingDate =
    user.plan === "trial"
      ? formatBillingDate(user.trialEndsAt)
      : formatBillingDate(user.billingEndsAt);

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-60 flex-col bg-navy-950 text-white">
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-600">
          <span className="text-lg">🐋</span>
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight">MarsaTrade</div>
          <div className="text-[10px] text-slate-400">Global Seafood Intelligence</div>
        </div>
      </div>

      <nav className="mt-2 flex-1 space-y-0.5 px-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-navy-700 text-white"
                  : "text-slate-400 hover:bg-navy-800 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
        {user.role === "admin" && (
          <Link
            href="/admin"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              pathname === "/admin"
                ? "bg-navy-700 text-white"
                : "text-slate-400 hover:bg-navy-800 hover:text-white"
            }`}
          >
            <Shield size={18} />
            Data Admin
          </Link>
        )}
      </nav>

      <div className="mx-3 mb-5 rounded-xl bg-navy-800 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Crown size={16} className="text-amber-500" />
          <span className="text-xs font-semibold">MarsaTrade Pro</span>
        </div>
        <p className="text-[11px] text-slate-400">{getPlanLabel(user.plan)}</p>
        <p className="mt-1 text-[11px] text-slate-500">
          {user.plan === "trial" ? "Trial ends" : "Next billing"}: {billingDate}
        </p>
        <button
          onClick={() => router.push("/settings")}
          className="mt-3 w-full rounded-lg bg-navy-600 py-2 text-xs font-medium transition hover:bg-blue-600"
        >
          Manage Subscription
        </button>
      </div>
    </aside>
  );
}
