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

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

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
    try {
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
      if (!res.ok) {
        setError(payload.error ?? "No se pudo guardar. Intenta de nuevo.");
        return;
      }
      router.refresh();
      router.push("/success");
    } catch {
      setError("No se pudo guardar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-1 flex-col gap-3 px-4 py-4"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))" }}
    >
      <p className="text-xs text-neutral-500">
        Persona: <span className="font-medium text-neutral-800">{memberName}</span>
      </p>

      <div>
        <p className="mb-1.5 text-xs text-neutral-600">Tipo de contacto</p>
        <div className="flex flex-wrap gap-2">
          {CONTACT_TYPES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setContactType(value)}
              className={`min-h-[44px] rounded-full border px-4 py-2 text-xs transition ${
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
        <p className="mb-1.5 text-xs text-neutral-600">Resultado</p>
        <div className="flex flex-wrap gap-2">
          {OUTCOMES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setOutcome(value)}
              className={`min-h-[44px] rounded-full border px-4 py-2 text-xs transition ${
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
        <label htmlFor="notes" className="mb-1.5 block text-xs text-neutral-600">
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
        className={`flex min-h-[44px] items-center justify-between rounded-lg border px-3 py-2.5 ${
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
          className={`relative h-7 w-12 shrink-0 rounded-full transition ${
            escalated ? "bg-red-500" : "bg-neutral-300"
          }`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
              escalated ? "left-[calc(100%-1.625rem)]" : "left-0.5"
            }`}
          />
        </button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}

      <div
        className="mt-auto flex gap-2 border-t border-neutral-100 pt-4"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom, 0px))" }}
      >
        <Link
          href={`/members/${memberId}`}
          className="flex min-h-[44px] flex-1 items-center justify-center rounded-lg border border-neutral-200 text-sm text-neutral-800"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg bg-brand text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? (
            <>
              <Spinner />
              Guardando…
            </>
          ) : (
            "Guardar"
          )}
        </button>
      </div>
    </form>
  );
}
