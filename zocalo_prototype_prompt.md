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
