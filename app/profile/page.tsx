import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppLogoBar from "@/components/app-logo-bar";
import { getServerLocale } from "@/lib/get-server-locale";
import { tForLocale, type Locale } from "@/lib/i18n-messages";
import { getUserRole } from "@/lib/user-role";
import type { UserRole } from "@/lib/types/database";

function roleLabel(locale: Locale, role: UserRole): string {
  switch (role) {
    case "payer":
      return tForLocale(locale, "profile.role_payer");
    case "clinician":
      return tForLocale(locale, "profile.role_clinician");
    default:
      return tForLocale(locale, "profile.role_promotora");
  }
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const role = await getUserRole(supabase, user.id);
  const { data: row } = await supabase.from("users").select("full_name, email").eq("id", user.id).maybeSingle();

  const locale = getServerLocale();
  const email = user.email ?? row?.email ?? "—";
  const fullName = (row?.full_name as string | null)?.trim() || "—";
  const isPayer = role === "payer";
  const backHref = isPayer ? "/dashboard" : "/members";
  const backLabel = isPayer
    ? tForLocale(locale, "profile.back_dashboard")
    : tForLocale(locale, "profile.back_members");

  return (
    <div className="mx-auto min-h-screen max-w-phone bg-white pb-6">
      <AppLogoBar subtitle={tForLocale(locale, "profile.title")} />

      <div className="border-b border-neutral-200 px-[18px] py-3">
        <Link
          href={backHref}
          className="text-sm font-medium text-brand-teal transition-colors duration-150 hover:text-brand-teal-dark"
        >
          {backLabel}
        </Link>
      </div>

      <div className="px-[18px] py-5">
        <p className="text-xs text-neutral-500">{tForLocale(locale, "profile.subtitle")}</p>
        <dl className="mt-4 space-y-4 rounded-lg bg-neutral-100 p-[10px]">
          <div>
            <dt className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">
              {tForLocale(locale, "profile.label_name")}
            </dt>
            <dd className="mt-1 text-sm text-neutral-900">{fullName}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">
              {tForLocale(locale, "profile.label_email")}
            </dt>
            <dd className="mt-1 break-all text-sm text-neutral-900">{email}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">
              {tForLocale(locale, "profile.label_role")}
            </dt>
            <dd className="mt-1 text-sm text-neutral-900">{roleLabel(locale, role)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
