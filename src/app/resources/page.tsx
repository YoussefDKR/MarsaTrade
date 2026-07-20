"use client";

import Link from "next/link";
import {
  Calculator,
  Ship,
  TrendingUp,
  Newspaper,
  FileDown,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { useLocale } from "@/i18n/LocaleProvider";

const GUIDE_KEYS = [
  { icon: Calculator, title: "guide1Title", desc: "guide1Desc" },
  { icon: Ship, title: "guide2Title", desc: "guide2Desc" },
  { icon: TrendingUp, title: "guide3Title", desc: "guide3Desc" },
  { icon: Newspaper, title: "guide4Title", desc: "guide4Desc" },
  { icon: FileDown, title: "guide5Title", desc: "guide5Desc" },
] as const;

const FAQ_KEYS = [
  { q: "faq1Q", a: "faq1A" },
  { q: "faq2Q", a: "faq2A" },
  { q: "faq3Q", a: "faq3A" },
  { q: "faq4Q", a: "faq4A" },
] as const;

export default function ResourcesPage() {
  const { t } = useLocale();

  return (
    <MarketingPageShell>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <RevealOnScroll>
          <h1 className="text-3xl font-bold text-slate-900">{t("resourcesPage.title")}</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">{t("resourcesPage.subtitle")}</p>
        </RevealOnScroll>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDE_KEYS.map(({ icon: Icon, title, desc }, i) => (
            <RevealOnScroll key={title} delay={i * 60}>
              <div className="h-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <Icon size={20} className="text-navy-600" />
                </div>
                <h2 className="text-sm font-bold text-slate-800">{t(`resourcesPage.${title}`)}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {t(`resourcesPage.${desc}`)}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll className="mt-14 rounded-xl border border-navy-100 bg-navy-50 p-8">
          <h2 className="text-lg font-semibold text-navy-900">{t("resourcesPage.dataTitle")}</h2>
          <p className="mt-3 leading-relaxed text-slate-600">{t("resourcesPage.dataBody")}</p>
        </RevealOnScroll>

        <RevealOnScroll className="mt-14">
          <div className="mb-6 flex items-center gap-2">
            <HelpCircle size={20} className="text-navy-600" />
            <h2 className="text-lg font-semibold text-slate-900">{t("resourcesPage.faqTitle")}</h2>
          </div>
          <div className="space-y-4">
            {FAQ_KEYS.map(({ q, a }) => (
              <details
                key={q}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800 marker:content-none group-open:mb-2">
                  {t(`resourcesPage.${q}`)}
                </summary>
                <p className="text-sm leading-relaxed text-slate-500">{t(`resourcesPage.${a}`)}</p>
              </details>
            ))}
          </div>
        </RevealOnScroll>

        <div className="mt-14 flex flex-wrap items-center gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-navy-600 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-700"
          >
            {t("resourcesPage.cta")}
            <ArrowRight size={16} />
          </Link>
          <Link href="/" className="text-sm font-medium text-navy-600 hover:underline">
            {t("resourcesPage.backHome")}
          </Link>
        </div>
      </div>
    </MarketingPageShell>
  );
}
