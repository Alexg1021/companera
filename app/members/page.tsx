import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MembersHeaderActions from "@/components/members-header-actions";
import { loadMembersDashboard, initials } from "@/lib/members-data";
import { triageBadgeClass, triageLabel } from "@/lib/triage";
import type { TriageStatus } from "@/lib/types/database";

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

export default async function MembersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const data = await loadMembersDashboard(supabase);
  if (data?.error) {
    return (
      <div className="mx-auto max-w-phone px-4 py-8 text-center text-sm text-red-700">
        No se pudieron cargar las personas: {data.error}
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

  return (
    <div className="mx-auto min-h-screen max-w-phone bg-white shadow-sm">
      <header className="flex items-center justify-between gap-2 border-b border-neutral-200 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-xs font-semibold text-white">
            C
          </div>
          <div>
            <p className="text-sm font-medium leading-tight text-neutral-900">Compañera</p>
            <p className="text-[10px] text-neutral-500">Zócalo Health</p>
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
            <p className="mt-0.5 text-[11px] capitalize text-neutral-500">
              {dateLine}
            </p>
          </div>
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-muted text-[11px] font-medium text-brand-dark"
            aria-hidden
          >
            {initials(promotoraName)}
          </div>
        </div>
        <div className="mt-2.5 flex gap-1.5">
          <div className="flex-1 rounded-lg bg-neutral-50 px-2 py-1.5 text-center">
            <div className="text-base font-medium text-neutral-900">{stats.total}</div>
            <div className="text-[9px] text-neutral-500">Personas</div>
          </div>
          <div className="flex-1 rounded-lg bg-neutral-50 px-2 py-1.5 text-center">
            <div className="text-base font-medium text-red-700">{stats.urgent}</div>
            <div className="text-[9px] text-neutral-500">Urgente</div>
          </div>
          <div className="flex-1 rounded-lg bg-neutral-50 px-2 py-1.5 text-center">
            <div className="text-base font-medium text-lime-800">{stats.doneToday}</div>
            <div className="text-[9px] text-neutral-500">Hoy</div>
          </div>
        </div>
      </div>

      <div className="divide-y divide-neutral-100">
        {byGroup.map(({ status, members: group }) =>
          group.length === 0 ? null : (
            <section key={status}>
              <h2 className="px-4 pb-1 pt-3 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                {groupLabel(status)}
              </h2>
              <ul>
                {group.map((m) => (
                  <li key={m.id}>
                    <Link
                      href={`/members/${m.id}`}
                      className="flex items-center gap-2.5 border-b border-neutral-100 px-4 py-2.5 transition hover:bg-neutral-50"
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-medium ${avatarClass(
                          m.computedTriage
                        )}`}
                      >
                        {initials(m.full_name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-neutral-900">{m.full_name}</p>
                        <p className="truncate text-[11px] text-neutral-500">{m.listNote}</p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${triageBadgeClass(
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
          )
        )}
      </div>
    </div>
  );
}
