// Run this ON YOUR OWN COMPUTER (the build sandbox cannot reach these sites):
//   npm run check:links
// Opens every external URL in the source registry and support directory and
// reports its HTTP status. Fix or remove any that fail, then record the date
// in src/content/support.ts (`verified`) and src/content/sources.ts.
import { readFileSync } from "node:fs";

const files = ["src/content/sources.ts", "src/content/support.ts"];
const urls = new Set();
for (const f of files) {
  for (const m of readFileSync(new URL(`../${f}`, import.meta.url), "utf8").matchAll(/https?:\/\/[^"'\s)]+/g)) {
    urls.add(m[0]);
  }
}
let bad = 0;
for (const u of urls) {
  try {
    const r = await fetch(u, { redirect: "follow", headers: { "user-agent": "Mozilla/5.0 link-check" }, signal: AbortSignal.timeout(20000) });
    const ok = r.status >= 200 && r.status < 400;
    if (!ok) bad++;
    console.log(`${ok ? "OK  " : "FAIL"} ${r.status} ${u}`);
  } catch (e) {
    bad++;
    console.log(`FAIL ERR ${u} (${e.message})`);
  }
}
console.log(bad ? `\n${bad} link(s) need attention` : "\nAll links responded.");
process.exit(bad ? 1 : 0);
