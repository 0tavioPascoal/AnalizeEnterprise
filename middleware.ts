import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // 🔥 IMPORTANTE: garante leitura correta da sessão
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isLoggedIn = !!session;

  const path = req.nextUrl.pathname;

  const isLoginPage = path === "/login";
  const isProtectedRoute = path.startsWith("/dashboard");

  // 🔒 Não autenticado tentando acessar área protegida
  if (isProtectedRoute && !isLoggedIn) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  // 🔁 Já logado tentando acessar login
  if (isLoginPage && isLoggedIn) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
