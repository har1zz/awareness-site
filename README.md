# Awareness for Everyone — breast cancer awareness site

Next.js 16 + TypeScript + Supabase (Postgres, sign-in). English, Urdu and Arabic interface (RTL supported).
Public pages: no cookies, no analytics, no third-party requests (videos load only after a click).
Accounts, doctor video submissions, stories, contact form and the admin dashboard need Supabase:
**start with `docs/SETUP-SUPABASE-VERCEL.md`**, then `docs/ADMIN-GUIDE.md`.

## What is built (Phase 1)
Home, 8 educational pages (about, signs, risk, breast health guide, screening, treatment, living with it,
appointment checklist), 9 myth-vs-fact cards with sources, 30-question quiz (3 levels, shuffled, scored,
reviewable, printable participation certificate), "What Should I Do Next?" tool, site search, support page,
FAQ, sources, contact, plus Privacy, Terms, Cookies, Payments and Refunds, Medical Disclaimer,
Accessibility and Credits pages, sitemap and robots.

## What is NOT built (and why)
Accounts, doctor registration/verification, video upload and admin approval, story submissions, admin
dashboard, database, reminders, downloadable resources, full translation of medical text. These need a backend,
secure storage and legal groundwork first: see `docs/LEGAL-RISKS.md` §12. Pages for these exist and honestly
say "not open yet". Nothing fake is shown.

## Run it
```
npm install
npm run dev            # http://localhost:3000
npm run build && npx next start -p 3100
```

## Set your details
Copy `.env.example` values into your host's environment settings (or `.env.local`). Editing text:
- Pages: `src/content/pages.ts` · Myths: `src/content/myths.ts` · Quiz: `src/content/quiz.ts`
- FAQ: `src/content/faq.ts` · Sources: `src/content/sources.ts` · Support list: `src/content/support.ts`
- UI strings and translations: `src/i18n/dictionaries.ts` · Site name/business facts: `src/config/site.ts`
- Every claim must cite a source id from `sources.ts`.

## Checks
`npm run lint` · `npm run check:launch` · `npm run check:contrast` · `npm run test:e2e` ·
`npm run check:quiz` · `npm run check:links` (run on your own computer).
Read `docs/LAUNCH-CHECKLIST.md` before going live.

## Deploy
Any Node host works (Vercel, Netlify, a VPS with `next start`). Turn OFF host analytics. Keep HTTPS on.
