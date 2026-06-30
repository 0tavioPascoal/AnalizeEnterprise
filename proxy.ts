import { createServerClient } from "@supabase/ssr";
import {
  NextResponse,
  type NextRequest,
} from "next/server";
import { getRequiredEnv } from "@/lib/env";

const publicRoutes: string[] = [
  "/login",
  "/register",
];

export async function proxy(
  request: NextRequest,
) {
  const response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value, options }) => {
              request.cookies.set(name, value);

              response.cookies.set(
                name,
                value,
                options,
              );
            },
          );
        },
      },
    },
  );

  const pathname =
    request.nextUrl.pathname;

  const isPublicRoute =
    publicRoutes.includes(pathname);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ========================================
  // NOT AUTHENTICATED
  // ========================================

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();

    url.pathname = "/login";

    url.searchParams.set(
      "redirectTo",
      pathname,
    );

    return NextResponse.redirect(url);
  }

  // ========================================
  // USER STATUS VALIDATION
  // ========================================

  if (user) {
    const { data: profile } =
      await supabase
        .from("profiles")
        .select("status")
        .eq("id", user.id)
        .maybeSingle();

    if (
      profile?.status === "inactive"
    ) {
      await supabase.auth.signOut();

      const url =
        request.nextUrl.clone();

      url.pathname = "/login";

      url.searchParams.set(
        "error",
        "user_inactive",
      );

      return NextResponse.redirect(
        url,
      );
    }
  }

  // ========================================
  // ALREADY AUTHENTICATED
  // ========================================

  if (user && pathname === "/login") {
    const url = request.nextUrl.clone();

    url.pathname = "/dashboard";

    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api|auth).*)",
  ],
};
