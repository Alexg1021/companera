"use client";

import { Heart } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  /** Second line under “Zócalo Health” (e.g. screen context). */
  subtitle?: ReactNode;
  /** Right side (e.g. header actions). */
  trailing?: ReactNode;
};

export default function AppLogoBar({ subtitle = "Promotora companion", trailing }: Props) {
  return (
    <header className="flex items-center justify-between gap-2 border-b border-neutral-200 bg-brand-navy px-[18px] py-[10px]">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[8px] bg-brand-teal">
          <Heart size={14} className="text-white" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-white">Zócalo Health</p>
          <p className="truncate text-[10px] text-white/60">{subtitle}</p>
        </div>
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </header>
  );
}
