/**
 * extract.mjs
 * Extrai o HTML monolítico em módulos separados para o Vite.
 *
 * Saída:
 *   src/css/styles.css
 *   src/data/projects-seed.js
 *   src/data/skills-list.js
 *   src/data/mentes-data.js
 *   src/data/equipe-seed.js
 *   src/modules/supabase.js
 *   src/main.js
 *   index.html
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const DATA = path.join(SRC, 'data');
const CSS_DIR = path.join(SRC, 'css');
const MODULES = path.join(SRC, 'modules');

// ── helpers ──────────────────────────────────────────────────────────────────
function ensure(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function write(file, content) {
  fs.writeFileSync(file, content, 'utf8');
  console.log(`  ✓ ${path.relative(ROOT, file)}`);
}

// ── read source ───────────────────────────────────────────────────────────────
console.log('\n📦 Lendo imperio-hq-v5.html…');
const raw = fs.readFileSync(path.join(ROOT, 'imperio-hq-v5.html'), 'utf8');
const lines = raw.split('\n');
const total = lines.length;
console.log(`   ${total} linhas no total\n`);

// ── locate blocks (1-based line numbers from summary) ────────────────────────
// CSS is inside <style>…</style>
const cssStart = lines.findIndex(l => l.trim() === '<style>');
const cssEnd   = lines.findIndex(l => l.trim() === '</style>');
console.log(`CSS: linhas ${cssStart + 1}–${cssEnd + 1}`);

// body HTML
const bodyStart = lines.findIndex(l => l.trim() === '</style>') + 1;
// first <script> that starts the JS block
const jsStartIdx = lines.findIndex((l, i) => i > bodyStart && l.trim().startsWith('<script') && !l.includes('src='));
const jsEndIdx   = lines.findIndex((l, i) => i > jsStartIdx && l.trim() === '</script>');
console.log(`Body HTML: linhas ${bodyStart + 1}–${jsStartIdx}`);
console.log(`JS block 1: linhas ${jsStartIdx + 1}–${jsEndIdx + 1}`);

// Supabase CDN line
const supabaseCDN = lines.findIndex(l => l.includes('supabase') && l.includes('src='));
console.log(`Supabase CDN: linha ${supabaseCDN + 1}`);

// JS block 2 (after Supabase CDN)
const js2StartIdx = lines.findIndex((l, i) => i > supabaseCDN && l.trim().startsWith('<script') && !l.includes('src='));
const js2EndIdx   = lines.findIndex((l, i) => i > js2StartIdx && l.trim() === '</script>');
console.log(`JS block 2: linhas ${js2StartIdx + 1}–${js2EndIdx + 1}\n`);

// ── known data array boundaries (from analysis) ───────────────────────────────
// These are searched dynamically to be safe
function findDataArray(name) {
  const constLine = lines.findIndex(l => l.includes(`const ${name}`) && l.includes('=') && l.includes('['));
  if (constLine === -1) {
    // try 'var ' or 'let '
    const varLine = lines.findIndex(l => (l.includes(`var ${name}`) || l.includes(`let ${name}`)) && l.includes('=') && l.includes('['));
    if (varLine === -1) return null;
    return varLine;
  }
  return constLine;
}

const dataArrays = ['PROJECTS_SEED', 'SKILLS_LIST', 'MENTES_DATA', 'EQUIPE_SEED'];

// ── ensure output dirs ────────────────────────────────────────────────────────
ensure(CSS_DIR);
ensure(DATA);
ensure(MODULES);
ensure(SRC);

// ═══════════════════════════════════════════════════════════════════════════════
// 1. CSS
// ═══════════════════════════════════════════════════════════════════════════════
console.log('🎨 Extraindo CSS…');
const cssContent = lines.slice(cssStart + 1, cssEnd).join('\n');
write(path.join(CSS_DIR, 'styles.css'), cssContent);

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Data arrays
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n📊 Extraindo data arrays…');

const jsBlock1 = lines.slice(jsStartIdx + 1, jsEndIdx);

function extractDataArray(jsLines, name) {
  // find "const NAME = [" or "var NAME = ["
  const startRel = jsLines.findIndex(l =>
    (l.includes(`const ${name}`) || l.includes(`var ${name}`) || l.includes(`let ${name}`)) &&
    l.includes('=')
  );
  if (startRel === -1) return null;

  // find closing '];' accounting for nested arrays/objects
  let depth = 0;
  let endRel = startRel;
  let started = false;
  for (let i = startRel; i < jsLines.length; i++) {
    for (const ch of jsLines[i]) {
      if (ch === '[' || ch === '{') { depth++; started = true; }
      if (ch === ']' || ch === '}') depth--;
    }
    if (started && depth === 0) { endRel = i; break; }
  }

  return { startRel, endRel, lines: jsLines.slice(startRel, endRel + 1) };
}

const dataArrayRanges = {};

for (const name of dataArrays) {
  const result = extractDataArray(jsBlock1, name);
  if (!result) {
    console.warn(`  ⚠️  ${name} não encontrado`);
    continue;
  }
  // Replace 'const NAME = ' / 'var NAME = ' with 'export const NAME = '
  const arrLines = [...result.lines];
  arrLines[0] = arrLines[0]
    .replace(/^\s*(const|var|let)\s+/, 'export const ');

  const fileName = name.toLowerCase().replace(/_/g, '-') + '.js';
  write(path.join(DATA, fileName), arrLines.join('\n') + '\n');
  dataArrayRanges[name] = { startRel: result.startRel, endRel: result.endRel };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. Supabase module
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n🔌 Extraindo módulo Supabase…');

const jsBlock2 = lines.slice(js2StartIdx + 1, js2EndIdx);
const sb = jsBlock2.join('\n').trim();

// Replace createClient from CDN global with npm import
const supabaseModule =
`import { createClient } from '@supabase/supabase-js';

${sb}
`;
write(path.join(MODULES, 'supabase.js'), supabaseModule);

// ═══════════════════════════════════════════════════════════════════════════════
// 4. main.js — JS block 1 minus data arrays
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n⚙️  Extraindo main.js…');

// Build a set of relative line ranges to SKIP (the data arrays)
const skipRanges = Object.values(dataArrayRanges);

const filteredJS = jsBlock1.filter((_, i) =>
  !skipRanges.some(r => i >= r.startRel && i <= r.endRel)
);

// Collect all top-level function names to expose on window
// Note: lines may have leading whitespace and/or trailing \r (CRLF)
const fnNames = [];
const fnRegex = /^\s*function\s+(\w+)\s*\(/;
for (const line of filteredJS) {
  const m = line.replace(/\r$/, '').match(fnRegex);
  if (m) fnNames.push(m[1]);
}
console.log(`   ${fnNames.length} funções detectadas para window.*`);

// Build import header
const dataImports = dataArrays
  .filter(n => dataArrayRanges[n])
  .map(n => {
    const file = n.toLowerCase().replace(/_/g, '-');
    return `import { ${n} } from './data/${file}.js';`;
  })
  .join('\n');

const windowAssignments = fnNames
  .map(n => `window.${n} = ${n};`)
  .join('\n');

const mainContent =
`import './css/styles.css';
import './modules/supabase.js';
${dataImports}

// ─────────────────────────────────────────────────────────────────────────────
// App logic (extracted from imperio-hq-v5.html)
// ─────────────────────────────────────────────────────────────────────────────

${filteredJS.join('\n')}

// ─────────────────────────────────────────────────────────────────────────────
// Expose functions to window for inline HTML event handlers (onclick=, etc.)
// ─────────────────────────────────────────────────────────────────────────────
${windowAssignments}
`;

write(path.join(SRC, 'main.js'), mainContent);

// ═══════════════════════════════════════════════════════════════════════════════
// 5. index.html — new Vite entry
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n📄 Criando index.html…');

// Extract HTML between </style> and first <script>
// Skip </head>, <body>, and any blank lines that precede actual content
let bodyContentStart = bodyStart;
while (bodyContentStart < jsStartIdx) {
  const l = lines[bodyContentStart].replace(/\r$/, '').trim();
  if (l === '' || l === '</head>' || l === '<body>') {
    bodyContentStart++;
  } else {
    break;
  }
}
const bodyHTML = lines.slice(bodyContentStart, jsStartIdx).join('\n');

// Extract <head> meta tags (before <style>)
const headLines = lines.slice(0, cssStart);

// Build new index.html
const newIndexHTML =
`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>IMPÉRIO HQ — Marketing OS</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
</head>
<body>
${bodyHTML}
  <script type="module" src="/src/main.js"></script>
</body>
</html>
`;

write(path.join(ROOT, 'index.html'), newIndexHTML);

// ═══════════════════════════════════════════════════════════════════════════════
// Done
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n✅ Extração concluída!\n');
console.log('Próximos passos:');
console.log('  npm install');
console.log('  npm run dev');
console.log('  npm run build\n');
