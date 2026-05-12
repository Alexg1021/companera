/**
 * Generates supabase/seed.sql — run: node scripts/generate-seed.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "..", "supabase", "seed.sql");

function esc(s) {
  return String(s).replace(/'/g, "''");
}

const members = [
  {
    fn: "Elena Cruz",
    age: 54,
    cond: "Diabetes T2, hipertensión",
    lang: "Español",
    pc: "WhatsApp",
    ins: "Health Net Medicaid",
    last: null,
    tri: "urgent",
    next: "Seguimiento pendiente · faltó cita 5/2",
    phone: "525511110001",
  },
  {
    fn: "Jorge Martínez",
    age: 61,
    cond: "EPOC, Diabetes T2",
    lang: "Español / inglés básico",
    pc: "WhatsApp",
    ins: "Anthem Blue Cross",
    last: "2026-04-20 10:00:00+00",
    tri: "urgent",
    next: "Seguimiento post-ER",
    phone: "525511110002",
  },
  {
    fn: "Lucía Ramírez",
    age: 38,
    cond: "Ansiedad, asma leve",
    lang: "Español",
    pc: "WhatsApp",
    ins: "Health Net Medicaid",
    last: "2026-05-09 15:00:00+00",
    tri: "upcoming",
    next: "Renovación Medicaid antes del 31/5",
    phone: "525511110003",
  },
  {
    fn: "María González",
    age: 45,
    cond: "Hipertensión",
    lang: "Español",
    pc: "WhatsApp",
    ins: "Health Net",
    last: "2026-05-10 14:30:00+00",
    tri: "current",
    next: "Próxima cita 18/5",
    phone: "525511110004",
  },
  {
    fn: "Carlos Fuentes",
    age: 52,
    cond: "Diabetes T2",
    lang: "Español / inglés",
    pc: "Llamada",
    ins: "Anthem",
    last: "2026-05-09 11:00:00+00",
    tri: "current",
    next: "Laboratorios pendientes",
    phone: "525511110005",
  },
  {
    fn: "Patricia Mendoza",
    age: 67,
    cond: "Insuficiencia cardiaca, diabetes T2",
    lang: "Español",
    pc: "WhatsApp",
    ins: "Health Net Medicaid",
    last: "2026-05-01 09:00:00+00",
    tri: "urgent",
    next: "Control cardiológico pendiente",
    phone: "525511110006",
  },
  {
    fn: "Roberto Sánchez",
    age: 48,
    cond: "Hipertensión",
    lang: "Español / inglés",
    pc: "WhatsApp",
    ins: "Anthem Blue Cross",
    last: "2026-05-02 11:00:00+00",
    tri: "urgent",
    next: "Reagendar citas perdidas",
    phone: "525511110007",
  },
  {
    fn: "Gabriela Reyes",
    age: 33,
    cond: "Depresión posparto",
    lang: "Español",
    pc: "WhatsApp",
    ins: "Health Net Medicaid",
    last: "2026-04-28 16:00:00+00",
    tri: "urgent",
    next: "Primera visita posparto",
    phone: "525511110008",
  },
  {
    fn: "Isabel Vargas",
    age: 71,
    cond: "EPOC, movilidad reducida",
    lang: "Español",
    pc: "WhatsApp",
    ins: "Molina Healthcare",
    last: "2026-05-08 10:00:00+00",
    tri: "upcoming",
    next: "Seguimiento esta semana",
    phone: "525511110009",
  },
  {
    fn: "Tomás Herrera",
    age: 55,
    cond: "Diabetes T2",
    lang: "Español / inglés",
    pc: "WhatsApp",
    ins: "Health Net Medicaid",
    last: "2026-05-07 14:00:00+00",
    tri: "upcoming",
    next: "Laboratorios vencidos",
    phone: "525511110010",
  },
  {
    fn: "Carmen Delgado",
    age: 44,
    cond: "Ansiedad, hipertensión",
    lang: "Español",
    pc: "WhatsApp",
    ins: "Anthem Blue Cross",
    last: "2026-05-10 09:00:00+00",
    tri: "upcoming",
    next: "Cita próxima semana",
    phone: "525511110011",
  },
  {
    fn: "Sofía Núñez",
    age: 29,
    cond: "Asma",
    lang: "Español / inglés",
    pc: "WhatsApp",
    ins: "Health Net Medicaid",
    last: "2026-05-10 18:00:00+00",
    tri: "current",
    next: "Control en 3 semanas",
    phone: "525511110012",
  },
  {
    fn: "Miguel Ángel Torres",
    age: 62,
    cond: "Diabetes T2, artritis",
    lang: "Español",
    pc: "WhatsApp",
    ins: "Molina Healthcare",
    last: "2026-05-04 12:00:00+00",
    tri: "current",
    next: "Visita domicilio la semana pasada",
    phone: "525511110013",
  },
  {
    fn: "Alejandra Morales",
    age: 51,
    cond: "Hipertensión",
    lang: "Español",
    pc: "WhatsApp",
    ins: "Health Net Medicaid",
    last: "2026-05-06 10:00:00+00",
    tri: "current",
    next: "Próximo control en 2 semanas",
    phone: "525511110014",
  },
  {
    fn: "Beatriz Flores",
    age: 38,
    cond: "Depresión",
    lang: "Español",
    pc: "WhatsApp",
    ins: "Anthem Blue Cross",
    last: "2026-05-08 15:00:00+00",
    tri: "current",
    next: "Seguimiento por WhatsApp",
    phone: "525511110015",
  },
  {
    fn: "David Castillo",
    age: 46,
    cond: "Prediabetes",
    lang: "Español / inglés",
    pc: "WhatsApp",
    ins: "Health Net Medicaid",
    last: "2026-05-05 11:00:00+00",
    tri: "current",
    next: "Clases de nutrición",
    phone: "525511110016",
  },
  {
    fn: "Esperanza Ruiz",
    age: 59,
    cond: "Diabetes T2",
    lang: "Español",
    pc: "WhatsApp",
    ins: "Molina Healthcare",
    last: "2026-05-09 09:30:00+00",
    tri: "current",
    next: "PA controlada, adherente",
    phone: "525511110017",
  },
  {
    fn: "Fernando Jiménez",
    age: 41,
    cond: "Obesidad, hipertensión",
    lang: "Español / inglés",
    pc: "WhatsApp",
    ins: "Health Net Medicaid",
    last: "2026-05-08 08:00:00+00",
    tri: "current",
    next: "Plan alimentación en curso",
    phone: "525511110018",
  },
];

const touchpoints = [];
const urgent = new Set([
  "Elena Cruz",
  "Jorge Martínez",
  "Patricia Mendoza",
  "Roberto Sánchez",
  "Gabriela Reyes",
]);

for (const m of members) {
  touchpoints.push({
    fn: m.fn,
    ct: "whatsapp",
    oc: "no_answer",
    notes: "Intento de contacto · sin respuesta",
    ts: "2026-04-22 10:00:00+00",
  });
  if (urgent.has(m.fn)) {
    touchpoints.push({
      fn: m.fn,
      ct: "call",
      oc: "contacted",
      notes:
        m.fn === "Elena Cruz"
          ? "Sin respuesta · faltó cita 5/2"
          : m.fn === "Jorge Martínez"
            ? "Visita ER 5/8 · sin seguimiento"
            : m.fn === "Patricia Mendoza"
              ? "Falta de adherencia · edema empeorando"
              : m.fn === "Roberto Sánchez"
                ? "Perdió 2 citas seguidas · hipertensión no controlada"
                : "Primera visita posparto incompleta",
      ts: "2026-05-01 12:00:00+00",
    });
    touchpoints.push({
      fn: m.fn,
      ct: "whatsapp",
      oc: "no_answer",
      notes: "Seguimiento programado · mensaje de voz",
      ts: "2026-05-06 09:00:00+00",
    });
  } else if (m.fn === "Lucía Ramírez") {
    touchpoints.push({
      fn: m.fn,
      ct: "whatsapp",
      oc: "contacted",
      notes: "Renovación Medicaid vence 5/31",
      ts: "2026-05-09 15:00:00+00",
    });
  } else if (m.fn === "María González") {
    touchpoints.push({
      fn: m.fn,
      ct: "call",
      oc: "contacted",
      notes: "Llamada 5/10 · próx cita 5/18",
      ts: "2026-05-10 14:30:00+00",
    });
  } else if (m.fn === "Carlos Fuentes") {
    touchpoints.push({
      fn: m.fn,
      ct: "home_visit",
      oc: "contacted",
      notes: "Visita domicilio 5/9 · labs pedidos",
      ts: "2026-05-09 11:00:00+00",
    });
  } else {
    touchpoints.push({
      fn: m.fn,
      ct: "whatsapp",
      oc: "contacted",
      notes: "Seguimiento rutinario · bien en general",
      ts: m.last ?? "2026-05-09 12:00:00+00",
    });
  }
}

let sql = `-- Seed members + touchpoints for demo@zocalo.health
-- Prerequisite: create user in Authentication with email demo@zocalo.health
-- (so public.users row exists via trigger). Run 002_member_contact_fields.sql if needed.
-- Regenerate: node scripts/generate-seed.mjs
-- Then run in SQL Editor.

update public.users
set full_name = 'Rosa Mendoza'
where email = 'demo@zocalo.health';

delete from public.touchpoints
where promotora_id = (select id from public.users where email = 'demo@zocalo.health' limit 1);

delete from public.notifications
where member_id in (
  select id from public.members
  where promotora_id = (select id from public.users where email = 'demo@zocalo.health' limit 1)
);

delete from public.members
where promotora_id = (select id from public.users where email = 'demo@zocalo.health' limit 1);

insert into public.members (
  full_name, age, conditions, language, preferred_contact, insurance_plan,
  last_contacted_at, triage_status, next_appointment, whatsapp_phone, promotora_id
)
select
  v.full_name,
  v.age,
  v.conditions,
  v.language,
  v.preferred_contact,
  v.insurance_plan,
  v.last_contacted_at,
  v.triage_status::public.triage_status,
  v.next_appointment,
  v.whatsapp_phone,
  u.id
from (values
`;

const valueRows = members.map(
  (m) =>
    `  ('${esc(m.fn)}', ${m.age}, '${esc(m.cond)}', '${esc(m.lang)}', '${esc(m.pc)}', '${esc(m.ins)}', ` +
    (m.last === null ? `null::timestamptz` : `timestamptz '${m.last}'`) +
    `, '${m.tri}'::public.triage_status, '${esc(m.next)}', '${m.phone}')`
);
sql += valueRows.join(",\n");
sql += `
) as v(
  full_name, age, conditions, language, preferred_contact, insurance_plan,
  last_contacted_at, triage_status, next_appointment, whatsapp_phone
)
cross join (select id from public.users where email = 'demo@zocalo.health' limit 1) u;

insert into public.touchpoints (member_id, promotora_id, contact_type, outcome, notes, escalated, created_at)
select m.id, m.promotora_id, r.contact_type::public.contact_type, r.outcome::public.touchpoint_outcome, r.notes, false, r.created_at::timestamptz
from public.members m
join public.users u on u.id = m.promotora_id and u.email = 'demo@zocalo.health'
join (values
`;

const tpRows = touchpoints.map(
  (t) =>
    `  ('${esc(t.fn)}', '${t.ct}'::public.contact_type, '${t.oc}'::public.touchpoint_outcome, '${esc(t.notes)}', timestamptz '${t.ts}')`
);
sql += tpRows.join(",\n");
sql += `
) as r(full_name, contact_type, outcome, notes, created_at) on r.full_name = m.full_name;

-- Optional: payer user for /dashboard
-- 1) Create user payer@zocalo.health in Authentication.
-- 2) Run:
--    update public.users
--    set role = 'payer', full_name = 'Alex Rivera'
--    where email = 'payer@zocalo.health';
`;

fs.writeFileSync(out, sql);
console.log("Wrote", out);
