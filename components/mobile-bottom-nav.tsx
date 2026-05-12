"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/locale-provider";

function IconPersonas({ active }: { active: boolean }) {
  const c = active ? "#085041" : "#6b7280";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm12-1a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        stroke={c}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBell({ active }: { active: boolean }) {
  const c = active ? "#085041" : "#6b7280";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"
        stroke={c}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChart({ active }: { active: boolean }) {
  const c = active ? "#085041" : "#6b7280";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 3v18h18" stroke={c} strokeWidth="1.75" strokeLinecap="round" />
      <path d="M7 14v4M12 10v8M17 6v12" stroke={c} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconSettings({ active }: { active: boolean }) {
  const c = active ? "#085041" : "#6b7280";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke={c}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .69.28 1.31.73 1.77.46.46 1.08.74 1.77.74H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
        stroke={c}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
      className={`relative flex min-h-[48px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 pt-1 ${
        active ? "text-brand-dark" : "text-neutral-500"
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
      <span className={`text-xs font-medium ${active ? "text-brand-dark" : "text-neutral-500"}`}>{label}</span>
    </Link>
  );
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();
  const [unread, setUnread] = useState(0);

  const isLogin = pathname === "/login";
  const isDashboard = pathname.startsWith("/dashboard");

  useEffect(() => {
    if (isLogin || isDashboard) return;
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
  }, [pathname, isLogin, isDashboard]);

  if (isLogin) return null;

  if (isDashboard) {
    return (
      <nav
        className="fixed inset-x-0 bottom-0 z-[100] border-t border-neutral-200 bg-white/95 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md"
        style={{ paddingBottom: "max(4px, env(safe-area-inset-bottom, 0px))" }}
        aria-label={t("nav.main")}
      >
        <div className="mx-auto flex h-14 max-w-phone items-stretch">
          <NavLink
            href="/dashboard"
            label={t("nav.panel")}
            icon={<IconChart active={pathname === "/dashboard"} />}
            active={pathname === "/dashboard"}
          />
          <NavLink
            href="/settings"
            label={t("nav.settings")}
            icon={<IconSettings active={pathname.startsWith("/settings")} />}
            active={pathname.startsWith("/settings")}
          />
        </div>
      </nav>
    );
  }

  const personasActive = pathname === "/members" || pathname.startsWith("/members/");
  const alertasActive = pathname.startsWith("/notifications");
  const settingsActive = pathname.startsWith("/settings");

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-neutral-200 bg-white/95 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md"
      style={{ paddingBottom: "max(4px, env(safe-area-inset-bottom, 0px))" }}
      aria-label={t("nav.main")}
    >
      <div className="mx-auto flex h-14 max-w-phone items-stretch">
        <NavLink
          href="/members"
          label={t("nav.personas")}
          icon={<IconPersonas active={personasActive} />}
          active={personasActive}
        />
        <NavLink
          href="/notifications"
          label={t("nav.alerts")}
          icon={<IconBell active={alertasActive} />}
          active={alertasActive}
          badge={unread}
        />
        <NavLink
          href="/settings"
          label={t("nav.settings")}
          icon={<IconSettings active={settingsActive} />}
          active={settingsActive}
        />
      </div>
    </nav>
  );
}
