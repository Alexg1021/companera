# Compañera — i18n Expansion Prompt

The app uses a custom i18n system with a `messagesByLocale` dictionary (`es` / `en`) and a `t()` hook or helper to resolve strings by key. The settings view has a working language toggle. The task is to expand the translation dictionary to cover every user-facing string in the app and replace all hardcoded Spanish text with `t()` calls throughout every component and page.

---

## Current translation file location

`lib/i18n.ts` (or wherever `messagesByLocale` is defined — check the import path used in existing `t()` calls).

---

## Step 1 — Expand the translation dictionary

Add all of the following keys to both `es` and `en` in `messagesByLocale`. Preserve the existing keys exactly — only append.

```ts
// --- Member list ---
"members.greeting_morning": "Buenos días" | "Good morning",
"members.greeting_afternoon": "Buenas tardes" | "Good afternoon",
"members.greeting_evening": "Buenas noches" | "Good evening",
"members.date_label": // computed — skip, handle in component
"members.stat_total": "Miembros" | "Members",
"members.stat_urgent": "Urgente" | "Urgent",
"members.stat_done_today": "Hoy" | "Today",
"members.section_needs_outreach": "Necesita contacto" | "Needs outreach",
"members.section_upcoming": "Próximamente" | "Upcoming",
"members.section_current": "Al día" | "Up to date",
"members.empty_urgent": "Todo al día — ningún miembro necesita atención urgente." | "All caught up — no members need urgent attention.",
"members.empty_all": "Aún no tienes miembros asignados." | "You have no assigned members yet.",

// --- Member profile ---
"profile.back": "Mis miembros" | "My members",
"profile.label": "Perfil" | "Profile",
"profile.years": "años" | "years old",
"profile.section_health_plan": "Plan de salud" | "Health plan",
"profile.insurance": "Aseguradora" | "Insurance",
"profile.next_appointment": "Próxima cita" | "Next appointment",
"profile.no_appointment": "No programada" | "Not scheduled",
"profile.language": "Idioma" | "Language",
"profile.preferred_contact": "Contacto preferido" | "Preferred contact",
"profile.section_history": "Historial reciente" | "Recent history",
"profile.empty_history": "Sin historial de contacto aún." | "No contact history yet.",
"profile.btn_log": "Registrar" | "Log",
"profile.btn_whatsapp": "WhatsApp" | "WhatsApp",

// --- Alert cards ---
"alert.no_contact": "Sin contacto en {days} días." | "No contact in {days} days.",
"alert.er_visit": "Visita a urgencias el {date}. Sin seguimiento post-ER." | "ER visit on {date}. No post-ER follow-up.",
"alert.medicaid_renewal": "Renovación de Medicaid vence el {date}." | "Medicaid renewal due {date}.",
"alert.ai_suggestion": "IA sugiere:" | "Suggested:",

// --- Log touchpoint form ---
"log.back": "Volver" | "Back",
"log.label": "Registrar contacto" | "Log contact",
"log.contact_type": "Tipo de contacto" | "Contact type",
"log.type_whatsapp": "WhatsApp" | "WhatsApp",
"log.type_call": "Llamada" | "Call",
"log.type_home_visit": "Visita domicilio" | "Home visit",
"log.type_clinic": "Clínica" | "Clinic",
"log.outcome": "Resultado" | "Outcome",
"log.outcome_contacted": "Contactada" | "Contacted",
"log.outcome_no_answer": "No contestó" | "No answer",
"log.outcome_appointment": "Cita agendada" | "Appointment scheduled",
"log.notes_label": "Notas" | "Notes",
"log.notes_placeholder": "Español o inglés..." | "Spanish or English...",
"log.escalate_label": "¿Escalar al equipo clínico?" | "Escalate to clinical team?",
"log.escalate_notify": "Notificar al médico" | "Notify clinician",
"log.btn_cancel": "Cancelar" | "Cancel",
"log.btn_save": "Guardar" | "Save",
"log.btn_saving": "Guardando..." | "Saving...",
"log.error": "No se pudo guardar. Intenta de nuevo." | "Could not save. Please try again.",

// --- Success screen ---
"success.title": "Contacto registrado" | "Contact logged",
"success.body": "El expediente ha sido actualizado." | "The record has been updated.",
"success.body_escalated": "El expediente ha sido actualizado. El equipo clínico ha sido notificado." | "The record has been updated. The clinical team has been notified.",
"success.btn_back": "Volver al inicio" | "Back to home",

// --- Alerts / notifications ---
"alerts.title": "Alertas" | "Alerts",
"alerts.empty": "Sin alertas pendientes." | "No pending alerts.",
"alerts.mark_read": "Marcar como leída" | "Mark as read",
"alerts.escalated_by": "Escalado por {name}" | "Escalated by {name}",

// --- Dashboard ---
"dashboard.title": "Panel del plan de salud" | "Health plan dashboard",
"dashboard.tab_overview": "Resumen" | "Overview",
"dashboard.tab_plans": "Planes activos" | "Active plans",
"dashboard.metric_retention": "Retención mensual" | "Monthly retention",
"dashboard.metric_members": "Miembros activos" | "Active members",
"dashboard.metric_savings": "Ahorro por miembro/mes" | "Savings per member/mo",
"dashboard.metric_er": "Reducción visitas ER" | "ER visit reduction",
"dashboard.section_hedis": "Métricas de calidad HEDIS" | "HEDIS quality metrics",
"dashboard.hedis_diabetes": "Control de diabetes (HbA1c)" | "Diabetes control (HbA1c)",
"dashboard.hedis_mental": "Screenings de salud mental" | "Mental health screenings",
"dashboard.hedis_post_hospital": "Seguimiento post-hospitalización" | "Post-hospitalization follow-up",
"dashboard.hedis_satisfaction": "Satisfacción del miembro" | "Member satisfaction",
"dashboard.section_plans": "Planes activos" | "Active plans",
"dashboard.plan_members": "{n} miembros" | "{n} members",
"dashboard.plan_since": "desde {date}" | "since {date}",
"dashboard.plan_active": "Activo" | "Active",
"dashboard.plan_soon": "Pronto" | "Soon",
"dashboard.growth_title": "Crecimiento de partnerships" | "Partnership growth",
"dashboard.vs_industry": "↑ {pct}% vs industria" | "↑ {pct}% vs industry",
"dashboard.vs_prior_year": "↑ {n}x vs año anterior" | "↑ {n}x vs prior year",
"dashboard.vs_control": "vs grupo control" | "vs control group",

// --- Logo bar ---
"app.name": "Zócalo Health" | "Zócalo Health",
"app.subtitle": "Promotora companion" | "Promotora companion",

// --- Auth ---
"auth.email": "Correo electrónico" | "Email",
"auth.password": "Contraseña" | "Password",
"auth.sign_in": "Iniciar sesión" | "Sign in",
"auth.signing_in": "Entrando..." | "Signing in...",
"auth.error_invalid": "Correo o contraseña incorrectos." | "Invalid email or password.",
"auth.error_generic": "Algo salió mal. Intenta de nuevo." | "Something went wrong. Please try again.",

// --- Shared / misc ---
"common.loading": "Cargando..." | "Loading...",
"common.error_load": "Error al cargar. Recarga la página." | "Error loading. Please refresh.",
"common.unknown": "Desconocido" | "Unknown",
"common.today": "Hoy" | "Today",
"common.days_ago": "hace {n} días" | "{n} days ago",
```

