#!/usr/bin/env node
/**
 * Negative tests for validate-anchors.mjs.
 * Proves that a 4/2 layer split, an extra prose anchor, and a missing prose
 * anchor all fail, while the current set passes.
 */
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const VALIDATOR = path.join(ROOT, 'scripts', 'validate-anchors.mjs')
const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'dsh-anchor-tests-'))
const dataDir = path.join(tmp, 'data')
await fs.mkdir(dataDir, { recursive: true })
const report = path.join(tmp, 'report.md')
const layerModel = path.join(tmp, 'layer-model.md')

async function copy(from, to) {
  await fs.copyFile(path.join(ROOT, from), to)
}

await Promise.all([
  copy('data/catalog.jsonl', path.join(dataDir, 'catalog.jsonl')),
  copy('data/layer-anchors.json', path.join(dataDir, 'layer-anchors.json')),
  copy('data/reference-anchors.json', path.join(dataDir, 'reference-anchors.json')),
  copy('references/layer-model.md', layerModel),
  copy('../../../docs/plugin-landscape/README.md', report),
])

const env = {
  ...process.env,
  DSH_ANCHOR_DATA_DIR: dataDir,
  DSH_ANCHOR_REPORT: report,
  DSH_ANCHOR_LAYER_MODEL: layerModel,
}

function run() {
  const r = spawnSync(process.execPath, [VALIDATOR], { encoding: 'utf8', env })
  return { status: r.status, output: (r.stdout || '') + (r.stderr || '') }
}

const failures = []
function expect(name, result, predicate, expectedText) {
  if (result.status === 0) failures.push(name + ': expected non-zero exit, got 0')
  else if (predicate && !result.output.includes(expectedText)) failures.push(name + ': missing error text: ' + expectedText + '\n' + result.output)
  else console.log('PASS ' + name)
}

const good = run()
if (good.status !== 0) failures.push('baseline: expected exit 0\n' + good.output)
else console.log('PASS baseline exact set')

const anchorPath = path.join(dataDir, 'layer-anchors.json')
const originalAnchors = await fs.readFile(anchorPath, 'utf8')
const anchorData = JSON.parse(originalAnchors)
const move = anchorData.anchors.find((a) => a.layer === 'L0')
move.layer = 'L1'
await fs.writeFile(anchorPath, JSON.stringify(anchorData, null, 2) + '\n')
const split = run()
expect('4/2 layer split fails', split, true, 'Expected 3 anchors for L0, got 2')
await fs.writeFile(anchorPath, originalAnchors)

const originalReport = await fs.readFile(report, 'utf8')
await fs.writeFile(report, originalReport.replace('PerryLink/dsh-doublecheck', 'PerryLink/dsh-doublecheck-x'))
const tableBad = run()
expect('report table mismatch fails', tableBad, true, 'Report table mismatch for L0')
await fs.writeFile(report, originalReport)

const originalLayerModel = await fs.readFile(layerModel, 'utf8')
await fs.writeFile(layerModel, originalLayerModel.replace('### Landscape anchors', '### Landscape anchors\n\ndsh-backup'))
const extra = run()
expect('extra prose anchor fails', extra, true, 'Prose anchor not listed in reference-anchors.json: dsh-backup')
await fs.writeFile(layerModel, originalLayerModel)

await fs.writeFile(layerModel, originalLayerModel.replace('dsh-doublecheck', 'dsh-memento'))
const missing = run()
expect('missing prose anchor fails', missing, true, 'Reference anchor missing from prose: dsh-doublecheck')
await fs.writeFile(layerModel, originalLayerModel)

const goodAgain = run()
if (goodAgain.status !== 0) failures.push('restored set: expected exit 0\n' + goodAgain.output)
else console.log('PASS restored exact set')

await fs.rm(tmp, { recursive: true, force: true })
if (failures.length) {
  for (const f of failures) console.error('FAIL ' + f)
  process.exit(1)
}
console.log('Negative tests: all expected failures observed; exact set passes')
