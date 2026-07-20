"use client";

import Link from "next/link";
import type { ExchangeRates } from "@/types";
import {
  TrendingUp,
  Ship,
  Newspaper,
  ArrowRight,
  Play,
  Check,
  BarChart3,
  Zap,
  Languages,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { MarsaTradeLogo, DashboardMockupImage } from "@/components/MarsaTradeLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { useLocale } from "@/i18n/LocaleProvider";
import { PRO_PRICE_EUR } from "@/lib/subscription-utils";

type Props = {
  rates: ExchangeRates | null;
};

const TRUSTED_BY = [
  "Agadir Seafood",
  "Oceanic Imports",
  "Mediterranean Seafood",
  "Bluewave Trading",
  "North Atlantic Seafoods",
  "Sahara Fisheries",
];

export function LandingPageClient({ rates }: Props) {
  const { t, m } = useLocale();
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-navy-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <MarsaTradeLogo />

          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#product" className="transition hover:text-white">
              {t("nav.product")}
            </a>
            <a href="#pricing" className="transition hover:text-white">
              {t("nav.pricing")}
            </a>
            <a href="#features" className="transition hover:text-white">
              {t("nav.resources")}
            </a>
            <a href="#about" className="transition hover:text-white">
              {t("nav.about")}
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNav((v) => !v)}
              className="rounded-lg border border-white/20 p-2 text-slate-300 md:hidden"
              aria-label={t("app.menu")}
            >
              {mobileNav ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div className="hidden sm:block">
              <LanguageSwitcher variant="dark" />
            </div>
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {t("landing.login")}
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              {t("landing.startTrial")}
            </Link>
          </div>
        </div>
        {mobileNav && (
          <nav className="border-t border-white/10 px-6 py-4 md:hidden">
            <div className="flex flex-col gap-3 text-sm text-slate-300">
              <a href="#product" onClick={() => setMobileNav(false)}>{t("nav.product")}</a>
              <a href="#pricing" onClick={() => setMobileNav(false)}>{t("nav.pricing")}</a>
              <a href="#features" onClick={() => setMobileNav(false)}>{t("nav.resources")}</a>
              <a href="#about" onClick={() => setMobileNav(false)}>{t("nav.about")}</a>
              <div className="pt-2 sm:hidden">
                <LanguageSwitcher variant="dark" />
              </div>
            </div>
          </nav>
        )}
      </header>

      <section id="product" className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-20 bottom-0 h-[60%] w-[55%] rounded-full bg-blue-600/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/95 to-navy-950/50"
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <RevealOnScroll>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-400 animate-fade-in">
              {t("landing.eyebrow")}
            </p>
            <h1 className="text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-[3.25rem]">
              {t("landing.heroLine1")}
              <br />
              {t("landing.heroLine2")}
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                {t("landing.heroLine3")}
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-400">
              {t("landing.heroDesc")}
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4 border-y border-white/10 py-6">
              {[
                { icon: BarChart3, label: m.landing.feature1 },
                { icon: Ship, label: m.landing.feature2 },
                { icon: Newspaper, label: m.landing.feature3 },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="text-center sm:text-left">
                  <Icon size={20} className="mx-auto text-blue-400 sm:mx-0" />
                  <p className="mt-2 text-[11px] font-medium leading-tight text-slate-300">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-navy-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:scale-[1.02] hover:bg-blue-500"
              >
                {t("landing.startTrial")}
                <ArrowRight size={16} />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                <Play size={14} className="fill-white" />
                {t("landing.seeHow")}
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {[m.landing.trustBadge1, m.landing.trustBadge2, m.landing.trustBadge3].map(
                (badge) => (
                  <span
                    key={badge}
                    className="flex items-center gap-1.5 text-xs text-slate-400"
                  >
                    <Check size={14} className="text-emerald-500" />
                    {badge}
                  </span>
                )
              )}
            </div>

            {rates && (
              <p className="mt-4 text-[11px] text-slate-500">
                {t("landing.liveFx")} · EUR/USD {rates.rates.USD?.toFixed(4)} · EUR/MAD{" "}
                {rates.rates.MAD?.toFixed(4)}
              </p>
            )}
          </RevealOnScroll>

          <RevealOnScroll delay={150} className="relative lg:pl-2">
            <DashboardMockupImage />
          </RevealOnScroll>
        </div>
      </section>

      <section className="border-y border-white/5 bg-navy-900/50 py-12">
        <RevealOnScroll className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {t("landing.trustedBy")}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {TRUSTED_BY.map((name, i) => (
              <span
                key={name}
                className="text-sm font-semibold text-slate-500/80 transition hover:text-slate-400"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {name}
              </span>
            ))}
          </div>
        </RevealOnScroll>
      </section>

      <section id="features" className="bg-white py-20 text-slate-800">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: TrendingUp, title: m.landing.feat1Title, desc: m.landing.feat1Desc },
            { icon: Ship, title: m.landing.feat2Title, desc: m.landing.feat2Desc },
            { icon: Languages, title: m.landing.feat3Title, desc: m.landing.feat3Desc },
            { icon: Zap, title: m.landing.feat4Title, desc: m.landing.feat4Desc },
          ].map(({ icon: Icon, title, desc }, i) => (
            <RevealOnScroll key={title} delay={i * 80}>
              <div className="rounded-xl border border-slate-100 p-5 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <Icon size={20} className="text-navy-600" />
                </div>
                <h3 className="text-sm font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section id="pricing" className="border-t border-slate-200 bg-slate-50 py-20">
        <RevealOnScroll className="mx-auto max-w-lg px-6 text-center">
          <div className="pricing-card rounded-2xl border border-slate-200 bg-white p-10 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-navy-600">
              {t("landing.pricingLabel")}
            </p>
            <p className="mt-4 text-5xl font-bold text-slate-900">
              <span className="pricing-amount inline-block">€{PRO_PRICE_EUR}</span>
              <span className="text-xl font-normal text-slate-500">/{t("common.month")}</span>
            </p>
            <p className="mt-3 text-sm text-slate-500">{t("landing.pricingDesc")}</p>
            <Link
              href="/signup"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-navy-600 px-8 py-3.5 text-sm font-semibold text-white transition hover:scale-[1.03] hover:bg-blue-600"
            >
              {t("landing.startTrial")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </RevealOnScroll>
      </section>

      <section id="about" className="bg-navy-950 py-20">
        <RevealOnScroll className="mx-auto max-w-3xl px-6 text-center">
          <MarsaTradeLogo variant="auth" href={null} className="mx-auto" />
          <p className="mt-6 text-sm leading-relaxed text-slate-400">{t("landing.aboutDesc")}</p>
        </RevealOnScroll>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} MarsaTrade · {t("landing.footer")}</p>
        <div className="mt-3 flex justify-center gap-4">
          <Link href="/privacy" className="hover:text-slate-300">{t("app.privacy")}</Link>
          <Link href="/terms" className="hover:text-slate-300">{t("app.terms")}</Link>
        </div>
      </footer>
    </div>
  );
}
