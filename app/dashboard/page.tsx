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
      <div className="mt-1 text-[10px] text-neutral-500">{label}</div>
      <div className="mt-1.5 text-[10px] text-neutral-600">{delta}</div>
    </div>
  );
}

function HedisBar({ label, value, code }: { label: string; value: number; code: string }) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex justify-between gap-2 text-[11px]">
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

  return (
    <div className="mx-auto min-h-screen max-w-phone bg-white pb-8">
      <header className="flex items-center justify-between gap-2 border-b border-neutral-200 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-xs font-semibold text-white">
            C
          </div>
          <div>
            <p className="text-sm font-medium leading-tight text-neutral-900">Compañera</p>
            <p className="text-[10px] text-neutral-500">Panel · planes de salud</p>
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
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
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
            value={m.activeMembers.value.toLocaleString("es-MX")}
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
        <p className="mb-3 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
          Calidad HEDIS (demo)
        </p>
        {hedisMetrics.map((h) => (
          <HedisBar key={h.code} code={h.code} label={h.label} value={h.value} />
        ))}
      </div>

      <div className="mt-6 px-4">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
          Planes activos
        </p>
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
                <p className="text-[10px] text-neutral-500">
                  {p.enrolled.toLocaleString("es-MX")} personas
                </p>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
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
      </div>

      <p className="mt-6 px-4 text-center text-[10px] text-neutral-400">
        Cifras ilustrativas para prototipo · no ligadas a datos reales
      </p>
    </div>
  );
}
