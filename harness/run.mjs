#!/usr/bin/env node
/**
 * Offline DSH SOTA practice probes.
 * Each scenario checks a pinned anchor and one layer-specific fixture.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SKILL = path.join(ROOT, '.dsh', 'skills', 'dsh-plugin-sota')
const SCENARIOS = path.join(ROOT, 'harness', 'scenarios')
const ALLOWLIST = path.join(ROOT, 'harness', 'policies', 'allowlist.json')
const LAYER_ANCHORS = path.join(SKILL, 'data', 'layer-anchors.json')
const failures = []

function fail(message) { failures.push(message) }
function runNode(args) {
  return spawnSync(process.execPath, args, { cwd: ROOT, encoding: 'utf8' })
}

const policy = JSON.parse(await fs.readFile(ALLOWLIST, 'utf8'))
const files = (await fs.readdir(SCENARIOS)).filter((f) => f.endsWith('.json')).sort()
if (files.length !== 5) fail('expected 5 scenarios, found ' + files.length)

const brief = runNode([path.join(SKILL, 'scripts', 'session-brief.mjs')])
if (brief.status !== 0 || !brief.stdout.includes('READY')) {
  fail('session brief is not READY\n' + brief.stdout + brief.stderr)
} else {
  console.log('PASS session brief READY')
}

for (const file of files) {
  const scenario = JSON.parse(await fs.readFile(path.join(SCENARIOS, file), 'utf8'))
  const label = scenario.layer + ' ' + scenario.id
  const allowed = policy.allowlist.find((p) => p.id === scenario.id)
  if (!allowed) fail(label + ': missing allowlist entry')
  else if (allowed.anchor !== scenario.anchor || allowed.layer !== scenario.layer) {
    fail(label + ': allowlist does not match scenario')
  }

  const layerAnchors = JSON.parse(await fs.readFile(LAYER_ANCHORS, 'utf8')).anchors
  const curated = layerAnchors.find((a) => a.layer === scenario.layer &&
    (a.title === scenario.anchor || a.npm === scenario.anchor || a.display === scenario.anchor))
  if (!curated) fail(label + ': not a curated ' + scenario.layer + ' anchor')

  const query = runNode([path.join(SKILL, 'scripts', 'query.mjs'), 'get', scenario.anchor])
  if (query.status !== 0) {
    fail(label + ': anchor did not resolve: ' + scenario.anchor)
  } else {
    const entry = JSON.parse(query.stdout)
    if (entry.title.toLowerCase() !== scenario.anchor.toLowerCase()) {
      fail(label + ': anchor title mismatch')
    }
    if (entry.layer !== scenario.layer && !(entry.layers || []).includes(scenario.layer)) {
      fail(label + ': catalog entry does not include ' + scenario.layer)
    }
  }

  const fixture = path.join(ROOT, scenario.fixture)
  try { await fs.access(fixture) } catch { fail(label + ': fixture missing: ' + scenario.fixture) }

  if (scenario.layer === 'L1') {
    const text = await fs.readFile(path.join(fixture, 'README.md'), 'utf8')
    if (!text.includes('E1') || !text.toLowerCase().includes('rollback')) fail(label + ': fixture must state E1 and rollback')
  } else if (scenario.layer === 'L3') {
    const schema = JSON.parse(await fs.readFile(path.join(fixture, 'schema.json'), 'utf8'))
    if (!schema.name || !schema.parameters || schema.parameters.additionalProperties !== false) fail(label + ': tool schema is not closed and typed')
  } else if (scenario.layer === 'L4') {
    const skill = await fs.readFile(path.join(fixture, 'SKILL.md'), 'utf8')
    if (!/^---\nname:/m.test(skill) || !/^description:/m.test(skill)) fail(label + ': skill fixture lacks name/description frontmatter')
  } else if (scenario.layer === 'L7') {
    const lines = (await fs.readFile(path.join(fixture, 'events.jsonl'), 'utf8')).trim().split('\n')
    if (lines.length < 3) fail(label + ': expected at least 3 events')
    for (const line of lines) {
      const event = JSON.parse(line)
      if (!event.type || !event.sessionId) fail(label + ': event lacks type/sessionId')
    }
  } else if (scenario.layer === 'L8') {
    const install = JSON.parse(await fs.readFile(path.join(fixture, 'policy.json'), 'utf8'))
    if (install.allowUnknown !== false || install.requireConsent !== true) fail(label + ': install policy is not fail-closed')
  } else {
    fail(label + ': unsupported layer')
  }

  if (!failures.some((f) => f.startsWith(label))) console.log('PASS ' + label + ' (' + scenario.anchor + ')')
}

if (failures.length) {
  for (const failure of failures) console.error('FAIL ' + failure)
  process.exit(1)
}
console.log('Harness: ' + files.length + '/5 probes pass; no plugins installed')
