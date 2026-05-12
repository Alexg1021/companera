-- Seed members + touchpoints for demo@zocalo.health
-- Prerequisite: create user in Authentication with email demo@zocalo.health
-- (so public.users row exists via trigger). Then run in SQL Editor.

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
  last_contacted_at, triage_status, promotora_id
)
select v.*, u.id
from (values
  ('Elena Cruz', 54, 'Diabetes T2, hipertensión', 'Español', 'WhatsApp', 'Health Net Medicaid',
    null::timestamptz, 'urgent'::public.triage_status),
  ('Jorge Martínez', 61, 'EPOC, Diabetes T2', 'Español / inglés básico', 'WhatsApp', 'Anthem Blue Cross',
    timestamptz '2026-04-20 10:00:00+00', 'urgent'::public.triage_status),
  ('Lucía Ramírez', 38, 'Ansiedad, asma leve', 'Español', 'WhatsApp', 'Health Net Medicaid',
    timestamptz '2026-05-09 15:00:00+00', 'upcoming'::public.triage_status),
  ('María González', 45, 'Hipertensión', 'Español', 'WhatsApp', 'Health Net',
    timestamptz '2026-05-10 14:30:00+00', 'current'::public.triage_status),
  ('Carlos Fuentes', 52, 'Diabetes T2', 'Español / inglés', 'Llamada', 'Anthem',
    timestamptz '2026-05-09 11:00:00+00', 'current'::public.triage_status)
) as v(full_name, age, conditions, language, preferred_contact, insurance_plan, last_contacted_at, triage_status)
cross join (select id from public.users where email = 'demo@zocalo.health' limit 1) u;

insert into public.touchpoints (member_id, promotora_id, contact_type, outcome, notes, escalated, created_at)
select m.id, m.promotora_id, r.contact_type, r.outcome, r.notes, false, r.created_at
from public.members m
join public.users u on u.id = m.promotora_id and u.email = 'demo@zocalo.health'
join (values
  ('Elena Cruz', 'whatsapp'::public.contact_type, 'no_answer'::public.touchpoint_outcome,
    'Sin respuesta · faltó cita 5/2', timestamptz '2026-04-26 09:00:00+00'),
  ('Jorge Martínez', 'call'::public.contact_type, 'contacted'::public.touchpoint_outcome,
    'Visita ER 5/8 · sin seguimiento', timestamptz '2026-05-08 18:00:00+00'),
  ('Lucía Ramírez', 'whatsapp'::public.contact_type, 'contacted'::public.touchpoint_outcome,
    'Renovación Medicaid vence 5/31', timestamptz '2026-05-09 15:00:00+00'),
  ('María González', 'call'::public.contact_type, 'contacted'::public.touchpoint_outcome,
    'Llamada 5/10 · próx cita 5/18', timestamptz '2026-05-10 14:30:00+00'),
  ('Carlos Fuentes', 'home_visit'::public.contact_type, 'contacted'::public.touchpoint_outcome,
    'Visita domicilio 5/9 · labs pedidos', timestamptz '2026-05-09 11:00:00+00')
) as r(full_name, contact_type, outcome, notes, created_at) on r.full_name = m.full_name;
