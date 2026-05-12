import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/user-role";
import type { NotificationRow } from "@/lib/types/database";
import AppLogoBar from "@/components/app-logo-bar";
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
      <div className="mx-auto max-w-phone px-[18px] py-8 text-center text-sm text-red-700">
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
      <AppLogoBar subtitle="Alertas · Escalaciones" />

      <div className="border-b border-neutral-100 px-[18px] py-3">
        <Link
          href="/members"
          className="text-sm font-medium text-brand-teal transition-colors duration-150 hover:text-brand-teal-dark"
        >
          ← Mis personas
        </Link>
      </div>

      <NotificationListClient initial={notifications} />
    </div>
  );
}
