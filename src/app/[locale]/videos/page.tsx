import Link from "next/link";
import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { Disclaimer, LocaleNotices, Notice, PageHead } from "@/components/Parts";
import { getPublicSupabase, supabaseConfigured } from "@/lib/supabase";
import { audiences, label, languages, topics } from "@/lib/options";
import { fmtDate } from "@/lib/status";
import { href } from "@/lib/paths";

export const metadata: Metadata = { title: "Doctor Awareness Videos" };
export const dynamic = "force-dynamic";

type SP = { [k: string]: string | string[] | undefined };
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function Page({ params, searchParams }: LocaleParams & { searchParams: Promise<SP> }) {
  const { locale, dict } = await getCtx(params);
  const sp = await searchParams;
  const q = one(sp.q).replace(/[^\p{L}\p{N} -]/gu, "").trim().slice(0, 60);
  const topic = topics.some((t) => t.value === one(sp.topic)) ? one(sp.topic) : "";
  const lang = languages.some((l) => l.value === one(sp.lang)) ? one(sp.lang) : "";

  let videos: Record<string, string>[] = [];
  const people = new Map<string, { full_name: string; specialty: string; country: string }>();
  let failed = false;
  if (supabaseConfigured) {
    const sb = getPublicSupabase();
    let query = sb
      .from("videos")
      .select("id,title,description,topic,language,audience,contributor_id,published_at,attribution")
      .eq("status", "approved")
      .order("published_at", { ascending: false })
      .limit(60);
    if (topic) query = query.eq("topic", topic);
    if (lang) query = query.eq("language", lang);
    if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
    const { data, error } = await query;
    if (error) failed = true;
    videos = (data as Record<string, string>[]) ?? [];
    const ids = [...new Set(videos.map((v) => v.contributor_id))];
    if (ids.length) {
      const { data: ps } = await sb.from("contributor_public").select("user_id,full_name,specialty,country").in("user_id", ids);
      for (const p of ps ?? []) people.set(p.user_id, p);
    }
  }

  return (
    <>
      <PageHead
        locale={locale}
        dict={dict}
        title={dict.nav.videos}
        lead="Educational videos from healthcare professionals. Every video is reviewed and approved by the site administrator before it appears here."
      />
      <div className="container section">
        <LocaleNotices locale={locale} dict={dict} medical />
        <form method="get" className="panel" role="search" aria-label="Search videos">
          <div className="field">
            <label htmlFor="q">Search by topic or word</label>
            <input id="q" name="q" type="search" defaultValue={q} maxLength={60} />
          </div>
          <div className="field">
            <label htmlFor="topic">Topic</label>
            <select id="topic" name="topic" defaultValue={topic}>
              <option value="">All topics</option>
              {topics.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="lang">Language</label>
            <select id="lang" name="lang" defaultValue={lang}>
              <option value="">All languages</option>
              {languages.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn">Search videos</button>
        </form>

        {!supabaseConfigured ? (
          <Notice kind="info"><p>Videos are not available yet.</p></Notice>
        ) : failed ? (
          <Notice kind="warn"><p>We could not load the videos right now. Please try again later.</p></Notice>
        ) : videos.length === 0 ? (
          <Notice kind="info">
            <p>
              {q || topic || lang
                ? "No videos match your search. Try fewer filters."
                : "There are no published videos yet. We only show videos that a verified healthcare professional has submitted and the administrator has approved."}
            </p>
          </Notice>
        ) : (
          <div className="card-grid" style={{ marginTop: "1.5rem" }}>
            {videos.map((v) => {
              const p = people.get(v.contributor_id);
              return (
                <article className="card" key={v.id}>
                  <h2 style={{ fontSize: "1.2rem", marginTop: 0 }}>
                    <Link href={href(locale, `videos/${v.id}`)}>{v.title}</Link>
                  </h2>
                  <p>{v.description}</p>
                  <p className="hint">
                    {label(topics, v.topic)} · {label(languages, v.language)} · for {label(audiences, v.audience).toLowerCase()}
                  </p>
                  <p className="hint">
                    {p ? <span className="status-pill good">Verified healthcare professional</span> : null}{" "}
                    {v.attribution}
                  </p>
                  <p className="hint">Published {fmtDate(v.published_at)}</p>
                </article>
              );
            })}
          </div>
        )}
        <p style={{ marginTop: "1.5rem" }}>
          Are you a doctor or other qualified healthcare professional?{" "}
          <Link href={href(locale, "contribute")}>Find out how to contribute</Link>.
        </p>
        <Disclaimer dict={dict} locale={locale} />
      </div>
    </>
  );
}
