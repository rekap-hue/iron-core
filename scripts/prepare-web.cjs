const fs = require("fs");
const path = require("path");

const root = process.cwd();
const outDir = path.join(root, "web");

const filesToCopy = ["index.html", "manifest.json", "sw.js"];
const optionalFiles = ["app-icon.png", "favicon.ico"];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function cleanDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const st = fs.statSync(full);
    if (st.isDirectory()) fs.rmSync(full, { recursive: true, force: true });
    else fs.unlinkSync(full);
  }
}

function copyIfExists(filename) {
  const src = path.join(root, filename);
  const dst = path.join(outDir, filename);
  if (!fs.existsSync(src)) return false;
  fs.copyFileSync(src, dst);
  return true;
}

ensureDir(outDir);
cleanDir(outDir);

for (const file of filesToCopy) {
  if (!copyIfExists(file)) {
    throw new Error(`Missing required file: ${file}`);
  }
}

for (const file of optionalFiles) {
  copyIfExists(file);
}

console.log("Prepared web assets in ./web");
