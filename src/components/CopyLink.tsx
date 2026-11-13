"use client";

import { useState } from "react";

export function CopyLink({ path }: { path: string }) {
  const [state, setState] = useState<"idle" | "ok" | "fail">("idle");
  async function copy() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${path}`);
      setState("ok");
    } catch {
      setState("fail");
    }
  }
  return (
    <span>
      <button type="button" className="btn secondary" onClick={copy}>
        Copy link to this page
      </button>{" "}
      <span role="status" className="hint">
        {state === "ok" ? "Link copied." : state === "fail" ? "Could not copy. Copy the address from your browser instead." : ""}
      </span>
    </span>
  );
}
