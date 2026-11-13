import { NextResponse, type NextRequest } from "next/server";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";

// Email links (confirm sign-up, reset password) land here with a one-time ?code=.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextRaw = searchParams.get("next") ?? "";
  const next = /^\/(en|ur|ar)\/[A-Za-z0-9/_-]*$/.test(nextRaw) ? nextRaw : "/en/account";
  const lang = next.split("/")[1];

  if (!supabaseConfigured || !code) {
    return NextResponse.redirect(`${origin}/${lang}/login?e=link_invalid`);
  }
  const sb = await getSupabase();
  const { error } = await sb.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(`${origin}/${lang}/login?e=link_invalid`);
  return NextResponse.redirect(`${origin}${next}`);
}
