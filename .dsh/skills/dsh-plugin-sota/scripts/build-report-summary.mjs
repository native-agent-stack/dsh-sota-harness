#!/usr/bin/env node
/**
 * Regenerate the executive-summary distribution block in the landscape report
 * from data/stats.json. The block is marker-delimited so validate-docs can
 * compare it without guessing which prose is generated.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const STATS = path.join(ROOT, 'data', 'stats.json')
const DOCS = process.env.DSH_DOCS_DIR ? path.resolve(process.env.DSH_DOCS_DIR) : path.resolve(ROOT, '../../../docs/plugin-landscape')
const REPORT = process.env.DSH_DOCS_REPORT ? path.resolve(process.env.DSH_DOCS_REPORT) : path.join(DOCS, 'README.md')
const BEGIN = '<!-- BEGIN GENERATED DISTRIBUTION -->'
const END = '<!-- END GENERATED DISTRIBUTION -->'

function block(stats) {
  const top = [...stats.categories].sort((a, b) => b.count - a.count || a.title.localeCompare(b.title)).slice(0, 7)
  return [BEGIN, ...top.map((c) => '- ' + c.title + ': ' + Number(c.count).toLocaleString('en-US') + ' entries'), END].join('\n')
}

async function main() {
  const stats = JSON.parse(await fs.readFile(STATS, 'utf8'))
  const report = await fs.readFile(REPORT, 'utf8')
  const begin = report.indexOf(BEGIN)
  const end = report.indexOf(END)
  if (begin < 0 || end < begin) throw new Error('Distribution markers not found in ' + REPORT)
  const next = report.slice(0, begin) + block(stats) + report.slice(end + END.length)
  await fs.writeFile(REPORT, next)
  console.log('Wrote executive distribution block: 7 categories; match rate remains checked against stats')
}

main().catch((e) => { console.error('build-report-summary: ' + e.message); process.exit(1) })
