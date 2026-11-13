"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { steps, outcomes } from "@/content/tool";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { href } from "@/lib/paths";

export function NextSteps({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [trail, setTrail] = useState<string[]>(["start"]);
  const [outcome, setOutcome] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const current = trail[trail.length - 1];
  const step = steps[current];

  // Move focus to the new question/result so keyboard + screen-reader users
  // are not left on a button that has disappeared.
  useEffect(() => {
    headingRef.current?.focus();
  }, [current, outcome]);

  function choose(next: string) {
    if (next.startsWith("out:")) setOutcome(next.slice(4));
    else setTrail((t) => [...t, next]);
  }
  function back() {
    if (outcome) setOutcome(null);
    else setTrail((t) => (t.length > 1 ? t.slice(0, -1) : t));
  }
  function restart() {
    setOutcome(null);
    setTrail(["start"]);
  }

  const result = outcome ? outcomes[outcome] : null;

  return (
    <div className="panel" aria-live="polite">
      {result ? (
        <div>
          <div className={`notice ${result.kind}`} role={result.kind === "urgent" ? "alert" : "status"}>
            <h2 tabIndex={-1} ref={headingRef} style={{ marginTop: 0, fontSize: "1.4rem" }}>
              {result.title}
            </h2>
            {result.body.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
          <ul>
            {result.links.map((l) => (
              <li key={l.slug}>
                <Link href={href(locale, l.slug)}>{l.label}</Link>
              </li>
            ))}
          </ul>
          <div className="btn-row">
            <button type="button" className="btn secondary" onClick={back}>
              {dict.tool.back}
            </button>
            <button type="button" className="btn secondary" onClick={restart}>
              {dict.tool.restart}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 tabIndex={-1} ref={headingRef} style={{ marginTop: 0, fontSize: "1.3rem" }}>
            {step.question}
          </h2>
          {step.help ? <p className="hint">{step.help}</p> : null}
          <ul className="choice-list">
            {step.choices.map((c) => (
              <li key={c.label}>
                <button type="button" className="btn secondary" onClick={() => choose(c.next)}>
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
          {trail.length > 1 ? (
            <button type="button" className="btn secondary" onClick={back}>
              {dict.tool.back}
            </button>
          ) : null}
        </div>
      )}
      <p className="hint" style={{ marginTop: "1.25rem" }}>
        {dict.quiz.noStorage}
      </p>
    </div>
  );
}
