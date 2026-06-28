import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const roots = ["AGENTS.md", "ARCHITECTURE.md", "README.md", "docs"];
const staleMarkers = ["TODO", "TBD", "FIXME", "???"];
const findings = [];

function walk(path) {
  const stat = statSync(path);
  if (stat.isDirectory()) {
    for (const entry of readdirSync(path)) walk(join(path, entry));
    return;
  }

  if (!path.endsWith(".md")) return;

  const text = readFileSync(path, "utf8");
  for (const marker of staleMarkers) {
    if (text.includes(marker)) findings.push(`${path}: contains ${marker}`);
  }
}

for (const root of roots) {
  if (statSync(root).isDirectory()) walk(root);
  else walk(root);
}

if (findings.length > 0) {
  console.error("Documentation entropy scan found issues:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log("Documentation entropy scan passed.");

