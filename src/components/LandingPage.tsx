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
  Globe2,
  Zap,
  Languages,
} from "lucide-react";
import { MarsaTradeLogo, DashboardMockupImage } from "@/components/MarsaTradeLogo";
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

export function LandingPage({ rates }: Props) {
  return (
    <div className="min-h-screen bg-navy-950 text-white">
      {/* Header */}
      <header className="relative z-20 border-b border-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <MarsaTradeLogo />

          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#product" className="transition hover:text-white">
              Product
            </a>
            <a href="#pricing" className="transition hover:text-white">
              Pricing
            </a>
            <a href="#features" className="transition hover:text-white">
              Resources
            </a>
            <a href="#about" className="transition hover:text-white">
              About Us
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1 text-xs text-slate-400 sm:flex">
              <Globe2 size={14} />
              EN
            </span>
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        id="product"
        className="relative overflow-hidden"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-1/2 w-1/2 bg-[url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80')] bg-cover bg-center opacity-[0.12]"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/95 to-navy-950/40" aria-hidden />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-400">
              Intelligence · Insights · Advantage
            </p>
            <h1 className="text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-[3.25rem]">
              Smarter Decisions.
              <br />
              Stronger Margins.
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Global Seafood Intelligence.
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-400">
              Actionable market intelligence for seafood exporters and importers.
              Track species prices, compare freight rates, calculate landed costs in EUR,
              USD or MAD, and stay ahead with AI-curated news.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4 border-y border-white/10 py-6">
              {[
                { icon: BarChart3, label: "Market Intelligence" },
                { icon: Ship, label: "Freight Rates" },
                { icon: Newspaper, label: "AI News Feed" },
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
                className="inline-flex items-center gap-2 rounded-lg bg-navy-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:bg-blue-500"
              >
                Start Free Trial
                <ArrowRight size={16} />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                <Play size={14} className="fill-white" />
                See How It Works
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {["No credit card required", "Cancel anytime", "Setup in 2 minutes"].map(
                (t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1.5 text-xs text-slate-400"
                  >
                    <Check size={14} className="text-emerald-500" />
                    {t}
                  </span>
                )
              )}
            </div>

            {rates && (
              <p className="mt-4 text-[11px] text-slate-500">
                Live FX · EUR/USD {rates.rates.USD?.toFixed(4)} · EUR/MAD{" "}
                {rates.rates.MAD?.toFixed(4)}
              </p>
            )}
          </div>

          <div className="relative lg:pl-2">
            <DashboardMockupImage />
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="border-y border-white/5 bg-navy-900/50 py-10">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Trusted by seafood professionals worldwide
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {TRUSTED_BY.map((name) => (
              <span
                key={name}
                className="text-sm font-semibold text-slate-500/80 transition hover:text-slate-400"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features band */}
      <section id="features" className="bg-white py-16 text-slate-800">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: TrendingUp,
              title: "Make data-driven decisions",
              desc: "Access reliable market data and landed costs to negotiate better deals.",
            },
            {
              icon: Ship,
              title: "Optimize your logistics",
              desc: "Compare freight rates across key Morocco–Europe–Gulf trade routes.",
            },
            {
              icon: Languages,
              title: "Stay informed, anytime",
              desc: "AI-powered news in English, French, and Arabic from industry RSS feeds.",
            },
            {
              icon: Zap,
              title: "Grow your business",
              desc: "Gain a competitive edge with intelligence built for seafood traders.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title}>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Icon size={20} className="text-navy-600" />
              </div>
              <h3 className="text-sm font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-lg px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-navy-600">
            Simple pricing
          </p>
          <p className="mt-4 text-5xl font-bold text-slate-900">
            €{PRO_PRICE_EUR}
            <span className="text-xl font-normal text-slate-500">/month</span>
          </p>
          <p className="mt-3 text-sm text-slate-500">
            7-day free trial · Full Pro access · Cancel anytime
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-navy-600 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Start Free Trial
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-navy-950 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <MarsaTradeLogo variant="auth" href={null} className="mx-auto" />
          <p className="mt-6 text-sm leading-relaxed text-slate-400">
            MarsaTrade is built for seafood exporters, importers, and logistics companies
            who need landed costs, freight benchmarks, and market news in one place —
            with honest labeling of live vs weekly compiled data.
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} MarsaTrade · Global Seafood Intelligence
      </footer>
    </div>
  );
}
