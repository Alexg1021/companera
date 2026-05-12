"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BarChart2, Bell, Settings, Users } from "lucide-react";
import { useI18n } from "@/components/locale-provider";
import type { MessageKey } from "@/lib/i18n-messages";
import type { UserRole } from "@/lib/types/database";

function NavLink({
  href,
  label,
  icon,
  active,
  badge,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className={`relative flex min-h-[48px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 pt-1 transition-colors duration-150 ${
        active ? "text-brand-navy" : "text-neutral-500"
      }`}
    >
      <span className="relative flex h-[22px] items-center justify-center">
        {icon}
        {badge != null && badge > 0 ? (
          <span className="absolute -right-2 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold leading-none text-white">
            {badge > 99 ? "99+" : badge}
          </span>
        ) : null}
      </span>
      <span className={`text-xs font-medium ${active ? "text-brand-navy" : "text-neutral-500"}`}>{label}</span>
    </Link>
  );
}

function NavChrome({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-neutral-200 bg-white/95 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md"
      style={{ paddingBottom: "max(4px, env(safe-area-inset-bottom, 0px))" }}
      aria-label={t("nav.main")}
    >
      <div className="mx-auto flex h-14 max-w-phone items-stretch">{children}</div>
    </nav>
  );
}

function StaffBottomNav({
  pathname,
  unread,
  t,
}: {
  pathname: string;
  unread: number;
  t: (key: MessageKey) => string;
}) {
  const personasActive = pathname === "/members" || pathname.startsWith("/members/");
  const alertasActive = pathname.startsWith("/notifications");
  const settingsActive = pathname.startsWith("/settings");
  return (
    <NavChrome>
      <NavLink
        href="/members"
        label={t("nav.personas")}
        icon={
          <Users size={22} strokeWidth={1.75} className={personasActive ? "text-brand-navy" : "text-neutral-500"} />
        }
        active={personasActive}
      />
      <NavLink
        href="/notifications"
        label={t("nav.alerts")}
        icon={
          <Bell size={22} strokeWidth={1.75} className={alertasActive ? "text-brand-navy" : "text-neutral-500"} />
        }
        active={alertasActive}
        badge={unread}
      />
      <NavLink
        href="/settings"
        label={t("nav.settings")}
        icon={
          <Settings size={22} strokeWidth={1.75} className={settingsActive ? "text-brand-navy" : "text-neutral-500"} />
        }
        active={settingsActive}
      />
    </NavChrome>
  );
}

function PayerBottomNav({ pathname, t }: { pathname: string; t: (key: MessageKey) => string }) {
  const panelActive = pathname === "/dashboard";
  const settingsActive = pathname.startsWith("/settings");
  return (
    <NavChrome>
      <NavLink
        href="/dashboard"
        label={t("nav.panel")}
        icon={
          <BarChart2
            size={22}
            strokeWidth={1.75}
            className={panelActive ? "text-brand-navy" : "text-neutral-500"}
          />
        }
        active={panelActive}
      />
      <NavLink
        href="/settings"
        label={t("nav.settings")}
        icon={
          <Settings
            size={22}
            strokeWidth={1.75}
            className={settingsActive ? "text-brand-navy" : "text-neutral-500"}
          />
        }
        active={settingsActive}
      />
    </NavChrome>
  );
}

/** Payer and staff both use /settings; show placeholders until `GET /api/me` resolves. */
function SettingsNavSkeleton() {
  return (
    <NavChrome>
      <div className="flex flex-1 items-center justify-center px-2">
        <div className="h-9 w-full max-w-[5.5rem] animate-pulse rounded-lg bg-neutral-100" />
      </div>
      <div className="flex flex-1 items-center justify-center px-2">
        <div className="h-9 w-full max-w-[5.5rem] animate-pulse rounded-lg bg-neutral-100" />
      </div>
    </NavChrome>
  );
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();
  const [unread, setUnread] = useState(0);
  const [role, setRole] = useState<UserRole | null>(null);

  const isLogin = pathname === "/login";
  const isDashboardPath = pathname.startsWith("/dashboard");
  const isSettingsPath = pathname.startsWith("/settings");
  const isStaffOnlyPath =
    pathname.startsWith("/members") ||
    pathname.startsWith("/notifications") ||
    pathname === "/success";

  useEffect(() => {
    if (isLogin) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/me", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { role: UserRole };
        if (!cancelled) setRole(data.role);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLogin]);

  useEffect(() => {
    if (isLogin || isDashboardPath || role === "payer") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/notifications");
        if (!res.ok) return;
        const data = (await res.json()) as { notifications?: { read: boolean }[] };
        const n = (data.notifications ?? []).filter((x) => !x.read).length;
        if (!cancelled) setUnread(n);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname, isLogin, isDashboardPath, role]);

  if (isLogin) return null;

  if (isStaffOnlyPath) {
    return <StaffBottomNav pathname={pathname} unread={unread} t={t} />;
  }

  if (isDashboardPath || (isSettingsPath && role === "payer")) {
    return <PayerBottomNav pathname={pathname} t={t} />;
  }

  if (isSettingsPath && role === null) {
    return <SettingsNavSkeleton />;
  }

  if (isSettingsPath) {
    return <StaffBottomNav pathname={pathname} unread={unread} t={t} />;
  }

  return null;
}
