import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { initials } from "@/lib/members-data";
import {
  formatTouchpointWhen,
  loadMemberDetail,
  urgentAlertCopy,
  waMeUrl,
} from "@/lib/member-detail";
import { contactTypeLabel, outcomeLabel } from "@/lib/contact-labels";
import { triageBadgeClass, triageLabel } from "@/lib/triage";

export const dynamic = "force-dynamic";

type PageProps = { params: { id: string } };

export default async function MemberProfilePage({ params }: PageProps) {
  const { id } = params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const detail = await loadMemberDetail(supabase, id, user.id);
  if (!detail) notFound();

  const { member, touchpoints, computedTriage } = detail;
  const timeline = touchpoints.slice(0, 3);
  const wa = waMeUrl(member.whatsapp_phone);

  return (
    <div className="mx-auto min-h-screen max-w-phone bg-white pb-6">
      <header className="flex items-center gap-2 border-b border-neutral-200 px-4 py-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-xs font-semibold text-white">
          C
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-neutral-900">Compañera</p>
          <p className="text-xs text-neutral-500">Zócalo Health</p>
        </div>
      </header>

      <div className="border-b border-neutral-200 px-4 py-3">
        <Link href="/members" className="text-sm text-brand">
          ← Lista
        </Link>
        <div className="mt-4 flex items-start gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
              computedTriage === "urgent"
                ? "bg-orange-50 text-orange-950"
                : computedTriage === "upcoming"
                  ? "bg-violet-50 text-violet-950"
                  : "bg-brand-muted text-brand-dark"
            }`}
            aria-hidden
          >
            {initials(member.full_name)}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-[15px] font-medium text-neutral-900">{member.full_name}</h1>
            <p className="mt-0.5 text-xs text-neutral-500">
              {member.age != null ? `${member.age} años` : "Edad no registrada"}
              {member.conditions ? ` · ${member.conditions}` : ""}
            </p>
            <span
              className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${triageBadgeClass(
                computedTriage
              )}`}
            >
              {triageLabel(computedTriage)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2.5 px-4 pb-44 pt-3">
        {computedTriage === "urgent" && (
          <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
            <span className="text-amber-800" aria-hidden>
              !
            </span>
            <p className="text-xs leading-relaxed text-amber-950">{urgentAlertCopy(member)}</p>
          </div>
        )}

        <section className="rounded-lg bg-neutral-50 px-3 py-2.5">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
            Plan y preferencias
          </p>
          <dl className="space-y-1 text-xs">
            <div className="flex justify-between gap-2">
              <dt className="text-neutral-500">Seguro</dt>
              <dd className="text-right text-neutral-900">{member.insurance_plan ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-neutral-500">Próxima cita / seguimiento</dt>
              <dd className="text-right text-neutral-900">
                {member.next_appointment?.trim() ? member.next_appointment : "Sin cita registrada"}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-neutral-500">Idioma</dt>
              <dd className="text-right text-neutral-900">{member.language ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-neutral-500">Contacto preferido</dt>
              <dd className="text-right text-neutral-900">{member.preferred_contact ?? "—"}</dd>
            </div>
          </dl>
        </section>

        <section>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
            Últimos contactos
          </p>
          {timeline.length === 0 ? (
            <div className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50/80 px-3 py-6 text-center">
              <p className="text-sm text-neutral-600">
                Sin historial de contacto aún. Registra el primer contacto.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {timeline.map((t) => (
                <li key={t.id} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-xs text-neutral-400">{formatTouchpointWhen(t.created_at)}</p>
                    <p className="text-xs text-neutral-900">
                      {contactTypeLabel(t.contact_type)} · {outcomeLabel(t.outcome)}
                    </p>
                    {t.notes && <p className="mt-0.5 text-xs text-neutral-600">{t.notes}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div
        className="fixed left-0 right-0 z-[90] border-t border-neutral-200 bg-white/95 px-4 pt-3 backdrop-blur-sm"
        style={{
          bottom: "calc(3.5rem + max(4px, env(safe-area-inset-bottom, 0px)))",
        }}
      >
        <div className="mx-auto flex max-w-phone gap-2">
          <Link
            href={`/members/${member.id}/log`}
            className="flex min-h-11 flex-1 items-center justify-center rounded-lg bg-brand py-3 text-center text-sm font-medium text-white"
          >
            Registrar
          </Link>
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 flex-1 items-center justify-center rounded-lg border border-neutral-200 py-3 text-center text-sm text-neutral-900"
            >
              WhatsApp
            </a>
          ) : (
            <span className="flex min-h-11 flex-1 items-center justify-center rounded-lg border border-dashed border-neutral-200 py-3 text-center text-sm text-neutral-400">
              WhatsApp
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
