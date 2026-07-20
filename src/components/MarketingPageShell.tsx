"use client";

import Link from "next/link";
import { MarsaTradeLogo } from "@/components/MarsaTradeLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocale } from "@/i18n/LocaleProvider";

type Props = {
  children: React.ReactNode;
};

export function MarketingPageShell({ children }: Props) {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <MarsaTradeLogo variant="auth" href="/" />
          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <Link href="/" className="hover:text-navy-600">
              {t("nav.product")}
            </Link>
            <Link href="/resources" className="hover:text-navy-600">
              {t("nav.resources")}
            </Link>
            <Link href="/about" className="hover:text-navy-600">
              {t("nav.about")}
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="light" />
            <Link
              href="/signup"
              className="hidden rounded-lg bg-navy-600 px-3 py-2 text-sm font-semibold text-white hover:bg-navy-700 sm:inline-block"
            >
              {t("landing.startTrial")}
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} MarsaTrade · {t("landing.footer")}</p>
        <div className="mt-3 flex justify-center gap-4">
          <Link href="/privacy" className="hover:text-navy-600">
            {t("app.privacy")}
          </Link>
          <Link href="/terms" className="hover:text-navy-600">
            {t("app.terms")}
          </Link>
          <Link href="/about" className="hover:text-navy-600">
            {t("nav.about")}
          </Link>
        </div>
      </footer>
    </div>
  );
}
