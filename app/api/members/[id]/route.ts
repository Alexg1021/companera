import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { loadMemberDetail } from "@/lib/member-detail";

type Ctx = { params: { id: string } };

export async function GET(_request: Request, { params }: Ctx) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const detail = await loadMemberDetail(supabase, params.id, user.id);
  if (!detail) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    member: detail.member,
    touchpoints: detail.touchpoints,
    computedTriage: detail.computedTriage,
  });
}
