import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { UserRole } from "@/lib/types/database";

async function fetchUserRole(
  supabase: ReturnType<typeof createServerClient>,
  userId: string
): Promise<UserRole> {
  const { data } = await supabase.from("users").select("role").eq("id", userId).maybeSingle();
  const r = data?.role as UserRole | undefined;
  if (r === "promotora" || r === "clinician" || r === "payer") return r;
  return "promotora";
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isLogin = path === "/login";
  const isApi = path.startsWith("/api/");

  const protectedPage =
    path === "/" ||
    path.startsWith("/members") ||
    path.startsWith("/notifications") ||
    path === "/success" ||
    path === "/dashboard";

  if (!user && protectedPage && !isApi) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  let userRole: UserRole = "promotora";
  if (user) {
    userRole = await fetchUserRole(supabase, user.id);
  }

  const isPayer = userRole === "payer";

  if (user && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = isPayer ? "/dashboard" : "/members";
    return NextResponse.redirect(url);
  }

  if (user && path === "/") {
    const url = request.nextUrl.clone();
    url.pathname = isPayer ? "/dashboard" : "/members";
    return NextResponse.redirect(url);
  }

  if (user && isPayer && (path.startsWith("/members") || path === "/success" || path.startsWith("/notifications"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (user && !isPayer && path.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/members", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
