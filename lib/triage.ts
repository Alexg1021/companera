import type { MemberRow, TriageStatus } from "@/lib/types/database";

const OUTREACH_DAYS = 7;

function daysSince(iso: string | null): number | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  const diff = Date.now() - then;
  return diff / (1000 * 60 * 60 * 24);
}

/**
 * Canonical triage for UI and grouping.
 * Urgent: no successful recent contact window (>7d or never).
 * Otherwise respect DB triage_status for cases like renewals (upcoming).
 */
export function computeTriage(member: MemberRow): TriageStatus {
  const d = daysSince(member.last_contacted_at);
  if (d === null || d > OUTREACH_DAYS) return "urgent";
  if (member.triage_status === "upcoming") return "upcoming";
  return "current";
}

export function triageLabel(status: TriageStatus): string {
  switch (status) {
    case "urgent":
      return "Urgente";
    case "upcoming":
      return "Pronto";
    case "current":
      return "Bien";
  }
}

export function triageBadgeClass(status: TriageStatus): string {
  switch (status) {
    case "urgent":
      return "bg-red-50 text-red-800";
    case "upcoming":
      return "bg-amber-50 text-amber-900";
    case "current":
      return "bg-lime-50 text-lime-900";
  }
}
