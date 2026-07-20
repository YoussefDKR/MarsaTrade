"use client";

import { ChevronDown, Globe, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import type { SessionUser } from "@/types/auth";
import { getInitials } from "@/lib/user-utils";

type Props = {
  user: SessionUser;
};

export function Header({ user }: Props) {
  const router = useRouter();
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Here&apos;s your market overview for {today}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
          {user.company}
          <ChevronDown size={14} />
        </button>
        <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
          <Globe size={14} />
          EN
        </button>
        <div className="group relative">
          <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-navy-600 text-xs font-semibold text-white">
            {getInitials(user.name)}
          </div>
          <div className="invisible absolute right-0 top-10 z-50 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg group-hover:visible">
            <button
              onClick={() => router.push("/settings")}
              className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
            >
              Settings
            </button>
            <button
              onClick={logout}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-500 hover:bg-slate-50"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
