# Zócalo Health — Promotora Companion App
## Claude Code / Cursor Build Prompt

Build a Next.js + Supabase web app that serves as a care coordination tool for community health workers (promotoras) at a Latino-focused healthcare company. This is a working prototype to demonstrate senior engineering capability.

---

## Stack
- Next.js 14 (app router)
- Supabase (Postgres + auth)
- Tailwind CSS
- Deployed to Vercel

---

## Database Schema

Create these tables in Supabase:

```sql
users (
  id, email, full_name,
  role: 'promotora' | 'clinician' | 'payer',
  created_at
)

members (
  id, full_name, age, conditions, language,
  preferred_contact, insurance_plan,
  last_contacted_at,
  triage_status: 'urgent' | 'upcoming' | 'current',
  promotora_id → users,
  created_at
)

touchpoints (
  id,
  member_id → members,
  promotora_id → users,
  contact_type: 'whatsapp' | 'call' | 'home_visit' | 'clinic',
  outcome: 'contacted' | 'no_answer' | 'appointment_scheduled',
  notes,
  escalated: boolean,
  created_at
)

notifications (
  id, member_id,
  triggered_by → users,
  message,
  read: boolean,
  created_at
)
```

---

## Seed Data

Use these members:

| Name | Age | Conditions | Language | Contact | Insurance | Status |
|---|---|---|---|---|---|---|
| Elena Cruz | 54 | Diabetes T2, hypertension | Spanish only | WhatsApp | Health Net Medicaid | urgent — no contact 14 days |
| Jorge Martínez | 61 | COPD, Diabetes T2 | Spanish/basic English | WhatsApp | Anthem Blue Cross | urgent — ER visit 5/8, no follow-up |
| Lucía Ramírez | 38 | Anxiety, mild asthma | Spanish only | WhatsApp | Health Net Medicaid | upcoming — Medicaid renewal due 5/31 |
| María González | 45 | Hypertension | Spanish | WhatsApp | Health Net | current — last call 5/10 |
| Carlos Fuentes | 52 | Diabetes T2 | Spanish/English | Call | Anthem | current — home visit 5/9 |

---

## Pages to Build

### `/` → redirects to `/members`

---

### `/members` — Member list
- Greeting with promotora name and today's date in Spanish
- Stats row: total members, urgent count, completed today
- Members grouped by triage status: Needs outreach / Upcoming / Al día
- Each row shows avatar, name, last contact note, status badge
- Clicking a row navigates to `/members/[id]`
- Triage status computed server-side based on `last_contacted_at` and touchpoint history

---

### `/members/[id]` — Member profile
- Back button to list
- Member name, age, conditions
- Alert card if urgent (pull from triage logic)
- Health plan card: insurance, next appointment, language, preferred contact
- Recent touchpoints timeline (last 3, pulled from DB)
- Action row: "Registrar" button → `/members/[id]/log` | "WhatsApp" button (opens `https://wa.me/` link)

---

### `/members/[id]/log` — Log a touchpoint
- Contact type selector: WhatsApp / Llamada / Visita domicilio / Clínica
- Outcome selector: Contactada / No contestó / Cita agendada
- Notes textarea (bilingual placeholder)
- Escalation toggle — if on, inserts a record into notifications table
- Save → POST to `/api/touchpoints` → updates member `last_contacted_at` → redirects to success

---

### `/success` — Confirmation screen
- Checkmark, confirmation copy in Spanish
- Button back to member list

---

### `/dashboard` — Payer view
- Metrics: retention rate, active members, cost savings per member, ER reduction
- HEDIS quality metrics as progress bars
- Active health plans list
- Data can be hardcoded aggregates for now, pulled from a config or DB view

---

## API Routes

- `POST /api/touchpoints` — inserts touchpoint, updates member `last_contacted_at`, creates notification if escalated
- `GET /api/members` — returns members with computed triage status
- `GET /api/members/[id]` — member + last 10 touchpoints

---

## Auth

- Use Supabase auth
- Seed one demo user: email `demo@zocalo.health`, password `zocalo2024`, role `promotora`
- Protect all routes — redirect to `/login` if not authenticated
- `/login` page: simple email/password form, Zócalo branding

---

## Design

- Primary color: `#1D9E75` (teal green)
- Mobile-first, max-width ~390px centered, feels like a phone app
- Spanish-first UI copy
- Status badges: urgent = red, upcoming = amber, current = green
- Clean, minimal — think WhatsApp meets a care app, not a clinical EMR

