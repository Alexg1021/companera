import { Check } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppLogoBar from "@/components/app-logo-bar";
import MembersHeaderActions from "@/components/members-header-actions";
import { avatarClassForMemberId } from "@/lib/avatar";
import { getServerLocale } from "@/lib/get-server-locale";
import { tForLocale } from "@/lib/i18n-messages";
import { loadMembersDashboard, initials } from "@/lib/members-data";
import { triageBadgeClass, triageLabel } from "@/lib/triage";
import type { TriageStatus } from "@/lib/types/database";

export const dynamic = "force-dynamic";

function groupLabel(status: TriageStatus) {
  switch (status) {
    case "urgent":
      return "Necesita contacto";
    case "upcoming":
      return "Próximamente";
    case "current":
      return "Al día";
  }
}

export default async function MembersPageContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const data = await loadMembersDashboard(supabase);
  if (data?.error) {
    return (
      <div className="mx-auto max-w-phone px-[18px] py-12 text-center">
        <p className="text-sm text-neutral-700">Error al cargar miembros. Recarga la página.</p>
      </div>
    );
  }
  if (!data || !data.stats) redirect("/login");

  const { count: unreadRaw } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("read", false);
  const unreadCount = unreadRaw ?? 0;

  const { promotoraName, members, stats } = data;
  const first = promotoraName.split(/\s+/)[0] ?? promotoraName;

  const locale = getServerLocale();
  const now = new Date();
  const dateLine = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now);

  const ordered: TriageStatus[] = ["urgent", "upcoming", "current"];
  const byGroup = ordered.map((status) => ({
    status,
    members: members.filter((m) => m.computedTriage === status),
  }));

  const emptyAllMembers = stats.total === 0;

  return (
    <div className="mx-auto min-h-screen max-w-phone bg-white shadow-sm">
      <AppLogoBar subtitle="Compañera" />

      <div className="border-b border-neutral-200 px-[18px] pb-2 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-base font-medium text-neutral-900">Buenos días, {first}</h1>
            <p className="mt-0.5 text-xs capitalize text-neutral-500">{dateLine}</p>
          </div>
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${avatarClassForMemberId(user.id)}`}
            aria-hidden
          >
            {initials(promotoraName)}
          </div>
        </div>
        <div className="mt-2.5 flex gap-1.5">
          <div className="flex-1 rounded-lg bg-neutral-100 p-[10px] text-center">
            <div className="text-xl font-medium text-neutral-900">{stats.total}</div>
            <div className="text-xs text-neutral-500">{tForLocale(locale, "members.stat_personas")}</div>
          </div>
          <div className="flex-1 rounded-lg bg-neutral-100 p-[10px] text-center">
            <div className="text-xl font-medium text-status-urgent-text">{stats.urgent}</div>
            <div className="text-xs text-neutral-500">{tForLocale(locale, "members.stat_urgent")}</div>
          </div>
          <div className="flex-1 rounded-lg bg-neutral-100 p-[10px] text-center">
            <div className="text-xl font-medium text-status-current-text">{stats.doneToday}</div>
            <div className="text-xs text-neutral-500">{tForLocale(locale, "members.stat_today")}</div>
          </div>
        </div>
      </div>

      {emptyAllMembers ? (
        <div className="flex flex-col items-center justify-center px-[18px] py-16 text-center">
          <div
            className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400"
            aria-hidden
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-3.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
              />
            </svg>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-neutral-600">
            Aún no tienes miembros asignados. Contacta a tu coordinadora.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-100">
          {byGroup.map(({ status, members: group }) => {
            if (group.length === 0) {
              if (status === "urgent") {
                return (
                  <section key="urgent-empty">
                    <h2 className="px-[18px] pb-1 pt-3 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                      {groupLabel(status)}
                    </h2>
                    <div className="flex flex-col items-center px-[18px] py-8 text-center">
                      <div
                        className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-teal-light text-brand-teal"
                        aria-hidden
                      >
                        <Check size={20} strokeWidth={2.5} aria-hidden />
                      </div>
                      <p className="text-sm text-neutral-600">Todo al día ✓</p>
                      <p className="mt-1 text-xs text-neutral-500">Ningún miembro necesita atención urgente.</p>
                    </div>
                  </section>
                );
              }
              return null;
            }
            return (
              <section key={status}>
                <h2 className="px-[18px] pb-1 pt-3 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                  {groupLabel(status)}
                </h2>
                <ul>
                  {group.map((m) => (
                    <li key={m.id}>
                      <Link
                        href={`/members/${m.id}`}
                        className="flex min-h-[44px] items-center gap-2.5 border-b border-neutral-100 px-[18px] py-3 transition-colors duration-150 hover:bg-neutral-50"
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-medium ${avatarClassForMemberId(
                            m.id
                          )}`}
                        >
                          {initials(m.full_name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-medium text-neutral-900">{m.full_name}</p>
                          <p className="truncate text-xs text-neutral-500">{m.listNote}</p>
                        </div>
                        <span className={`shrink-0 ${triageBadgeClass(m.computedTriage)}`}>
                          {triageLabel(m.computedTriage)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
