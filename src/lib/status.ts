export const videoStatus: Record<string, { label: string; tone: "pending" | "good" | "bad" | "neutral" }> = {
  pending: { label: "Waiting for review", tone: "pending" },
  changes_requested: { label: "Changes requested", tone: "pending" },
  approved: { label: "Published", tone: "good" },
  rejected: { label: "Not accepted", tone: "bad" },
  unpublished: { label: "Unpublished by the administrator", tone: "bad" },
  withdrawn: { label: "Withdrawn", tone: "neutral" },
};

export const applicationStatus: Record<string, { label: string; tone: "pending" | "good" | "bad" | "neutral" }> = {
  pending: { label: "Pending verification", tone: "pending" },
  more_info: { label: "Additional information required", tone: "pending" },
  verified: { label: "Verified", tone: "good" },
  rejected: { label: "Not approved", tone: "bad" },
  suspended: { label: "Suspended", tone: "bad" },
};

export const storyStatus: Record<string, { label: string; tone: "pending" | "good" | "bad" | "neutral" }> = {
  pending: { label: "Waiting for review", tone: "pending" },
  approved: { label: "Published", tone: "good" },
  rejected: { label: "Not published", tone: "bad" },
};

export function fmtDate(s: string | null | undefined): string {
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export function fmtDateTime(s: string | null | undefined): string {
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) + " UTC";
}
