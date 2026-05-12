import Link from "next/link";
import { Check } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function SuccessPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto flex min-h-screen max-w-phone flex-col items-center justify-center bg-white px-[18px] py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-teal-light">
        <Check size={26} className="text-brand-teal" strokeWidth={2.5} aria-hidden />
      </div>
      <h1 className="text-base font-medium text-neutral-900">Contacto registrado</h1>
      <p className="mt-2 max-w-xs text-xs leading-relaxed text-neutral-600">
        El contacto quedó registrado. Puedes seguir con tu lista cuando quieras.
      </p>
      <Link
        href="/members"
        className="mt-8 w-full max-w-[240px] rounded-lg bg-brand-navy py-[9px] text-xs font-medium text-white transition-colors duration-150 hover:bg-brand-navy/90"
      >
        Volver a mis personas
      </Link>
    </div>
  );
}
