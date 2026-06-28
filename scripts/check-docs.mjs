import { existsSync, readFileSync } from "node:fs";

const requiredFiles = [
  "AGENTS.md",
  "ARCHITECTURE.md",
  "docs/architecture/LAYERS.md",
  "docs/product-specs/GAMEPLAY.md",
  "docs/product-specs/ROSTER.md",
  "docs/development/WORKFLOW.md",
  "docs/SECURITY.md",
  "docs/golden-principles/SIMULATION.md",
  "docs/golden-principles/DATA_CANON.md",
  "docs/golden-principles/UI_TEXT.md"
];

const missing = requiredFiles.filter((file) => !existsSync(file));

if (missing.length > 0) {
  console.error("Missing required documentation files:");
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

for (const file of requiredFiles) {
  const body = readFileSync(file, "utf8").trim();
  if (body.length < 120) {
    console.error(`Documentation file is too thin to be useful: ${file}`);
    process.exit(1);
  }
}

console.log(`Documentation check passed (${requiredFiles.length} files).`);

