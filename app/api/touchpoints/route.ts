import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ContactType, MemberRow, TouchpointOutcome } from "@/lib/types/database";
import { computeTriage, persistedTriageAfterContact } from "@/lib/triage";

const CONTACT_TYPES: ContactType[] = ["whatsapp", "call", "home_visit", "clinic"];
const OUTCOMES: TouchpointOutcome[] = ["contacted", "no_answer", "appointment_scheduled"];

type Body = {
  member_id?: string;
  contact_type?: string;
  outcome?: string;
  notes?: string | null;
  escalated?: boolean;
};

function truncate(s: string, max: number) {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const memberId = body.member_id;
  const contactType = body.contact_type as ContactType | undefined;
  const outcome = body.outcome as TouchpointOutcome | undefined;
  const notes = typeof body.notes === "string" ? body.notes.trim() : "";
  const escalated = Boolean(body.escalated);

  if (!memberId || typeof memberId !== "string") {
    return NextResponse.json({ error: "member_id requerido" }, { status: 400 });
  }
  if (!contactType || !CONTACT_TYPES.includes(contactType)) {
    return NextResponse.json({ error: "contact_type inválido" }, { status: 400 });
  }
  if (!outcome || !OUTCOMES.includes(outcome)) {
    return NextResponse.json({ error: "outcome inválido" }, { status: 400 });
  }

  const { data: fullMember, error: memErr } = await supabase
    .from("members")
    .select("*")
    .eq("id", memberId)
    .eq("promotora_id", user.id)
    .maybeSingle();

  if (memErr || !fullMember) {
    return NextResponse.json({ error: "Persona no encontrada" }, { status: 404 });
  }

  const memberRow = fullMember as MemberRow;
  const now = new Date().toISOString();
  const newTriageStatus = persistedTriageAfterContact(memberRow, now);

  const { data: touchpoint, error: tpErr } = await supabase
    .from("touchpoints")
    .insert({
      member_id: memberId,
      promotora_id: user.id,
      contact_type: contactType,
      outcome,
      notes: notes.length > 0 ? notes : null,
      escalated,
    })
    .select("id")
    .single();

  if (tpErr || !touchpoint) {
    console.error(tpErr);
    return NextResponse.json({ error: "No se pudo guardar el contacto" }, { status: 500 });
  }

  const { error: upErr } = await supabase
    .from("members")
    .update({
      last_contacted_at: now,
      triage_status: newTriageStatus,
    })
    .eq("id", memberId)
    .eq("promotora_id", user.id);

  if (upErr) {
    console.error(upErr);
    return NextResponse.json({ error: "Contacto guardado pero falló actualizar la persona" }, { status: 500 });
  }

  const { data: updatedMember, error: fetchErr } = await supabase
    .from("members")
    .select("*")
    .eq("id", memberId)
    .eq("promotora_id", user.id)
    .maybeSingle();

  if (fetchErr || !updatedMember) {
    console.error(fetchErr);
    return NextResponse.json({ error: "Actualizado pero no se pudo leer la persona" }, { status: 500 });
  }

  const updated = updatedMember as MemberRow;
  const computedTriage = computeTriage(updated);

  revalidatePath("/members");
  revalidatePath(`/members/${memberId}`);

  if (escalated) {
    const base = `Escalación — ${updated.full_name}`;
    const msg = notes.length > 0 ? `${base}: ${notes}` : `${base}.`;
    const { error: nErr } = await supabase.from("notifications").insert({
      member_id: memberId,
      triggered_by: user.id,
      message: truncate(msg, 2000),
    });
    if (nErr) {
      console.error(nErr);
      return NextResponse.json(
        { error: "Contacto guardado pero falló crear la notificación de escalación" },
        { status: 500 }
      );
    }
    revalidatePath("/notifications");
  }

  return NextResponse.json(
    {
      ok: true,
      id: touchpoint.id,
      member: {
        ...updated,
        computedTriage,
      },
    },
    { status: 201 }
  );
}
