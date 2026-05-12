-- Allow promotoras to mark notifications read for their assigned members
drop policy if exists "notifications_update_promotora" on public.notifications;

create policy "notifications_update_promotora" on public.notifications
  for update using (
    exists (
      select 1 from public.members m
      where m.id = notifications.member_id and m.promotora_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.members m
      where m.id = notifications.member_id and m.promotora_id = auth.uid()
    )
  );
