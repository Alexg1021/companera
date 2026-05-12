"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LOCALE_PREFERENCE_KEY } from "@/lib/i18n-constants";
import {
  type Locale,
  type MessageKey,
  isLocale,
  messagesByLocale,
  tiForLocale,
} from "@/lib/i18n-messages";

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return "es";
  const raw = window.localStorage.getItem(LOCALE_PREFERENCE_KEY);
  return raw && isLocale(raw) ? raw : "es";
}

function writeLocaleCookie(locale: Locale) {
  if (typeof document === "undefined") return;
  document.cookie = `${LOCALE_PREFERENCE_KEY}=${encodeURIComponent(locale)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey) => string;
  ti: (key: MessageKey, vars: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    const stored = readStoredLocale();
    setLocaleState(stored);
    writeLocaleCookie(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : "es";
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(LOCALE_PREFERENCE_KEY, next);
    } catch {
      /* ignore */
    }
    writeLocaleCookie(next);
    document.documentElement.lang = next === "en" ? "en" : "es";
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key) => messagesByLocale[locale][key] ?? messagesByLocale.es[key] ?? key,
      ti: (key, vars) => tiForLocale(locale, key, vars),
    }),
    [locale, setLocale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useI18n must be used within LocaleProvider");
  }
  return ctx;
}
