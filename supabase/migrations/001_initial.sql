-- Compañera / Zócalo Health — initial schema
-- Run in Supabase SQL Editor (or supabase db push)

-- Extensions
create extension if not exists "pgcrypto";

-- Enums
do $$ begin
  create type public.user_role as enum ('promotora', 'clinician', 'payer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.triage_status as enum ('urgent', 'upcoming', 'current');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.contact_type as enum ('whatsapp', 'call', 'home_visit', 'clinic');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.touchpoint_outcome as enum ('contacted', 'no_answer', 'appointment_scheduled');
exception when duplicate_object then null; end $$;

-- Profiles linked to auth.users
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role public.user_role not null default 'promotora',
  created_at timestamptz not null default now()
);

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  age int,
  conditions text,
  language text,
  preferred_contact text,
  insurance_plan text,
  last_contacted_at timestamptz,
  triage_status public.triage_status not null default 'current',
  promotora_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists members_promotora_id_idx on public.members (promotora_id);

create table if not exists public.touchpoints (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members (id) on delete cascade,
  promotora_id uuid not null references public.users (id) on delete cascade,
  contact_type public.contact_type not null,
  outcome public.touchpoint_outcome not null,
  notes text,
  escalated boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists touchpoints_member_id_idx on public.touchpoints (member_id);
create index if not exists touchpoints_promotora_created_idx on public.touchpoints (promotora_id, created_at desc);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members (id) on delete cascade,
  triggered_by uuid references public.users (id) on delete set null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- New auth users → public.users row
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', initcap(split_part(new.email, '@', 1))),
    'promotora'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.users enable row level security;
alter table public.members enable row level security;
alter table public.touchpoints enable row level security;
alter table public.notifications enable row level security;

-- Drop policies if re-running migration
drop policy if exists "users_select_own" on public.users;
drop policy if exists "users_update_own" on public.users;
drop policy if exists "members_select_assigned" on public.members;
drop policy if exists "members_update_assigned" on public.members;
drop policy if exists "touchpoints_select_promotora" on public.touchpoints;
drop policy if exists "touchpoints_insert_promotora" on public.touchpoints;
drop policy if exists "notifications_select_promotora" on public.notifications;
drop policy if exists "notifications_insert_promotora" on public.notifications;

create policy "users_select_own" on public.users
  for select using (auth.uid() = id);

create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

create policy "members_select_assigned" on public.members
  for select using (auth.uid() = promotora_id);

create policy "members_update_assigned" on public.members
  for update using (auth.uid() = promotora_id);

create policy "touchpoints_select_promotora" on public.touchpoints
  for select using (auth.uid() = promotora_id);

create policy "touchpoints_insert_promotora" on public.touchpoints
  for insert with check (auth.uid() = promotora_id);

create policy "notifications_select_promotora" on public.notifications
  for select using (
    exists (
      select 1 from public.members m
      where m.id = notifications.member_id and m.promotora_id = auth.uid()
    )
  );

create policy "notifications_insert_promotora" on public.notifications
  for insert with check (
    auth.uid() = triggered_by
    and exists (
      select 1 from public.members m
      where m.id = member_id and m.promotora_id = auth.uid()
    )
  );
