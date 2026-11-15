#!/usr/bin/env node
/**
 * Count, then reject, any fetch made by a child process.
 * The count is written on exit so a caller can assert zero network attempts.
 */
import fs from 'node:fs'

const countFile = process.env.DSH_FETCH_COUNT_FILE
let fetchCount = 0

if (typeof globalThis.fetch === 'function') {
  globalThis.fetch = () => {
    fetchCount += 1
    throw new Error('network fetch attempted during catalog --check')
  }
}

process.on('exit', () => {
  if (!countFile) return
  try { fs.writeFileSync(countFile, String(fetchCount)) } catch {}
})
