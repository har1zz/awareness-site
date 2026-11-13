import "server-only";
import { getPublicSupabase, supabaseConfigured } from "./supabase";

export type Flags = {
  contributors_open: boolean;
  videos_open: boolean;
  stories_open: boolean;
  contact_open: boolean;
};
const off: Flags = { contributors_open: false, videos_open: false, stories_open: false, contact_open: false };

/** Reads the on/off switches the administrator controls. Everything is OFF if the database is unreachable. */
export async function getFlags(): Promise<Flags> {
  if (!supabaseConfigured) return off;
  try {
    const { data, error } = await getPublicSupabase().from("site_settings").select("key,value");
    if (error || !data) return off;
    const f = { ...off };
    for (const r of data as { key: keyof Flags; value: boolean }[]) if (r.key in f) f[r.key] = r.value === true;
    return f;
  } catch {
    return off;
  }
}
