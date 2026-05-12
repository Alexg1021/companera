-- Payer role can read all members (for dashboard aggregate counts only in this prototype).
-- Promotoras still use members_select_assigned; policies combine with OR.

drop policy if exists "members_select_payer" on public.members;

create policy "members_select_payer" on public.members
  for select using (
    (select role from public.users where id = auth.uid() limit 1) = 'payer'::public.user_role
  );
