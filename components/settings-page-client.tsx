"use client";

import SignOutButton from "@/components/sign-out-button";
import AppLogoBar from "@/components/app-logo-bar";
import { useI18n } from "@/components/locale-provider";
import type { Locale } from "@/lib/i18n-messages";

const LOCALES: Locale[] = ["es", "en"];

export default function SettingsPageClient() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="mx-auto min-h-screen max-w-phone bg-white pb-6">
      <AppLogoBar subtitle={t("settings.title")} />

      <div className="space-y-6 px-[18px] pt-6">
        <section>
          <h2 className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">
            {t("settings.language")}
          </h2>
          <p className="mt-1 text-xs text-neutral-600">{t("settings.languageHint")}</p>
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
                className={`flex-1 rounded-lg py-2.5 text-xs font-medium transition-all duration-200 ${
                  locale === code
                    ? "bg-white text-brand-teal-dark shadow-sm"
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
          <h2 className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">
            {t("settings.accountSection")}
          </h2>
          <SignOutButton
            className="mt-3 w-full rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-medium text-red-800 transition-colors duration-150 hover:bg-red-100 active:bg-red-100/90"
            label={t("settings.signOut")}
          />
        </section>
      </div>
    </div>
  );
}
