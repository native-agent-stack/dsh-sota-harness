#!/usr/bin/env node
/**
 * Validate the 30 SOTA layer anchors against catalog.jsonl and the report table.
 * Exact identity only: id, title, npm name, and display (exact title or npm name).
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATA = process.env.DSH_ANCHOR_DATA_DIR ? path.resolve(process.env.DSH_ANCHOR_DATA_DIR) : path.join(ROOT, 'data')
const DOCS = process.env.DSH_DOCS_DIR ? path.resolve(process.env.DSH_DOCS_DIR) : path.resolve(ROOT, '../../../docs/plugin-landscape')
const REPORT = process.env.DSH_ANCHOR_REPORT ? path.resolve(process.env.DSH_ANCHOR_REPORT) : path.join(DOCS, 'README.md')
const LAYER_MODEL = process.env.DSH_ANCHOR_LAYER_MODEL ? path.resolve(process.env.DSH_ANCHOR_LAYER_MODEL) : path.join(ROOT, 'references', 'layer-model.md')

function extractProseAnchors(text) {
  const sections = [...text.matchAll(/### Landscape anchors\n([\s\S]*?)(?=\n---|$)/g)].map((m) => m[1])
  if (sections.length !== 10) throw new Error('Expected 10 landscape-anchor sections, got ' + sections.length)
  const body = sections.join('\n')
  const tokenRe = /@[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+|[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:#[A-Za-z0-9_.-]+)?|\bdsh-[a-z0-9][a-z0-9-]*\b/g
  return new Set(body.match(tokenRe) || [])
}

async function main() {
  const [catalogText, anchorData, referenceData, report, layerModel] = await Promise.all([
    fs.readFile(path.join(DATA, 'catalog.jsonl'), 'utf8'),
    fs.readFile(path.join(DATA, 'layer-anchors.json'), 'utf8').then(JSON.parse),
    fs.readFile(path.join(DATA, 'reference-anchors.json'), 'utf8').then(JSON.parse),
    fs.readFile(REPORT, 'utf8'),
    fs.readFile(LAYER_MODEL, 'utf8'),
  ])
  const catalog = catalogText.split('\n').filter(Boolean).map((line) => JSON.parse(line))
  const errors = []
  const byLayer = new Map()
  for (const a of anchorData.anchors || []) {
    if (!/^L[0-9]$/.test(a.layer || '')) errors.push('Invalid layer: ' + a.layer + ' (' + a.id + ')')
    const e = catalog.find((x) => x.id === a.id)
    if (!e) { errors.push('Unknown anchor id: ' + a.id); continue }
    if (e.title !== a.title) errors.push('Title mismatch: ' + a.id)
    const npm = e.npm?.name || null
    if (npm !== a.npm) errors.push('Npm mismatch: ' + a.id)
    if (a.display !== a.title && a.display !== npm) errors.push('Display is not exact title or npm: ' + a.display)
    if (!byLayer.has(a.layer)) byLayer.set(a.layer, [])
    byLayer.get(a.layer).push(a.display)
  }
  for (let i = 0; i < 10; i++) {
    const count = (byLayer.get('L' + i) || []).length
    if (count !== 3) errors.push('Expected 3 anchors for L' + i + ', got ' + count)
  }
  if ((anchorData.anchors || []).length !== 30) errors.push('Expected 30 anchors, got ' + (anchorData.anchors || []).length)

  const rows = new Map()
  for (const m of report.matchAll(/^\| (L\d) \| ([^|]+?) \|/gm)) {
    rows.set(m[1], m[2].split(',').map((x) => x.trim()))
  }
  for (let i = 0; i < 10; i++) {
    const layer = 'L' + i
    const expected = byLayer.get(layer) || []
    const actual = rows.get(layer) || []
    if (expected.join('|') !== actual.join('|')) errors.push('Report table mismatch for ' + layer + ': expected ' + expected.join(', ') + '; got ' + actual.join(', '))
  }

  const refs = referenceData.anchors || []
  for (const name of refs) {
    const matches = catalog.filter((e) => e.title === name || (e.npm && e.npm.name === name))
    if (matches.length !== 1) errors.push('Reference anchor must resolve exactly once: ' + name + ' (' + matches.length + ')')
  }
  const proseAnchors = extractProseAnchors(layerModel)
  const expectedProse = new Set(refs)
  for (const name of expectedProse) if (!proseAnchors.has(name)) errors.push('Reference anchor missing from prose: ' + name)
  for (const name of proseAnchors) if (!expectedProse.has(name)) errors.push('Prose anchor not listed in reference-anchors.json: ' + name)

  if (errors.length) {
    for (const e of errors) console.error('ERR ' + e)
    process.exit(1)
  }
  console.log('Anchors: 30/30 exact identities; report table matches; 3 per layer')
  console.log('Reference anchors: ' + refs.length + '/' + refs.length + ' exact identities; prose set matches')
}

main().catch((e) => { console.error('validate-anchors: ' + e.message); process.exit(1) })
