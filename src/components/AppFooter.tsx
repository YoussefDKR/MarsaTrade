"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";

export function AppFooter() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-4 text-xs text-slate-500">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
        <p>
          © {new Date().getFullYear()} MarsaTrade · {t("app.footerTagline")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/privacy" className="hover:text-navy-600">
            {t("app.privacy")}
          </Link>
          <Link href="/terms" className="hover:text-navy-600">
            {t("app.terms")}
          </Link>
          <a href="mailto:support@marsatrade.com" className="hover:text-navy-600">
            {t("app.support")}
          </a>
        </div>
      </div>
    </footer>
  );
}
