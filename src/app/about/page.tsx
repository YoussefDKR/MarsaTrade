"use client";

import Link from "next/link";
import { ArrowRight, Check, Quote } from "lucide-react";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { useLocale } from "@/i18n/LocaleProvider";

const VALUE_KEYS = ["value1", "value2", "value3"] as const;

export default function AboutPage() {
  const { t } = useLocale();
  const paragraphs = t("aboutPage.presidentMessage").split("\n\n");

  return (
    <MarketingPageShell>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <RevealOnScroll>
          <h1 className="text-3xl font-bold text-slate-900">{t("aboutPage.title")}</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">{t("aboutPage.subtitle")}</p>
        </RevealOnScroll>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <RevealOnScroll>
            <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-navy-600">
                {t("aboutPage.missionTitle")}
              </h2>
              <p className="mt-4 leading-relaxed text-slate-600">{t("aboutPage.missionBody")}</p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={80}>
            <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-navy-600">
                {t("aboutPage.visionTitle")}
              </h2>
              <p className="mt-4 leading-relaxed text-slate-600">{t("aboutPage.visionBody")}</p>
            </div>
          </RevealOnScroll>
        </div>

        <RevealOnScroll className="mt-12">
          <div className="relative overflow-hidden rounded-2xl border border-navy-200 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 p-8 text-white sm:p-10">
            <Quote
              size={48}
              className="absolute right-6 top-6 text-white/10"
              aria-hidden
            />
            <h2 className="text-xl font-semibold text-blue-300">{t("aboutPage.presidentTitle")}</h2>
            <div className="mt-6 space-y-4">
              {paragraphs.map((para) => (
                <p key={para.slice(0, 40)} className="leading-relaxed text-slate-300">
                  {para}
                </p>
              ))}
            </div>
            <div className="mt-8 border-t border-white/10 pt-6">
              <p
                className="font-serif text-2xl tracking-wide text-white"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {t("aboutPage.presidentName")}
              </p>
              <p className="mt-1 text-sm text-slate-400">{t("aboutPage.presidentRole")}</p>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll className="mt-12">
          <h2 className="text-lg font-semibold text-slate-900">{t("aboutPage.valuesTitle")}</h2>
          <ul className="mt-4 space-y-3">
            {VALUE_KEYS.map((key) => (
              <li key={key} className="flex items-start gap-3 text-sm text-slate-600">
                <Check size={18} className="mt-0.5 shrink-0 text-emerald-500" />
                {t(`aboutPage.${key}`)}
              </li>
            ))}
          </ul>
        </RevealOnScroll>

        <div className="mt-14 flex flex-wrap items-center gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-navy-600 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-700"
          >
            {t("aboutPage.cta")}
            <ArrowRight size={16} />
          </Link>
          <Link href="/" className="text-sm font-medium text-navy-600 hover:underline">
            {t("aboutPage.backHome")}
          </Link>
        </div>
      </div>
    </MarketingPageShell>
  );
}
