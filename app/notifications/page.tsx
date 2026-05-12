import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/user-role";
import type { NotificationRow } from "@/lib/types/database";
import NotificationListClient from "@/components/notification-list-client";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const role = await getUserRole(supabase, user.id);
  if (role === "payer") redirect("/dashboard");

  const { data: rows, error } = await supabase
    .from("notifications")
    .select("id, message, read, created_at, member_id")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <div className="mx-auto max-w-phone px-4 py-8 text-center text-sm text-red-700">
        No se pudieron cargar las alertas.
      </div>
    );
  }

  const notes = (rows ?? []) as NotificationRow[];
  const memberIds = Array.from(new Set(notes.map((n) => n.member_id)));
  let nameById = new Map<string, string>();
  if (memberIds.length > 0) {
    const { data: members } = await supabase
      .from("members")
      .select("id, full_name")
      .in("id", memberIds);
    nameById = new Map((members ?? []).map((m) => [m.id as string, m.full_name as string]));
  }

  const notifications = notes.map((n) => ({
    id: n.id,
    message: n.message,
    read: n.read,
    created_at: n.created_at,
    member_id: n.member_id,
    member_name: nameById.get(n.member_id) ?? "Persona",
  }));

  return (
    <div className="mx-auto min-h-screen max-w-phone bg-white">
      <header className="flex items-center justify-between gap-2 border-b border-neutral-200 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-xs font-semibold text-white">
            C
          </div>
          <div>
            <p className="text-sm font-medium leading-tight text-neutral-900">Alertas</p>
            <p className="text-[10px] text-neutral-500">Escalaciones</p>
          </div>
        </div>
      </header>

      <div className="border-b border-neutral-100 px-4 py-3">
        <Link href="/members" className="text-sm text-brand">
          ← Mis personas
        </Link>
      </div>

      <NotificationListClient initial={notifications} />
    </div>
  );
}
