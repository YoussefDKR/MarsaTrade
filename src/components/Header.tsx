"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import type { SessionUser } from "@/types/auth";
import { getInitials } from "@/lib/user-utils";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocale } from "@/i18n/LocaleProvider";

type Props = {
  user: SessionUser;
};

export function Header({ user }: Props) {
  const router = useRouter();
  const { t, locale } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  async function logout() {
    setMenuOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-8 py-5 backdrop-blur-md">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">
          {t("header.welcome", { name: user.name.split(" ")[0] })}
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">
          {t("header.overview", { date: today })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          {user.company}
          <ChevronDown size={14} />
        </button>
        <LanguageSwitcher variant="light" />
        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-600 text-xs font-semibold text-white transition hover:bg-navy-700"
          >
            {getInitials(user.name)}
          </button>
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-2 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/settings");
                }}
                className="block w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                {t("common.settings")}
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={logout}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-500 hover:bg-slate-50"
              >
                <LogOut size={14} />
                {t("common.signOut")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
