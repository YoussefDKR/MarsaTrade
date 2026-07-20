"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, CheckCircle2 } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";

const ONBOARDING_KEY = "marsatrade-onboarded";

export function OnboardingModal() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(ONBOARDING_KEY)) {
      setOpen(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(ONBOARDING_KEY, "1");
    setOpen(false);
  }

  if (!open) return null;

  const steps = [
    t("app.onboardingStep1"),
    t("app.onboardingStep2"),
    t("app.onboardingStep3"),
  ];

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <h2 className="text-lg font-semibold text-slate-800">{t("app.onboardingTitle")}</h2>
        <p className="mt-2 text-sm text-slate-500">{t("app.onboardingDesc")}</p>
        <ul className="mt-4 space-y-2">
          {steps.map((step) => (
            <li key={step} className="flex items-start gap-2 text-sm text-slate-600">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
              {step}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex gap-3">
          <Link
            href="/dashboard"
            onClick={dismiss}
            className="flex-1 rounded-lg bg-navy-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-navy-700"
          >
            {t("app.onboardingCta")}
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            {t("app.onboardingDismiss")}
          </button>
        </div>
      </div>
    </div>
  );
}
