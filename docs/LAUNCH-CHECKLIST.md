# Launch checklist

Do these in order. Do not go live until every 🔴 is ticked.

## A. Fill in the facts only you know
- [ ] 🔴 Copy `.env.example` to your host's environment settings and fill **every** value (name, address, email,
      hosting provider and region, site URL).
- [ ] 🔴 `npm run check:launch` reports no MISSING and no RISK lines.
- [ ] 🔴 Read `/privacy`, `/terms`, `/cookies`, `/contact`, `/accessibility` in the browser: no `[TODO: …]` text.
- [ ] 🔴 Pick a site name you have checked is not someone else's trademark (`src/config/site.ts` → `name`).

## B. Professional review
- [ ] 🔴 A qualified clinician reads every page, the 30 quiz answers and the 9 myths, and signs off. Record
      their name, credential and date, then set `clinicalReview` in `src/config/site.ts` (and the env vars).
- [ ] 🔴 A lawyer in Pakistan reviews the Privacy Policy and Terms (one-off, short).
- [ ] 🟠 A bilingual clinician reviews Urdu/Arabic before you translate any medical text.

## C. Verify references (run on your own computer)
- [ ] `npm run check:links` all OK (the build sandbox could not reach these sites).
- [ ] Open each source and confirm the page says what our text says. Update `verified` dates in
      `src/content/support.ts`.
- [ ] Re-open the WHO fact sheet and confirm the figures still match (2.4 M diagnosed, 694,000 deaths, 164/186, 0.5–1% men).

## D. Technical checks (already passing at hand-over; rerun after any change)
```
npm run build
npx next start -p 3100        # in a second terminal
npm run test:e2e              # all pages x 3 languages, axe, keyboard, no cookies/storage/third-party
npm run check:quiz            # 30 questions, scoring under shuffling
npm run check:contrast
npm run lint
```

## E. Human testing
- [ ] Phone (Android + iPhone): menu, quiz, tool, RTL Urdu and Arabic layouts, print certificate.
- [ ] Keyboard only: Tab through the home page, quiz and tool; focus is always visible.
- [ ] Screen reader (NVDA/VoiceOver/TalkBack): home, signs page, quiz, tool.
- [ ] Zoom to 200% and 400%: nothing is cut off.

## F. Hosting
- [ ] HTTPS on. The headers in `next.config.ts` are kept (CSP, HSTS, nosniff…).
- [ ] 🔴 **Analytics, "web vitals" and tracking features of the host are OFF.**
- [ ] Log retention at the host is short; update the privacy policy if it is not "days to a few weeks".
- [ ] `https://your-domain/sitemap.xml` and `/robots.txt` work. Submit the sitemap to search engines if you want.
- [ ] Mailbox for the contact address works; set a reminder to delete old mail.

## G. Do NOT add without more work
- Analytics, ads, share buttons, embedded videos/maps, Google Fonts, live chat → breaks the privacy promises.
- Donate buttons → see `LEGAL-RISKS.md` §6.
- Contact forms, accounts, video upload, stories → Phase 2, see `LEGAL-RISKS.md` §5 and §12.

## Accounts, videos, stories and contact (all OFF until you switch them on)
- [ ] `docs/SETUP-SUPABASE-VERCEL.md` completed, including the smoke test.
- [ ] A qualified clinician has reviewed the educational text (then set clinical review details).
- [ ] A lawyer has reviewed Privacy, Terms and the contributor flow (PECA 2016 s26A false-information risk, user content).
- [ ] You know who will check the admin page and how often (suggest: at least weekly).
- [ ] Database/hosting regions filled in; `npm run check:launch` is clean.
