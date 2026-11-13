/**
 * Accepts ONLY public YouTube or Vimeo links and reduces them to (provider, id[, hash]).
 * The embed address is rebuilt from those parts, so a contributor can never make the
 * site embed any other page.
 */
export type ParsedVideo = { provider: "youtube" | "vimeo"; ref: string; hash: string | null };

const YT_ID = /^[A-Za-z0-9_-]{11}$/;
const VIMEO_ID = /^[0-9]{5,12}$/;
const VIMEO_HASH = /^[a-f0-9]{6,20}$/;

export function parseVideoUrl(input: string): ParsedVideo | null {
  let u: URL;
  try {
    u = new URL(input.trim());
  } catch {
    return null;
  }
  if (u.protocol !== "https:") return null;
  const host = u.hostname.toLowerCase().replace(/^www\./, "");
  const parts = u.pathname.split("/").filter(Boolean);

  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    let id: string | undefined;
    if (parts[0] === "watch") id = u.searchParams.get("v") ?? undefined;
    else if (parts[0] === "embed" || parts[0] === "shorts" || parts[0] === "live") id = parts[1];
    return id && YT_ID.test(id) ? { provider: "youtube", ref: id, hash: null } : null;
  }
  if (host === "youtu.be") {
    const id = parts[0];
    return id && YT_ID.test(id) ? { provider: "youtube", ref: id, hash: null } : null;
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const i = host === "player.vimeo.com" ? 1 : 0;
    if (host === "player.vimeo.com" && parts[0] !== "video") return null;
    const id = parts[i];
    if (!id || !VIMEO_ID.test(id)) return null;
    const h = host === "player.vimeo.com" ? u.searchParams.get("h") : parts[i + 1];
    return { provider: "vimeo", ref: id, hash: h && VIMEO_HASH.test(h) ? h : null };
  }
  return null;
}

export function embedUrl(provider: string, ref: string, hash: string | null): string | null {
  if (provider === "youtube" && YT_ID.test(ref)) {
    return `https://www.youtube-nocookie.com/embed/${ref}?rel=0`;
  }
  if (provider === "vimeo" && VIMEO_ID.test(ref)) {
    return `https://player.vimeo.com/video/${ref}${hash && VIMEO_HASH.test(hash) ? `?h=${hash}&dnt=1` : "?dnt=1"}`;
  }
  return null;
}

export function watchUrl(provider: string, ref: string, hash: string | null): string {
  if (provider === "youtube") return `https://www.youtube.com/watch?v=${ref}`;
  return `https://vimeo.com/${ref}${hash ? `/${hash}` : ""}`;
}
