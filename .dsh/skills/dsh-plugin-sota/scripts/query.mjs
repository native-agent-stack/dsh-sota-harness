#!/usr/bin/env node
/**
 * Query the DSH plugin landscape catalog.
 *
 * Usage:
 *   node scripts/query.mjs stats
 *   node scripts/query.mjs categories
 *   node scripts/query.mjs layers
 *   node scripts/query.mjs exemplars [--category ui]
 *   node scripts/query.mjs search "browser automation" [--npm-only] [--layer L3] [--tag browser] [--limit 10]
 *   node scripts/query.mjs category ui [--limit 20]
 *   node scripts/query.mjs get <id>
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATA = path.join(ROOT, 'data')

function parseArgs(argv) {
  const opts = { json: false, limit: 10, category: null, layer: null, tag: null, npmOnly: false, githubOnly: false, terms: [] }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--json') opts.json = true
    else if (a === '--limit') opts.limit = Math.max(1, Number(argv[++i]) || 10)
    else if (a === '--category') opts.category = argv[++i]
    else if (a === '--layer') opts.layer = argv[++i]
    else if (a === '--tag') opts.tag = argv[++i]
    else if (a === '--npm-only') opts.npmOnly = true
    else if (a === '--github-only') opts.githubOnly = true
    else if (a === '--help' || a === '-h') opts.help = true
    else opts.terms.push(a)
  }
  return opts
}

async function load() {
  const [catalogText, statsText, categoriesText] = await Promise.all([
    fs.readFile(path.join(DATA, 'catalog.jsonl'), 'utf8'),
    fs.readFile(path.join(DATA, 'stats.json'), 'utf8'),
    fs.readFile(path.join(DATA, 'categories.json'), 'utf8'),
  ])
  const catalog = catalogText.split('\n').filter(Boolean).map((line) => JSON.parse(line))
  return { catalog, stats: JSON.parse(statsText), categories: JSON.parse(categoriesText) }
}

function truncate(text, n) {
  if (!text) return ''
  return text.length <= n ? text : text.slice(0, n - 1) + '…'
}

function installOf(entry) {
  return entry.install || 'github-only: ' + entry.repo
}

function printEntries(entries, opts) {
  if (opts.json) {
    console.log(JSON.stringify(entries.map((e) => ({
      id: e.id,
      title: e.title,
      category: e.categoryKey,
      layer: e.layer,
      layers: e.layers,
      tags: e.tags,
      npm: e.npm,
      install: installOf(e),
      repo: e.repo,
      description: e.description,
    })), null, 2))
    return
  }
  if (!entries.length) { console.log('No matching plugins.'); return }
  for (const e of entries) {
    const pkg = e.npm ? e.npm.name + '@' + e.npm.version : '—'
    console.log(e.title)
    console.log('  ' + e.categoryKey + ' · ' + e.layer + ' · ' + pkg)
    console.log('  ' + truncate(e.description, 220))
    console.log('  install: ' + installOf(e))
    console.log('  id: ' + e.id)
    console.log('')
  }
}

// Each word is scored on its own. `matched` counts the distinct words that hit,
// so a row that matches nothing is never returned, and a row that covers more
// of the query ranks above one that repeats a single word. Being on npm is a
// tie-break in the sort, never a match.
function score(entry, words) {
  const title = entry.title.toLowerCase()
  const hay = (entry.title + ' ' + entry.description + ' ' + entry.category + ' ' + entry.tags.join(' ')).toLowerCase()
  let s = 0
  let matched = 0
  for (const t of words) {
    let hit = false
    if (title === t) { s += 20; hit = true }
    else if (title.includes(t)) { s += 8; hit = true }
    if (entry.tags.some((tag) => tag.includes(t))) { s += 4; hit = true }
    if (hay.includes(t)) { s += 2; hit = true }
    if (hit) matched += 1
  }
  return { s, matched }
}

// A quoted phrase arrives as one argument; search by its words.
function searchWords(terms) {
  return [...new Set(terms.flatMap((term) => term.toLowerCase().split(/\s+/)).filter(Boolean))]
}

function filterCatalog(catalog, opts) {
  return catalog.filter((e) => {
    if (opts.category && e.categoryKey !== opts.category) return false
    if (opts.layer && !e.layers.includes(opts.layer)) return false
    if (opts.tag && !e.tags.includes(opts.tag)) return false
    if (opts.npmOnly && !e.npm) return false
    if (opts.githubOnly && e.npm) return false
    return true
  })
}

function cmdStats(stats) {
  const lines = []
  lines.push('DSH plugin landscape catalog')
  lines.push('  entries:        ' + stats.totals.entries)
  lines.push('  npm-indexed:    ' + stats.totals.npmIndexed + ' (' + stats.totals.npmMatchRate + '%)')
  lines.push('  GitHub-only:    ' + stats.totals.githubOnly)
  lines.push('  categories:     ' + stats.totals.categories)
  lines.push('  layers:         ' + stats.totals.layers)
  lines.push('  install specs:  ' + stats.totals.withInstallCommand)
  lines.push('  generated:      ' + stats.generatedAt)
  lines.push('')
  lines.push('Category'.padEnd(30) + 'Count'.padStart(8) + 'npm'.padStart(8) + '  Layer')
  for (const c of stats.categories) lines.push(c.title.padEnd(30) + String(c.count).padStart(8) + String(c.npmCount).padStart(8) + '  ' + c.layer)
  lines.push('')
  lines.push('Layer'.padEnd(40) + 'Primary'.padStart(9) + 'Mentions'.padStart(10))
  for (const l of stats.layers) lines.push((l.id + ' ' + l.name).padEnd(40) + String(l.primary).padStart(9) + String(l.mentions).padStart(10))
  lines.push('')
  lines.push('Top tags: ' + stats.tags.slice(0, 12).map((t) => t.tag + '(' + t.count + ')').join(', '))
  lines.push('Top keywords: ' + stats.keywords.slice(0, 12).map((k) => k.term + '(' + k.count + ')').join(', '))
  console.log(lines.join('\n'))
}

function cmdCategories(stats, opts) {
  if (opts.json) { console.log(JSON.stringify(stats.categories, null, 2)); return }
  const lines = []
  for (const c of stats.categories) {
    lines.push(c.key.padEnd(10) + c.title.padEnd(32) + String(c.count).padStart(6) + ' entries' + String(c.npmCount).padStart(6) + ' npm' + '  ' + c.layer)
  }
  console.log(lines.join('\n'))
}

function cmdLayers(stats, opts) {
  if (opts.json) { console.log(JSON.stringify(stats.layers, null, 2)); return }
  const lines = []
  for (const l of stats.layers) {
    lines.push(l.id + '  ' + l.name)
    lines.push('    ' + l.short)
    lines.push('    primary categories: ' + l.primary + ' · entries mentioning this layer: ' + l.mentions)
  }
  console.log(lines.join('\n'))
}

function cmdExemplars(catalog, categories, opts) {
  const byId = new Map(catalog.map((e) => [e.id, e]))
  const notes = categories.exemplarNotes || {}
  const chosen = opts.category ? categories.categories.filter((c) => c.key === opts.category) : categories.categories
  if (opts.category && !chosen.length) throw new Error('Unknown category: ' + opts.category)
  const rows = []
  for (const c of chosen) {
    for (const id of c.exemplars || []) {
      const e = byId.get(id)
      if (!e) continue
      rows.push({ category: c.key, id, title: e.title, repo: e.repo, install: installOf(e), npm: e.npm, note: notes[id] || '', description: e.description })
    }
  }
  if (!rows.length) { console.log('No exemplars.'); return }
  if (opts.json) { console.log(JSON.stringify(rows, null, 2)); return }
  let last = null
  for (const r of rows) {
    if (r.category !== last) { console.log('\n' + r.category.toUpperCase()); last = r.category }
    console.log('  ' + r.title + '  [' + (r.npm ? r.npm.name + '@' + r.npm.version : 'GitHub') + ']')
    console.log('    ' + r.note)
    console.log('    install: ' + r.install)
  }
}

function cmdGet(catalog, id) {
  const e = catalog.find((x) => x.id === id) || catalog.find((x) => x.title.toLowerCase() === id.toLowerCase())
  if (!e) throw new Error('No entry: ' + id)
  console.log(JSON.stringify({ ...e, installResolved: installOf(e) }, null, 2))
}

function cmdSearch(catalog, opts) {
  let rows = filterCatalog(catalog, opts)
  const words = searchWords(opts.terms)
  if (words.length) {
    rows = rows
      .map((e) => ({ e, ...score(e, words) }))
      .filter((x) => x.matched > 0)
      .sort((a, b) => b.matched - a.matched || b.s - a.s || (b.e.npm ? 1 : 0) - (a.e.npm ? 1 : 0) || a.e.title.localeCompare(b.e.title))
      .map((x) => x.e)
    if (!rows.length && !opts.json) {
      console.log('No catalog entry matches: ' + words.join(' '))
      console.log('A miss here is not proof that no plugin exists; try other words or `category <key>`.')
      return
    }
  } else {
    rows = rows.sort((a, b) => (b.npm ? 1 : 0) - (a.npm ? 1 : 0) || a.title.localeCompare(b.title))
  }
  printEntries(rows.slice(0, opts.limit), opts)
}

function cmdCategory(catalog, opts) {
  const key = opts.terms[0]
  if (!key) throw new Error('Usage: query.mjs category <key> [--limit N]')
  opts.category = key
  const rows = filterCatalog(catalog, opts).sort((a, b) => (b.npm ? 1 : 0) - (a.npm ? 1 : 0) || a.title.localeCompare(b.title)).slice(0, opts.limit)
  printEntries(rows, opts)
}

function printHelp() {
  console.log([
    'DSH plugin landscape query',
    '',
    'Commands:',
    '  stats                          totals, category and layer coverage',
    '  categories                     all 23 categories',
    '  layers                         all 10 layers and their coverage',
    '  exemplars [--category KEY]     three curated exemplars per category',
    '  search <terms...>              ranked search; flags narrow the set',
    '  category <key>                 list one category',
    '  get <id|title>                 full entry as JSON',
    '',
    'Flags:',
    '  --npm-only | --github-only     restrict installability',
    '  --layer L0..L9                 filter by layer membership',
    '  --tag TAG                      filter by heuristic tag',
    '  --category KEY                 filter by category key',
    '  --limit N                      max results (default 10)',
    '  --json                         machine-readable output',
  ].join('\n'))
}

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  if (opts.help) { printHelp(); return }
  const cmd = opts.terms.shift()
  if (!cmd) { printHelp(); return }
  const { catalog, stats, categories } = await load()
  if (cmd === 'stats') {
    if (opts.json) console.log(JSON.stringify(stats, null, 2)); else cmdStats(stats)
  } else if (cmd === 'categories') cmdCategories(stats, opts)
  else if (cmd === 'layers') cmdLayers(stats, opts)
  else if (cmd === 'exemplars') cmdExemplars(catalog, categories, opts)
  else if (cmd === 'search') cmdSearch(catalog, opts)
  else if (cmd === 'category') cmdCategory(catalog, opts)
  else if (cmd === 'get') {
    const id = opts.terms[0]
    if (!id) throw new Error('Usage: query.mjs get <id|title>')
    cmdGet(catalog, id)
  } else {
    throw new Error('Unknown command: ' + cmd)
  }
}

main().catch((e) => { console.error('query: ' + e.message); process.exit(1) })
