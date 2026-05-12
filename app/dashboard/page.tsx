import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/user-role";
import { activePlans, dashboardMetrics, hedisMetrics } from "@/lib/dashboard-demo";
import SignOutButton from "@/components/sign-out-button";

export const dynamic = "force-dynamic";

function MetricCard({
  value,
  label,
  delta,
  suffix,
}: {
  value: string | number;
  label: string;
  delta: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-lg bg-neutral-50 px-3 py-2.5">
      <div className="text-xl font-medium text-neutral-900">
        {value}
        {suffix ? <span className="text-base">{suffix}</span> : null}
      </div>
      <div className="mt-1 text-xs text-neutral-500">{label}</div>
      <div className="mt-1.5 text-xs text-neutral-600">{delta}</div>
    </div>
  );
}

function HedisBar({ label, value, code }: { label: string; value: number; code: string }) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex justify-between gap-2 text-xs">
        <span className="text-neutral-600">
          <span className="font-medium text-neutral-800">{code}</span> · {label}
        </span>
        <span className="font-medium text-neutral-900">{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-brand transition-all"
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const role = await getUserRole(supabase, user.id);
  if (role !== "payer") redirect("/members");

  const { data: profile } = await supabase
    .from("users")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const m = dashboardMetrics;

  const { count: memberCount } = await supabase
    .from("members")
    .select("*", { count: "exact", head: true });

  return (
    <div className="mx-auto min-h-screen max-w-phone bg-white pb-8">
      <header className="flex items-center justify-between gap-2 border-b border-neutral-200 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-xs font-semibold text-white">
            C
          </div>
          <div>
            <p className="text-sm font-medium leading-tight text-neutral-900">Compañera</p>
            <p className="text-xs text-neutral-500">Panel · planes de salud</p>
          </div>
        </div>
        <SignOutButton />
      </header>

      <div className="border-b border-neutral-100 px-4 py-3">
        <p className="text-xs text-neutral-500">Vista pagador</p>
        <p className="text-base font-medium text-neutral-900">
          Hola{profile?.full_name ? `, ${profile.full_name.split(/\s+/)[0]}` : ""}
        </p>
      </div>

      <div className="px-4 pt-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
          Indicadores clave
        </p>
        <div className="grid grid-cols-2 gap-2">
          <MetricCard
            value={m.retentionRate.value}
            suffix="%"
            label={m.retentionRate.label}
            delta={m.retentionRate.delta}
          />
          <MetricCard
            value={(memberCount ?? 0).toLocaleString("es-MX")}
            label={m.activeMembers.label}
            delta={m.activeMembers.delta}
          />
          <MetricCard
            value={`$${m.costPerMember.value}`}
            label={m.costPerMember.label}
            delta={m.costPerMember.delta}
          />
          <MetricCard
            value={m.erReduction.value}
            suffix="%"
            label={m.erReduction.label}
            delta={m.erReduction.delta}
          />
        </div>
      </div>

      <div className="mt-6 px-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-400">
          Calidad HEDIS (demo)
        </p>
        {hedisMetrics.map((h) => (
          <HedisBar key={h.code} code={h.code} label={h.label} value={h.value} />
        ))}
      </div>

      <div className="mt-6 px-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
          Planes activos
        </p>
        {activePlans.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 py-10 text-center">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-400" aria-hidden>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m12 0a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H15a2.25 2.25 0 00-2.25 2.25v12a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
            <p className="text-sm text-neutral-500">Sin datos disponibles para este período.</p>
          </div>
        ) : (
          <div className="rounded-lg border border-neutral-100">
            {activePlans.map((p, i) => (
              <div
                key={p.name}
                className={`flex items-center justify-between px-3 py-2.5 ${
                  i > 0 ? "border-t border-neutral-100" : ""
                }`}
              >
                <div>
                  <p className="text-xs font-medium text-neutral-900">{p.name}</p>
                  <p className="text-xs text-neutral-500">
                    {p.enrolled.toLocaleString("es-MX")} personas
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    p.status === "Activo"
                      ? "bg-lime-50 text-lime-900"
                      : "bg-amber-50 text-amber-900"
                  }`}
                >
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-6 px-4 text-center text-xs text-neutral-400">
        Indicadores de ejemplo salvo &quot;Personas activas&quot; (total en base de datos).
      </p>
    </div>
  );
}
