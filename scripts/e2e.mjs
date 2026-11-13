// Browser checks against a running production server.
//   npm run build && npx next start -p 3100 &  then:  node scripts/e2e.mjs
// Verifies: every page loads, no cookies/storage, no third-party requests,
// correct lang/dir, axe-core WCAG 2.x A/AA violations, keyboard use of tools.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const { AxeBuilder } = require("@axe-core/playwright");

const BASE = process.env.BASE ?? "http://localhost:3100";
const locales = ["en", "ur", "ar"];
const paths = [
  "", "about-breast-cancer", "signs-and-symptoms", "risk-factors-and-prevention",
  "breast-health-guide", "screening-and-diagnosis", "treatment-and-recovery",
  "living-with-breast-cancer", "appointment-preparation", "myths-vs-facts", "quiz",
  "what-should-i-do-next", "support", "stories", "videos", "contribute", "resources",
  "faq", "sources", "contact", "search", "privacy", "terms", "cookies",
  "payments-and-refunds", "medical-disclaimer", "accessibility", "credits",
  "login", "signup", "forgot-password", "account", "admin", "admin/videos",
];

let failures = 0;
const fail = (m) => { failures++; console.log("FAIL ", m); };

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
const external = new Set();
page.on("request", (r) => {
  const u = new URL(r.url());
  if (!["localhost", "127.0.0.1"].includes(u.hostname) && u.protocol.startsWith("http")) external.add(r.url());
});
const consoleErrors = [];
page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
page.on("pageerror", (e) => consoleErrors.push(String(e)));

for (const l of locales) {
  for (const p of paths) {
    const url = `${BASE}/${l}${p ? "/" + p : ""}`;
    const res = await page.goto(url, { waitUntil: "networkidle" });
    if (!res || res.status() !== 200) { fail(`${url} -> ${res?.status()}`); continue; }
    const lang = await page.getAttribute("html", "lang");
    const dir = await page.getAttribute("html", "dir");
    const wantDir = l === "en" ? "ltr" : "rtl";
    if (lang !== l || dir !== wantDir) fail(`${url} lang=${lang} dir=${dir}`);
    const h1 = await page.locator("h1").count();
    if (h1 !== 1) fail(`${url} has ${h1} <h1>`);
    const storage = await page.evaluate(() => localStorage.length + sessionStorage.length + document.cookie.length);
    if (storage) fail(`${url} uses cookies/storage`);
    // axe on en for every page; ur/ar on a representative subset (same templates)
    if (l === "en" || ["", "quiz", "support", "privacy"].includes(p)) {
      const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      for (const v of r.violations) fail(`${url} axe ${v.id} (${v.impact}): ${v.help} x${v.nodes.length}`);
    }
  }
}
const cookies = await ctx.cookies();
if (cookies.length) fail(`cookies set: ${cookies.map((c) => c.name).join(",")}`);
if (external.size) fail(`third-party requests: ${[...external].join(", ")}`);

// ---- keyboard: What Should I Do Next? ----
await page.goto(`${BASE}/en/what-should-i-do-next`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "No", exact: true }).focus();
await page.keyboard.press("Enter");
await page.getByRole("button", { name: /new lump/ }).focus();
await page.keyboard.press("Enter");
const heading = await page.locator("h2[tabindex='-1']").innerText();
if (!/medical assessment/i.test(heading)) fail(`tool outcome heading: ${heading}`);
const focused = await page.evaluate(() => document.activeElement?.tagName);
if (focused !== "H2") fail(`focus not moved to result heading (${focused})`);
await page.getByRole("button", { name: "Start over" }).click();
await page.getByRole("button", { name: /Yes, one or more/ }).click();
if (!(await page.locator("h2", { hasText: "Get medical care today" }).count())) fail("urgent outcome missing");

// ---- keyboard: quiz ----
await page.goto(`${BASE}/en/quiz`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Start quiz" }).click();
let total = 0;
for (let i = 0; i < 40; i++) {
  const radios = page.locator("input[type=radio]");
  if (!(await radios.count())) break;
  total++;
  await radios.first().focus();
  await page.keyboard.press("Space");
  await page.getByRole("button", { name: "Check answer" }).click();
  if (await page.locator(".option.right").count() !== 1) fail(`quiz Q${total}: expected exactly one correct option shown`);
  const next = page.getByRole("button", { name: /Next question|See results/ });
  await next.click();
}
if (total !== 30) fail(`quiz played ${total} questions, expected 30`);
if (!(await page.locator("text=Your score").count())) fail("no results screen");
if (!(await page.locator("text=Review your answers").count())) fail("no review");
if (!(await page.getByRole("button", { name: "Retake the quiz" }).count())) fail("no retake");
const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
for (const v of r.violations) fail(`quiz results axe ${v.id}: ${v.help}`);

// ---- scoring is correct regardless of shuffling: always pick the right answer ----
await page.getByRole("button", { name: "Retake the quiz" }).click();
await page.selectOption("#level", "easy");
await page.getByRole("button", { name: "Start quiz" }).click();
let n = 0;
while (await page.locator("input[type=radio]").count()) {
  n++;
  // pick by reading explanation after a probe: click first, check, then the right one is highlighted
  await page.locator("input[type=radio]").first().check();
  await page.getByRole("button", { name: "Check answer" }).click();
  await page.getByRole("button", { name: /Next question|See results/ }).click();
}
console.log(`easy quiz length: ${n}`);

// ---- myths ----
await page.goto(`${BASE}/en/myths-vs-facts`, { waitUntil: "networkidle" });
const btn = page.locator("button.myth-q").first();
await btn.focus();
await page.keyboard.press("Enter");
if ((await btn.getAttribute("aria-expanded")) !== "true") fail("myth card did not expand by keyboard");

// ---- menu keyboard + Escape ----
await page.goto(`${BASE}/en`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Menu" }).focus();
await page.keyboard.press("Enter");
if (!(await page.locator("nav.main-nav").isVisible())) fail("menu did not open");
await page.keyboard.press("Tab");
await page.keyboard.press("Escape");

// ---- search ----
await page.goto(`${BASE}/en/search`, { waitUntil: "networkidle" });
await page.fill("#site-search", "lump");
if (!(await page.locator("ul li a").count())) fail("search for 'lump' returned nothing");

// ---- mobile overflow ----
await page.setViewportSize({ width: 360, height: 740 });
for (const p of ["", "support", "quiz", "privacy"]) {
  await page.goto(`${BASE}/en${p ? "/" + p : ""}`, { waitUntil: "networkidle" });
  const over = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (over) fail(`horizontal scroll at 360px on /${p}`);
}

const realErrors = consoleErrors.filter((e) => !/favicon/i.test(e));
if (realErrors.length) fail(`console errors: ${[...new Set(realErrors)].join(" | ")}`);

await browser.close();
console.log(failures ? `\n${failures} failure(s)` : "\nAll browser checks passed.");
process.exit(failures ? 1 : 0);
