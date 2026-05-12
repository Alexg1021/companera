import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/user-role";

type Ctx = { params: { id: string } };

export async function PATCH(request: Request, { params }: Ctx) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const role = await getUserRole(supabase, user.id);
  if (role === "payer") {
    return NextResponse.json({ error: "No disponible para este rol" }, { status: 403 });
  }

  let body: { read?: boolean };
  try {
    body = (await request.json()) as { read?: boolean };
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (typeof body.read !== "boolean") {
    return NextResponse.json({ error: "read (boolean) requerido" }, { status: 400 });
  }

  const { data: updated, error } = await supabase
    .from("notifications")
    .update({ read: body.read })
    .eq("id", params.id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "No se pudo actualizar" }, { status: 500 });
  }

  if (!updated) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
