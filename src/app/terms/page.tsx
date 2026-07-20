"use client";

import Link from "next/link";
import { MarsaTradeLogo } from "@/components/MarsaTradeLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocale } from "@/i18n/LocaleProvider";

export default function TermsPage() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <MarsaTradeLogo variant="auth" href="/" />
          <LanguageSwitcher variant="light" />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-bold text-slate-900">{t("app.termsTitle")}</h1>
        <p className="mt-6 leading-relaxed text-slate-600">{t("app.termsBody")}</p>
        <Link href="/" className="mt-8 inline-block text-sm font-medium text-navy-600 hover:underline">
          ← MarsaTrade
        </Link>
      </main>
    </div>
  );
}
