import type { SupabaseClient } from "@supabase/supabase-js";
import type { MemberRow } from "@/lib/types/database";
import { computeTriage } from "@/lib/triage";

export type MemberWithPreview = MemberRow & {
  computedTriage: ReturnType<typeof computeTriage>;
  listNote: string;
};

function startOfUtcDay(d = new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())).toISOString();
}

function endOfUtcDay(d = new Date()) {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999)
  ).toISOString();
}

function initials(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function latestNoteByMember(
  touchpoints: { member_id: string; notes: string | null; created_at: string }[]
): Map<string, string> {
  const map = new Map<string, string>();
  for (const t of touchpoints) {
    if (!map.has(t.member_id) && t.notes) map.set(t.member_id, t.notes);
  }
  return map;
}

function buildListNote(member: MemberRow, latestNote: string | undefined): string {
  if (latestNote) return latestNote;
  if (!member.last_contacted_at) return "Sin contacto registrado";
  const d = new Date(member.last_contacted_at);
  return `Último contacto ${d.toLocaleDateString("es-MX", { day: "numeric", month: "short" })}`;
}

export async function loadMembersDashboard(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const { data: membersRaw, error: membersError } = await supabase
    .from("members")
    .select("*")
    .eq("promotora_id", user.id)
    .order("full_name");

  if (membersError) {
    console.error(membersError);
    return { error: membersError.message as string, user: null, members: [] as MemberWithPreview[], stats: null };
  }

  const membersList = (membersRaw ?? []) as MemberRow[];
  const memberIds = membersList.map((m) => m.id);

  let touchpoints: { member_id: string; notes: string | null; created_at: string }[] = [];
  if (memberIds.length > 0) {
    const { data: tp } = await supabase
      .from("touchpoints")
      .select("member_id, notes, created_at")
      .in("member_id", memberIds)
      .order("created_at", { ascending: false });
    touchpoints = tp ?? [];
  }

  const noteByMember = latestNoteByMember(touchpoints);

  const members: MemberWithPreview[] = membersList.map((m) => {
    const computedTriage = computeTriage(m);
    return {
      ...m,
      computedTriage,
      listNote: buildListNote(m, noteByMember.get(m.id)),
    };
  });

  const urgentCount = members.filter((m) => m.computedTriage === "urgent").length;

  const { count: doneToday } = await supabase
    .from("touchpoints")
    .select("*", { count: "exact", head: true })
    .eq("promotora_id", user.id)
    .gte("created_at", startOfUtcDay())
    .lte("created_at", endOfUtcDay())
    .in("outcome", ["contacted", "appointment_scheduled"]);

  return {
    error: null as string | null,
    user,
    promotoraName: profile?.full_name ?? user.email ?? "Promotora",
    members,
    stats: {
      total: members.length,
      urgent: urgentCount,
      doneToday: doneToday ?? 0,
    },
  };
}

export { initials };
