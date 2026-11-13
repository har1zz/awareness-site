import { Notice } from "./Parts";

/**
 * Short status messages shown after a redirect (?m=code or ?e=code).
 * Only codes listed here are ever shown, so nobody can put their own text on our pages.
 */
const messages: Record<string, { kind: "ok" | "info" | "warn" | "urgent"; text: string }> = {
  check_email: {
    kind: "ok",
    text: "Almost done. If the details are valid, we have sent a confirmation link to your email. Open it to finish creating your account, then sign in.",
  },
  reset_sent: {
    kind: "ok",
    text: "If an account exists for that email, a password reset link is on its way.",
  },
  password_updated: { kind: "ok", text: "Your password was changed." },
  signed_out: { kind: "ok", text: "You are signed out." },
  account_deleted: { kind: "ok", text: "Your account and the data linked to it were deleted." },
  application_sent: {
    kind: "ok",
    text: "Your application was sent. The site administrator will review it. You can see its status on this page.",
  },
  application_updated: { kind: "ok", text: "Your application was updated and sent for review again." },
  video_submitted: {
    kind: "ok",
    text: "Your video was submitted. It stays private until the administrator reviews and approves it.",
  },
  video_updated: { kind: "ok", text: "Your changes were saved and the video is back in the review queue." },
  video_withdrawn: { kind: "ok", text: "The video was withdrawn and is no longer public." },
  story_sent: {
    kind: "ok",
    text: "Thank you. Your story was received. It will only be published after an editor has reviewed it.",
  },
  message_sent: { kind: "ok", text: "Thank you. Your message was sent." },
  saved: { kind: "ok", text: "Saved." },
  deleted: { kind: "ok", text: "Deleted." },
  invalid_login: {
    kind: "urgent",
    text: "That email and password did not match, or the email has not been confirmed yet.",
  },
  link_invalid: {
    kind: "urgent",
    text: "That link is invalid or has expired. Please request a new one.",
  },
  decided: { kind: "ok", text: "Decision saved and recorded in the audit log." },
  need_message: { kind: "urgent", text: "Please write a message for this decision. The contributor will see it." },
  changed: {
    kind: "urgent",
    text: "This item changed while you were reviewing it (or was already decided). Please review the latest version below and decide again.",
  },
  failed: { kind: "urgent", text: "That did not work. Please try again." },
  not_allowed: { kind: "urgent", text: "You do not have access to that." },
  closed: {
    kind: "warn",
    text: "This is not open yet. Please check back later.",
  },
};

export function Flash({ code }: { code?: string | string[] }) {
  const c = Array.isArray(code) ? code[0] : code;
  const m = c ? messages[c] : undefined;
  if (!m) return null;
  return (
    <Notice kind={m.kind} role={m.kind === "urgent" ? "alert" : "status"}>
      <p>{m.text}</p>
    </Notice>
  );
}
