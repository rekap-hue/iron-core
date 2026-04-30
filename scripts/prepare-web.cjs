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

const privacyPath = path.join(outDir, "privacypolicy.html");
const privacyHtml = `<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Ochrana soukromí — IRON CORE (Health Connect)</title>
  <style>
    body { font-family: system-ui, sans-serif; line-height: 1.45; padding: 16px; max-width: 40rem; margin: 0 auto; color: #0f172a; }
    h1 { font-size: 1.15rem; }
    h2 { font-size: 1rem; margin-top: 1.5rem; }
  </style>
</head>
<body>
  <h1>Ochrana soukromí (Health Connect)</h1>
  <p>
    Aplikace <strong>IRON CORE</strong> z Health Connect čte pouze <strong>aktivní spálené kalorie</strong> a
    <strong>hmotnost</strong>, které už ve svém zařízení ukládáte. Slouží to jen k doplnění denního zápisu v aplikaci.
    Tato data se v rámci této aplikace neodesílají na náš server (běží lokálně v zařízení).
  </p>
  <h2>Privacy policy (English)</h2>
  <p>
    <strong>IRON CORE</strong> reads only <strong>active energy burned</strong> and <strong>body weight</strong> from
    Health Connect that you already store on your device, to fill your daily log. This app does not send that health data
    to our servers; it stays on your device.
  </p>
</body>
</html>
`;
fs.writeFileSync(privacyPath, privacyHtml, "utf8");

console.log("Prepared web assets in ./web");
