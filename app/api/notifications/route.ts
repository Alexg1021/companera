import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/user-role";
import type { NotificationRow } from "@/lib/types/database";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const role = await getUserRole(supabase, user.id);
  if (role === "payer") {
    return NextResponse.json({ error: "No disponible para este rol" }, { status: 403 });
  }

  const { data: rows, error } = await supabase
    .from("notifications")
    .select("id, message, read, created_at, member_id")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "No se pudieron cargar las alertas" }, { status: 500 });
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

  return NextResponse.json({ notifications });
}
