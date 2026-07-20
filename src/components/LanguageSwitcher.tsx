"use client";

import { useEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";
import type { Locale } from "@/i18n/messages";

type Props = {
  variant?: "light" | "dark";
};

export function LanguageSwitcher({ variant = "dark" }: Props) {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function pick(next: Locale) {
    setLocale(next);
    setOpen(false);
  }

  const btnClass =
    variant === "light"
      ? "border-slate-200 text-slate-700 hover:bg-slate-50"
      : "border-white/20 text-slate-300 hover:bg-white/10";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition ${btnClass}`}
      >
        <Globe size={14} />
        {locale.toUpperCase()}
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full z-50 mt-1 min-w-[120px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
        >
          {(["en", "fr"] as Locale[]).map((code) => (
            <button
              key={code}
              type="button"
              role="option"
              aria-selected={locale === code}
              onClick={() => pick(code)}
              className={`block w-full px-4 py-2 text-left text-sm transition hover:bg-slate-50 ${
                locale === code ? "font-semibold text-navy-600" : "text-slate-700"
              }`}
            >
              {code === "en" ? "English" : "Français"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
