"use client";

import { usePathname } from "next/navigation";
import { LocaleProvider } from "@/components/locale-provider";
import MobileBottomNav from "@/components/mobile-bottom-nav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  /* Reserve space for fixed bottom nav (h-14 + safe-area padding on the nav shell). */
  const contentPad =
    !isLogin
      ? "pb-[calc(3.5rem+max(4px,env(safe-area-inset-bottom,0px))+10px)]"
      : "";

  return (
    <LocaleProvider>
      <div className={contentPad}>{children}</div>
      <MobileBottomNav />
    </LocaleProvider>
  );
}
