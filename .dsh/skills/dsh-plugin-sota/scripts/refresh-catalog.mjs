#!/usr/bin/env node
/**
 * Rebuild the full DSH plugin landscape catalog.
 *
 * Sources:
 *   - awesome-dsh-plugin README (all listed entries, 23 categories)
 *   - dsh-plugin-catalog index.json (npm-published subset with versions)
 *
 * Outputs:
 *   data/catalog.jsonl  one JSON entry per line, every listed plugin
 *   data/stats.json     coverage, category, layer, tag, and keyword statistics
 *
 * Usage:
 *   node scripts/refresh-catalog.mjs
 *   node scripts/refresh-catalog.mjs --readme ./README.md --index ./index.json
 *   node scripts/refresh-catalog.mjs --check
 *
 * --check is snapshot-only: it compares committed data/catalog.jsonl, stats,
 * categories, and anchors. It performs no network fetch. --offline applies to
 * the rebuild path, not --check.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATA_DIR = process.env.DSH_CATALOG_DATA_DIR ? path.resolve(process.env.DSH_CATALOG_DATA_DIR) : path.join(ROOT, 'data')
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json')
const SOURCES = {
  readme: 'https://raw.githubusercontent.com/awesome-dsh-plugin/awesome-dsh-plugin/main/README.md',
  index: 'https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json',
}

const TAG_RULES = [
  ['client-ui', /\b(sidebar|panel|settings|composer|button|menu|tab|modal|dialog|layout|drag|drop|responsive|mobile|accessib|i18n|locale|theme|css|renderer|visuali[sz])\b/i],
  ['host-runtime', /\b(cordis|plugin lifecycle|loader|hmr|hot.reload|effect|inject|profile|bundle|manifest)\b/i],
  ['service-seam', /\b(service|seam|provider|adapter|backend|registry|capability|interface)\b/i],
  ['tools', /\b(tool|tools|mcp|function call|schema|endpoint|api|cli command)\b/i],
  ['skills', /\b(skill|skills|SKILL\.md|instruction pack|prompt section)\b/i],
  ['orchestration', /\b(subagent|agent team|multi.agent|workflow|preset|orchestrat|dispatch|delegate|hook|schedule|cron|goal|task board)\b/i],
  ['memory', /\b(memory|remember|recall|forget|consolidat|knowledge base|rag|retrieval|embedding|vector|semantic search)\b/i],
  ['sessions', /\b(session|conversation|transcript|turn|message|context window|compaction|compact|token budget)\b/i],
  ['persistence', /\b(sqlite|database|persist|storage|migration|backup|restore|export|import|snapshot|journal|wal)\b/i],
  ['security', /\b(security|secure|auth|oauth|permission|approval|sandbox|encrypt|credential|secret|vault|audit|trust|risk|policy|redact|privacy)\b/i],
  ['models', /\b(model|provider|llm|adapter|openai|anthropic|deepseek|ollama|router|routing|failover|retry|token usage|billing|cost)\b/i],
  ['browser', /\b(browser|chrome|chromium|cdp|playwright|puppeteer|web page|dom|screenshot|scrap|crawl)\b/i],
  ['media', /\b(image|vision|video|audio|voice|speech|tts|asr|whisper|transcri|ocr|pdf|docx|markdown|render)\b/i],
  ['platform', /\b(windows|wsl|macos|linux|android|ios|docker|ssh|remote|desktop|electron|pwa)\b/i],
  ['distribution', /\b(npm|publish|market|index|install|update|upgrade|version|release|provenance|semver)\b/i],
  ['reliability', /\b(retry|backoff|timeout|cancel|abort|idempot|rollback|recover|fallback|circuit breaker|rate limit)\b/i],
  ['observability', /\b(log|logging|telemetry|trace|metric|diagnos|health|audit|report|dashboard|forensic)\b/i],
  ['format', /\b(json|csv|yaml|html|xml|sse|websocket|http|rest|graphql|rpc)\b/i],
]

const STOPWORDS = new Set('the a an and or for with from into onto your you our their its this that these those is are was were be been to of in on by as at it not no all any each per via than then so if but can will also more most other such only just very much many use used using make makes made build built run runs running add adds added plugin plugins dsh support supports supported provide provides provided allow allows allowed new one two three'.split(' '))
const KEYWORDS = [
  'mcp', 'sandbox', 'approval', 'permission', 'subagent', 'skill', 'preset', 'hook', 'theme', 'i18n',
  'audit', 'sqlite', 'memory', 'rag', 'embedding', 'browser', 'terminal', 'git', 'diff', 'markdown',
  'pdf', 'docx', 'voice', 'whisper', 'vision', 'image', 'openai', 'anthropic', 'deepseek', 'ollama',
  'plugin', 'bundle', 'client', 'server', 'tool', 'context', 'token', 'compact', 'workflow', 'cron',
  'schedule', 'webhook', 'notify', 'telegram', 'discord', 'slack', 'oauth', 'encrypt', 'secret',
  'local-first', 'offline', 'stream', 'sse', 'websocket', 'retry', 'timeout', 'cache', 'migration',
]

function parseArgs(argv) {
  const out = { check: false, offline: false, readme: null, index: null, quiet: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--check') out.check = true
    else if (a === '--offline') out.offline = true
    else if (a === '--quiet') out.quiet = true
    else if (a === '--readme') out.readme = argv[++i]
    else if (a === '--index') out.index = argv[++i]
    else if (a === '--help' || a === '-h') {
      console.log('Usage: node scripts/refresh-catalog.mjs [--check] [--offline] [--readme FILE] [--index FILE] [--quiet]')
      process.exit(0)
    } else {
      throw new Error('Unknown argument: ' + a)
    }
  }
  return out
}

async function fetchText(url, label) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 45000)
  try {
    const headers = { 'user-agent': 'dsh-plugin-sota/1.0 (+https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)' }
    if (process.env.GITHUB_TOKEN && /github/i.test(url)) headers.authorization = 'Bearer ' + process.env.GITHUB_TOKEN
    const res = await fetch(url, { signal: controller.signal, headers })
    if (!res.ok) throw new Error(label + ' returned HTTP ' + res.status)
    return await res.text()
  } finally {
    clearTimeout(timer)
  }
}

function normalizeUrl(raw) {
  if (!raw) return null
  let value = String(raw).trim().split('#')[0].split('?')[0].replace(/\/+$/, '').replace(/\.git$/i, '')
  try {
    const u = new URL(value)
    u.hostname = u.hostname.toLowerCase().replace(/^www\./, '')
    if (u.hostname === 'github.com') {
      const parts = u.pathname.split('/').filter(Boolean)
      if (parts.length >= 2) {
        return { url: 'https://github.com/' + parts[0] + '/' + parts[1] + (parts.length > 2 ? '/' + parts.slice(2).join('/') : ''), root: (parts[0] + '/' + parts[1]).toLowerCase(), github: true, path: parts.join('/').toLowerCase() }
      }
    }
    return { url: u.toString().replace(/\/+$/, ''), root: u.toString().toLowerCase(), github: false, path: u.toString().toLowerCase() }
  } catch {
    return { url: value, root: value.toLowerCase(), github: false, path: value.toLowerCase() }
  }
}

function entryId(normalized, title) {
  if (!normalized) return 'unknown:' + title.toLowerCase()
  return (normalized.github ? 'gh:' : 'url:') + normalized.path
}

function parseReadme(text, categoryTitles) {
  const entries = []
  let category = null
  let skipped = 0
  for (const line of text.split(/\r?\n/)) {
    const heading = line.match(/^### (.+?)\s*$/)
    if (heading) {
      const title = heading[1].trim()
      category = categoryTitles.has(title) ? title : null
      continue
    }
    const item = line.match(/^- \[([^\]]+)\]\(([^)]+)\)\s+-\s+(.+)$/)
    if (!item) continue
    if (!category) { skipped++; continue }
    entries.push({ category, title: item[1].trim(), url: item[2].trim(), description: item[3].trim() })
  }
  return { entries, skipped }
}

function parseIndex(text) {
  const data = JSON.parse(text)
  if (data.format !== 1) throw new Error('Unsupported plugin index format: ' + data.format)
  if (!Array.isArray(data.plugins)) throw new Error('Plugin index has no plugins array')
  return data
}

function iso(ts) {
  if (!ts) return null
  const n = Number(ts)
  return Number.isFinite(n) ? new Date(n * 1000).toISOString() : null
}

function classify(category, description) {
  const layers = new Set([category.layer, ...category.secondary])
  if (/\b(ui|sidebar|panel|settings|composer|theme|css|render|visual|markdown|card|chat)\b/i.test(description)) layers.add('L6')
  if (/\b(bundle|manifest|profile|npm|publish|install|update|version|release|market)\b/i.test(description)) layers.add('L0')
  if (/\b(tool|mcp|schema|api|endpoint|command)\b/i.test(description)) layers.add('L3')
  if (/\b(skill|prompt section|instruction)\b/i.test(description)) layers.add('L4')
  if (/\b(subagent|agent|preset|workflow|hook|schedule|cron|goal|team|dispatch|delegate)\b/i.test(description)) layers.add('L5')
  if (/\b(session|event|memory|sqlite|database|persist|storage|migration|backup|export|import|log)\b/i.test(description)) layers.add('L7')
  if (/\b(security|auth|permission|approval|sandbox|encrypt|credential|secret|audit|trust|risk|policy)\b/i.test(description)) layers.add('L8')
  if (/\b(cordis|plugin|loader|hmr|inject|effect|service|provider|adapter|seam)\b/i.test(description)) layers.add('L1')
  const tags = TAG_RULES.filter(([, re]) => re.test(description)).map(([tag]) => tag).slice(0, 8)
  return { layer: category.layer, layers: [...layers].sort(), tags }
}

function githubSubpath(url) {
  try {
    const u = new URL(url)
    const parts = u.pathname.split('/').filter(Boolean)
    const at = parts.findIndex((x) => x === 'tree' || x === 'blob')
    return at >= 0 && parts.length > at + 2 ? parts.slice(at + 2).join('/') : null
  } catch {
    return null
  }
}

function itemSubpath(item) {
  const fragment = item.title.includes('#') ? item.title.split('#').slice(1).join('#') : null
  const dir = githubSubpath(item.url)
  const last = fragment || (dir ? dir.split('/').filter(Boolean).pop() : null)
  return { fragment, dir, last }
}

function indexSubpath(p) {
  const title = String(p.title || '')
  const fragment = title.includes('#') ? title.split('#').slice(1).join('#') : null
  const dir = p.repository?.directory || null
  const last = fragment || (dir ? dir.split('/').filter(Boolean).pop() : null)
  return { fragment, dir, last }
}

function sameSubpath(a, b) {
  if (!a.last && !b.last) return true
  if (!a.last || !b.last) return false
  return a.last.toLowerCase() === b.last.toLowerCase()
}

function buildCatalog(readmeText, indexText, categoryData) {
  const titleToCategory = new Map(categoryData.categories.map((c) => [c.title, c]))
  const parsed = parseReadme(readmeText, titleToCategory)
  const index = parseIndex(indexText)

  const byTitle = new Map()
  const byRoot = new Map()
  for (const p of index.plugins) {
    const title = String(p.title || '').toLowerCase()
    if (title) byTitle.set(title, p)
    const repo = normalizeUrl(p.repository?.url)
    if (repo) {
      if (!byRoot.has(repo.root)) byRoot.set(repo.root, [])
      byRoot.get(repo.root).push(p)
    }
  }

  const usedIndex = new Set()
  const catalog = []
  const idCounts = new Map()
  for (const item of parsed.entries) {
    const category = titleToCategory.get(item.category)
    if (!category) throw new Error('Unknown category ' + JSON.stringify(item.category) + ' for ' + item.title)
    const repo = normalizeUrl(item.url)
    let pkg = byTitle.get(item.title.toLowerCase()) || null
    if (!pkg && repo) {
      const itemSub = itemSubpath(item)
      const candidates = (byRoot.get(repo.root) || []).filter((p) => sameSubpath(itemSub, indexSubpath(p)))
      if (candidates.length === 1) pkg = candidates[0]
      else if (candidates.length > 1) {
        const named = candidates.filter((p) => item.description.includes(p.name))
        pkg = named.length === 1 ? named[0] : null
      }
    }
    if (pkg) usedIndex.add(pkg.name)

    const npm = pkg && pkg.name ? {
      name: pkg.name,
      version: pkg.versions?.[0]?.version || null,
      publishedAt: iso(pkg.versions?.[0]?.publishTimestamp),
    } : null

    const idBase = entryId(repo, item.title)
    const n = (idCounts.get(idBase) || 0) + 1
    idCounts.set(idBase, n)
    const id = n === 1 ? idBase : idBase + '~' + n

    const c = classify(category, item.description)
    catalog.push({
      id,
      title: item.title,
      category: category.title,
      categoryKey: category.key,
      repo: repo?.url || item.url,
      description: item.description,
      npm,
      install: npm?.name && npm.version ? 'dsh plugin --profile web add ' + npm.name + '@' + npm.version : null,
      layer: c.layer,
      layers: c.layers,
      tags: c.tags,
      source: pkg ? 'readme+npm-index' : 'readme',
    })
  }

  const duplicates = [...idCounts.entries()].filter(([, n]) => n > 1)
  const indexOnly = index.plugins.filter((p) => !usedIndex.has(p.name)).map((p) => {
    const cat = categoryData.categories.find((c) => c.key === p.metadata?.category) || null
    const repo = normalizeUrl(p.repository?.url)
    const npm = { name: p.name, version: p.versions?.[0]?.version || null, publishedAt: iso(p.versions?.[0]?.publishTimestamp) }
    const description = p.description?.en || ''
    const c = cat ? classify(cat, description) : { layer: null, layers: [], tags: [] }
    return {
      id: entryId(repo, p.title),
      title: p.title,
      category: cat?.title || null,
      categoryKey: cat?.key || null,
      repo: repo?.url || '',
      description,
      npm,
      install: npm.name && npm.version ? 'dsh plugin --profile web add ' + npm.name + '@' + npm.version : null,
      layer: c.layer,
      layers: c.layers,
      tags: c.tags,
      source: 'npm-index-only',
    }
  })
  return { catalog, duplicates, indexOnly, readmeSkipped: parsed.skipped, indexCount: index.plugins.length }
}

function makeStats(catalog, extra, categoryData, generatedAt, sources) {
  const countBy = (fn) => {
    const m = new Map()
    for (const e of catalog) {
      const k = fn(e)
      if (k == null) continue
      m.set(k, (m.get(k) || 0) + 1)
    }
    return m
  }
  const categoryCounts = countBy((e) => e.categoryKey)
  const layerCounts = countBy((e) => e.layer)
  const tagCounts = new Map()
  for (const e of catalog) for (const t of e.tags) tagCounts.set(t, (tagCounts.get(t) || 0) + 1)
  const allText = catalog.map((e) => e.description).join(' ').toLowerCase()
  const keywordCounts = KEYWORDS.map((term) => ({
    term,
    count: (allText.match(new RegExp('\\b' + term.replace(/[.*+?^$()|[\]\\]/g, '\\$&') + '\\b', 'g')) || []).length,
  })).filter((x) => x.count > 0).sort((a, b) => b.count - a.count)
  const wordCounts = new Map()
  for (const word of allText.match(/[a-z][a-z0-9-]{2,}/g) || []) {
    if (STOPWORDS.has(word)) continue
    wordCounts.set(word, (wordCounts.get(word) || 0) + 1)
  }
  const topWords = [...wordCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 60).map(([term, count]) => ({ term, count }))

  const categories = categoryData.categories.map((c) => ({
    key: c.key,
    title: c.title,
    titleZh: c.titleZh,
    layer: c.layer,
    secondary: c.secondary,
    count: categoryCounts.get(c.key) || 0,
    npmCount: catalog.filter((e) => e.categoryKey === c.key && e.npm).length,
    exemplars: c.exemplars || [],
  }))
  const npmIndexed = catalog.filter((e) => e.npm).length
  return {
    schemaVersion: 1,
    generatedAt,
    sources,
    totals: {
      entries: catalog.length,
      npmIndexed,
      uniqueNpmNames: new Set(catalog.filter((e) => e.npm).map((e) => e.npm.name)).size,
      githubOnly: catalog.length - npmIndexed,
      npmMatchRate: catalog.length ? Number((npmIndexed / catalog.length * 100).toFixed(1)) : 0,
      categories: categories.length,
      layers: categoryData.layers.length,
      withInstallCommand: catalog.filter((e) => e.install).length,
      uniqueTitles: new Set(catalog.map((e) => e.title)).size,
    },
    categories,
    layers: categoryData.layers.map((l) => ({
      ...l,
      primary: layerCounts.get(l.id) || 0,
      mentions: catalog.reduce((n, e) => n + (e.layers.includes(l.id) ? 1 : 0), 0),
    })),
    tags: [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).map(([tag, count]) => ({ tag, count })),
    keywords: keywordCounts,
    topWords,
    coverage: {
      indexPlugins: extra.indexCount,
      matchedToNpmIndex: npmIndexed,
      indexOnly: extra.indexOnly.length,
      indexOnlySample: extra.indexOnly.slice(0, 10).map((e) => ({ id: e.id, name: e.npm?.name || null, title: e.title, categoryKey: e.categoryKey })),
      readmeEntries: catalog.length,
      readmeSkipped: extra.readmeSkipped,
      duplicateIds: extra.duplicates.length,
      duplicateIdSample: extra.duplicates.slice(0, 10),
    },
    caveats: [
      'Awesome-list inclusion is not a security review or a quality ranking.',
      'npm-indexed means the index carried a known npm version; GitHub-only entries have no verified install spec here.',
      'Layer and tag assignments are keyword heuristics over the curated one-line description, not source inspection.',
      'One-line descriptions are author/community claims; verify the repository and running host before installing or recommending.',
    ],
  }
}

async function readLocalOrFetch(file, url, label, offline) {
  if (file) return await fs.readFile(file, 'utf8')
  if (offline) return await fs.readFile(path.join(DATA_DIR, 'raw', label), 'utf8')
  return await fetchText(url, label)
}

async function checkExisting(categoryData) {
  const errors = []
  const warnings = []
  let catalog = []
  try {
    const text = await fs.readFile(path.join(DATA_DIR, 'catalog.jsonl'), 'utf8')
    catalog = text.split('\n').filter(Boolean).map((line, i) => {
      try { return JSON.parse(line) } catch (e) { errors.push('catalog.jsonl line ' + (i + 1) + ': ' + e.message); return null }
    }).filter(Boolean)
  } catch (e) { errors.push('Cannot read catalog.jsonl: ' + e.message) }

  const stats = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'stats.json'), 'utf8'))
  const computed = {
    entries: catalog.length,
    npmIndexed: catalog.filter((e) => e.npm).length,
    uniqueNpmNames: new Set(catalog.filter((e) => e.npm).map((e) => e.npm.name)).size,
    githubOnly: catalog.filter((e) => !e.npm).length,
    withInstallCommand: catalog.filter((e) => e.install).length,
    uniqueTitles: new Set(catalog.map((e) => e.title)).size,
  }
  for (const key of Object.keys(computed)) {
    if (stats.totals[key] !== computed[key]) errors.push('stats.totals.' + key + ' ' + stats.totals[key] + ' != computed ' + computed[key])
  }
  const matchRate = computed.entries ? Number((computed.npmIndexed / computed.entries * 100).toFixed(1)) : 0
  if (stats.totals.npmMatchRate !== matchRate) errors.push('stats.totals.npmMatchRate ' + stats.totals.npmMatchRate + ' != computed ' + matchRate)
  if (computed.uniqueTitles !== computed.entries) warnings.push('Duplicate titles: ' + (computed.entries - computed.uniqueTitles) + ' duplicate(s); ids remain unique')
  if (computed.withInstallCommand !== computed.npmIndexed) warnings.push('Install specs differ from npm entries: ' + computed.withInstallCommand + ' install specs for ' + computed.npmIndexed + ' npm entries')
  if (computed.uniqueNpmNames !== computed.npmIndexed) warnings.push('Npm entries share packages: ' + (computed.npmIndexed - computed.uniqueNpmNames) + ' extra entry match(es)')
  const installWithoutNpm = catalog.filter((e) => e.install && !e.npm).length
  const npmWithoutInstall = catalog.filter((e) => !e.install && e.npm).length
  if (installWithoutNpm || npmWithoutInstall) warnings.push('Install/npm presence differs: ' + installWithoutNpm + ' install-only, ' + npmWithoutInstall + ' npm-only')
  if (stats.coverage.matchedToNpmIndex !== computed.npmIndexed) errors.push('stats.coverage.matchedToNpmIndex ' + stats.coverage.matchedToNpmIndex + ' != computed ' + computed.npmIndexed)
  if (stats.coverage.indexPlugins !== computed.uniqueNpmNames + stats.coverage.indexOnly) errors.push('Index ledger does not add up: ' + stats.coverage.indexPlugins + ' != ' + computed.uniqueNpmNames + ' unique matched + ' + stats.coverage.indexOnly + ' index-only')
  if (stats.categories.length !== categoryData.categories.length) errors.push('Category count mismatch')
  const sum = stats.categories.reduce((n, c) => n + c.count, 0)
  if (sum !== catalog.length) errors.push('Category counts sum to ' + sum + ', catalog has ' + catalog.length)
  for (const c of stats.categories) {
    if (!c.count) errors.push('Empty category: ' + c.key)
    const entries = catalog.filter((e) => e.categoryKey === c.key)
    const npmCount = entries.filter((e) => e.npm).length
    if (entries.length !== c.count) errors.push('Category ' + c.key + ' count ' + c.count + ' != computed ' + entries.length)
    if (npmCount !== c.npmCount) errors.push('Category ' + c.key + ' npmCount ' + c.npmCount + ' != computed ' + npmCount)
    if ((c.exemplars || []).length !== 3) errors.push('Expected 3 exemplars for ' + c.key + ', got ' + (c.exemplars || []).length)
    for (const id of c.exemplars || []) {
      if (!catalog.some((e) => e.id === id)) errors.push('Unknown exemplar in ' + c.key + ': ' + id)
    }
  }
  if (stats.totals.layers !== stats.layers.length) errors.push('Layer count ' + stats.totals.layers + ' != ' + stats.layers.length)
  for (const l of stats.layers) {
    const primary = catalog.filter((e) => e.layer === l.id).length
    const mentions = catalog.filter((e) => e.layers.includes(l.id)).length
    if (l.primary !== primary) errors.push('Layer ' + l.id + ' primary ' + l.primary + ' != computed ' + primary)
    if (l.mentions !== mentions) errors.push('Layer ' + l.id + ' mentions ' + l.mentions + ' != computed ' + mentions)
  }
  const ids = new Set(catalog.map((e) => e.id))
  if (ids.size !== catalog.length) warnings.push('Duplicate ids: ' + (catalog.length - ids.size))

  try {
    const indexOnlyData = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'index-only.json'), 'utf8'))
    if ((indexOnlyData.entries || []).length !== stats.coverage.indexOnly) errors.push('index-only.json count ' + (indexOnlyData.entries || []).length + ' != stats ' + stats.coverage.indexOnly)
    for (const e of indexOnlyData.entries || []) if (e.source !== 'npm-index-only') errors.push('index-only entry has wrong source: ' + e.id)
  } catch (e) {
    errors.push('Cannot read index-only.json: ' + e.message)
  }

  let anchorCount = 0
  try {
    const anchorData = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'layer-anchors.json'), 'utf8'))
    const anchors = anchorData.anchors || []
    anchorCount = anchors.length
    if (anchorCount !== 30) errors.push('Expected 30 layer anchors, got ' + anchorCount)
    const byLayer = new Map()
    for (const a of anchors) {
      if (!/^L[0-9]$/.test(a.layer || '')) errors.push('Invalid anchor layer: ' + a.layer + ' (' + a.id + ')')
      byLayer.set(a.layer, (byLayer.get(a.layer) || 0) + 1)
      const e = catalog.find((x) => x.id === a.id)
      if (!e) { errors.push('Unknown anchor id: ' + a.id); continue }
      if (e.title !== a.title) errors.push('Anchor title mismatch for ' + a.id + ': catalog=' + e.title + ' anchor=' + a.title)
      const npm = e.npm?.name || null
      if (npm !== a.npm) errors.push('Anchor npm mismatch for ' + a.id + ': catalog=' + npm + ' anchor=' + a.npm)
      if (a.display !== a.title && a.display !== npm) errors.push('Anchor display is not an exact title or npm name: ' + a.display)
    }
    for (let i = 0; i < 10; i++) {
      const count = byLayer.get('L' + i) || 0
      if (count !== 3) errors.push('Expected 3 anchors for L' + i + ', got ' + count)
    }
  } catch (e) {
    errors.push('Cannot read layer-anchors.json: ' + e.message)
  }

  return { errors, warnings, catalog, stats, anchorCount }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const categoryData = JSON.parse(await fs.readFile(CATEGORIES_FILE, 'utf8'))
  if (categoryData.categories.length !== 23) throw new Error('Expected 23 categories, got ' + categoryData.categories.length)

  if (args.check) {
    const { errors, warnings, stats, anchorCount } = await checkExisting(categoryData)
    if (!args.quiet) {
      console.log('Catalog: ' + stats.totals.entries + ' entries, ' + stats.totals.npmIndexed + ' npm-indexed, ' + stats.categories.length + ' categories')
      console.log('Anchors: ' + anchorCount + ' exact catalog identities')
      for (const w of warnings) console.log('WARN ' + w)
      for (const e of errors) console.log('ERR  ' + e)
    }
    if (errors.length) process.exit(1)
    console.log('OK')
    return
  }

  const generatedAt = new Date().toISOString()
  const readmeText = await readLocalOrFetch(args.readme, SOURCES.readme, 'README.md', args.offline)
  const indexText = await readLocalOrFetch(args.index, SOURCES.index, 'index.json', args.offline)
  const built = buildCatalog(readmeText, indexText, categoryData)
  if (built.catalog.length < 1000) throw new Error('Refusing to write suspiciously small catalog: ' + built.catalog.length)

  const stats = makeStats(built.catalog, built, categoryData, generatedAt, {
    readme: args.readme ? path.resolve(args.readme) : SOURCES.readme,
    index: args.index ? path.resolve(args.index) : SOURCES.index,
  })

  await fs.mkdir(path.join(DATA_DIR, 'raw'), { recursive: true })
  await fs.writeFile(path.join(DATA_DIR, 'raw', 'README.md'), readmeText)
  await fs.writeFile(path.join(DATA_DIR, 'raw', 'index.json'), indexText)
  await fs.writeFile(path.join(DATA_DIR, 'catalog.jsonl.tmp'), built.catalog.map((e) => JSON.stringify(e)).join('\n') + '\n')
  await fs.rename(path.join(DATA_DIR, 'catalog.jsonl.tmp'), path.join(DATA_DIR, 'catalog.jsonl'))
  await fs.writeFile(path.join(DATA_DIR, 'stats.json.tmp'), JSON.stringify(stats, null, 2) + '\n')
  await fs.rename(path.join(DATA_DIR, 'stats.json.tmp'), path.join(DATA_DIR, 'stats.json'))
  await fs.writeFile(path.join(DATA_DIR, 'index-only.json.tmp'), JSON.stringify({ schemaVersion: 1, generatedAt, note: 'Plugins present in the npm index but absent from the awesome-list README. Kept outside the 10,974 listed-entry count.', entries: built.indexOnly }, null, 2) + '\n')
  await fs.rename(path.join(DATA_DIR, 'index-only.json.tmp'), path.join(DATA_DIR, 'index-only.json'))

  if (!args.quiet) {
    console.log('Wrote ' + built.catalog.length + ' entries (' + stats.totals.npmIndexed + ' npm-indexed, ' + stats.totals.githubOnly + ' GitHub-only) across ' + stats.categories.length + ' categories')
    console.log('Categories: ' + stats.categories.map((c) => c.key + '=' + c.count).join(' '))
    if (built.indexOnly.length) console.log('Index entries not in README: ' + built.indexOnly.length)
    if (built.duplicates.length) console.log('Duplicate ids: ' + built.duplicates.length)
  }
}

main().catch((e) => { console.error('refresh-catalog: ' + e.message); process.exit(1) })
