// Lists facts only the site owner can supply, and scans built content for
// risky leftovers. Run: npm run check:launch  (exit 1 = NOT ready to go live)
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
let problems = 0;

// 1. Env vars the legal pages need
const required = {
  NEXT_PUBLIC_SITE_URL: "public address of the site, e.g. https://example.org",
  NEXT_PUBLIC_OPERATOR_NAME: "your full legal name",
  NEXT_PUBLIC_OPERATOR_ADDRESS: "a postal/contact address you are willing to publish",
  NEXT_PUBLIC_CONTACT_EMAIL: "a dedicated contact email",
  NEXT_PUBLIC_HOSTING_PROVIDER: "your hosting provider's name",
  NEXT_PUBLIC_HOSTING_REGION: "where the host stores logs",
  NEXT_PUBLIC_DATABASE_REGION: "region of your Supabase project (Supabase > Project settings)",
  SUPABASE_URL: "your Supabase Project URL (server only)",
  SUPABASE_PUBLISHABLE_KEY: "your Supabase publishable key (server only)",
};
for (const [k, why] of Object.entries(required)) {
  if (!process.env[k]) {
    console.log(`MISSING  ${k}  (${why})`);
    problems++;
  }
}

// 2. Scan source for risky leftovers
const risky = [
  [/lorem ipsum/i, "placeholder text"],
  [/\[TODO:[^\]]*\](?![^\n]*process\.env)/, "unresolved TODO shown to visitors"],
  [/\b(testimonial|5[- ]star|rated #1|clinically proven|guaranteed cure|miracle)\b/i, "unsupported claim / fake review wording"],
  [/<script[^>]+src=["']https?:/i, "third-party script"],
  [/google-analytics|googletagmanager|gtag\(|fbq\(|hotjar|facebook\.net|doubleclick/i, "analytics/tracking code"],
  [/fonts\.googleapis|fonts\.gstatic|next\/font\/google/i, "Google Fonts (third-party request)"],
  [/localStorage|sessionStorage|document\.cookie|indexedDB/, "browser storage (cookie policy says none is used)"],
];
function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|css|mjs)$/.test(f)) scan(p);
  }
}
function scan(p) {
  if (p.endsWith("check-placeholders.mjs")) return;
  // Only the two-click video embed may contain an iframe; the CSP allows just YouTube-nocookie and Vimeo.
  const iframeOk = p.endsWith("components/VideoEmbed.tsx");
  const text = readFileSync(p, "utf8");
  const iframe = /<iframe/i.exec(text);
  if (iframe && !iframeOk) { console.log(`RISK     ${p.replace(root, "")}: unexpected iframe`); problems++; }
  for (const [re, why] of risky) {
    const m = text.match(re);
    if (m) {
      // the placeholder helper in site.ts legitimately contains "[TODO:"
      if (p.endsWith("config/site.ts") && why.startsWith("unresolved")) continue;
      // Legal pages mention storage only to say it is NOT used; quiz distractors
      // mention "miracle cure" as a wrong answer. Only real code/claims matter.
      if (why.startsWith("browser storage") && p.includes("/app/[locale]/")) continue;
      if (why.startsWith("browser storage") && p.endsWith("lib/supabase.ts")) continue;
      if (why.startsWith("unsupported") && p.endsWith("content/quiz.ts")) continue;
      console.log(`RISK     ${p.replace(root, "")}: ${why} -> "${m[0]}"`);
      problems++;
    }
  }
}
walk(join(root, "src"));

// 3. Images must have alt text
function imgs(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) imgs(p);
    else if (/\.tsx$/.test(f)) {
      const t = readFileSync(p, "utf8");
      for (const m of t.matchAll(/<(img|Image)\b[^>]*>/g)) {
        if (!/\balt=/.test(m[0])) {
          console.log(`ALT      ${p.replace(root, "")}: <img> without alt`);
          problems++;
        }
      }
    }
  }
}
imgs(join(root, "src"));

console.log(problems ? `\n${problems} issue(s). Not ready to launch.` : "\nNo launch blockers found by this script (it does not replace legal and clinical review).");
process.exit(problems ? 1 : 0);
