"use client";

import { useEffect, useRef, useState } from "react";
import type { QuizQuestion, Level } from "@/content/quiz";
import { getSources } from "@/content/sources";
import type { Dictionary } from "@/i18n/dictionaries";

type Item = { q: QuizQuestion; order: number[] }; // order = shuffled option indices
type Answer = { picked: number | null }; // picked = ORIGINAL option index

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Quiz({ questions, dict }: { questions: QuizQuestion[]; dict: Dictionary }) {
  const d = dict.quiz;
  const [phase, setPhase] = useState<"setup" | "play" | "done">("setup");
  const [level, setLevel] = useState<Level | "all">("all");
  const [items, setItems] = useState<Item[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [checked, setChecked] = useState(false);
  const [name, setName] = useState("");
  const headRef = useRef<HTMLElement | null>(null);
  const setHead = (el: HTMLElement | null) => {
    headRef.current = el;
  };

  useEffect(() => {
    headRef.current?.focus();
  }, [phase, idx]);

  function start() {
    const pool = level === "all" ? questions : questions.filter((q) => q.level === level);
    // Randomise on click (not on render) so server and client HTML always match.
    const chosen = shuffle(pool).map((q) => ({ q, order: shuffle([0, 1, 2, 3]) }));
    setItems(chosen);
    setAnswers(chosen.map(() => ({ picked: null })));
    setIdx(0);
    setChecked(false);
    setPhase("play");
  }

  const score = items.reduce(
    (n, it, i) => n + (answers[i]?.picked === it.q.answer ? 1 : 0),
    0,
  );

  if (phase === "setup") {
    return (
      <div className="panel">
        <h2 ref={setHead} tabIndex={-1} style={{ marginTop: 0 }}>
          {d.start}
        </h2>
        <div className="field">
          <label htmlFor="level">{d.level}</label>
          <select id="level" value={level} onChange={(e) => setLevel(e.target.value as Level | "all")}>
            <option value="all">{d.all}</option>
            <option value="easy">{d.easy}</option>
            <option value="intermediate">{d.intermediate}</option>
            <option value="advanced">{d.advanced}</option>
          </select>
        </div>
        <p className="hint">{d.noStorage}</p>
        <button type="button" className="btn" onClick={start}>
          {d.start}
        </button>
      </div>
    );
  }

  if (phase === "play") {
    const it = items[idx];
    const picked = answers[idx].picked;
    const last = idx === items.length - 1;
    return (
      <div className="panel">
        <p aria-live="polite">
          {d.question} {idx + 1} {d.of} {items.length}
        </p>
        <progress className="progress" max={items.length} value={idx + (checked ? 1 : 0)}>
          {idx + 1}/{items.length}
        </progress>
        <fieldset disabled={checked}>
          <legend ref={setHead} tabIndex={-1}>
            {it.q.q}
          </legend>
          <ul className="options">
            {it.order.map((orig) => {
              const isRight = checked && orig === it.q.answer;
              const isWrong = checked && picked === orig && orig !== it.q.answer;
              const cls = `option${picked === orig ? " selected" : ""}${isRight ? " right" : ""}${isWrong ? " wrong" : ""}`;
              return (
                <li key={orig}>
                  <label className={cls}>
                    <input
                      type="radio"
                      name={`q-${it.q.id}`}
                      checked={picked === orig}
                      onChange={() =>
                        setAnswers((a) => a.map((x, i) => (i === idx ? { picked: orig } : x)))
                      }
                    />
                    <span>
                      {it.q.options[orig]}
                      {isRight ? <strong> — {d.correct}</strong> : null}
                      {isWrong ? <strong> — {d.incorrect}</strong> : null}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
        {checked ? (
          <div
            role="status"
            className={`notice ${picked === it.q.answer ? "ok" : "warn"}`}
          >
            <p>
              <strong>{picked === it.q.answer ? d.correct : d.incorrect}.</strong>{" "}
              {it.q.explanation}
            </p>
          </div>
        ) : null}
        <div className="btn-row">
          {!checked ? (
            <button
              type="button"
              className="btn"
              disabled={picked === null}
              onClick={() => setChecked(true)}
            >
              {d.check}
            </button>
          ) : (
            <button
              type="button"
              className="btn"
              onClick={() => {
                if (last) setPhase("done");
                else {
                  setIdx(idx + 1);
                  setChecked(false);
                }
              }}
            >
              {last ? d.finish : d.next}
            </button>
          )}
        </div>
      </div>
    );
  }

  const pct = Math.round((score / items.length) * 100);
  const message =
    pct >= 80
      ? "Great work. Keep learning and share what you know."
      : pct >= 50
        ? "A good start. Review the explanations below and try again."
        : "Every bit of learning helps. The explanations below are a good place to start.";

  return (
    <div>
      <div className="panel no-print">
        <h2 ref={setHead} tabIndex={-1} style={{ marginTop: 0 }}>
          {d.score}
        </h2>
        <p className="score-big">
          {score} / {items.length}
        </p>
        <p>{message}</p>
        <div className="btn-row">
          <button type="button" className="btn" onClick={() => setPhase("setup")}>
            {d.retake}
          </button>
        </div>
      </div>

      <section className="no-print" aria-labelledby="review-h">
        <h2 id="review-h">{d.review}</h2>
        <ol>
          {items.map((it, i) => {
            const p = answers[i].picked;
            const ok = p === it.q.answer;
            return (
              <li key={it.q.id}>
                <p>
                  <strong>{it.q.q}</strong>
                </p>
                <p>
                  {d.yourAnswer}: {p === null ? "—" : it.q.options[p]}{" "}
                  <strong>({ok ? d.correct : d.incorrect})</strong>
                </p>
                {!ok ? (
                  <p>
                    {d.correctAnswer}: {it.q.options[it.q.answer]}
                  </p>
                ) : null}
                <p className="hint">{it.q.explanation}</p>
                <p className="hint">
                  {getSources(it.q.sources).map((s, k) => (
                    <span key={s.id}>
                      {k > 0 ? "; " : ""}
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        {s.org}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </span>
                  ))}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="cert-h">
        <h2 id="cert-h" className="no-print">
          {d.certificate}
        </h2>
        <div className="field no-print" style={{ maxWidth: 420 }}>
          <label htmlFor="cert-name">{d.certificateName}</label>
          <input
            id="cert-name"
            type="text"
            autoComplete="off"
            value={name}
            maxLength={80}
            onChange={(e) => setName(e.target.value)}
          />
          <p className="hint">{d.noStorage}</p>
        </div>
        <div className="cert">
          <p>Breast Cancer Awareness Quiz</p>
          <h3 style={{ fontSize: "1.6rem" }}>Certificate of Participation</h3>
          <p>{name.trim() ? name.trim() : "Participant"}</p>
          <p>
            completed the awareness quiz with a score of {score} out of {items.length}.
          </p>
          <p className="hint">
            This certificate recognises participation in an educational quiz only. It is
            not a medical qualification and does not provide medical advice.
          </p>
        </div>
        <div className="btn-row no-print">
          <button type="button" className="btn secondary" onClick={() => window.print()}>
            {d.print}
          </button>
        </div>
      </section>
    </div>
  );
}
