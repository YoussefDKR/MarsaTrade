"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";

type Props = {
  titleKey: string;
  descriptionKey?: string;
  vars?: Record<string, string | number>;
};

export function PageHeader({ titleKey, descriptionKey, vars }: Props) {
  const { t } = useLocale();

  return (
    <div className="border-b border-slate-200 bg-white px-6 py-4">
      <nav className="mb-1 flex items-center gap-1 text-xs text-slate-400">
        <Link href="/dashboard" className="hover:text-navy-600">
          {t("nav.dashboard")}
        </Link>
        <ChevronRight size={12} />
        <span className="text-slate-600">{t(titleKey, vars)}</span>
      </nav>
      <h1 className="text-lg font-semibold text-slate-800">{t(titleKey, vars)}</h1>
      {descriptionKey && (
        <p className="mt-0.5 text-sm text-slate-500">{t(descriptionKey, vars)}</p>
      )}
    </div>
  );
}
