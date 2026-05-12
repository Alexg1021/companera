import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { loadMembersDashboard } from "@/lib/members-data";

export async function GET() {
  const supabase = await createClient();
  const data = await loadMembersDashboard(supabase);
  if (!data) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (data.error) {
    return NextResponse.json({ error: data.error }, { status: 500 });
  }
  return NextResponse.json({
    promotoraName: data.promotoraName,
    stats: data.stats,
    members: data.members,
  });
}
