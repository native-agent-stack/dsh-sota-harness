#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..', '..');
const adrDir = path.join(root, 'docs', 'adr');
const catalogPath = path.join(adrDir, 'CATALOG.md');

if (!fs.existsSync(catalogPath)) {
  console.error('[ADR-CATALOG FAIL] Missing docs/adr/CATALOG.md');
  process.exit(1);
}

const catalogText = fs.readFileSync(catalogPath, 'utf8');
const adrFiles = fs
  .readdirSync(adrDir)
  .filter((f) => /^ADR-\d{4}-.*\.md$/.test(f))
  .sort();

if (adrFiles.length < 3) {
  console.error(`[ADR-CATALOG FAIL] Expected >=3 ADR files, found ${adrFiles.length}`);
  process.exit(1);
}

for (const file of adrFiles) {
  if (!catalogText.includes(`(${file})`)) {
    console.error(`[ADR-CATALOG FAIL] ${file} is not indexed in docs/adr/CATALOG.md`);
    process.exit(1);
  }
  const body = fs.readFileSync(path.join(adrDir, file), 'utf8');
  if (!/Status:\*\*\s*Accepted/i.test(body) && !/Status:\s*Accepted/i.test(body)) {
    console.error(`[ADR-CATALOG FAIL] ${file} missing Accepted status header`);
    process.exit(1);
  }
}

const tracked = execFileSync('git', ['-C', root, 'ls-files'], { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean);

const leakPatterns = [
  { name: 'Alpaca Paper Account ID', re: /\bPA[0-9A-Z]{10}\b/ },
  { name: 'IBKR Paper Account ID', re: /\bDU[0-9]{7,9}\b/ },
  { name: 'Alpaca API Key', re: /\b(?:AK|PK)[0-9A-Z]{18,24}\b/ },
  { name: 'Concrete macOS Home Path', re: /\/Users\/(?!<)[A-Za-z0-9._-]+\// },
];

for (const rel of tracked) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full) || fs.statSync(full).isDirectory()) continue;
  const content = fs.readFileSync(full, 'utf8');
  for (const { name, re } of leakPatterns) {
    if (re.test(content)) {
      console.error(`[PRIVACY-GATE FAIL] ${name} matched in ${rel}`);
      process.exit(1);
    }
  }
}

console.log(`[ADR-CATALOG PASS] ${adrFiles.length}/${adrFiles.length} MADR ADRs indexed and ${tracked.length} tracked files zero-leak verified.`);
