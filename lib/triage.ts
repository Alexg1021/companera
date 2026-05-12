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

/** DB column `triage_status` after a new contact at `newLastContactIso` (server-side). */
export function persistedTriageAfterContact(
  member: MemberRow,
  newLastContactIso: string
): TriageStatus {
  return computeTriage({ ...member, last_contacted_at: newLastContactIso });
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

/** Status badge — style guide tokens + text label. */
export function triageBadgeClass(status: TriageStatus): string {
  switch (status) {
    case "urgent":
      return "bg-status-urgent-bg text-status-urgent-text text-[10px] font-medium px-[7px] py-[2px] rounded-full";
    case "upcoming":
      return "bg-status-upcoming-bg text-status-upcoming-text text-[10px] font-medium px-[7px] py-[2px] rounded-full";
    case "current":
      return "bg-status-current-bg text-status-current-text text-[10px] font-medium px-[7px] py-[2px] rounded-full";
  }
}
