import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppLogoBar from "@/components/app-logo-bar";
import { avatarClassForMemberId } from "@/lib/avatar";
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
      <AppLogoBar subtitle={member.full_name} />

      <div className="border-b border-neutral-200 px-[18px] py-3">
        <Link href="/members" className="text-sm font-medium text-brand-teal transition-colors duration-150 hover:text-brand-teal-dark">
          ← Mis personas
        </Link>
        <div className="mt-4 flex items-start gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-medium ${avatarClassForMemberId(member.id)}`}
            aria-hidden
          >
            {initials(member.full_name)}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-[13px] font-medium text-neutral-900">{member.full_name}</h1>
            <p className="mt-0.5 text-xs text-neutral-500">
              {member.age != null ? `${member.age} años` : "Edad no registrada"}
              {member.conditions ? ` · ${member.conditions}` : ""}
            </p>
            <span className={`mt-2 inline-block ${triageBadgeClass(computedTriage)}`}>
              {triageLabel(computedTriage)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2.5 px-[18px] pb-44 pt-3">
        {computedTriage === "urgent" && (
          <div className="flex gap-2 rounded-lg bg-status-urgent-bg p-[10px]">
            <AlertTriangle size={15} className="mt-px shrink-0 text-status-urgent-text" aria-hidden />
            <p className="text-xs leading-relaxed text-status-urgent-text">{urgentAlertCopy(member)}</p>
          </div>
        )}

        <section className="rounded-lg bg-neutral-100 p-[10px]">
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
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
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
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-teal" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-[11px] text-neutral-400">{formatTouchpointWhen(t.created_at)}</p>
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
        className="fixed left-0 right-0 z-[90] border-t border-neutral-200 bg-white/95 px-[18px] pt-3 backdrop-blur-sm"
        style={{
          bottom: "calc(3.5rem + max(4px, env(safe-area-inset-bottom, 0px)))",
          paddingBottom: "max(12px, env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div className="mx-auto flex max-w-phone gap-2">
          <Link
            href={`/members/${member.id}/log`}
            className="flex min-h-11 flex-1 items-center justify-center rounded-lg bg-brand-navy py-3 text-center text-xs font-medium text-white transition-colors duration-150 hover:bg-brand-navy/90"
          >
            Registrar
          </Link>
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 py-3 text-center text-xs text-neutral-900 transition-colors duration-150 hover:bg-neutral-50"
            >
              WhatsApp
            </a>
          ) : (
            <span className="flex min-h-11 flex-1 items-center justify-center rounded-lg border border-dashed border-neutral-200 py-3 text-center text-xs text-neutral-400">
              WhatsApp
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
