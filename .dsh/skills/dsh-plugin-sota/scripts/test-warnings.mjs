#!/usr/bin/env node
/**
 * Prove that legitimate upstream variation is warning-level, not a refresh
 * failure: duplicate titles, an install spec on a GitHub-only entry, and a
 * shared npm package.
 */
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(ROOT, 'data')
const SCRIPT = path.join(ROOT, 'scripts', 'refresh-catalog.mjs')
const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'dsh-catalog-warnings-'))
const files = ['catalog.jsonl', 'stats.json', 'categories.json', 'index-only.json', 'layer-anchors.json']

async function reset() {
  await fs.mkdir(tmp, { recursive: true })
  for (const name of files) await fs.copyFile(path.join(SRC, name), path.join(tmp, name))
}

function run() {
  const r = spawnSync(process.execPath, [SCRIPT, '--check'], {
    encoding: 'utf8',
    env: { ...process.env, DSH_CATALOG_DATA_DIR: tmp },
  })
  return { status: r.status, output: (r.stdout || '') + (r.stderr || '') }
}

async function readCatalog() {
  return (await fs.readFile(path.join(tmp, 'catalog.jsonl'), 'utf8')).split('\n').filter(Boolean).map((line) => JSON.parse(line))
}
async function writeCatalog(catalog) {
  await fs.writeFile(path.join(tmp, 'catalog.jsonl'), catalog.map((e) => JSON.stringify(e)).join('\n') + '\n')
}
async function readStats() { return JSON.parse(await fs.readFile(path.join(tmp, 'stats.json'), 'utf8')) }
async function writeStats(stats) { await fs.writeFile(path.join(tmp, 'stats.json'), JSON.stringify(stats, null, 2) + '\n') }

function recompute(stats, catalog) {
  stats.totals.entries = catalog.length
  stats.totals.npmIndexed = catalog.filter((e) => e.npm).length
  stats.totals.uniqueNpmNames = new Set(catalog.filter((e) => e.npm).map((e) => e.npm.name)).size
  stats.totals.githubOnly = catalog.filter((e) => !e.npm).length
  stats.totals.withInstallCommand = catalog.filter((e) => e.install).length
  stats.totals.uniqueTitles = new Set(catalog.map((e) => e.title)).size
  stats.totals.npmMatchRate = catalog.length ? Number((stats.totals.npmIndexed / catalog.length * 100).toFixed(1)) : 0
  stats.coverage.matchedToNpmIndex = stats.totals.npmIndexed
}

const failures = []
function expect(name, result, text) {
  if (result.status !== 0) failures.push(name + ': expected exit 0\n' + result.output)
  else if (!result.output.includes('WARN ' + text)) failures.push(name + ': missing warning ' + text + '\n' + result.output)
  else console.log('PASS ' + name)
}

await reset()
const base = run()
if (base.status !== 0 || !base.output.includes('OK')) failures.push('baseline: expected OK\n' + base.output)
else console.log('PASS baseline')

// 1. Duplicate title: legitimate upstream variation, still a warning.
await reset()
let catalog = await readCatalog()
const anchorIds = new Set((JSON.parse(await fs.readFile(path.join(tmp, 'layer-anchors.json'), 'utf8')).anchors || []).map((a) => a.id))
const candidates = catalog.filter((e) => !anchorIds.has(e.id))
candidates[1].title = candidates[0].title
let stats = await readStats()
recompute(stats, catalog)
await writeCatalog(catalog)
await writeStats(stats)
expect('duplicate title is warning', run(), 'Duplicate titles:')

// 2. Install spec on a GitHub-only entry: legitimate, still a warning.
await reset()
catalog = await readCatalog()
const gh = catalog.find((e) => !e.npm && !anchorIds.has(e.id))
gh.install = 'manual: reviewed install'
stats = await readStats()
recompute(stats, catalog)
await writeCatalog(catalog)
await writeStats(stats)
expect('install-only entry is warning', run(), 'Install specs differ from npm entries:')

// 3. Shared npm package: legitimate, still a warning.
await reset()
catalog = await readCatalog()
const donor = catalog.find((e) => e.npm && !anchorIds.has(e.id))
const target = catalog.find((e) => !e.npm && !anchorIds.has(e.id))
target.npm = { ...donor.npm }
target.install = 'dsh plugin --profile web add ' + target.npm.name + '@' + target.npm.version
stats = await readStats()
recompute(stats, catalog)
const cat = stats.categories.find((c) => c.key === target.categoryKey)
if (cat) cat.npmCount += 1
await writeCatalog(catalog)
await writeStats(stats)
expect('shared npm package is warning', run(), 'Npm entries share packages:')

await fs.rm(tmp, { recursive: true, force: true })
if (failures.length) {
  for (const f of failures) console.error('FAIL ' + f)
  process.exit(1)
}
console.log('Warning tests: all legitimate variations pass with warnings')
