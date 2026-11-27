// Atlas in Numbers — hand-in program (Node 22, standard library only).
//
// The site itself is the app/ folder next to this file: plain static files
// (HTML, CSS and classic scripts, no build step, nothing loaded over the
// network). This program delivers it: it copies app/ and screenshots/ into
// the output directory and writes dossier.json there with the vendored
// make.fun library. vendor/makefun-frontend.ts stays exactly as the kit
// shipped it — the scorer requires dossier.json to be byte for byte what
// its own copy of the library writes.
//
// Preview locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's caps: text_max_bytes shapes the dossier bytes; the rest refuse
// an entry the scorer would refuse anyway (over 4 screenshots, one screenshot
// over 256 KiB, app/ over 993 entries or 16 MiB).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
