import type { SupabaseClient } from "@supabase/supabase-js";
import type { MemberRow, TouchpointRow } from "@/lib/types/database";
import { computeTriage } from "@/lib/triage";

export type MemberDetail = {
  member: MemberRow;
  touchpoints: TouchpointRow[];
  computedTriage: ReturnType<typeof computeTriage>;
};

export async function loadMemberDetail(
  supabase: SupabaseClient,
  memberId: string,
  promotoraId: string
): Promise<MemberDetail | null> {
  const { data: raw, error } = await supabase
    .from("members")
    .select("*")
    .eq("id", memberId)
    .eq("promotora_id", promotoraId)
    .maybeSingle();

  if (error || !raw) return null;

  const member = raw as MemberRow;

  const { data: tps } = await supabase
    .from("touchpoints")
    .select("*")
    .eq("member_id", memberId)
    .order("created_at", { ascending: false })
    .limit(10);

  const touchpoints = (tps ?? []) as TouchpointRow[];

  return {
    member,
    touchpoints,
    computedTriage: computeTriage(member),
  };
}

export function waMeUrl(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}

export function urgentAlertCopy(member: MemberRow): string {
  if (!member.last_contacted_at) {
    return "No hay contacto registrado recientemente. Prioriza una llamada o mensaje hoy.";
  }
  const d = new Date(member.last_contacted_at);
  const days = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  return `Llevamos ${days} días sin un contacto registrado. Esta persona necesita seguimiento urgente.`;
}

export function formatTouchpointWhen(iso: string): string {
  return new Date(iso).toLocaleString("es-MX", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
