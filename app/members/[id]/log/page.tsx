import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppLogoBar from "@/components/app-logo-bar";
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
      <AppLogoBar subtitle="Registrar contacto" />

      <div className="border-b border-neutral-200 px-[18px] py-3">
        <Link
          href={`/members/${id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-teal transition-colors duration-150 hover:text-brand-teal-dark"
        >
          <ArrowLeft size={16} aria-hidden />
          Volver al perfil
        </Link>
      </div>

      <LogTouchpointForm memberId={member.id} memberName={member.full_name} />
    </div>
  );
}
