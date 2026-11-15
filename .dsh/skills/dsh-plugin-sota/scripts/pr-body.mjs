#!/usr/bin/env node
/** Build the scheduled refresh pull-request body from stats.json. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const stats = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'stats.json'), 'utf8'))
const out = process.argv[2] || 'pr-body.md'
const lines = [
  'Automated upstream refresh from the awesome-dsh-plugin README and npm index.',
  '',
  '- Listed entries: ' + stats.totals.entries,
  '- npm-indexed: ' + stats.totals.npmIndexed,
  '- GitHub-only: ' + stats.totals.githubOnly,
  '- Categories: ' + stats.categories.length,
  '- Index-only: ' + stats.coverage.indexOnly,
  '',
  'Validated with the session brief, offline catalog guard, anchors, doc drift, HTML freshness, theme check, and docs validator.',
  '',
  'Review count and anchor changes before merging.',
]
fs.writeFileSync(out, lines.join('\n') + '\n')
console.log('Wrote ' + out)
