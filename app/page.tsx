import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/user-role";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const role = await getUserRole(supabase, user.id);
  redirect(role === "payer" ? "/dashboard" : "/members");
}
