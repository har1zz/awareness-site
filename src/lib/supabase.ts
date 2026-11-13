import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY;

/** False until SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are set. Pages then show a friendly notice. */
export const supabaseConfigured = Boolean(url && key);

export const cookieOptions = {
  httpOnly: true, // the browser never needs to read the session; only our server does
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

/**
 * Client acting as the signed-in user (reads the session cookie).
 * Row Level Security in the database still decides what this user may do.
 */
export async function getSupabase() {
  if (!url || !key) throw new Error("Supabase is not configured");
  const store = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(list) {
        try {
          for (const { name, value, options } of list) {
            store.set(name, value, { ...options, ...cookieOptions });
          }
        } catch {
          // Called from a Server Component: cookies cannot be written there.
          // The proxy refreshes sessions, so this is safe to ignore.
        }
      },
    },
  });
}

/**
 * Client for PUBLIC pages (approved videos/stories, directory). It reads no cookies and
 * sets none, so ordinary visitors never receive a cookie.
 */
export function getPublicSupabase() {
  if (!url || !key) throw new Error("Supabase is not configured");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

export { url as supabaseUrl, key as supabaseKey };
