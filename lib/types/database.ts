export type UserRole = "promotora" | "clinician" | "payer";

export type TriageStatus = "urgent" | "upcoming" | "current";

export type ContactType = "whatsapp" | "call" | "home_visit" | "clinic";

export type TouchpointOutcome = "contacted" | "no_answer" | "appointment_scheduled";

export type PublicUser = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
};

export type MemberRow = {
  id: string;
  full_name: string;
  age: number | null;
  conditions: string | null;
  language: string | null;
  preferred_contact: string | null;
  insurance_plan: string | null;
  last_contacted_at: string | null;
  triage_status: TriageStatus;
  promotora_id: string | null;
  created_at: string;
};

export type TouchpointRow = {
  id: string;
  member_id: string;
  promotora_id: string;
  contact_type: ContactType;
  outcome: TouchpointOutcome;
  notes: string | null;
  escalated: boolean;
  created_at: string;
};
