"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MarsaTradeLogo } from "@/components/MarsaTradeLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocale } from "@/i18n/LocaleProvider";

export default function SignupPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? t("auth.signupFailed"));
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  const fields = [
    { key: "name" as const, label: t("auth.name"), type: "text" },
    { key: "company" as const, label: t("auth.company"), type: "text" },
    { key: "email" as const, label: t("auth.email"), type: "email" },
    { key: "password" as const, label: t("auth.password"), type: "password" },
  ];

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-navy-950 px-4">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher variant="dark" />
      </div>
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-block">
            <MarsaTradeLogo variant="auth" href={null} className="mx-auto" />
          </Link>
          <p className="mt-3 text-sm text-slate-500">{t("auth.signupTrial")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ key, label, type }) => (
            <div key={key}>
              <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
                required
                minLength={key === "password" ? 6 : undefined}
              />
            </div>
          ))}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-navy-600 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-50"
          >
            {loading ? t("auth.signingUp") : t("auth.createAccount")}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          {t("auth.hasAccount")}{" "}
          <Link href="/login" className="font-medium text-navy-600 hover:underline">
            {t("auth.signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
