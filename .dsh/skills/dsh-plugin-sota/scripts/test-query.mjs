#!/usr/bin/env node
// Regression tests for `query.mjs search`. A search that returns rows which
// do not match the query is worse than no search: agents are told to query the
// catalog first and to trust what comes back.
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const QUERY = path.join(path.dirname(fileURLToPath(import.meta.url)), 'query.mjs')
const failures = []

function search(...args) {
  const run = spawnSync(process.execPath, [QUERY, 'search', ...args, '--json'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  if (run.status !== 0) { failures.push('search ' + args.join(' ') + ' exited ' + run.status + ': ' + run.stderr.slice(0, 200)); return [] }
  try { return JSON.parse(run.stdout) } catch { failures.push('search ' + args.join(' ') + ' did not print JSON'); return [] }
}
const text = (e) => (e.title + ' ' + e.description + ' ' + e.category + ' ' + (e.tags || []).join(' ')).toLowerCase()
const ids = (rows) => rows.map((e) => e.id).join(',')

// 1. A word that appears nowhere returns nothing.
const none = search('zzzznotaword', '--limit', '5')
if (none.length !== 0) failures.push('a nonsense word returned ' + none.length + ' rows: ' + ids(none))

// 2. Every returned row contains at least one of the query's words.
for (const query of ['browser automation', 'trading stock market data', 'secret credential guard', 'csv data notebook analysis']) {
  const rows = search(query, '--limit', '10')
  const words = query.split(' ')
  if (!rows.length) failures.push('"' + query + '" returned nothing')
  for (const row of rows) if (!words.some((w) => text(row).includes(w))) failures.push('"' + query + '" returned a row with none of its words: ' + row.id)
}

// 3. A quoted phrase and the same words as separate arguments agree.
if (ids(search('browser automation', '--limit', '10')) !== ids(search('browser', 'automation', '--limit', '10'))) failures.push('quoted phrase and separate words gave different results')

// 4. Unrelated queries do not return the same list.
if (ids(search('trading stock market data', '--limit', '6')) === ids(search('secret credential guard', '--limit', '6'))) failures.push('two unrelated queries returned the same rows')

// 5. Covering more of the query ranks first.
const top = search('browser automation', '--limit', '1')[0]
if (top && !(text(top).includes('browser') && text(top).includes('automation'))) failures.push('top result for "browser automation" does not contain both words: ' + top.id)

// 6. Filters still apply to a search.
for (const row of search('memory', '--npm-only', '--limit', '10')) if (!row.npm) failures.push('--npm-only returned a GitHub-only row: ' + row.id)

// 7. No terms still lists the catalog.
if (!search('--limit', '3').length) failures.push('a search with no terms returned nothing')

if (failures.length) {
  for (const f of failures) console.error('FAIL ' + f)
  process.exit(1)
}
console.log('Query tests: PASS (no-match is empty, rows match the query, phrase equals words, queries differ, coverage ranks first, filters apply)')
