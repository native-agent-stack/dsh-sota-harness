#!/usr/bin/env node
/**
 * Run refresh-catalog.mjs --check in a child process with a fetch-counting
 * preload. The child must exit 0 and the preload must record zero fetches.
 */
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PRELOAD = pathToFileURL(path.join(ROOT, 'scripts', 'fetch-counter-preload.mjs')).href
const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'dsh-offline-check-'))
const countFile = path.join(tmp, 'fetch-count.txt')

const result = spawnSync(process.execPath, ['--import', PRELOAD, 'scripts/refresh-catalog.mjs', '--check'], {
  cwd: ROOT,
  encoding: 'utf8',
  env: { ...process.env, DSH_FETCH_COUNT_FILE: countFile },
})

let fetchCount = null
try { fetchCount = Number(await fs.readFile(countFile, 'utf8')) } catch {}
const output = (result.stdout || '') + (result.stderr || '')
await fs.rm(tmp, { recursive: true, force: true })

try {
  assert.equal(result.status, 0, 'refresh-catalog --check must exit 0\n' + output)
  assert.equal(fetchCount, 0, 'refresh-catalog --check must make zero fetch calls; observed ' + fetchCount + '\n' + output)
  assert.match(output, /\bOK\b/, 'refresh-catalog --check must report OK\n' + output)
  console.log('Catalog check: offline snapshot path verified; exit 0; fetch calls: 0')
} catch (error) {
  console.error('FAIL ' + error.message)
  process.exit(1)
}
