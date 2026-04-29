/**
 * When Vercel Root Directory is the Git repo root, the Next.js builder expects
 * `.next` here. The real app lives in NoteFlow/src/frontend — copy output after build.
 */
const fs = require("fs");
const path = require("path");

const src = path.join("NoteFlow", "src", "frontend", ".next");
const dest = path.join(".next");

if (!fs.existsSync(src)) {
  console.error(`sync-next-output: missing ${src} — run Next build in NoteFlow/src/frontend first`);
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
console.log(`sync-next-output: copied ${src} -> ${dest}`);
