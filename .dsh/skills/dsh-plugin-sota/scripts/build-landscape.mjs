#!/usr/bin/env node
/**
 * Generate references/landscape.md from the catalog, category metadata, and
 * per-category editorial content. Run refresh-catalog.mjs first when the list
 * changes, then run this script.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATA = path.join(ROOT, 'data')
const OUT = path.join(ROOT, 'references', 'landscape.md')

function truncate(text, n) {
  if (!text) return ''
  return text.length <= n ? text : text.slice(0, n - 1) + '...'
}

async function main() {
  const [stats, categories, content, catalogText] = await Promise.all([
    fs.readFile(path.join(DATA, 'stats.json'), 'utf8').then(JSON.parse),
    fs.readFile(path.join(DATA, 'categories.json'), 'utf8').then(JSON.parse),
    fs.readFile(path.join(DATA, 'landscape-content.json'), 'utf8').then(JSON.parse),
    fs.readFile(path.join(DATA, 'catalog.jsonl'), 'utf8'),
  ])
  const catalog = catalogText.split('\n').filter(Boolean).map((line) => JSON.parse(line))
  const byId = new Map(catalog.map((e) => [e.id, e]))
  const notes = categories.exemplarNotes || {}
  if (categories.categories.length !== 23) throw new Error('Expected 23 categories')
  for (const c of categories.categories) {
    if (!content[c.key]) throw new Error('Missing landscape content for ' + c.key)
    for (const id of c.exemplars) if (!byId.has(id)) throw new Error('Missing exemplar ' + id)
  }

  const lines = []
  lines.push('# The full DSH plugin landscape')
  lines.push('')
  lines.push('Snapshot: ' + stats.generatedAt + '. Source: the awesome-dsh-plugin list plus the npm plugin index.')
  lines.push('')
  lines.push('**Coverage:** ' + stats.totals.entries + ' listed entries across ' + stats.totals.categories + ' categories; ' + stats.totals.npmIndexed + ' have a known npm version (' + stats.totals.npmMatchRate + '%), ' + stats.totals.githubOnly + ' are GitHub-only.')
  lines.push('')
  lines.push('This is a complete catalog view, not a claim that every entry was source-reviewed. The three exemplars per category are a starting shortlist chosen for explicit mechanisms, not a quality ranking. One-line descriptions are author/community claims.')
  lines.push('')
  lines.push('## How to use this landscape')
  lines.push('')
  lines.push('1. Start with the category that owns the user outcome, not the category that names the technology.')
  lines.push('2. Read the SOTA signals and vet questions before opening a repository.')
  lines.push('3. Shortlist three candidates; compare them on the evaluation rubric in evaluation.md.')
  lines.push('4. Treat an exemplar as an architecture reference, not an endorsement to install.')
  lines.push('5. Refresh this file when the upstream list changes: node scripts/refresh-catalog.mjs && node scripts/build-landscape.mjs')
  lines.push('')
  lines.push('## Coverage by category')
  lines.push('')
  lines.push('| Category | Entries | npm | Primary layer | SOTA focus |')
  lines.push('|---|---:|---:|---|---|')
  for (const c of stats.categories) {
    const meta = categories.categories.find((x) => x.key === c.key)
    lines.push('| [' + c.title + '](#' + c.key + ') | ' + c.count + ' | ' + c.npmCount + ' | ' + c.layer + ' | ' + meta.focus + ' |')
  }
  lines.push('')
  lines.push('## Layer distribution')
  lines.push('')
  lines.push('| Layer | Primary categories | Entries mentioning |')
  lines.push('|---|---:|---:|')
  for (const l of stats.layers) lines.push('| ' + l.id + ' ' + l.name + ' | ' + l.primary + ' | ' + l.mentions + ' |')
  lines.push('')
  lines.push('A high mention count means the layer is cross-cutting, not that those entries are all good examples of it.')
  lines.push('')
  lines.push('## Signals in the catalog')
  lines.push('')
  lines.push('Most frequent curated terms: ' + stats.keywords.slice(0, 18).map((k) => k.term + ' (' + k.count + ')').join(', ') + '.')
  lines.push('')
  lines.push('Most frequent heuristic tags: ' + stats.tags.slice(0, 12).map((t) => t.tag + ' (' + t.count + ')').join(', ') + '.')
  lines.push('')
  lines.push('The distribution shows where the ecosystem concentrates: UI surfaces, tools, sessions/context, orchestration, and platform bridges. It does not show where the quality is. Use the signals and questions below.')
  lines.push('')
  lines.push('---')
  lines.push('')

  for (const c of stats.categories) {
    const meta = categories.categories.find((x) => x.key === c.key)
    const body = content[c.key]
    lines.push('<a id="' + c.key + '"></a>')
    lines.push('## ' + c.title)
    lines.push('')
    lines.push('**' + c.count + ' entries · ' + c.npmCount + ' npm-indexed · primary layer ' + c.layer + ' (' + meta.focus + ')**')
    lines.push('')
    lines.push('### SOTA looks like')
    lines.push('')
    for (const s of body.signals) lines.push('- ' + s)
    lines.push('')
    lines.push('### Exemplars')
    lines.push('')
    for (const id of meta.exemplars) {
      const e = byId.get(id)
      const install = e.install ? 'Install: ' + e.install : 'GitHub-only: ' + e.repo
      const npm = e.npm ? e.npm.name + '@' + e.npm.version : 'no npm version'
      lines.push('- **' + e.title + '** (' + npm + ') — ' + (notes[id] || '') + ' ' + install)
      lines.push('  ' + truncate(e.description, 260))
    }
    lines.push('')
    lines.push('### Vet before adopting')
    lines.push('')
    for (const q of body.questions) lines.push('- ' + q)
    lines.push('')
    lines.push('**Pitfall:** ' + body.pitfall)
    lines.push('')
    lines.push('Query this category: node scripts/query.mjs category ' + c.key + ' --limit 20')
    lines.push('')
    lines.push('---')
    lines.push('')
  }

  lines.push('## Coverage notes and limits')
  lines.push('')
  lines.push('- The README is the broad list; the npm index carries a version for roughly half of it. GitHub-only entries have no verified install spec here.')
  lines.push('- Category assignment comes from the upstream list. Layer and tag assignment is a keyword heuristic over the description, not source inspection.')
  lines.push('- The exemplars are selected for explicit mechanisms and category fit; they are not security-reviewed or benchmarked.')
  lines.push('- Every claim about a plugin in this file comes from its curated one-line description unless the plugin is also inspected locally.')
  lines.push('- Use the live repository, package manifest, and running-host checks before install. This file is a map, not a permission slip.')
  lines.push('')
  lines.push('## Refresh')
  lines.push('')
  lines.push('1. node scripts/refresh-catalog.mjs')
  lines.push('2. node scripts/build-landscape.mjs')
  lines.push('3. node scripts/refresh-catalog.mjs --check')
  lines.push('4. review the diff, especially category counts and exemplar resolution')
  lines.push('')
  lines.push('## Source links')
  lines.push('')
  lines.push('- Awesome list: https://github.com/awesome-dsh-plugin/awesome-dsh-plugin')
  lines.push('- Plugin index: https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json')
  lines.push('- DSH architecture: https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md')
  lines.push('- DSH extension cookbook: https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cookbook/extension-cookbook.md')
  lines.push('- DSH skills subsystem: https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/skills.md')
  lines.push('')

  await fs.writeFile(OUT, lines.join('\n'))
  console.log('Wrote ' + OUT + ' (' + lines.length + ' lines, ' + stats.categories.length + ' categories)')
}

main().catch((e) => { console.error('build-landscape: ' + e.message); process.exit(1) })
