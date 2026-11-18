#!/usr/bin/env node
/**
 * Verify light-scheme and print computed styles for the final HTML manifest.
 * Uses Chrome DevTools Protocol Emulation.setEmulatedMedia; no screenshot needed.
 *
 * Prerequisites: Node 22+ (global WebSocket) and Chrome/Chromium. Set DSH_CHROME
 * when Chrome is not in a standard location. Without either prerequisite the
 * check prints a clear SKIP and exits 0; pass --require (or set
 * DSH_REQUIRE_THEME_CHECK=1) to make it a hard error instead.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const REQUIRE = process.argv.includes('--require') || process.env.DSH_REQUIRE_THEME_CHECK === '1'
const DOCS = process.env.DSH_DOCS_DIR ? path.resolve(process.env.DSH_DOCS_DIR) : path.resolve(ROOT, '../../../docs/plugin-landscape')
const TARGET = process.env.DSH_HTML_URL || 'file://' + path.join(DOCS, 'final-manifest.html')
const PORT = Number(process.env.DSH_CDP_PORT || 9444)
const PROFILE = '/tmp/dsh-theme-check-' + process.pid
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function skip(reason) {
  console.log('SKIP validate-themes: ' + reason)
  if (REQUIRE) {
    console.error('ERROR validate-themes: ' + reason + ' (required by --require)')
    process.exit(2)
  }
  process.exit(0)
}

if (typeof WebSocket !== 'function') {
  skip('Node 22+ global WebSocket is unavailable; upgrade Node or omit this optional check')
}

const candidates = process.env.DSH_CHROME ? [process.env.DSH_CHROME] : [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/snap/bin/chromium',
  process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe') : null,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].filter(Boolean)
let CHROME = null
for (const candidate of candidates) {
  try {
    await fs.access(candidate)
    const ver = spawnSync(candidate, ['--version'], { timeout: 3000, stdio: 'ignore' })
    if (ver.status === 0) { CHROME = candidate; break }
  } catch {}
}
if (!CHROME) {
  skip('Chrome/Chromium not found; set DSH_CHROME or install Chrome, or omit this optional check')
}

function parseColor(value) {
  const m = String(value).match(/rgba?\(([^)]+)\)/)
  if (!m) return null
  const p = m[1].split(',').map(Number)
  if (p.length < 3 || p.some((n) => Number.isNaN(n))) return null
  return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }
}
function blend(fg, bg) {
  const a = fg.a
  return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 }
}
function luminance(c) {
  const f = (v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b)
}
function contrast(a, b) {
  const l1 = luminance(a)
  const l2 = luminance(b)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

async function waitForEndpoint() {
  for (let i = 0; i < 80; i++) {
    try {
      const r = await fetch('http://127.0.0.1:' + PORT + '/json/version')
      if (r.ok) return
    } catch {}
    await sleep(150)
  }
  throw new Error('Chrome CDP endpoint did not start on ' + PORT)
}

async function main() {
  await fs.access(CHROME)
  await fs.rm(PROFILE, { recursive: true, force: true })
  const chrome = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    ...(process.env.CI === 'true' ? ['--no-sandbox', '--disable-dev-shm-usage'] : []),
    '--remote-debugging-port=' + PORT,
    '--user-data-dir=' + PROFILE,
    'about:blank',
  ], { stdio: 'ignore' })

  let ws
  try {
    await waitForEndpoint()
    const created = await fetch('http://127.0.0.1:' + PORT + '/json/new?' + encodeURIComponent(TARGET), { method: 'PUT' })
    if (!created.ok) throw new Error('Could not create CDP target: ' + created.status)
    const target = await created.json()
    ws = new WebSocket(target.webSocketDebuggerUrl)
    const pending = new Map()
    let nextId = 0
    ws.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data))
      if (!message.id) return
      const waiter = pending.get(message.id)
      if (!waiter) return
      pending.delete(message.id)
      if (message.error) waiter.reject(new Error(message.error.message))
      else waiter.resolve(message.result)
    })
    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve, { once: true })
      ws.addEventListener('error', reject, { once: true })
    })
    function send(method, params) {
      return new Promise((resolve, reject) => {
        const id = ++nextId
        pending.set(id, { resolve, reject })
        ws.send(JSON.stringify({ id, method, params: params || {} }))
      })
    }
    await send('Page.enable')
    await send('Runtime.enable')
    await send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 1000, deviceScaleFactor: 1, mobile: false })

    async function inspect(media) {
      await send('Emulation.setEmulatedMedia', {
        media,
        features: [{ name: 'prefers-color-scheme', value: 'light' }],
      })
      await send('Page.navigate', { url: TARGET })
      await sleep(1000)
      const result = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: [
          '(() => {',
          '  const read = (sel) => {',
          '    const el = document.querySelector(sel);',
          '    if (!el) return null;',
          '    const s = getComputedStyle(el);',
          '    return { color: s.color, background: s.backgroundColor, border: s.borderColor };',
          '  };',
          '  return {',
          '    body: getComputedStyle(document.body).backgroundColor,',
          '    tag: read(".tag"),',
          '    sota: read(".sota-card"),',
          '    code: read("code"),',
          '  };',
          '})()',
        ].join('\n'),
      })
      if (result.exceptionDetails) throw new Error('Runtime.evaluate failed for ' + media)
      const value = result.result.value
      if (!value.tag || !value.sota || !value.code) throw new Error('Theme selectors missing for ' + media)
      const body = parseColor(value.body)
      const tagBg = parseColor(value.tag.background)
      const tagFg = parseColor(value.tag.color)
      const sotaBg = parseColor(value.sota.background)
      const codeBg = parseColor(value.code.background)
      const codeFg = parseColor(value.code.color)
      if (!body || !tagBg || !tagFg || !sotaBg || !codeBg || !codeFg) throw new Error('Could not parse computed colors for ' + media)
      const tagContrast = contrast(tagFg, blend(tagBg, body))
      const codeContrast = contrast(codeFg, blend(codeBg, body))
      const sotaLight = luminance(sotaBg) > 0.8
      const bodyLight = luminance(body) > 0.7
      if (!bodyLight) throw new Error(media + ': body is not a light surface (' + value.body + ')')
      if (!sotaLight) throw new Error(media + ': .sota-card is not a light surface (' + value.sota.background + ')')
      if (tagContrast < 4.5) throw new Error(media + ': .tag contrast ' + tagContrast.toFixed(2) + ' < 4.5')
      if (codeContrast < 4.5) throw new Error(media + ': code contrast ' + codeContrast.toFixed(2) + ' < 4.5')
      console.log(media + ': body light, sota-card light, tag ' + tagContrast.toFixed(2) + ':1, code ' + codeContrast.toFixed(2) + ':1')
    }

    await inspect('screen')
    await inspect('print')
    console.log('Themes: light screen + print pass')
  } finally {
    if (ws) ws.close()
    chrome.kill('SIGTERM')
    await sleep(300)
    try {
      await fs.rm(PROFILE, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 })
    } catch (error) {
      console.error('validate-themes: profile cleanup failed: ' + (error?.code || error?.message || String(error)))
    }
  }
}

main().catch((e) => { console.error('validate-themes: ' + e.message); process.exit(1) })
