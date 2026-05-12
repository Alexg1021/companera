"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ContactType, TouchpointOutcome } from "@/lib/types/database";
import { CONTACT_TYPES, OUTCOMES } from "@/lib/contact-labels";

type Props = {
  memberId: string;
  memberName: string;
};

export default function LogTouchpointForm({ memberId, memberName }: Props) {
  const router = useRouter();
  const [contactType, setContactType] = useState<ContactType>("whatsapp");
  const [outcome, setOutcome] = useState<TouchpointOutcome>("contacted");
  const [notes, setNotes] = useState("");
  const [escalated, setEscalated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/touchpoints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        member_id: memberId,
        contact_type: contactType,
        outcome,
        notes,
        escalated,
      }),
    });
    const payload = (await res.json().catch(() => ({}))) as { error?: string };
    setLoading(false);
    if (!res.ok) {
      setError(payload.error ?? "Error al guardar");
      return;
    }
    router.push("/success");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-3 px-4 py-4">
      <p className="text-xs text-neutral-500">
        Persona: <span className="font-medium text-neutral-800">{memberName}</span>
      </p>

      <div>
        <p className="mb-1.5 text-[11px] text-neutral-600">Tipo de contacto</p>
        <div className="flex flex-wrap gap-1.5">
          {CONTACT_TYPES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setContactType(value)}
              className={`rounded-full border px-3 py-1 text-[11px] transition ${
                contactType === value
                  ? "border-brand bg-brand-muted font-medium text-brand-dark"
                  : "border-neutral-200 text-neutral-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-[11px] text-neutral-600">Resultado</p>
        <div className="flex flex-wrap gap-1.5">
          {OUTCOMES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setOutcome(value)}
              className={`rounded-full border px-3 py-1 text-[11px] transition ${
                outcome === value
                  ? "border-brand bg-brand-muted font-medium text-brand-dark"
                  : "border-neutral-200 text-neutral-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="mb-1.5 block text-[11px] text-neutral-600">
          Notas
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Notas (ES / EN) — breve resumen del contacto…"
          className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none ring-brand focus:ring-2"
        />
      </div>

      <div
        className={`flex items-center justify-between rounded-lg border px-3 py-2.5 ${
          escalated ? "border-red-300 bg-red-50" : "border-neutral-200 bg-neutral-50"
        }`}
      >
        <span className={`text-xs font-medium ${escalated ? "text-red-800" : "text-neutral-700"}`}>
          Escalar a coordinación
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={escalated}
          onClick={() => setEscalated((v) => !v)}
          className={`relative h-[19px] w-[34px] shrink-0 rounded-full transition ${
            escalated ? "bg-red-500" : "bg-neutral-300"
          }`}
        >
          <span
            className={`absolute top-0.5 h-[15px] w-[15px] rounded-full bg-white shadow transition ${
              escalated ? "left-[17px]" : "left-0.5"
            }`}
          />
        </button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-800" role="alert">
          {error}
        </p>
      )}

      <div className="mt-auto flex gap-2 border-t border-neutral-100 pt-4">
        <Link
          href={`/members/${memberId}`}
          className="flex-1 rounded-lg border border-neutral-200 py-2.5 text-center text-sm text-neutral-800"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-brand py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </form>
  );
}
