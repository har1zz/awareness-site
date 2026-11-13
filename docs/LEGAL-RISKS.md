# Legal and risk register

**Read this before you publish.** This is a practical risk review by an AI assistant, not legal advice.
The laws below were checked against sources found on 28 Oct 2026; laws change. Have a lawyer in Pakistan
review the policy pages once, and a qualified clinician review all medical content. Neither review has
happened yet.

Legend: 🔴 must fix before launch · 🟠 should decide/fix · 🟢 handled in the code.

## 1. Who is legally responsible
- 🔴 You told us the operator is **you as an individual in Pakistan**. That means you are personally
  liable for what the site says, with no company shield. If the site grows (videos, doctors, donations),
  strongly consider registering a company or a charity/NGO first and updating `src/config/site.ts`.
- 🔴 The legal pages print your **name, address and email**. Use real details; do not leave `[TODO: …]`
  showing. If you do not want your home address public, use a PO box or a registered business address.

## 2. Medical content (biggest risk on this site)
- 🔴 **No clinician has reviewed the content.** Every page currently says so honestly. Do not remove those
  notices until a qualified doctor has reviewed the pages, quiz answers and myth/fact cards, and you have set
  `clinicalReview.completed = true` with a real name, credential and date in `.env`/`site.ts`.
- 🔴 Wrong health information can cause real harm and a claim. Pakistan's PECA 2016 (as amended in 2025,
  section 26A) also created an offence for knowingly spreading false information that causes fear or panic.
  Accuracy and sourcing are your protection: keep every claim tied to a source in `src/content/sources.ts`.
- 🟢 Done in code: no diagnosis, no risk percentages, no "you are fine" messaging, no treatment advice, no
  supplement/diet claims, no universal screening schedule, urgent-care routing, disclaimers on medical pages.
- 🟠 Statistics: only the WHO figures are used (2.4 million women diagnosed, 694,000 deaths in 2024; 164 of 186
  countries; men 0.5–1%), taken from the WHO fact sheet dated 3 July 2026. Recheck when WHO updates it.

## 3. Privacy and data protection
- 🟢 Public reading collects nothing: no cookies, no analytics, no third-party requests (verified in a real
  browser on all pages, 3 languages). The forms (sign-up, application, video, story, contact) DO collect
  personal data; the Privacy Policy lists each item, purpose, basis and retention. They ship switched OFF.
- 🟠 Supabase and Vercel are processors. Fill in their regions (env vars). Use a Supabase project region
  close to your readers and confirm both providers' data-processing terms in their dashboards.
- Pakistan: no general data-protection law is in force as of mid-2026 (the Personal Data Protection Bill is
  still a draft). Constitution Art. 14 and PECA 2016 (e.g. unauthorised access/copying of data) still apply.
  Watch for the Bill passing; it would add duties (notice, consent, breach reporting, cross-border rules).
- EU/UK/other visitors: GDPR-style laws can apply to a site outside the EU if it targets people there or
  monitors them. This site is general and collects almost nothing, but the privacy policy is written to
  GDPR principles so you are in a good position. 🟠 If you later target the EU (e.g. EU-language pages,
  EU marketing), get advice and consider appointing an EU representative.
- 🟠 **Hosting logs**: your host records IP addresses. Choose a host, fill in `NEXT_PUBLIC_HOSTING_*`, and
  check the host's retention setting (the policy says "typically days to a few weeks"; match it to reality).
- 🔴 **Do not turn on host analytics** (e.g. Vercel Analytics, Cloudflare Web Analytics with cookies, Google
  Analytics). It would make the Privacy and Cookie policies false. The Content-Security-Policy blocks
  most third-party scripts, but host-injected tools can bypass it.
- 🟠 Email: if you publish a contact address you will receive personal data. Use a dedicated mailbox, do not
  forward to many people, and delete old messages (policy says 12 months).

## 4. Cookies and consent
- 🟢 **No cookie banner is needed**: public pages set no cookies. The only cookie is the strictly-necessary
  sign-in cookie, set after login (and described in the Cookie Policy). Video hosts load only after the
  visitor clicks "Load video". The e2e test fails if any cookie/storage is set on public pages.
