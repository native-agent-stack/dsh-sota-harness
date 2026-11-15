#!/usr/bin/env node
/**
 * Cross-check the hand-maintained report tables and generated landscape/coverage
 * against data/stats.json and data/catalog.jsonl.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATA = process.env.DSH_DOCS_DATA_DIR ? path.resolve(process.env.DSH_DOCS_DATA_DIR) : path.join(ROOT, 'data')
const DOCS = process.env.DSH_DOCS_DIR ? path.resolve(process.env.DSH_DOCS_DIR) : path.resolve(ROOT, '../../../docs/plugin-landscape')
const REPORT = process.env.DSH_DOCS_REPORT ? path.resolve(process.env.DSH_DOCS_REPORT) : path.join(DOCS, 'README.md')
const LANDSCAPE = process.env.DSH_DOCS_LANDSCAPE ? path.resolve(process.env.DSH_DOCS_LANDSCAPE) : path.join(ROOT, 'references', 'landscape.md')
const COVERAGE = process.env.DSH_DOCS_COVERAGE ? path.resolve(process.env.DSH_DOCS_COVERAGE) : path.join(DOCS, 'coverage.md')
const ARCHITECTURE = process.env.DSH_DOCS_ARCHITECTURE ? path.resolve(process.env.DSH_DOCS_ARCHITECTURE) : path.join(ROOT, 'references', 'architecture.md')

function num(s) { return Number(String(s).replace(/,/g, '')) }

async function main() {
  const [stats, catalogText, report, landscape, coverage, indexOnly, architecture] = await Promise.all([
    fs.readFile(path.join(DATA, 'stats.json'), 'utf8').then(JSON.parse),
    fs.readFile(path.join(DATA, 'catalog.jsonl'), 'utf8'),
    fs.readFile(REPORT, 'utf8'),
    fs.readFile(LANDSCAPE, 'utf8'),
    fs.readFile(COVERAGE, 'utf8'),
    fs.readFile(path.join(DATA, 'index-only.json'), 'utf8').then(JSON.parse),
    fs.readFile(ARCHITECTURE, 'utf8'),
  ])
  const catalog = catalogText.split('\n').filter(Boolean).map((line) => JSON.parse(line))
  const errors = []
  const byTitle = new Map(stats.categories.map((c) => [c.title, c]))
  const fmt = (n) => Number(n).toLocaleString('en-US')

  for (const marker of [fmt(stats.totals.entries), fmt(stats.totals.npmIndexed), fmt(stats.totals.githubOnly), fmt(stats.coverage.indexPlugins), fmt(stats.totals.entries + stats.coverage.indexOnly)]) {
    if (!report.includes(marker)) errors.push('Report missing ' + marker)
  }
  const expectedRate = String(stats.totals.npmMatchRate) + '%'
  const ratePattern = /(?:known npm version\s*\(|npm coverage is\s+|npm match rate\s*(?:is|:)?\s*)(\d+\.\d)%/gi
  const reportRates = [...report.matchAll(ratePattern)].map((m) => m[1] + '%')
  if (!reportRates.length) errors.push('Report missing npm match rate ' + expectedRate)
  for (const rate of reportRates) if (rate !== expectedRate) errors.push('Report has stale npm match rate ' + rate + ' (expected ' + expectedRate + ')')

  const BEGIN = '<!-- BEGIN GENERATED DISTRIBUTION -->'
  const END = '<!-- END GENERATED DISTRIBUTION -->'
  const b = report.indexOf(BEGIN)
  const e = report.indexOf(END)
  if (b < 0 || e < b) {
    errors.push('Report distribution markers missing')
  } else {
    const top = [...stats.categories].sort((x, y) => y.count - x.count || x.title.localeCompare(y.title)).slice(0, 7)
    const expected = [BEGIN, ...top.map((c) => '- ' + c.title + ': ' + fmt(c.count) + ' entries'), END].join('\n')
    const actual = report.slice(b, e + END.length)
    if (actual !== expected) errors.push('Report distribution block does not match stats')
  }

  const reportRows = new Map()
  for (const line of report.split('\n')) {
    if (!line.startsWith('| ')) continue
    const cells = line.split('|').slice(1, -1).map((x) => x.trim())
    if (cells.length < 4) continue
    if (!byTitle.has(cells[0])) continue
    reportRows.set(cells[0], { count: num(cells[1]), npm: num(cells[2]), layer: cells[3] })
  }
  if (reportRows.size !== stats.categories.length) errors.push('Report category rows ' + reportRows.size + ' != ' + stats.categories.length)
  for (const c of stats.categories) {
    const row = reportRows.get(c.title)
    if (!row) { errors.push('Report missing category ' + c.title); continue }
    if (row.count !== c.count || row.npm !== c.npmCount || row.layer !== c.layer) errors.push('Report row mismatch: ' + c.title)
  }

  const layerRows = new Map()
  for (const m of report.matchAll(/^\| (L\d) [^|]+ \| [^|]+ \| ([\d,]+) \| ([\d,]+) \|/gm)) {
    layerRows.set(m[1], { primary: num(m[2]), mentions: num(m[3]) })
  }
  if (layerRows.size !== stats.layers.length) errors.push('Report layer rows ' + layerRows.size + ' != ' + stats.layers.length)
  for (const l of stats.layers) {
    const row = layerRows.get(l.id)
    if (!row) { errors.push('Report missing layer ' + l.id); continue }
    if (row.primary !== l.primary || row.mentions !== l.mentions) errors.push('Report layer row mismatch: ' + l.id)
  }

  const landRows = new Map()
  const sectionRe = /^## (.+?)\n\n\*\*(\d+) entries · (\d+) npm-indexed · primary layer (L\d)/gm
  for (const m of landscape.matchAll(sectionRe)) landRows.set(m[1].trim(), { count: Number(m[2]), npm: Number(m[3]), layer: m[4] })
  if (landRows.size !== stats.categories.length) errors.push('Landscape sections ' + landRows.size + ' != ' + stats.categories.length)
  for (const c of stats.categories) {
    const row = landRows.get(c.title)
    if (!row) { errors.push('Landscape missing category ' + c.title); continue }
    if (row.count !== c.count || row.npm !== c.npmCount || row.layer !== c.layer) errors.push('Landscape row mismatch: ' + c.title)
  }
  for (const title of landRows.keys()) {
    const start = landscape.indexOf('## ' + title + '\n')
    const next = landscape.indexOf('\n---', start)
    const block = landscape.slice(start, next < 0 ? undefined : next)
    for (const heading of ['### SOTA looks like', '### Exemplars', '### Vet before adopting', '**Pitfall:**']) {
      if (!block.includes(heading)) errors.push('Landscape ' + title + ' missing ' + heading)
    }
    const exemplars = block.split('### Exemplars')[1] ? block.split('### Exemplars')[1].split('### Vet before adopting')[0] : ''
    const count = (exemplars.match(/^- \*\*/gm) || []).length
    if (count !== 3) errors.push('Landscape ' + title + ' has ' + count + ' exemplar bullets')
  }

  const coverageChecks = [
    ['Listed entries', stats.totals.entries],
    ['npm-indexed', stats.totals.npmIndexed],
    ['unique npm packages', stats.totals.uniqueNpmNames],
    ['GitHub-only', stats.totals.githubOnly],
    ['Index-only plugins (outside the listed count)', stats.coverage.indexOnly],
    ['Known universe (listed + index-only)', stats.totals.entries + stats.coverage.indexOnly],
  ]
  for (const [label, expected] of coverageChecks) {
    const line = coverage.split('\n').find((x) => x.startsWith('| ' + label + ' |'))
    if (!line) { errors.push('Coverage missing ' + label); continue }
    const value = num(line.split('|')[2])
    if (value !== expected) errors.push('Coverage ' + label + ' ' + value + ' != ' + expected)
  }

  const archLines = [
    '| Listed entries | ' + fmt(stats.totals.entries) + ' |',
    '| Index-only entries | ' + stats.coverage.indexOnly + ' |',
    '| Known universe | ' + fmt(stats.totals.entries + stats.coverage.indexOnly) + ' |',
    '| npm-indexed entries | ' + fmt(stats.totals.npmIndexed) + ' |',
    '| unique npm packages | ' + fmt(stats.totals.uniqueNpmNames) + ' |',
    '| GitHub-only entries | ' + fmt(stats.totals.githubOnly) + ' |',
    '| categories | ' + stats.totals.categories + ' |',
    '| curated exemplars | ' + stats.categories.reduce((n, c) => n + c.exemplars.length, 0) + ' |',
    '| layers | ' + stats.totals.layers + ' |',
    '| table anchors | 30 (3 per layer) |',
    '| prose anchors | ' + 36 + ' |',
    fmt(stats.coverage.indexPlugins) + ' index packages = ' + fmt(stats.totals.uniqueNpmNames) + ' unique matched packages + ' + stats.coverage.indexOnly + ' index-only packages',
  ]
  for (const line of archLines) if (!architecture.includes(line)) errors.push('Architecture manifest missing: ' + line)

  if (catalog.length !== stats.totals.entries) errors.push('Catalog count != stats')
  if ((indexOnly.entries || []).length !== stats.coverage.indexOnly) errors.push('Index-only count != stats')
  for (const e of indexOnly.entries || []) if (e.source !== 'npm-index-only') errors.push('Index-only source mismatch: ' + e.id)

  if (errors.length) {
    for (const e of errors) console.error('ERR ' + e)
    process.exit(1)
  }
  console.log('Docs: report ' + reportRows.size + '/23, layers ' + layerRows.size + '/10, landscape ' + landRows.size + '/23, coverage totals match; architecture contract matches; 3 exemplars each')
}

main().catch((e) => { console.error('validate-docs: ' + e.message); process.exit(1) })
