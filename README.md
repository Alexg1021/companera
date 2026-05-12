# Compañera

**Compañera** is a working prototype of a **community health worker (promotora) companion app** for Zócalo Health: a mobile-first web tool for care coordination, touchpoint logging, escalations, and a separate **payer** dashboard with illustrative metrics.

**Live deployment:** replace this link after your first Vercel deploy: `https://companera.vercel.app`

---

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS  
- **Supabase** (Postgres, Auth, Row Level Security)  
- **Deploy target:** Vercel  

---

## Architecture (why this shape)

- **Supabase** gives Postgres + Auth in one place, with **RLS** so member and touchpoint data are scoped to the assigned promotora (and notifications follow the same member linkage). The anon key is safe to expose in the browser because policies enforce access; there is no service-role key in this app.
- **Triage** is computed **on the server** (see `lib/triage.ts`): a member is **urgent** if `last_contacted_at` is null or older than seven days; otherwise the stored `triage_status` can keep someone in **upcoming** (for example Medicaid renewal) even when contact is recent; otherwise **current**.
- **Roles** on `public.users` (`promotora`, `clinician`, `payer`) drive routing: payers land on **`/dashboard`** with demo aggregates; promotoras and clinicians use **`/members`** and related flows (`middleware.ts` + `lib/user-role.ts`).
- **Escalations** on touchpoint save insert a row in **`notifications`**; promotoras list and mark them read under RLS (`003_notifications_update.sql`).

---

## Prerequisites

- Node.js **18.18+** (see `package.json` `engines`)  
- A **Supabase** project  
- Optional: **Vercel** account for production deploy  

---

## Supabase setup

Run SQL in the Supabase **SQL Editor** (or use the Supabase CLI against these files), **in order**:

| Order | File | Purpose |
|-------|------|--------|
| 1 | `supabase/migrations/001_initial.sql` | Enums, `users`, `members`, `touchpoints`, `notifications`, RLS, auth → `public.users` trigger |
| 2 | `supabase/migrations/002_member_contact_fields.sql` | `next_appointment`, `whatsapp_phone` on `members` |
| 3 | `supabase/migrations/003_notifications_update.sql` | RLS `UPDATE` on `notifications` (mark read) |

### Auth users (required before seed)

1. In Supabase **Authentication → Users**, create **`demo@zocalo.health`** with password **`zocalo2024`** (or your own password and update the README demo section). The trigger creates **`public.users`** automatically.
2. Optional payer demo: create **`payer@zocalo.health`**, then run the `UPDATE` shown at the bottom of **`supabase/seed.sql`** to set `role = 'payer'`.

### Seed data

After `demo@zocalo.health` exists, run **`supabase/seed.sql`** in the SQL Editor. It wipes and re-seeds demo members and touchpoints for that promotora.

---

## Local development

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your Supabase URL and anon key (Settings → API).
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should be redirected to **`/login`**, then to **`/members`** or **`/dashboard`** depending on role.

```bash
npm run build   # production build
npm run lint
```

---

## Deploying to Vercel

1. Push this repo to GitHub (or GitLab / Bitbucket) if it is not already hosted.
2. In Vercel, **Import** the repository and use the default Next.js settings.
3. Under **Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
   Use the same values as in `.env.local`. Apply to **Production** (and Preview if you use previews).
4. Deploy. Smoke-test: login, member list, log touchpoint, optional escalation → **Alertas**, payer **`/dashboard`** if configured.

Update the **Live deployment** link at the top of this README with your production URL.

---

## Environment variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase **anon** public key (not the service role key) |

Never commit **`.env.local`** or the service role key.

---

## Demo accounts (prototype only)

| Role | Email | Password | Notes |
|------|--------|----------|--------|
| Promotora | `demo@zocalo.health` | `zocalo2024` | Create this user in Supabase Auth before running `seed.sql`. |
| Payer (optional) | `payer@zocalo.health` | *(you choose)* | After creating the user, run the SQL comment at the end of `supabase/seed.sql` to set `role = 'payer'`. |

Change passwords in any real environment; these are for demos and portfolios.

---

## Project layout (high level)

```
app/                  # App Router pages and API routes
components/           # Client components (log form, sign out, notifications, etc.)
lib/                  # Supabase clients, triage, members/member detail, dashboard demo data
middleware.ts         # Session refresh + auth + role redirects
supabase/migrations/  # Ordered SQL migrations
supabase/seed.sql     # Demo data for demo@zocalo.health
```

---

## Reference

- Product / build notes: `zocalo_prototype_prompt.md`  
- UI reference mock: `zocalo_health_full_demo.html`  
