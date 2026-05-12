export type Locale = "es" | "en";

const es = {
  "nav.personas": "Personas",
  "nav.alerts": "Alertas",
  "nav.panel": "Panel",
  "nav.settings": "Ajustes",
  "nav.profile": "Perfil",
  "nav.main": "Navegación principal",
  "notifications.logo_subtitle": "Alertas · Escalaciones",
  "members.stat_personas": "Personas",
  "members.stat_urgent": "Urgente",
  "members.stat_today": "Hoy",
  "settings.title": "Ajustes",
  "settings.subtitle": "Cuenta e idioma",
  "settings.language": "Idioma",
  "settings.languageHint": "Textos de la app (Personas, alertas, etc.).",
  "settings.langEs": "Español",
  "settings.langEn": "English",
  "settings.signOut": "Cerrar sesión",
  "settings.accountSection": "Cuenta",
  "header.alerts": "Alertas",
  "profile.title": "Perfil",
  "profile.subtitle": "Tu cuenta",
  "profile.label_name": "Nombre",
  "profile.label_email": "Correo",
  "profile.label_role": "Rol",
  "profile.role_promotora": "Promotora",
  "profile.role_clinician": "Personal clínico",
  "profile.role_payer": "Vista pagador",
  "profile.back_members": "← Personas",
  "profile.back_dashboard": "← Panel",
} as const;

const en: Record<keyof typeof es, string> = {
  "nav.personas": "People",
  "nav.alerts": "Alerts",
  "nav.panel": "Dashboard",
  "nav.settings": "Settings",
  "nav.profile": "Profile",
  "nav.main": "Main navigation",
  "notifications.logo_subtitle": "Alerts · Escalations",
  "members.stat_personas": "People",
  "members.stat_urgent": "Urgent",
  "members.stat_today": "Today",
  "settings.title": "Settings",
  "settings.subtitle": "Account & language",
  "settings.language": "Language",
  "settings.languageHint": "App chrome (People, alerts, etc.).",
  "settings.langEs": "Español",
  "settings.langEn": "English",
  "settings.signOut": "Log out",
  "settings.accountSection": "Account",
  "header.alerts": "Alerts",
  "profile.title": "Profile",
  "profile.subtitle": "Your account",
  "profile.label_name": "Name",
  "profile.label_email": "Email",
  "profile.label_role": "Role",
  "profile.role_promotora": "Promotora",
  "profile.role_clinician": "Clinical staff",
  "profile.role_payer": "Payer view",
  "profile.back_members": "← People",
  "profile.back_dashboard": "← Dashboard",
};

export type MessageKey = keyof typeof es;

export const messagesByLocale: Record<Locale, Record<MessageKey, string>> = {
  es,
  en,
};

export function isLocale(value: string): value is Locale {
  return value === "es" || value === "en";
}

/** Resolve a string on the server (or anywhere) without React context. */
export function tForLocale(locale: Locale, key: MessageKey): string {
  return messagesByLocale[locale][key] ?? messagesByLocale.es[key] ?? key;
}

/** Same as `tForLocale` plus `{placeholder}` replacement. */
export function tiForLocale(
  locale: Locale,
  key: MessageKey,
  vars: Record<string, string | number>
): string {
  let str = tForLocale(locale, key);
  for (const [k, v] of Object.entries(vars)) {
    str = str.replaceAll(`{${k}}`, String(v));
  }
  return str;
}
