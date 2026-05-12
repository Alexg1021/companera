import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type PageProps = { params: { id: string } };

export default async function MemberProfilePage({ params }: PageProps) {
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

  if (!member) {
    return (
      <div className="mx-auto max-w-phone px-4 py-8 text-center text-sm text-neutral-600">
        No encontramos a esta persona.
        <div className="mt-4">
          <Link href="/members" className="text-brand font-medium">
            Volver a la lista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-phone px-4 py-6">
      <Link href="/members" className="text-sm text-brand">
        ← Lista
      </Link>
      <h1 className="mt-4 text-lg font-medium text-neutral-900">{member.full_name}</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Perfil completo y registro de contacto llegan en la siguiente fase.
      </p>
    </div>
  );
}
