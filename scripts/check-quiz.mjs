// Validates the quiz bank and proves scoring is correct under shuffling.
// Needs a running server (see e2e.mjs). Node 22+ strips TS types natively.
import { createRequire } from "node:module";
import { quiz } from "../src/content/quiz.ts";
import { sources } from "../src/content/sources.ts";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const BASE = process.env.BASE ?? "http://localhost:3100";
let failures = 0;
const fail = (m) => { failures++; console.log("FAIL ", m); };

// ---- static validation of the bank ----
const ids = new Set();
const levels = { easy: 0, intermediate: 0, advanced: 0 };
for (const q of quiz) {
  if (ids.has(q.id)) fail(`duplicate id ${q.id}`);
  ids.add(q.id);
  levels[q.level]++;
  if (q.options.length !== 4 || new Set(q.options).size !== 4) fail(`${q.id}: need 4 distinct options`);
  if (!(q.answer >= 0 && q.answer <= 3)) fail(`${q.id}: bad answer index`);
  if (!q.explanation || q.explanation.length < 20) fail(`${q.id}: explanation missing`);
  if (!q.sources.length) fail(`${q.id}: no source`);
  for (const s of q.sources) if (!sources[s]) fail(`${q.id}: unknown source ${s}`);
}
const dist = [0, 0, 0, 0];
quiz.forEach((q) => dist[q.answer]++);
console.log(`questions=${quiz.length} levels=${JSON.stringify(levels)} correct-answer position counts=${dist}`);
if (quiz.length < 25) fail("fewer than 25 questions");
if (Math.max(...dist) > quiz.length * 0.4) fail("correct answers cluster in one position (guessable)");

// ---- scoring under shuffle ----
const byQ = new Map(quiz.map((q) => [q.q, q]));
const browser = await chromium.launch();
const page = await browser.newPage();

async function run(mode) {
  await page.goto(`${BASE}/en/quiz`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Start quiz" }).click();
  let n = 0;
  while (await page.locator("input[type=radio]").count()) {
    const text = (await page.locator("legend").innerText()).trim();
    const q = byQ.get(text);
    if (!q) { fail(`question text not in bank: ${text}`); break; }
    const want = mode === "right" ? q.options[q.answer] : q.options[(q.answer + 1) % 4];
    await page.locator("label.option", { hasText: want }).first().locator("input").check();
    await page.getByRole("button", { name: "Check answer" }).click();
    await page.getByRole("button", { name: /Next question|See results/ }).click();
    n++;
  }
  const score = (await page.locator(".score-big").innerText()).replace(/\s/g, "");
  return { n, score };
}
const right = await run("right");
if (right.score !== "30/30") fail(`all-correct run scored ${right.score}`);
const wrong = await run("wrong");
if (wrong.score !== "0/30") fail(`all-wrong run scored ${wrong.score}`);
console.log(`all-correct: ${right.score}   all-wrong: ${wrong.score}`);

// order differs between two attempts (randomised)
const order = async () => {
  await page.goto(`${BASE}/en/quiz`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Start quiz" }).click();
  return (await page.locator("legend").innerText()).trim();
};
const firsts = new Set();
for (let i = 0; i < 6; i++) firsts.add(await order());
if (firsts.size < 2) fail("question order did not vary across 6 attempts");

await browser.close();
console.log(failures ? `\n${failures} failure(s)` : "\nQuiz checks passed.");
process.exit(failures ? 1 : 0);
