import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { LocaleNotices, Notice, PageHead } from "@/components/Parts";
import { Flash } from "@/components/Flash";
import { ActionForm, CheckField, SelectField, TextArea, TextField } from "@/components/forms";
import { submitStory } from "@/app/actions/public";
import { getPublicSupabase, supabaseConfigured } from "@/lib/supabase";
import { getFlags } from "@/lib/flags";
import { label, languages, storyCategories } from "@/lib/options";
import { fmtDate } from "@/lib/status";

export const metadata: Metadata = { title: "Stories and Community" };
export const dynamic = "force-dynamic";

export default async function Page({
  params,
  searchParams,
}: LocaleParams & { searchParams: Promise<{ [k: string]: string | string[] | undefined }> }) {
  const { locale, dict } = await getCtx(params);
  const sp = await searchParams;
  const flags = await getFlags();
  let stories: { id: string; category: string; title: string; body: string; display_name: string | null; content_warning: string | null; published_at: string; language: string }[] = [];
  if (supabaseConfigured) {
    const { data } = await getPublicSupabase()
      .from("stories")
      .select("id,category,title,body,display_name,content_warning,language,published_at")
      .eq("status", "approved")
      .order("published_at", { ascending: false })
      .limit(50);
    stories = data ?? [];
  }

  return (
    <>
      <PageHead
        locale={locale}
        dict={dict}
        title={dict.nav.stories}
        lead="Real experiences from patients, survivors, caregivers and supporters, shared with permission."
      />
      <div className="container section prose">
        <LocaleNotices locale={locale} dict={dict} />
        <Flash code={sp.m} />
        <Notice kind="info">
          <p>
            Every story is read and approved by an editor before it is published. Each one is one person&apos;s
            experience and does not predict what will happen to anyone else. This is not a forum, and we do not
            publish medical advice from visitors.
          </p>
        </Notice>

        {stories.length === 0 ? (
          <p>There are no published stories yet.</p>
        ) : (
          <div style={{ marginBlock: "1.5rem" }}>
            {stories.map((s) => (
              <article className="card" key={s.id} style={{ marginBottom: "1rem" }}>
                <h2 style={{ fontSize: "1.3rem", marginTop: 0 }}>{s.title}</h2>
                <p className="hint">
                  {label(storyCategories, s.category).replace("I am a ", "")} story ·{" "}
                  {s.display_name ? s.display_name : "Anonymous"} · {fmtDate(s.published_at)} · {label(languages, s.language)}
                </p>
                {s.content_warning ? (
                  <details className="expander">
                    <summary>Content note: {s.content_warning}. Show the story</summary>
                    <div className="expander-body">
                      <p className="pre">{s.body}</p>
                    </div>
                  </details>
                ) : (
                  <p className="pre">{s.body}</p>
                )}
              </article>
            ))}
          </div>
        )}

        <h2>Share your story</h2>
        {!flags.stories_open ? (
          <Notice kind="info">
            <p>Story submissions are not open yet.</p>
          </Notice>
        ) : (
          <div className="panel">
            <p>
              We collect only what you type below. We do not ask for your email or any contact details, so we
              cannot reply to you. Please do not include names, phone numbers or other details that identify
              other people.
            </p>
            <ActionForm action={submitStory} locale={locale} submitLabel="Send my story for review" honeypot>
              <SelectField name="category" label="I am sharing as" required options={[...storyCategories]} />
              <TextField name="title" label="Title" required maxLength={140} />
              <TextArea name="body" label="Your story" required rows={10} minLength={100} maxLength={6000} hint="At least 100 characters." />
              <TextField
                name="display_name"
                label="Name to show"
                maxLength={60}
                hint="A first name or nickname. Leave empty to be published anonymously."
              />
              <TextField
                name="content_warning"
                label="Content note"
                maxLength={200}
                hint="Optional. For example: mentions surgery or loss. Readers will see this before the story."
              />
              <SelectField name="language" label="Language of your story" required options={[...languages]} />
              <CheckField name="consent_publish">
                I agree that my story may be published on this website, with the name I chose above or anonymously, if the editor approves it.
              </CheckField>
              <CheckField name="consent_real">
                This is a true account of my own or a family member&apos;s experience. I understand it is not medical advice.
              </CheckField>
            </ActionForm>
          </div>
        )}
      </div>
    </>
  );
}
