# Setup: Supabase + Vercel (about 45 minutes)

You need: the repo, a Supabase project, a Vercel account.

## 1. Supabase
1. supabase.com → New project. Choose a region near your readers. Note the **Project URL** (Project settings → API,
   looks like `https://xxxx.supabase.co`) and the **publishable key** (`sb_publishable_…`).
   The publishable key is designed to be public, but this site only uses it on the server. Never use the
   `service_role` / secret key anywhere in this project.
2. SQL Editor → New query → paste all of `supabase/migrations/0001_init.sql` → Run. It must finish with no error.
3. Authentication → URL Configuration:
   - Site URL: `https://YOUR-DOMAIN`
   - Redirect URLs: `https://YOUR-DOMAIN/auth/callback` (and `http://localhost:3000/auth/callback` for testing)
4. Authentication → Sign In / Providers → Email: keep **Confirm email ON**; minimum password length **10**.
5. Authentication → Rate limits: keep the defaults or lower. (Optional) enable CAPTCHA protection for extra spam control.
6. Authentication → Emails: the built-in mailer is limited to a few emails per hour. For real use, add your own SMTP.
7. Settings → Billing/Usage: set up spend alerts if you upgrade.

## 2. Environment variables (Vercel → Project → Settings → Environment Variables, and `.env.local` locally)
```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
NEXT_PUBLIC_SITE_URL=https://YOUR-DOMAIN
NEXT_PUBLIC_OPERATOR_NAME=Your full legal name
NEXT_PUBLIC_OPERATOR_ADDRESS=An address you are willing to publish
NEXT_PUBLIC_CONTACT_EMAIL=...
NEXT_PUBLIC_PRIVACY_EMAIL=...
NEXT_PUBLIC_HOSTING_PROVIDER=Vercel
NEXT_PUBLIC_HOSTING_REGION=(the region shown in Vercel → Settings → Functions)
NEXT_PUBLIC_DATABASE_REGION=(the region shown in Supabase project settings)
```
Run `npm run check:launch`. It must say nothing is missing before you go public.

## 3. Deploy
1. Push the code to GitHub (never commit `.env.local`).
2. Vercel → Add New Project → import the repo → add the variables above → Deploy.
3. Add your domain in Vercel and wait for HTTPS.

## 4. Make yourself admin
1. On the live site open `/en/signup`, create your account, confirm the email, sign in.
2. Supabase → SQL Editor → open `supabase/make_admin.sql`, put your email in, Run.
3. Visit `/en/admin`. Anyone who is not admin gets a 404.

## 5. Smoke test (do all of these once, with a second email as a "doctor")
- [ ] Public pages load, no cookie banner, no cookies (browser dev tools → Application).
- [ ] Sign up a second account, confirm the email, sign in, sign out, reset password.
- [ ] In `/en/admin/settings` turn on **applications**. As the second account apply as a professional.
- [ ] As admin: verify the applicant. Turn on **video submissions**. As the doctor, submit a YouTube link.
- [ ] The video is NOT visible at `/en/videos` yet. As admin, preview it, then approve. Now it is visible.
- [ ] Unpublish it; it disappears. Doctor sees your message.
- [ ] Turn on stories/contact; submit one each; approve the story; handle the message.
- [ ] Doctor deletes their account; their videos disappear.
- [ ] Turn the switches back OFF until reviews are complete.

## 6. Before you turn the switches on for real
See `docs/LAUNCH-CHECKLIST.md`: a clinician must review the educational text, and a lawyer should review the
Privacy Policy, Terms and the contributor flow. The public learning pages can go live without that, with their
"pending clinical review" notice.
