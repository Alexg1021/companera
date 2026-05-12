import Link from "next/link";
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
    <div className="mx-auto flex min-h-screen max-w-phone flex-col items-center justify-center bg-white px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-muted">
        <svg
          className="h-7 w-7 text-brand"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-base font-medium text-neutral-900">Listo</h1>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-neutral-600">
        El contacto quedó registrado. Puedes seguir con tu lista cuando quieras.
      </p>
      <Link
        href="/members"
        className="mt-8 w-full max-w-[240px] rounded-lg bg-brand py-2.5 text-sm font-medium text-white"
      >
        Volver a mis personas
      </Link>
    </div>
  );
}
