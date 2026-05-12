import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserRole } from "@/lib/types/database";

export async function getUserRole(supabase: SupabaseClient, userId: string): Promise<UserRole> {
  const { data } = await supabase.from("users").select("role").eq("id", userId).maybeSingle();
  const r = data?.role as UserRole | undefined;
  if (r === "promotora" || r === "clinician" || r === "payer") return r;
  return "promotora";
}

export function isPayerRole(role: UserRole): boolean {
  return role === "payer";
}
