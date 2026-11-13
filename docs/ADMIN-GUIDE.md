# Admin guide

Sign in, then open `/en/admin`. Sections:

- **Videos**: queue of submissions. Open one → press "Load video" to preview privately → read the transcript →
  check the contributor. Choose Approve, Ask for changes, or Reject (a message is required unless you approve).
  Approved videos can later be Unpublished. A video edited by its author returns to the queue.
  If someone else changed the item while you were looking, you are asked to review again (nothing is overwritten).
- **Contributors**: check the name and registration number on the **official register** of the named body
  yourself. Only then press Verify. Verified status is what lets someone submit videos. Suspending a contributor hides their videos.
- **Stories**: publish only if there is no medical advice or cure claim, no named third parties, no identifying
  details, no promotion. Reject if unsure.
- **Messages**: reply by email, mark as handled, then delete (keep personal data no longer than needed).
- **Directory**: add services you have checked yourself on their official page. "Verified" needs the date and the source link.
- **Launch switches**: four switches, all OFF by default.
- **Audit log**: automatic record of decisions and changes. Cannot be edited from the site.

## Rules to follow
- Never approve a video you have not watched and read the transcript of.
- Remove anything that gives individual medical advice, promotes a product, or shows a patient.
- If someone asks you to remove their data: delete the item, or ask them to use "Delete account".
- The site does not email you about new submissions. Check the overview page (counts) regularly.

## Honest limits
- No notification emails to you.
- Articles, quiz, myths and translations are edited in code (reviewed in git), not in the admin.
- Urdu/Arabic interface text is translated, but long medical text is still English only; get a medical translator before claiming otherwise.
- Spam protection is a hidden field plus a database rate limit; add CAPTCHA in Supabase if abused.
- Anyone can call Supabase sign-up directly with the public key. Accounts have no power until you verify them.
