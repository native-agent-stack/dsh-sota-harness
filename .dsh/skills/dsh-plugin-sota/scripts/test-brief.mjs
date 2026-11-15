#!/usr/bin/env node
/**
 * Negative tests for session-brief.mjs:
 * - empty DSH_DOCS_DIR => NOT READY, exit 1
 * - missing scripts/build-html.py => NOT READY, exit 1
 * - current installation => READY, exit 0
 */
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BRIEF = path.join(ROOT, 'scripts', 'session-brief.mjs')
const REAL_DOCS = path.resolve(ROOT, '../../../docs/plugin-landscape')
const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'dsh-brief-tests-'))
const failures = []

function run(script, env) {
  const r = spawnSync(process.execPath, [script], { encoding: 'utf8', env: { ...process.env, ...env } })
  return { status: r.status, output: (r.stdout || '') + (r.stderr || '') }
}
function expect(name, result, predicate, text) {
  if (result.status === 0) failures.push(name + ': expected non-zero exit\n' + result.output)
  else if (!result.output.includes(text)) failures.push(name + ': missing ' + text + '\n' + result.output)
  else console.log('PASS ' + name)
}

const base = run(BRIEF, {})
if (base.status !== 0 || !base.output.includes('READY')) failures.push('baseline: expected READY exit 0\n' + base.output)
else console.log('PASS baseline READY')

const emptyDocs = path.join(tmp, 'empty-docs')
await fs.mkdir(emptyDocs, { recursive: true })
const empty = run(BRIEF, { DSH_DOCS_DIR: emptyDocs })
expect('empty docs => NOT READY', empty, true, 'NOT READY')
if (!empty.output.includes('missing: docs/README.md, docs/final-manifest.html')) {
  failures.push('empty docs: missing expected missing-list\n' + empty.output)
}

const noRenderer = path.join(tmp, 'skill-no-renderer')
await fs.cp(ROOT, noRenderer, { recursive: true })
await fs.rm(path.join(noRenderer, 'scripts', 'build-html.py'), { force: true })
const noRender = run(path.join(noRenderer, 'scripts', 'session-brief.mjs'), { DSH_DOCS_DIR: REAL_DOCS })
expect('missing renderer => NOT READY', noRender, true, 'NOT READY')
if (!noRender.output.includes('scripts/build-html.py')) {
  failures.push('missing renderer: renderer not in missing list\n' + noRender.output)
}

await fs.rm(tmp, { recursive: true, force: true })
if (failures.length) {
  for (const f of failures) console.error('FAIL ' + f)
  process.exit(1)
}
console.log('Brief tests: READY, empty-docs failure, and missing-renderer failure all observed')
