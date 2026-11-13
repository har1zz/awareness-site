/**
 * Central site + business configuration.
 *
 * Anything marked TODO_ is a fact ONLY the site owner can supply. The legal
 * pages print these values. `npm run check:placeholders` lists every one that
 * is still unfilled and the production build warns if any remain.
 * Do NOT invent values to make the warnings go away.
 */

const TODO = (what: string) => `[TODO: ${what}]`;

export const site = {
  name: "Awareness for Everyone",
  // Working title. Change freely; it is used in the header, footer and legal pages.
  tagline: "Awareness for Everyone. Knowledge for Life.",
  // Public site address, used for canonical URLs and the sitemap.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  operator: {
    // Legal operator. The owner has said this is an individual in Pakistan.
    legalName: process.env.NEXT_PUBLIC_OPERATOR_NAME ?? TODO("your full legal name"),
    status: "an individual (sole operator), not a registered company or charity",
    country: "Pakistan",
    postalAddress:
      process.env.NEXT_PUBLIC_OPERATOR_ADDRESS ??
      TODO("a postal/contact address you are willing to publish (consider a PO box or registered business address)"),
    contactEmail:
      process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? TODO("a dedicated contact email address for this site"),
    privacyEmail:
      process.env.NEXT_PUBLIC_PRIVACY_EMAIL ??
      process.env.NEXT_PUBLIC_CONTACT_EMAIL ??
      TODO("an email address for privacy / data requests"),
  },

  // Hosting provider is a processor of visitor IP addresses (server logs).
  hosting: {
    provider:
      process.env.NEXT_PUBLIC_HOSTING_PROVIDER ?? TODO("name of your hosting provider, e.g. Vercel, Netlify, your VPS host"),
    region:
      process.env.NEXT_PUBLIC_HOSTING_REGION ?? TODO("hosting region/country"),
  },

  // Database provider (Supabase) stores accounts, applications, videos, stories and messages.
  database: {
    provider: "Supabase",
    region:
      process.env.NEXT_PUBLIC_DATABASE_REGION ?? TODO("region of your Supabase project, shown in Supabase project settings"),
  },

  // Editorial / medical review. Leave false until a qualified clinician has
  // actually reviewed the content. While false, every educational page shows
  // an honest "pending clinical review" notice. NEVER set to true without a
  // real reviewer.
  clinicalReview: {
    completed: false,
    reviewerName: process.env.NEXT_PUBLIC_REVIEWER_NAME ?? null,
    reviewerCredential: process.env.NEXT_PUBLIC_REVIEWER_CREDENTIAL ?? null,
    reviewDate: process.env.NEXT_PUBLIC_REVIEW_DATE ?? null,
  },

  // Date the draft legal pages were written. Update when you change them.
  legalLastUpdated: "13 November 2026",
  contentDraftedOn: "28 October 2026",
} as const;

export function isPlaceholder(v: string) {
  return v.startsWith("[TODO:");
}

export function unfilledPlaceholders(): string[] {
  const out: string[] = [];
  const check = (label: string, v: string) => {
    if (isPlaceholder(v)) out.push(`${label}: ${v}`);
  };
  check("operator.legalName", site.operator.legalName);
  check("operator.postalAddress", site.operator.postalAddress);
  check("operator.contactEmail", site.operator.contactEmail);
  check("operator.privacyEmail", site.operator.privacyEmail);
  check("hosting.provider", site.hosting.provider);
  check("hosting.region", site.hosting.region);
  check("database.region", site.database.region);
  return out;
}
