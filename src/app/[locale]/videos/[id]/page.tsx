import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCtx } from "@/lib/ctx";
import { Disclaimer, LocaleNotices, PageHead } from "@/components/Parts";
import { VideoEmbed } from "@/components/VideoEmbed";
import { CopyLink } from "@/components/CopyLink";
import { getPublicSupabase, supabaseConfigured } from "@/lib/supabase";
import { audiences, label, languages, topics } from "@/lib/options";
import { fmtDate } from "@/lib/status";
import { embedUrl, watchUrl } from "@/lib/video";
import { href } from "@/lib/paths";

export const dynamic = "force-dynamic";

async function load(id: string) {
  if (!supabaseConfigured || !/^[0-9a-f-]{36}$/.test(id)) return null;
  const sb = getPublicSupabase();
  // RLS means only APPROVED videos can ever be returned here.
  const { data: v } = await sb.from("videos").select("*").eq("id", id).eq("status", "approved").maybeSingle();
  if (!v) return null;
  const { data: p } = await sb
    .from("contributor_public")
    .select("full_name,specialty,country,workplace,bio")
    .eq("user_id", v.contributor_id)
    .maybeSingle();
  return { v, p };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const r = await load(id);
  return r ? { title: r.v.title, description: r.v.description } : { title: "Video not found", robots: { index: false } };
}

export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { id } = await params;
  const { locale, dict } = await getCtx(params);
  const r = await load(id);
  if (!r) notFound();
  const { v, p } = r;
  const src = embedUrl(v.provider, v.video_ref, v.video_hash);
  if (!src) notFound();
  const refs = String(v.reference_links ?? "").split("\n").map((s) => s.trim()).filter(Boolean);

  return (
    <>
      <PageHead locale={locale} dict={dict} title={v.title} trail={[{ label: dict.nav.videos, path: "videos" }]} lead={v.description} />
      <div className="container section prose">
        <LocaleNotices locale={locale} dict={dict} medical />
        <VideoEmbed
          src={src}
          title={v.title}
          watchUrl={watchUrl(v.provider, v.video_ref, v.video_hash)}
          providerName={v.provider === "youtube" ? "YouTube" : "Vimeo"}
        />
        <p className="hint">
          {label(topics, v.topic)} · {label(languages, v.language)} · for {label(audiences, v.audience).toLowerCase()} · published {fmtDate(v.published_at)}
        </p>

        <h2>Who made this</h2>
        <p>
          <strong>{v.attribution}</strong>
        </p>
        {p ? (
          <p>
            <span className="status-pill good">Verified healthcare professional</span>{" "}
            {p.full_name}, {p.specialty}, {p.country}
            {p.workplace ? `, ${p.workplace}` : ""}. {p.bio}
          </p>
        ) : null}
        <p className="hint">
          “Verified” means the site administrator checked this person&apos;s professional registration. It does
          not mean the content has been independently peer reviewed.
        </p>

        <details className="expander" open>
          <summary>Transcript</summary>
          <div className="expander-body">
            <p className="pre">{v.transcript}</p>
          </div>
        </details>

        {refs.length > 0 ? (
          <section aria-labelledby="refs-h">
            <h2 id="refs-h">References</h2>
            <ul className="sources-list">
              {refs.map((line, i) => {
                const isUrl = /^https:\/\/[^\s]+$/.test(line);
                return (
                  <li key={i}>
                    {isUrl ? (
                      <a href={line} target="_blank" rel="noopener noreferrer nofollow">
                        {line}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      line
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <p>
          <CopyLink path={href(locale, `videos/${v.id}`)} />
        </p>
        <p>
          <Link href={href(locale, "videos")}>← All videos</Link>
        </p>
        <Disclaimer dict={dict} locale={locale} />
      </div>
    </>
  );
}