---

## Key Architecture Notes

Implement these correctly — they signal senior-level thinking:

- **Triage logic lives server-side** (not in the client) — a member is "urgent" if `last_contacted_at` is null or > 7 days ago
- **Role column on users** enables future promotora vs. clinician vs. payer views
- **Escalation creates a notification record** — the pattern for a real notification system
- **All DB access through Supabase client** with RLS policies enabled

---

## README Should Include

- What the app is and who it's for
- Architecture decisions (why Supabase, how triage logic works, role model)
- How to run locally
- Link to live Vercel deployment

---

## Build Order

Build in this order and verify each phase works before moving on:

1. **Phase 1** — Supabase schema + seed data + member list pulling from real DB
2. **Phase 2** — Member profile + touchpoint log form + full save loop
3. **Phase 3** — Auth, escalation notifications, payer dashboard
4. **Phase 4** — Vercel deploy + demo credentials + README
5. **Phase 5** — Polish: feels like a real product (see below)

---

## Phase 5 — Polish

Phases 1–4 produced a working prototype. Phase 5 makes it feel like a real product. Work through these in order — each one materially improves the impression.

---

### 5a — Expand seed data

The current 5-member list doesn't stress-test the triage logic or make the app feel inhabited. Replace `supabase/seed.sql` with a richer dataset of ~18 members in varied states.

Add these additional members for `demo@zocalo.health`:

| Name | Age | Conditions | Language | Insurance | Status | Notes |
|---|---|---|---|---|---|---|
| Patricia Mendoza | 67 | Heart failure, diabetes T2 | Spanish only | Health Net Medicaid | urgent | No contact 10 days |
| Roberto Sánchez | 48 | Hypertension | Spanish/English | Anthem Blue Cross | urgent | Missed 2 appointments |
| Gabriela Reyes | 33 | Postpartum depression | Spanish only | Health Net Medicaid | urgent | First visit never completed |
| Isabel Vargas | 71 | COPD, mobility issues | Spanish only | Molina Healthcare | upcoming | Follow-up due this week |
| Tomás Herrera | 55 | Diabetes T2 | Spanish/English | Health Net Medicaid | upcoming | Labs overdue |
| Carmen Delgado | 44 | Anxiety, hypertension | Spanish only | Anthem Blue Cross | upcoming | Appointment next week |
| Sofía Núñez | 29 | Asthma | Spanish/English | Health Net Medicaid | current | Called yesterday, doing well |
| Miguel Ángel Torres | 62 | Diabetes T2, arthritis | Spanish only | Molina Healthcare | current | Home visit last week |
| Alejandra Morales | 51 | Hypertension | Spanish only | Health Net Medicaid | current | Stable, next check in 2 weeks |
| Beatriz Flores | 38 | Depression | Spanish only | Anthem Blue Cross | current | Engaged via WhatsApp |
| David Castillo | 46 | Pre-diabetes | Spanish/English | Health Net Medicaid | current | Attending nutrition classes |
| Esperanza Ruiz | 59 | Diabetes T2 | Spanish only | Molina Healthcare | current | BP controlled, medication adherent |
| Fernando Jiménez | 41 | Obesity, hypertension | Spanish/English | Health Net Medicaid | current | Working on diet plan |

Also seed 2–3 realistic touchpoints per urgent member so their timeline feels alive, not empty.

---

### 5b — Live triage update after logging a touchpoint

After a promotora saves a touchpoint, the member list must visibly reflect the change — no stale data.

**What to fix:**

In `POST /api/touchpoints`:
- After inserting the touchpoint, recompute `triage_status` server-side using `lib/triage.ts`
- Update `members.last_contacted_at` AND `members.triage_status` in the same DB call
- Return the updated member object in the API response

In the member list page (`/members`):
- Use `router.refresh()` after a successful log save so Next.js re-fetches from the server
- The member's row should show the updated last contact note and status badge immediately

In the member profile page (`/members/[id]`):
- The touchpoints timeline should show the new entry at the top on return
- The alert card should disappear if triage status changed from urgent to current

The full loop: log touchpoint → save → redirect to success → back to list → member shows updated status. This must work end to end.

---

### 5c — Empty states

Every surface that can be empty needs intentional copy. Never leave a blank screen.