For interpolated strings (those with `{placeholder}` values), use whatever interpolation pattern the existing `t()` implementation supports. If it's a simple string replace, implement a helper:

```ts
export function ti(key: MessageKey, vars: Record<string, string | number>): string {
  let str = t(key)
  for (const [k, v] of Object.entries(vars)) {
    str = str.replace(`{${k}}`, String(v))
  }
  return str
}
```

Export `ti` alongside `t` from the same file.

---

## Step 2 — Audit and replace hardcoded strings

Go through every file in `app/` and `components/` and replace hardcoded Spanish (or English) UI strings with `t()` or `ti()` calls. Do not translate dynamic data from the database (member names, notes, conditions) — only static UI copy.

### Files to audit (check all of these):

```
app/login/page.tsx
app/members/page.tsx
app/members/[id]/page.tsx
app/members/[id]/log/page.tsx
app/success/page.tsx
app/alerts/page.tsx          (or wherever notifications are listed)
app/dashboard/page.tsx
app/settings/page.tsx        (partially done — verify all strings covered)
components/LogTouchpointForm.tsx
components/MemberRow.tsx     (or equivalent list row component)
components/StatusBadge.tsx   (or wherever badge labels are rendered)
components/AlertCard.tsx     (or wherever alert cards are rendered)
components/NavBar.tsx        (or bottom nav component)
components/LogoBar.tsx       (or wherever the header logo bar lives)
```

