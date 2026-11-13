// WCAG 2.2 contrast check for the colour pairs the site actually uses.
// Run: npm run check:contrast   (exits 1 if any pair fails)
const pairs = [
  // [label, foreground, background, minimum ratio]
  ["body text on page", "#2a1f25", "#fffaf7", 4.5],
  ["body text on white card", "#2a1f25", "#ffffff", 4.5],
  ["muted text on page", "#5a4850", "#fffaf7", 4.5],
  ["muted text on cream", "#5a4850", "#fbf1ea", 4.5],
  ["muted text on blush (hero)", "#5a4850", "#fce7ed", 4.5],
  ["muted text on white", "#5a4850", "#ffffff", 4.5],
  ["link on page", "#8a1241", "#fffaf7", 4.5],
  ["link on white", "#8a1241", "#ffffff", 4.5],
  ["link on cream", "#8a1241", "#fbf1ea", 4.5],
  ["link on blush", "#8a1241", "#fce7ed", 4.5],
  ["button text (white on rose)", "#ffffff", "#a3174f", 4.5],
  ["button hover (white on rose-dark)", "#ffffff", "#7d1039", 4.5],
  ["secondary button text on white", "#8a1241", "#ffffff", 4.5],
  ["secondary button hover on blush", "#7d1039", "#fce7ed", 4.5],
  ["tag text on blush", "#7d1039", "#fce7ed", 4.5],
  ["info notice", "#12365c", "#eaf2fb", 4.5],
  ["warn notice", "#4a3500", "#fff4d6", 4.5],
  ["urgent notice", "#6b1414", "#fde8e8", 4.5],
  ["ok notice", "#11442a", "#e6f5ec", 4.5],
  ["correct option", "#11442a", "#e6f5ec", 4.5],
  ["wrong option", "#6b1414", "#fde8e8", 4.5],
  ["selected option text", "#2a1f25", "#fce7ed", 4.5],
  ["myth label", "#6b1414", "#ffffff", 4.5],
  ["footer text", "#f6e9ee", "#2a1f25", 4.5],
  ["footer link", "#ffd3e1", "#2a1f25", 4.5],
  ["footer link hover", "#ffffff", "#2a1f25", 4.5],
  ["skip link", "#ffffff", "#2a1f25", 4.5],
  ["big score text", "#8a1241", "#ffffff", 3],
  ["focus ring vs page", "#14467a", "#fffaf7", 3],
  ["focus ring vs white", "#14467a", "#ffffff", 3],
  ["focus ring inside footer (white)", "#ffffff", "#2a1f25", 3],
  ["input border vs white (UI 3:1)", "#8b6b77", "#ffffff", 3],
  ["rose border on white (UI 3:1)", "#a3174f", "#ffffff", 3],
  ["card border vs page (decorative)", "#e7d5db", "#fffaf7", 1],
];

function lum(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a, b) {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

let failed = 0;
for (const [label, fg, bg, min] of pairs) {
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${r.toFixed(2).padStart(5)}:1  (needs ${min})  ${label}  ${fg} on ${bg}`);
}
console.log(failed ? `\n${failed} pair(s) FAILED` : "\nAll pairs pass.");
process.exit(failed ? 1 : 0);