| Surface | Empty state copy |
|---|---|
| Member list — no urgent members | "Todo al día ✓ — Ningún miembro necesita atención urgente." |
| Member list — no members at all | "Aún no tienes miembros asignados. Contacta a tu coordinadora." |
| Member profile — no touchpoint history | "Sin historial de contacto aún. Registra el primer contacto." |
| Notifications / Alertas — no escalations | "Sin alertas pendientes." |
| Dashboard — no plan data | "Sin datos disponibles para este período." |

Style: centered, muted color, small icon (checkmark or inbox), 1–2 lines max. No walls of text.

---

### 5d — Loading and error states

**Loading:**

Any component that fetches from Supabase needs a skeleton, not a blank flash.

- Member list: render 5–6 skeleton rows (gray rounded rectangles, pulsing animation) while data loads
- Member profile: skeleton for the header card and timeline
- Use Tailwind's `animate-pulse` class — no extra libraries needed

```tsx
// Example skeleton row
<div className="animate-pulse flex items-center gap-3 px-4 py-3">
  <div className="rounded-full bg-gray-200 h-9 w-9" />
  <div className="flex-1 space-y-2">
    <div className="h-3 bg-gray-200 rounded w-1/3" />
    <div className="h-2 bg-gray-200 rounded w-1/2" />
  </div>
</div>
```

**Errors:**

The touchpoint log form needs explicit error handling:

- Wrap the `POST /api/touchpoints` call in try/catch
- On failure, show an inline error banner above the save button: "No se pudo guardar. Intenta de nuevo."
- The save button should show a loading spinner while the request is in flight and be disabled to prevent double-submits
- On the member list, if the Supabase fetch fails, show: "Error al cargar miembros. Recarga la página."

---

### 5e — Mobile audit

Open the app on a real phone (or Chrome DevTools at 390px) and fix these common issues:

- **Tap targets** — every button and member row tap target must be at least 44px tall. Check the log form pills especially.
- **Keyboard behavior** — on the log form, when the notes textarea gets focus, the keyboard should not cover the save button. Add `pb-safe` or equivalent bottom padding.
- **Scroll** — the member list should scroll smoothly with no body overflow issues. Test with 18 members.
- **Font sizes** — nothing below 12px on mobile. Check the stat chips and section labels.
- **Safe area insets** — add `env(safe-area-inset-bottom)` padding to the bottom action row on member profile and log form so it clears the home indicator on iPhone.

```css
/* Add to bottom action rows */
padding-bottom: max(12px, env(safe-area-inset-bottom));
```

---

### 5f — One live number on the payer dashboard

The dashboard metrics can stay as demo aggregates, but the "Miembros activos" count must pull from the real DB:

```ts
// In the dashboard page server component
const { count } = await supabase
  .from('members')
  .select('*', { count: 'exact', head: true })

// Pass count to the metric card — replace the hardcoded 247
```

This one change shows the dashboard pattern is wired up, not purely fictional.

---

### 5g — PWA manifest

Add a `manifest.json` so the app is installable on a phone home screen. This signals you thought about the real deployment context — a promotora in the field, not a user at a desk.

Create `/public/manifest.json`:

```json
{
  "name": "Compañera — Zócalo Health",
  "short_name": "Compañera",
  "description": "Herramienta de coordinación para promotoras de salud",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1D9E75",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

In `app/layout.tsx`, add to the `<head>`:
```tsx
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#1D9E75" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
```

Create simple placeholder icons at `/public/icon-192.png` and `/public/icon-512.png` — a teal square with a white heart is enough.

---

### 5h — Repo cleanup

The repo root should look like a product, not a working directory.

- Move `zocalo_health_full_demo.html` and `zocalo_prototype_prompt.md` into a `/docs` folder
- Update `README.md`: replace the placeholder Vercel URL with `https://companera.vercel.app`
- Add a brief "Why I built this" section to the README — 2–3 sentences on Zócalo Health's model and what problem this tool solves. This is the first thing an engineer reviewing the repo will read.

---

### Phase 5 completion checklist

Before sending the link, verify:

- [ ] ~18 members seeded with varied triage states and touchpoint history
- [ ] Logging a touchpoint updates the member list status in real time
- [ ] No blank screens — every empty state has copy
- [ ] Member list shows skeleton while loading, error message on failure
- [ ] Log form shows spinner on save, error banner on failure
- [ ] App feels good on a real phone at 390px
- [ ] Payer dashboard "Miembros activos" pulls from real DB
- [ ] `manifest.json` present, app installable on mobile
- [ ] Repo root is clean, README has live URL and context
