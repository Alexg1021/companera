"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
  className?: string;
  label?: string;
};

export default function SignOutButton({ className, label = "Salir" }: Props) {
  const router = useRouter();

  async function onSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onSignOut}
      className={
        className ??
        "rounded-lg border border-neutral-200 px-2.5 py-1 text-[11px] text-neutral-600 hover:bg-neutral-50"
      }
    >
      {label}
    </button>
  );
}
