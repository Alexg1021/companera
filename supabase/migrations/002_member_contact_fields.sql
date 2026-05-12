-- Optional profile fields for Phase 2 (WhatsApp deep link + próxima cita)
alter table public.members
  add column if not exists next_appointment text,
  add column if not exists whatsapp_phone text;