- 🔴 If you ever add analytics, embeds, a newsletter, accounts, or a contact form: update the Privacy and
  Cookie policies, add a real consent mechanism (opt-in, equal-weight accept/reject, no pre-ticked boxes),
  and load nothing until consent is given. Edit `next.config.ts` CSP only deliberately.

## 5. Forms and consent
- 🟢 There are **no data-collecting forms** in this release (contact is a plain email link; quiz, tool and
  search run only in the browser). So there is nothing to consent to.
- 🟠 For Phase 2 (contributor registration, video upload, story submission), each form needs: a plain-language
  purpose, an unticked consent checkbox for anything optional, only the minimum fields, a link to the privacy
  policy, and a deletion route. Health-related submissions and identity documents are sensitive: do not start
  collecting them without secure storage, retention limits and legal advice.

## 6. Payments, refunds and donations
- 🟢 The site takes no money. `/payments-and-refunds` says so, and tells visitors to give directly to
  registered charities.
- 🔴 **Do not add a donate button** without registering as a legitimate charity/NGO or using a registered one.
  Collecting donations for "breast cancer" as an individual risks being treated as fraud or illegal fundraising
  in many jurisdictions. Pakistan has specific rules for charities and public fundraising; ask a lawyer.

## 7. Reviews, testimonials and claims
- 🟢 No fake reviews, user counts, testimonials, endorsements, donation totals or ratings exist anywhere.
  The launch check scans for common claim words. The home page says plainly that stories/videos are not
  live yet.
- 🟠 Do not describe the site as "medically verified", "doctor approved", or "official" until true.
  Do not use the logos of WHO, NCI, ACS, NHS or any charity. The credits page says you are not affiliated.

## 8. Copyright and images
- 🟢 The site uses **no photos, stock images, or third-party artwork**. The ribbon is an original simple
  drawing. Text is written in our own words, not copied. Fonts are system fonts (no Google Fonts request).
- 🟠 The *pink ribbon* as a general symbol is widely used; specific charity ribbon logos are trademarked. Do not
  swap in a downloaded ribbon logo. Before adding any image/video: confirm the licence, store the proof, and add
  it to `/credits`. Never download photos of real people from the web.
- 🟠 The quiz and myths are original wording based on public guidance. Do not paste text from WHO/NCI/ACS/NHS pages.

## 9. Accessibility (legal exposure in some countries, and the right thing to do)
- 🟢 Automated axe-core scan (WCAG 2.0–2.2 A/AA rules) found 0 violations on all pages; contrast pairs pass;
  quiz, tool, menu and myth cards work by keyboard; no horizontal scroll at 360 px; reduced-motion respected.
- 🟠 Automated tools find roughly a third of issues. Have a real person test with a screen reader (NVDA,
  VoiceOver, TalkBack) before claiming conformance. The accessibility page does not claim full conformance.
- 🟠 Urdu uses a Nastaliq font stack that depends on fonts installed on the visitor's device; check it looks
  right on Android/iOS. Bundling a licensed font is possible but must be self-hosted (no Google Fonts).

## 10. Translations
- 🔴 Urdu and Arabic UI text is **machine-assisted and unreviewed**; medical page text is English only, and
  each translated page says so. Do not publish medical translations without a bilingual clinician reviewing
  them. Wrong translations of medical content are a real safety risk.

## 11. Content that could put you at risk in Pakistan
- 🟠 PECA 2016 as amended (2025) criminalises false information and gives a new authority power to order
  content removal. Keep claims sourced, avoid commenting on politics, courts, military or religion, and have a
  lawyer advise before opening user-generated content (stories, videos). That is exactly why stories, video
  submissions, sign-ups and the contact form ship OFF and every item needs your approval first.

## 12. Phase 2 (doctor video portal) — not built, legally heavy
- Verifying licences (PMDC in Pakistan; other countries differ), handling ID documents, hosting video of
  patients (consent), moderation duties, takedown process, and liability for what contributors say all need a
  lawyer and a company/NGO wrapper first. Do not start this as an individual.

## 13. Things this review cannot tell you
- Whether your chosen domain/name infringes a trademark (search before you buy/brand).
- Your hosting provider's exact log retention and country (fill in `.env`).
- Local registration duties for a website or health information service in Pakistan (ask a lawyer; none were
  found for a purely informational site, but this was not exhaustively checked).
