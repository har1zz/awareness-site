import Link from "next/link";
import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { LocaleNotices, Notice, PageHead } from "@/components/Parts";
import { Flash } from "@/components/Flash";
import { getSupabase } from "@/lib/supabase";
import { getIsAdmin, requireUser } from "@/lib/session";
import { getFlags } from "@/lib/flags";
import { applicationStatus, fmtDate, videoStatus } from "@/lib/status";
import { href } from "@/lib/paths";
import { signOut } from "@/app/actions/auth";

export const metadata: Metadata = { title: "Your account", robots: { index: false } };

export default async function Page({
  params,
  searchParams,
}: LocaleParams & { searchParams: Promise<{ [k: string]: string | string[] | undefined }> }) {
  const { locale, dict } = await getCtx(params);
  const sp = await searchParams;
  const user = await requireUser(locale, `/${locale}/account`);
  const sb = await getSupabase();
  const [{ data: app }, { data: vids }, isAdmin, flags] = await Promise.all([
    sb.from("contributor_applications").select("*").eq("user_id", user.id).maybeSingle(),
    sb.from("videos").select("id,title,status,updated_at").eq("contributor_id", user.id).order("created_at", { ascending: false }),
    getIsAdmin(),
    getFlags(),
  ]);
  const st = app ? applicationStatus[app.status] : null;

  return (
    <>
      <PageHead locale={locale} dict={dict} title="Your account" />
      <div className="container section">
        <LocaleNotices locale={locale} dict={dict} />
        <Flash code={sp.m} />
        <Flash code={sp.e} />
        <p>
          Signed in as <strong>{user.email}</strong>.
        </p>
        <div className="btn-row">
          {isAdmin ? (
            <Link className="btn" href={href(locale, "admin")}>
              Go to the admin dashboard
            </Link>
          ) : null}
          <Link className="btn secondary" href={href(locale, "account/password")}>
            Change password
          </Link>
          <form action={signOut} className="inline-form">
            <input type="hidden" name="locale" value={locale} />
            <button type="submit" className="btn secondary">
              Sign out
            </button>
          </form>
        </div>

        <h2>Healthcare professional application</h2>
        {!app ? (
          flags.contributors_open ? (
            <>
              <p>
                If you are a doctor or other qualified healthcare professional, you can apply to share
                educational videos. The administrator checks your registration before you can submit anything.
              </p>
              <Link className="btn" href={href(locale, "account/apply")}>
                Apply as a healthcare professional
              </Link>
            </>
          ) : (
            <Notice kind="info">
              <p>Applications from healthcare professionals are not open yet.</p>
            </Notice>
          )
        ) : (
          <div className="card">
            <p>
              Status: <span className={`status-pill ${st?.tone}`}>{st?.label}</span>
            </p>
            {app.admin_note ? (
              <Notice kind="warn">
                <p>
                  <strong>Message from the administrator:</strong> {app.admin_note}
                </p>
              </Notice>
            ) : null}
            {["pending", "more_info"].includes(app.status) ? (
              <Link className="btn secondary" href={href(locale, "account/apply")}>
                {app.status === "more_info" ? "Update and resubmit" : "Edit your application"}
              </Link>
            ) : null}
            {app.status === "verified" ? (
              flags.videos_open ? (
                <Link className="btn" href={href(locale, "account/videos/new")}>
                  Submit a new video
                </Link>
              ) : (
                <p>Video submissions are not open yet. You will be able to submit here when they open.</p>
              )
            ) : null}
          </div>
        )}

        {vids && vids.length > 0 ? (
          <>
            <h2>Your videos</h2>
            <div className="table-wrap">
              <table>
                <caption className="sr-only">Your video submissions</caption>
                <thead>
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Status</th>
                    <th scope="col">Last changed</th>
                  </tr>
                </thead>
                <tbody>
                  {vids.map((v) => (
                    <tr key={v.id}>
                      <th scope="row">
                        <Link href={href(locale, `account/videos/${v.id}`)}>{v.title}</Link>
                      </th>
                      <td>
                        <span className={`status-pill ${videoStatus[v.status]?.tone}`}>{videoStatus[v.status]?.label}</span>
                      </td>
                      <td>{fmtDate(v.updated_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}

        <h2>Your data</h2>
        <p>
          You can delete your account and everything linked to it at any time.{" "}
          <Link href={href(locale, "account/delete")}>Delete my account</Link>.
        </p>
      </div>
    </>
  );
}
