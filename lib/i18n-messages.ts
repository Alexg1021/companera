export type Locale = "es" | "en";

const es = {
  "nav.personas": "Personas",
  "nav.alerts": "Alertas",
  "nav.panel": "Panel",
  "nav.settings": "Ajustes",
  "nav.main": "Navegación principal",
  "settings.title": "Ajustes",
  "settings.subtitle": "Cuenta e idioma",
  "settings.language": "Idioma",
  "settings.languageHint": "Textos de la app (Personas, alertas, etc.).",
  "settings.langEs": "Español",
  "settings.langEn": "English",
  "settings.signOut": "Cerrar sesión",
  "settings.accountSection": "Cuenta",
  "header.alerts": "Alertas",
} as const;

const en: Record<keyof typeof es, string> = {
  "nav.personas": "People",
  "nav.alerts": "Alerts",
  "nav.panel": "Dashboard",
  "nav.settings": "Settings",
  "nav.main": "Main navigation",
  "settings.title": "Settings",
  "settings.subtitle": "Account & language",
  "settings.language": "Language",
  "settings.languageHint": "App chrome (People, alerts, etc.).",
  "settings.langEs": "Español",
  "settings.langEn": "English",
  "settings.signOut": "Log out",
  "settings.accountSection": "Account",
  "header.alerts": "Alerts",
};

export type MessageKey = keyof typeof es;

export const messagesByLocale: Record<Locale, Record<MessageKey, string>> = {
  es,
  en,
};

export function isLocale(value: string): value is Locale {
  return value === "es" || value === "en";
}
