"use client";

import Link from "next/link";
import { useI18n } from "@/components/locale-provider";

export default function MembersHeaderActions({ unreadCount }: { unreadCount: number }) {
  const { t } = useI18n();
  return (
    <Link
      href="/notifications"
      className="relative rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-[11px] font-medium text-white transition-colors duration-150 hover:bg-white/15"
    >
      {t("header.alerts")}
      {unreadCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-semibold leading-none text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      ) : null}
    </Link>
  );
}
