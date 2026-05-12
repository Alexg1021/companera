import type { ContactType, TouchpointOutcome } from "@/lib/types/database";

export function contactTypeLabel(t: ContactType): string {
  switch (t) {
    case "whatsapp":
      return "WhatsApp";
    case "call":
      return "Llamada";
    case "home_visit":
      return "Visita domicilio";
    case "clinic":
      return "Clínica";
  }
}

export function outcomeLabel(o: TouchpointOutcome): string {
  switch (o) {
    case "contacted":
      return "Contactada";
    case "no_answer":
      return "No contestó";
    case "appointment_scheduled":
      return "Cita agendada";
  }
}

export const CONTACT_TYPES: { value: ContactType; label: string }[] = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "call", label: "Llamada" },
  { value: "home_visit", label: "Visita domicilio" },
  { value: "clinic", label: "Clínica" },
];

export const OUTCOMES: { value: TouchpointOutcome; label: string }[] = [
  { value: "contacted", label: "Contactada" },
  { value: "no_answer", label: "No contestó" },
  { value: "appointment_scheduled", label: "Cita agendada" },
];
