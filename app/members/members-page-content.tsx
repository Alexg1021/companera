import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MembersHeaderActions from "@/components/members-header-actions";
import { loadMembersDashboard, initials } from "@/lib/members-data";
import { triageBadgeClass, triageLabel } from "@/lib/triage";
import type { TriageStatus } from "@/lib/types/database";

export const dynamic = "force-dynamic";

function avatarClass(status: TriageStatus) {
  switch (status) {
    case "urgent":
      return "bg-orange-50 text-orange-950";
    case "upcoming":
      return "bg-violet-50 text-violet-950";
    default:
      return "bg-brand-muted text-brand-dark";
  }
}

function groupLabel(status: TriageStatus) {
  switch (status) {
    case "urgent":
      return "Necesitan contacto";
    case "upcoming":
      return "Próximos pasos";
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
      <div className="mx-auto max-w-phone px-4 py-12 text-center">
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

  const now = new Date();
  const dateLine = new Intl.DateTimeFormat("es-MX", {
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
      <header className="flex items-center justify-between gap-2 border-b border-neutral-200 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-xs font-semibold text-white">
            C
          </div>
          <div>
            <p className="text-sm font-medium leading-tight text-neutral-900">Compañera</p>
            <p className="text-xs text-neutral-500">Zócalo Health</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <MembersHeaderActions unreadCount={unreadCount} />
        </div>
      </header>

      <div className="border-b border-neutral-200 px-4 pb-2 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-base font-medium text-neutral-900">Buenos días, {first}</h1>
            <p className="mt-0.5 text-xs capitalize text-neutral-500">{dateLine}</p>
          </div>
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-muted text-xs font-medium text-brand-dark"
            aria-hidden
          >
            {initials(promotoraName)}
          </div>
        </div>
        <div className="mt-2.5 flex gap-1.5">
          <div className="flex-1 rounded-lg bg-neutral-50 px-2 py-2 text-center">
            <div className="text-base font-medium text-neutral-900">{stats.total}</div>
            <div className="text-xs text-neutral-500">Personas</div>
          </div>
          <div className="flex-1 rounded-lg bg-neutral-50 px-2 py-2 text-center">
            <div className="text-base font-medium text-red-700">{stats.urgent}</div>
            <div className="text-xs text-neutral-500">Urgente</div>
          </div>
          <div className="flex-1 rounded-lg bg-neutral-50 px-2 py-2 text-center">
            <div className="text-base font-medium text-lime-800">{stats.doneToday}</div>
            <div className="text-xs text-neutral-500">Hoy</div>
          </div>
        </div>
      </div>

      {emptyAllMembers ? (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400" aria-hidden>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-3.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
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
                    <h2 className="px-4 pb-1 pt-3 text-xs font-medium uppercase tracking-wide text-neutral-400">
                      {groupLabel(status)}
                    </h2>
                    <div className="flex flex-col items-center px-6 py-8 text-center">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-muted text-brand" aria-hidden>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm text-neutral-600">
                        Todo al día — Ningún miembro necesita atención urgente.
                      </p>
                    </div>
                  </section>
                );
              }
              return null;
            }
            return (
              <section key={status}>
                <h2 className="px-4 pb-1 pt-3 text-xs font-medium uppercase tracking-wide text-neutral-400">
                  {groupLabel(status)}
                </h2>
                <ul>
                  {group.map((m) => (
                    <li key={m.id}>
                      <Link
                        href={`/members/${m.id}`}
                        className="flex min-h-[44px] items-center gap-2.5 border-b border-neutral-100 px-4 py-3 transition hover:bg-neutral-50"
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-medium ${avatarClass(
                            m.computedTriage
                          )}`}
                        >
                          {initials(m.full_name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-neutral-900">{m.full_name}</p>
                          <p className="truncate text-xs text-neutral-500">{m.listNote}</p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${triageBadgeClass(
                            m.computedTriage
                          )}`}
                        >
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
