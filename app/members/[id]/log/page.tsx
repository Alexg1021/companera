import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogTouchpointForm from "@/components/log-touchpoint-form";

type PageProps = { params: { id: string } };

export default async function LogTouchpointPage({ params }: PageProps) {
  const { id } = params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: member } = await supabase
    .from("members")
    .select("id, full_name")
    .eq("id", id)
    .eq("promotora_id", user.id)
    .maybeSingle();

  if (!member) notFound();

  return (
    <div className="mx-auto flex min-h-screen max-w-phone flex-col bg-white">
      <header className="flex items-center gap-2 border-b border-neutral-200 px-4 py-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-xs font-semibold text-white">
          C
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-neutral-900">Registrar contacto</p>
          <p className="text-[10px] text-neutral-500">Compañera · Zócalo Health</p>
        </div>
      </header>

      <div className="border-b border-neutral-200 px-4 py-3">
        <Link href={`/members/${id}`} className="text-sm text-brand">
          ← Volver al perfil
        </Link>
      </div>

      <LogTouchpointForm memberId={member.id} memberName={member.full_name} />
    </div>
  );
}
