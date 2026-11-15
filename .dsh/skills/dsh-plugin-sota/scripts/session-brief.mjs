#!/usr/bin/env node
/**
 * Session bootstrap for the DSH plugin landscape skill.
 * Prints a compact readiness brief and exits 0 only when the catalog, docs,
 * Python renderer, and final HTML are present.
 *
 * Optional JSON: node scripts/session-brief.mjs --json
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DOCS = process.env.DSH_DOCS_DIR ? path.resolve(process.env.DSH_DOCS_DIR) : path.resolve(ROOT, '../../../docs/plugin-landscape')
const JSON_OUT = process.argv.includes('--json')
let anchorCount = 0
let proseCount = 0
try { anchorCount = JSON.parse(await fs.readFile(path.join(ROOT, 'data', 'layer-anchors.json'), 'utf8')).anchors.length } catch {}
try { proseCount = JSON.parse(await fs.readFile(path.join(ROOT, 'data', 'reference-anchors.json'), 'utf8')).anchors.length } catch {}

const required = [
  ['data/stats.json', path.join(ROOT, 'data', 'stats.json')],
  ['data/catalog.jsonl', path.join(ROOT, 'data', 'catalog.jsonl')],
  ['data/index-only.json', path.join(ROOT, 'data', 'index-only.json')],
  ['scripts/build-html.py', path.join(ROOT, 'scripts', 'build-html.py')],
  ['docs/README.md', path.join(DOCS, 'README.md')],
  ['docs/final-manifest.html', path.join(DOCS, 'final-manifest.html')],
]
const missing = []
for (const [label, file] of required) {
  try { await fs.access(file) } catch { missing.push(label) }
}

let stats = null
try { stats = JSON.parse(await fs.readFile(path.join(ROOT, 'data', 'stats.json'), 'utf8')) } catch {}
let htmlSize = 0
try { htmlSize = (await fs.stat(path.join(DOCS, 'final-manifest.html'))).size } catch {}
const python = spawnSync('python3', ['--version'], { encoding: 'utf8' })
const pythonVersion = (python.stdout || python.stderr || 'missing').trim()
const ready = missing.length === 0 && stats && python.status === 0

const summary = {
  ready,
  skill: ROOT,
  docs: DOCS,
  snapshot: stats ? stats.generatedAt : null,
  listed: stats ? stats.totals.entries : null,
  known: stats ? stats.totals.entries + stats.coverage.indexOnly : null,
  categories: stats ? stats.totals.categories : null,
  npmIndexed: stats ? stats.totals.npmIndexed : null,
  anchors: anchorCount,
  proseAnchors: proseCount,
  exemplars: stats ? stats.categories.reduce((n, c) => n + c.exemplars.length, 0) : null,
  htmlBytes: htmlSize,
  renderer: missing.includes('scripts/build-html.py') ? 'missing' : 'ready',
  python: pythonVersion,
  themeCheck: process.env.DSH_CHROME ? 'DSH_CHROME set' : 'optional; set DSH_CHROME or let validate-themes discover Chrome',
  missing,
}

if (JSON_OUT) {
  console.log(JSON.stringify(summary, null, 2))
} else {
  console.log((ready ? 'DSH plugin landscape: READY' : 'DSH plugin landscape: NOT READY'))
  if (stats) {
    console.log('snapshot: ' + summary.snapshot)
    console.log('catalog: ' + summary.listed + ' listed / ' + summary.known + ' known / ' + summary.categories + ' categories')
    console.log('index: ' + summary.npmIndexed + ' npm-indexed; anchors: ' + summary.anchors + ' table / ' + summary.proseAnchors + ' prose; exemplars: ' + summary.exemplars)
  } else {
    console.log('catalog: stats.json missing or invalid')
  }
  console.log('docs: ' + summary.docs)
  console.log('html: ' + (htmlSize ? 'final-manifest.html (' + htmlSize.toLocaleString('en-US') + ' bytes)' : 'final-manifest.html missing'))
  console.log('renderer: scripts/build-html.py (' + summary.renderer + ')')
  console.log('python: ' + summary.python)
  console.log('theme: ' + summary.themeCheck)
  if (missing.length) console.log('missing: ' + missing.join(', '))
  console.log('next: node scripts/query.mjs search "outcome words" --limit 15')
}

process.exit(ready ? 0 : 1)
