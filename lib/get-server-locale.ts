import { cookies } from "next/headers";
import { LOCALE_PREFERENCE_KEY } from "@/lib/i18n-constants";
import { type Locale, isLocale } from "@/lib/i18n-messages";

/** Reads the locale cookie set by the client (see `LocaleProvider`). Defaults to `es`. */
export function getServerLocale(): Locale {
  const raw = cookies().get(LOCALE_PREFERENCE_KEY)?.value;
  return raw && isLocale(raw) ? raw : "es";
}
