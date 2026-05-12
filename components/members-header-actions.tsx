"use client";

import Link from "next/link";
import SignOutButton from "@/components/sign-out-button";

export default function MembersHeaderActions({ unreadCount }: { unreadCount: number }) {
  return (
    <>
      <Link
        href="/notifications"
        className="relative rounded-lg border border-neutral-200 px-2 py-1 text-[11px] text-neutral-700 hover:bg-neutral-50"
      >
        Alertas
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-semibold leading-none text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </Link>
      <SignOutButton className="rounded-lg border border-neutral-200 px-2 py-1 text-[11px] text-neutral-600 hover:bg-neutral-50" />
    </>
  );
}
