import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { Disclaimer, LocaleNotices, Notice, PageHead } from "@/components/Parts";
import { orgs } from "@/content/support";
import { getPublicSupabase, supabaseConfigured } from "@/lib/supabase";
import { serviceTypes } from "@/lib/options";
import { fmtDate } from "@/lib/status";

export const metadata: Metadata = {
  title: "Get Help and Find Support",
  description: "Official sources of breast cancer information and care, and how to find local services.",
};

export const dynamic = "force-dynamic";

type Entry = {
  id: string; name: string; country: string; city: string | null; region: string | null;
  service_types: string[]; languages: string[]; website: string | null; phone: string | null;
  address: string | null; about: string | null; source_url: string | null;
  last_verified: string | null; status: string;
};
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const clean = (s: string) => s.replace(/[^\p{L}\p{N} -]/gu, "").trim().slice(0, 60);

export default async function Page({
  params,
  searchParams,
}: LocaleParams & { searchParams: Promise<{ [k: string]: string | string[] | undefined }> }) {
  const { locale, dict } = await getCtx(params);
  const sp = await searchParams;
  const q = clean(one(sp.q));
  const country = clean(one(sp.country));
  const lang = clean(one(sp.lang)).toLowerCase();
  const service = (serviceTypes as readonly string[]).includes(one(sp.service)) ? one(sp.service) : "";
  const searching = Boolean(q || country || lang || service);

  let entries: Entry[] = [];
  if (supabaseConfigured) {
    let query = getPublicSupabase()
      .from("directory_entries")
      .select("id,name,country,city,region,service_types,languages,website,phone,address,about,source_url,last_verified,status")
      .order("country")
      .order("name")
      .limit(100);
    if (country) query = query.ilike("country", `%${country}%`);
    if (q) query = query.or(`name.ilike.%${q}%,city.ilike.%${q}%,region.ilike.%${q}%`);
    if (service) query = query.contains("service_types", [service]);
    if (lang) query = query.contains("languages", [lang]);
    const { data } = await query;
    entries = (data as Entry[]) ?? [];
  }
  return (
    <>
      <PageHead
        locale={locale}
        dict={dict}
        title={dict.nav.support}
        lead="Where to find official information and how to reach care near you."
      />
      <div className="container section">
        <LocaleNotices locale={locale} dict={dict} />
        <Notice kind="urgent">
          <p>{dict.emergency}</p>
        </Notice>
        <h2>If you have a concern about your breasts</h2>
        <ol>
          <li>Contact your own doctor, nurse or local primary care or women&apos;s health clinic.</li>
          <li>Ask your local or national health authority whether there is a breast clinic or screening programme near you.</li>
          <li>If you cannot find a service, ask a trusted community health worker, pharmacist or hospital reception to point you to the right place.</li>
        </ol>

        <h2>Organisations with official information</h2>
        <Notice kind="warn">
          <p>
            This is <strong>not</strong> a complete directory and it does not recommend one hospital over another.
            Entries marked &quot;not yet verified&quot; have not been individually checked by the site owner.
            Always confirm details on the organisation&apos;s own website. We do not list telephone numbers or
            addresses because they change and we cannot guarantee they are current.
          </p>
        </Notice>
        <div className="table-wrap">
          <table>
            <caption className="sr-only">Organisations providing breast cancer information or care</caption>
            <thead>
              <tr>
                <th scope="col">Organisation</th>
                <th scope="col">Country</th>
                <th scope="col">What it offers</th>
                <th scope="col">Official website</th>
                <th scope="col">Verification</th>
              </tr>
            </thead>
            <tbody>
              {orgs.map((o) => (
                <tr key={o.name}>
                  <th scope="row">{o.name}</th>
                  <td>{o.country}</td>
                  <td>{o.about}</td>
                  <td>
                    <a href={o.url} target="_blank" rel="noopener noreferrer">
                      Visit website<span className="sr-only"> of {o.name} (opens in a new tab)</span>
                    </a>
                  </td>
                  <td>{o.verified ? `Link checked ${o.verified}` : "Not yet verified"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {supabaseConfigured ? (
          <>
            <h2>Search the directory</h2>
            <form method="get" className="panel" role="search" aria-label="Search the directory">
              <div className="field">
                <label htmlFor="q">Name, city or region</label>
                <input id="q" name="q" type="search" defaultValue={q} maxLength={60} />
              </div>
              <div className="field">
                <label htmlFor="country">Country</label>
                <input id="country" name="country" type="search" defaultValue={country} maxLength={60} />
              </div>
              <div className="field">
                <label htmlFor="service">Type of service</label>
                <select id="service" name="service" defaultValue={service}>
                  <option value="">Any</option>
                  {serviceTypes.map((t) => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="lang">Language offered</label>
                <input id="lang" name="lang" type="search" defaultValue={lang} maxLength={40} placeholder="for example: urdu" />
              </div>
              <button type="submit" className="btn">Search</button>
            </form>
            {entries.length === 0 ? (
              <Notice kind="info">
                <p>
                  {searching
                    ? "No entries match. Try fewer filters. If you cannot find a local service, contact your local health authority or a qualified healthcare professional."
                    : "No directory entries have been added yet. Until then, use the organisations above, your own doctor, or your local health authority."}
                </p>
              </Notice>
            ) : (
              <div className="card-grid">
                {entries.map((e) => (
                  <article className="card" key={e.id}>
                    <h3>{e.name}</h3>
                    <p className="hint">{[e.city, e.region, e.country].filter(Boolean).join(", ")}</p>
                    {e.about ? <p>{e.about}</p> : null}
                    {e.service_types.length ? <p><strong>Services:</strong> {e.service_types.join(", ")}</p> : null}
                    {e.languages.length ? <p><strong>Languages:</strong> {e.languages.join(", ")}</p> : null}
                    {e.address ? <p><strong>Address:</strong> {e.address}</p> : null}
                    {e.phone ? <p><strong>Phone:</strong> {e.phone}</p> : null}
                    {e.website ? (
                      <p>
                        <a href={e.website} target="_blank" rel="noopener noreferrer">
                          Official website<span className="sr-only"> of {e.name} (opens in a new tab)</span>
                        </a>
                      </p>
                    ) : null}
                    <p>
                      {e.status === "verified" ? (
                        <span className="status-pill good">Verified {fmtDate(e.last_verified)}</span>
                      ) : (
                        <span className="status-pill pending">Not yet verified</span>
                      )}
                    </p>
                    {e.status === "verified" && e.source_url ? (
                      <p className="hint">
                        Source:{" "}
                        <a href={e.source_url} target="_blank" rel="noopener noreferrer">
                          where this was checked<span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            )}
          </>
        ) : null}
        <p>
          Know of a reliable service that should be listed, or found a mistake? Please use the{" "}
          <a href={`/${locale}/contact`}>contact page</a>.
        </p>
        <Disclaimer dict={dict} locale={locale} />
      </div>
    </>
  );
}
