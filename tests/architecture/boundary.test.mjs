import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const srcRoot = "src";
const layerOrder = ["content", "domain", "simulation", "ui", "app"];
const allowedImports = {
  content: [],
  domain: ["content"],
  simulation: ["content", "domain"],
  ui: ["content", "domain", "simulation"],
  app: ["content", "domain", "simulation", "ui"]
};

const importPattern = /import\s+(?:[^'"]+\s+from\s+)?["']([^"']+)["']/g;
const violations = [];

function layerFor(filePath) {
  const parts = relative(srcRoot, filePath).split("/");
  return layerOrder.includes(parts[0]) ? parts[0] : null;
}

function targetLayer(specifier) {
  const normalized = specifier.replace(/^@?\//, "");
  const srcMatch = normalized.match(/^src\/([^/]+)/);
  if (srcMatch) return layerOrder.includes(srcMatch[1]) ? srcMatch[1] : null;

  const aliasMatch = normalized.match(/^@\/([^/]+)/);
  if (aliasMatch) return layerOrder.includes(aliasMatch[1]) ? aliasMatch[1] : null;

  return null;
}

function walk(path) {
  const stat = statSync(path);
  if (stat.isDirectory()) {
    for (const entry of readdirSync(path)) walk(join(path, entry));
    return;
  }

  if (!/\.(ts|tsx|js|jsx)$/.test(path)) return;

  const sourceLayer = layerFor(path);
  if (!sourceLayer) return;

  const text = readFileSync(path, "utf8");
  let match;
  while ((match = importPattern.exec(text))) {
    const importedLayer = targetLayer(match[1]);
    if (!importedLayer || importedLayer === sourceLayer) continue;
    if (!allowedImports[sourceLayer].includes(importedLayer)) {
      violations.push(
        `VIOLATION: ${path} imports ${match[1]} - ${sourceLayer} cannot import ${importedLayer}. See docs/architecture/LAYERS.md`
      );
    }
  }
}

if (existsSync(srcRoot)) walk(srcRoot);

if (violations.length > 0) {
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("Architecture boundary test passed.");

