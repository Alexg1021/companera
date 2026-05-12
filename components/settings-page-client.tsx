"use client";

import SignOutButton from "@/components/sign-out-button";
import { useI18n } from "@/components/locale-provider";
import type { Locale } from "@/lib/i18n-messages";

const LOCALES: Locale[] = ["es", "en"];

export default function SettingsPageClient() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="mx-auto min-h-screen max-w-phone bg-white pb-6">
      <header className="flex items-center gap-2 border-b border-neutral-200 px-4 py-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-xs font-semibold text-white">
          C
        </div>
        <div>
          <p className="text-sm font-medium leading-tight text-neutral-900">{t("settings.title")}</p>
          <p className="text-[10px] text-neutral-500">{t("settings.subtitle")}</p>
        </div>
      </header>

      <div className="space-y-6 px-4 pt-6">
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            {t("settings.language")}
          </h2>
          <p className="mt-1 text-sm text-neutral-600">{t("settings.languageHint")}</p>
          <div
            className="mt-3 flex rounded-xl border border-neutral-200 bg-neutral-50 p-1"
            role="group"
            aria-label={t("settings.language")}
          >
            {LOCALES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                  locale === code
                    ? "bg-white text-brand-dark shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
                aria-pressed={locale === code}
              >
                {code === "es" ? t("settings.langEs") : t("settings.langEn")}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            {t("settings.accountSection")}
          </h2>
          <SignOutButton
            className="mt-3 w-full rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-medium text-red-800 hover:bg-red-100 active:bg-red-100/90"
            label={t("settings.signOut")}
          />
        </section>
      </div>
    </div>
  );
}
