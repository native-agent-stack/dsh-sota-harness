#!/usr/bin/env node
/**
 * Negative tests for validate-docs.mjs: a stale executive distribution bullet
 * and a stale npm match rate must fail.
 */
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SCRIPT = path.join(ROOT, 'scripts', 'validate-docs.mjs')
const HTML_SCRIPT = path.join(ROOT, 'scripts', 'build-html.py')
const DOCS = process.env.DSH_DOCS_DIR ? path.resolve(process.env.DSH_DOCS_DIR) : path.resolve(ROOT, '../../../docs/plugin-landscape')
const HTML = path.join(DOCS, 'final-manifest.html')
const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'dsh-doc-tests-'))
const dataDir = path.join(tmp, 'data')
await fs.mkdir(dataDir, { recursive: true })
const report = path.join(tmp, 'report.md')
const landscape = path.join(tmp, 'landscape.md')
const coverage = path.join(tmp, 'coverage.md')
const architecture = path.join(tmp, 'architecture.md')
const htmlCopy = path.join(tmp, 'final-manifest.html')

async function copy(from, to) { await fs.copyFile(path.isAbsolute(from) ? from : path.join(ROOT, from), to) }
await Promise.all([
  copy('data/stats.json', path.join(dataDir, 'stats.json')),
  copy('data/catalog.jsonl', path.join(dataDir, 'catalog.jsonl')),
  copy('data/index-only.json', path.join(dataDir, 'index-only.json')),
  copy('references/landscape.md', landscape),
  copy('references/architecture.md', architecture),
  copy(path.join(DOCS, 'README.md'), report),
  copy(path.join(DOCS, 'coverage.md'), coverage),
])

const stats = JSON.parse(await fs.readFile(path.join(dataDir, 'stats.json'), 'utf8'))
const top = [...stats.categories].sort((a, b) => b.count - a.count || a.title.localeCompare(b.title))[0]
const topLine = '- ' + top.title + ': ' + Number(top.count).toLocaleString('en-US') + ' entries'
const staleTopLine = '- ' + top.title + ': ' + Number(top.count + 1).toLocaleString('en-US') + ' entries'
const rate = String(stats.totals.npmMatchRate) + '%'
const staleRate = (Number(stats.totals.npmMatchRate) + 0.1).toFixed(1) + '%'

const env = {
  ...process.env,
  DSH_DOCS_DATA_DIR: dataDir,
  DSH_DOCS_REPORT: report,
  DSH_DOCS_LANDSCAPE: landscape,
  DSH_DOCS_COVERAGE: coverage,
  DSH_DOCS_ARCHITECTURE: architecture,
}
function mutate(text, from, to, name) {
  const next = text.replace(from, to)
  if (next === text) throw new Error(name + ' fixture is a no-op: ' + from)
  return next
}
function run() {
  const r = spawnSync(process.execPath, [SCRIPT], { encoding: 'utf8', env })
  return { status: r.status, output: (r.stdout || '') + (r.stderr || '') }
}
const failures = []
function expect(name, result, text) {
  if (result.status === 0) failures.push(name + ': expected non-zero exit\n' + result.output)
  else if (!result.output.includes(text)) failures.push(name + ': missing error ' + text + '\n' + result.output)
  else console.log('PASS ' + name)
}
function runHtmlCheck(target) {
  const r = spawnSync('python3', [HTML_SCRIPT, '--check', target], { encoding: 'utf8' })
  return { status: r.status, output: (r.stdout || '') + (r.stderr || '') }
}

const htmlBase = runHtmlCheck(HTML)
if (htmlBase.status !== 0) failures.push('HTML current: expected exit 0\n' + htmlBase.output)
else console.log('PASS html current')

const htmlText = await fs.readFile(HTML, 'utf8')
const listedText = Number(stats.totals.entries).toLocaleString('en-US')
const staleListed = Number(stats.totals.entries - 1).toLocaleString('en-US')
await fs.writeFile(htmlCopy, mutate(htmlText, listedText, staleListed, 'html-count'))
expect('stale HTML fails', runHtmlCheck(htmlCopy), 'HTML is stale')

const base = run()
if (base.status !== 0) failures.push('baseline: expected exit 0\n' + base.output)
else console.log('PASS baseline')

const original = await fs.readFile(report, 'utf8')
await fs.writeFile(report, mutate(original, topLine, staleTopLine, 'distribution'))
expect('stale distribution bullet fails', run(), 'Report distribution block does not match stats')
await fs.writeFile(report, original)

const l0 = original.split('\n').find((line) => line.startsWith('| L0 Distribution & Composition |'))
if (!l0) throw new Error('L0 report row not found')
const l0Bad = l0.replace(/\| ([\d,]+) \|$/, (m, n) => '| ' + (Number(n.replace(/,/g, '')) + 1).toLocaleString('en-US') + ' |')
if (l0Bad === l0) throw new Error('layer-row fixture is a no-op')
await fs.writeFile(report, original.replace(l0, l0Bad))
expect('stale layer row fails', run(), 'Report layer row mismatch: L0')
await fs.writeFile(report, original)

await fs.writeFile(report, mutate(original, rate, staleRate, 'match-rate'))
expect('stale match rate fails', run(), 'Report has stale npm match rate ' + staleRate)
await fs.writeFile(report, original)

const unrelated = original.replace('That concentration is useful,', '- Unrelated metric: 95.0%\n\nThat concentration is useful,')
if (unrelated === original) throw new Error('unrelated-percentage fixture is a no-op')
await fs.writeFile(report, unrelated)
const unrelatedRun = run()
if (unrelatedRun.status !== 0) failures.push('unrelated decimal should be ignored\n' + unrelatedRun.output)
else console.log('PASS unrelated decimal is ignored')
await fs.writeFile(report, original)

const restored = run()
if (restored.status !== 0) failures.push('restored: expected exit 0\n' + restored.output)
else console.log('PASS restored')

await fs.rm(tmp, { recursive: true, force: true })
if (failures.length) {
  for (const f of failures) console.error('FAIL ' + f)
  process.exit(1)
}
console.log('Doc tests: stale distribution, layer, rate, and HTML fail; unrelated decimal ignored; exact docs pass')
