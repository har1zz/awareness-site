"use client";

import { useId, useState } from "react";
import type { Myth } from "@/content/myths";
import { getSources } from "@/content/sources";

export function MythCards({ myths }: { myths: Myth[] }) {
  return (
    <div className="myth-grid">
      {myths.map((m) => (
        <MythCard key={m.id} myth={m} />
      ))}
    </div>
  );
}

function MythCard({ myth }: { myth: Myth }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="myth-card">
      <button
        type="button"
        className="myth-q"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="label">Myth</span>
        <br />
        <strong>{myth.myth}</strong>
        <br />
        <span className="hint">
          {open ? "Hide the fact" : "Show the fact"}
        </span>
      </button>
      <div id={id} hidden={!open} className="answer">
        <span className="label">Fact</span>
        <p>{myth.fact}</p>
        <p className="hint" style={{ color: "inherit" }}>
          Sources:{" "}
          {getSources(myth.sources).map((s, i) => (
            <span key={s.id}>
              {i > 0 ? "; " : ""}
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.org}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
