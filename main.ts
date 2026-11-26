// NusaStat — main.ts
// Entrypoint for the make.fun entry. Node 22, stdlib only.
//
// Copies app/ and screenshots/ from beside this file into the output
// directory (env MAKEFUN_OUTPUT_DIR, default /output), then writes
// /output/dossier.json with buildDossier from ./vendor/makefun-frontend.ts.
//
// It never deletes the output folder itself — only writes into it
// (the grader mounts it, so deleting it fails with EBUSY).

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

const caps = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

function copyTree(name: string): void {
  const src = join(here, name);
  const dst = join(outDir, name);
  if (!existsSync(src)) {
    throw new Error(`main.ts: missing ${name}/ beside main.ts`);
  }
  mkdirSync(outDir, { recursive: true });
  cpSync(src, dst, { recursive: true, force: true });
}

copyTree("app");
copyTree("screenshots");

const dossier = buildDossier(outDir, caps);
writeFileSync(join(outDir, "dossier.json"), dossier);

// The dossier is the single source of truth for the entry: report its
// size so a failed or truncated build is obvious from the log alone.
console.log(`NusaStat: wrote ${outDir} (dossier ${dossier.length} bytes)`);
