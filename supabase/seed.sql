-- Seed members + touchpoints for demo@zocalo.health
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
  ('Elena Cruz', 54, 'Diabetes T2, hipertensión', 'Español', 'WhatsApp', 'Health Net Medicaid', null::timestamptz, 'urgent'::public.triage_status, 'Seguimiento pendiente · faltó cita 5/2', '525511110001'),
  ('Jorge Martínez', 61, 'EPOC, Diabetes T2', 'Español / inglés básico', 'WhatsApp', 'Anthem Blue Cross', timestamptz '2026-04-20 10:00:00+00', 'urgent'::public.triage_status, 'Seguimiento post-ER', '525511110002'),
  ('Lucía Ramírez', 38, 'Ansiedad, asma leve', 'Español', 'WhatsApp', 'Health Net Medicaid', timestamptz '2026-05-09 15:00:00+00', 'upcoming'::public.triage_status, 'Renovación Medicaid antes del 31/5', '525511110003'),
  ('María González', 45, 'Hipertensión', 'Español', 'WhatsApp', 'Health Net', timestamptz '2026-05-10 14:30:00+00', 'current'::public.triage_status, 'Próxima cita 18/5', '525511110004'),
  ('Carlos Fuentes', 52, 'Diabetes T2', 'Español / inglés', 'Llamada', 'Anthem', timestamptz '2026-05-09 11:00:00+00', 'current'::public.triage_status, 'Laboratorios pendientes', '525511110005'),
  ('Patricia Mendoza', 67, 'Insuficiencia cardiaca, diabetes T2', 'Español', 'WhatsApp', 'Health Net Medicaid', timestamptz '2026-05-01 09:00:00+00', 'urgent'::public.triage_status, 'Control cardiológico pendiente', '525511110006'),
  ('Roberto Sánchez', 48, 'Hipertensión', 'Español / inglés', 'WhatsApp', 'Anthem Blue Cross', timestamptz '2026-05-02 11:00:00+00', 'urgent'::public.triage_status, 'Reagendar citas perdidas', '525511110007'),
  ('Gabriela Reyes', 33, 'Depresión posparto', 'Español', 'WhatsApp', 'Health Net Medicaid', timestamptz '2026-04-28 16:00:00+00', 'urgent'::public.triage_status, 'Primera visita posparto', '525511110008'),
  ('Isabel Vargas', 71, 'EPOC, movilidad reducida', 'Español', 'WhatsApp', 'Molina Healthcare', timestamptz '2026-05-08 10:00:00+00', 'upcoming'::public.triage_status, 'Seguimiento esta semana', '525511110009'),
  ('Tomás Herrera', 55, 'Diabetes T2', 'Español / inglés', 'WhatsApp', 'Health Net Medicaid', timestamptz '2026-05-07 14:00:00+00', 'upcoming'::public.triage_status, 'Laboratorios vencidos', '525511110010'),
  ('Carmen Delgado', 44, 'Ansiedad, hipertensión', 'Español', 'WhatsApp', 'Anthem Blue Cross', timestamptz '2026-05-10 09:00:00+00', 'upcoming'::public.triage_status, 'Cita próxima semana', '525511110011'),
  ('Sofía Núñez', 29, 'Asma', 'Español / inglés', 'WhatsApp', 'Health Net Medicaid', timestamptz '2026-05-10 18:00:00+00', 'current'::public.triage_status, 'Control en 3 semanas', '525511110012'),
  ('Miguel Ángel Torres', 62, 'Diabetes T2, artritis', 'Español', 'WhatsApp', 'Molina Healthcare', timestamptz '2026-05-04 12:00:00+00', 'current'::public.triage_status, 'Visita domicilio la semana pasada', '525511110013'),
  ('Alejandra Morales', 51, 'Hipertensión', 'Español', 'WhatsApp', 'Health Net Medicaid', timestamptz '2026-05-06 10:00:00+00', 'current'::public.triage_status, 'Próximo control en 2 semanas', '525511110014'),
  ('Beatriz Flores', 38, 'Depresión', 'Español', 'WhatsApp', 'Anthem Blue Cross', timestamptz '2026-05-08 15:00:00+00', 'current'::public.triage_status, 'Seguimiento por WhatsApp', '525511110015'),
  ('David Castillo', 46, 'Prediabetes', 'Español / inglés', 'WhatsApp', 'Health Net Medicaid', timestamptz '2026-05-05 11:00:00+00', 'current'::public.triage_status, 'Clases de nutrición', '525511110016'),
  ('Esperanza Ruiz', 59, 'Diabetes T2', 'Español', 'WhatsApp', 'Molina Healthcare', timestamptz '2026-05-09 09:30:00+00', 'current'::public.triage_status, 'PA controlada, adherente', '525511110017'),
  ('Fernando Jiménez', 41, 'Obesidad, hipertensión', 'Español / inglés', 'WhatsApp', 'Health Net Medicaid', timestamptz '2026-05-08 08:00:00+00', 'current'::public.triage_status, 'Plan alimentación en curso', '525511110018')
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
  ('Elena Cruz', 'whatsapp'::public.contact_type, 'no_answer'::public.touchpoint_outcome, 'Intento de contacto · sin respuesta', timestamptz '2026-04-22 10:00:00+00'),
  ('Elena Cruz', 'call'::public.contact_type, 'contacted'::public.touchpoint_outcome, 'Sin respuesta · faltó cita 5/2', timestamptz '2026-05-01 12:00:00+00'),
  ('Elena Cruz', 'whatsapp'::public.contact_type, 'no_answer'::public.touchpoint_outcome, 'Seguimiento programado · mensaje de voz', timestamptz '2026-05-06 09:00:00+00'),
  ('Jorge Martínez', 'whatsapp'::public.contact_type, 'no_answer'::public.touchpoint_outcome, 'Intento de contacto · sin respuesta', timestamptz '2026-04-22 10:00:00+00'),
  ('Jorge Martínez', 'call'::public.contact_type, 'contacted'::public.touchpoint_outcome, 'Visita ER 5/8 · sin seguimiento', timestamptz '2026-05-01 12:00:00+00'),
  ('Jorge Martínez', 'whatsapp'::public.contact_type, 'no_answer'::public.touchpoint_outcome, 'Seguimiento programado · mensaje de voz', timestamptz '2026-05-06 09:00:00+00'),
  ('Lucía Ramírez', 'whatsapp'::public.contact_type, 'no_answer'::public.touchpoint_outcome, 'Intento de contacto · sin respuesta', timestamptz '2026-04-22 10:00:00+00'),
  ('Lucía Ramírez', 'whatsapp'::public.contact_type, 'contacted'::public.touchpoint_outcome, 'Renovación Medicaid vence 5/31', timestamptz '2026-05-09 15:00:00+00'),
  ('María González', 'whatsapp'::public.contact_type, 'no_answer'::public.touchpoint_outcome, 'Intento de contacto · sin respuesta', timestamptz '2026-04-22 10:00:00+00'),
  ('María González', 'call'::public.contact_type, 'contacted'::public.touchpoint_outcome, 'Llamada 5/10 · próx cita 5/18', timestamptz '2026-05-10 14:30:00+00'),
  ('Carlos Fuentes', 'whatsapp'::public.contact_type, 'no_answer'::public.touchpoint_outcome, 'Intento de contacto · sin respuesta', timestamptz '2026-04-22 10:00:00+00'),
  ('Carlos Fuentes', 'home_visit'::public.contact_type, 'contacted'::public.touchpoint_outcome, 'Visita domicilio 5/9 · labs pedidos', timestamptz '2026-05-09 11:00:00+00'),
  ('Patricia Mendoza', 'whatsapp'::public.contact_type, 'no_answer'::public.touchpoint_outcome, 'Intento de contacto · sin respuesta', timestamptz '2026-04-22 10:00:00+00'),
  ('Patricia Mendoza', 'call'::public.contact_type, 'contacted'::public.touchpoint_outcome, 'Falta de adherencia · edema empeorando', timestamptz '2026-05-01 12:00:00+00'),
  ('Patricia Mendoza', 'whatsapp'::public.contact_type, 'no_answer'::public.touchpoint_outcome, 'Seguimiento programado · mensaje de voz', timestamptz '2026-05-06 09:00:00+00'),
  ('Roberto Sánchez', 'whatsapp'::public.contact_type, 'no_answer'::public.touchpoint_outcome, 'Intento de contacto · sin respuesta', timestamptz '2026-04-22 10:00:00+00'),
  ('Roberto Sánchez', 'call'::public.contact_type, 'contacted'::public.touchpoint_outcome, 'Perdió 2 citas seguidas · hipertensión no controlada', timestamptz '2026-05-01 12:00:00+00'),
  ('Roberto Sánchez', 'whatsapp'::public.contact_type, 'no_answer'::public.touchpoint_outcome, 'Seguimiento programado · mensaje de voz', timestamptz '2026-05-06 09:00:00+00'),
  ('Gabriela Reyes', 'whatsapp'::public.contact_type, 'no_answer'::public.touchpoint_outcome, 'Intento de contacto · sin respuesta', timestamptz '2026-04-22 10:00:00+00'),
  ('Gabriela Reyes', 'call'::public.contact_type, 'contacted'::public.touchpoint_outcome, 'Primera visita posparto incompleta', timestamptz '2026-05-01 12:00:00+00'),
  ('Gabriela Reyes', 'whatsapp'::public.contact_type, 'no_answer'::public.touchpoint_outcome, 'Seguimiento programado · mensaje de voz', timestamptz '2026-05-06 09:00:00+00'),
  ('Isabel Vargas', 'whatsapp'::public.contact_type, 'no_answer'::public.touchpoint_outcome, 'Intento de contacto · sin respuesta', timestamptz '2026-04-22 10:00:00+00'),
  ('Isabel Vargas', 'whatsapp'::public.contact_type, 'contacted'::public.touchpoint_outcome, 'Seguimiento rutinario · bien en general', timestamptz '2026-05-08 10:00:00+00'),
  ('Tomás Herrera', 'whatsapp'::public.contact_type, 'no_answer'::public.touchpoint_outcome, 'Intento de contacto · sin respuesta', timestamptz '2026-04-22 10:00:00+00'),
  ('Tomás Herrera', 'whatsapp'::public.contact_type, 'contacted'::public.touchpoint_outcome, 'Seguimiento rutinario · bien en general', timestamptz '2026-05-07 14:00:00+00'),
  ('Carmen Delgado', 'whatsapp'::public.contact_type, 'no_answer'::public.touchpoint_outcome, 'Intento de contacto · sin respuesta', timestamptz '2026-04-22 10:00:00+00'),
  ('Carmen Delgado', 'whatsapp'::public.contact_type, 'contacted'::public.touchpoint_outcome, 'Seguimiento rutinario · bien en general', timestamptz '2026-05-10 09:00:00+00'),
  ('Sofía Núñez', 'whatsapp'::public.contact_type, 'no_answer'::public.touchpoint_outcome, 'Intento de contacto · sin respuesta', timestamptz '2026-04-22 10:00:00+00'),
  ('Sofía Núñez', 'whatsapp'::public.contact_type, 'contacted'::public.touchpoint_outcome, 'Seguimiento rutinario · bien en general', timestamptz '2026-05-10 18:00:00+00'),
  ('Miguel Ángel Torres', 'whatsapp'::public.contact_type, 'no_answer'::public.touchpoint_outcome, 'Intento de contacto · sin respuesta', timestamptz '2026-04-22 10:00:00+00'),
  ('Miguel Ángel Torres', 'whatsapp'::public.contact_type, 'contacted'::public.touchpoint_outcome, 'Seguimiento rutinario · bien en general', timestamptz '2026-05-04 12:00:00+00'),
  ('Alejandra Morales', 'whatsapp'::public.contact_type, 'no_answer'::public.touchpoint_outcome, 'Intento de contacto · sin respuesta', timestamptz '2026-04-22 10:00:00+00'),
  ('Alejandra Morales', 'whatsapp'::public.contact_type, 'contacted'::public.touchpoint_outcome, 'Seguimiento rutinario · bien en general', timestamptz '2026-05-06 10:00:00+00'),
  ('Beatriz Flores', 'whatsapp'::public.contact_type, 'no_answer'::public.touchpoint_outcome, 'Intento de contacto · sin respuesta', timestamptz '2026-04-22 10:00:00+00'),
  ('Beatriz Flores', 'whatsapp'::public.contact_type, 'contacted'::public.touchpoint_outcome, 'Seguimiento rutinario · bien en general', timestamptz '2026-05-08 15:00:00+00'),
  ('David Castillo', 'whatsapp'::public.contact_type, 'no_answer'::public.touchpoint_outcome, 'Intento de contacto · sin respuesta', timestamptz '2026-04-22 10:00:00+00'),
  ('David Castillo', 'whatsapp'::public.contact_type, 'contacted'::public.touchpoint_outcome, 'Seguimiento rutinario · bien en general', timestamptz '2026-05-05 11:00:00+00'),
  ('Esperanza Ruiz', 'whatsapp'::public.contact_type, 'no_answer'::public.touchpoint_outcome, 'Intento de contacto · sin respuesta', timestamptz '2026-04-22 10:00:00+00'),
  ('Esperanza Ruiz', 'whatsapp'::public.contact_type, 'contacted'::public.touchpoint_outcome, 'Seguimiento rutinario · bien en general', timestamptz '2026-05-09 09:30:00+00'),
  ('Fernando Jiménez', 'whatsapp'::public.contact_type, 'no_answer'::public.touchpoint_outcome, 'Intento de contacto · sin respuesta', timestamptz '2026-04-22 10:00:00+00'),
  ('Fernando Jiménez', 'whatsapp'::public.contact_type, 'contacted'::public.touchpoint_outcome, 'Seguimiento rutinario · bien en general', timestamptz '2026-05-08 08:00:00+00')
) as r(full_name, contact_type, outcome, notes, created_at) on r.full_name = m.full_name;

-- Optional: payer user for /dashboard
-- 1) Create user payer@zocalo.health in Authentication.
-- 2) Run:
--    update public.users
--    set role = 'payer', full_name = 'Alex Gutierrez'
--    where email = 'payer@zocalo.health';