If a file doesn't exist by that exact name, find the equivalent component that renders that surface and update it.

### What to replace — examples:

```tsx
// Before
<p>Mis miembros</p>
// After
<p>{t('profile.back')}</p>

// Before
<span>Urgente</span>
// After
<span>{t('status.urgent')}</span>

// Before
<button>Guardar</button>
// After
<button>{t('log.btn_save')}</button>

// Before
<p>Sin contacto en 14 días.</p>
// After
<p>{ti('alert.no_contact', { days: daysSinceContact })}</p>
```

### Do NOT translate:
- Member names, ages, conditions (from DB)
- Touchpoint notes (user-entered)
- Dates (format these using `toLocaleDateString` with the current locale instead)
- Insurance plan names
- The word "WhatsApp"

---

## Step 3 — Locale-aware date formatting

Replace any hardcoded Spanish date strings with locale-aware formatting:

```tsx
// In any component that has access to the current locale:
const locale = useLocale() // or however the current locale is accessed

const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

// For the member list greeting date:
// es: "Lunes, 12 de mayo"
// en: "Monday, May 12"
```

---

## Step 4 — Greeting by time of day

The member list greeting should use time-of-day awareness and respect the current locale:

```tsx
const getGreeting = (t: (key: MessageKey) => string) => {
  const hour = new Date().getHours()
  if (hour < 12) return t('members.greeting_morning')
  if (hour < 18) return t('members.greeting_afternoon')
  return t('members.greeting_evening')
}

// Renders as:
// es: "Buenos días, Rosa" / "Buenas tardes, Rosa" / "Buenas noches, Rosa"
// en: "Good morning, Rosa" / "Good afternoon, Rosa" / "Good evening, Rosa"
```

---

## Step 5 — Verify the toggle wires through correctly

After replacing all strings, test the toggle end to end:

1. Open the app in English — every visible UI string should be in English
2. Switch to Spanish in Settings — every visible UI string should switch to Spanish immediately without a page reload
3. Reload the page — the selected language should persist (check that the locale is stored in `localStorage` or a cookie, not just component state)
4. Check these surfaces specifically as they're the most likely to have missed strings:
   - Status badges on the member list
   - Alert card copy on member profiles
   - The log form pill labels (contact type + outcome)
   - The success screen body copy (especially the escalation variant)
   - Empty states on the member list and alerts page

---

## What NOT to change

- Do not change the `Locale` type or the `messagesByLocale` structure — only add keys
- Do not translate the app name "Zócalo Health" or "Compañera"
- Do not translate "WhatsApp"
- Do not translate database content (names, notes, conditions, insurance names)
- Do not add a third locale or change the toggle UI — that's already working
