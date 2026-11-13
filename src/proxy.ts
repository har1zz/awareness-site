import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { locales, pickLocale } from "@/i18n/config";

// 1) Redirect "/" and any path without a language prefix to a language path
//    (language comes from Accept-Language; nothing is stored).
// 2) ONLY for sign-in / account / admin pages: keep the login session fresh.
//    Everyone else, i.e. every public page, never gets a cookie.
const AUTH_PATHS = /^\/(en|ur|ar)\/(login|signup|forgot-password|account|admin)(\/|$)/;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));

  if (!hasLocale) {
    const locale = pickLocale(request.headers.get("accept-language"));
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || !AUTH_PATHS.test(pathname)) return;

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(list) {
        for (const { name, value } of list) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of list) {
          response.cookies.set(name, value, {
            ...options,
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          });
        }
      },
    },
  });
  await supabase.auth.getUser(); // refreshes an expiring session
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  // Skip Next internals, API routes, the auth callback and any file with an extension.
  matcher: ["/((?!_next|api|auth|.*\\..*).*)"],
};
