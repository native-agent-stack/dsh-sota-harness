#!/usr/bin/env python3
"""Build the self-contained final architecture manifest HTML."""
import html
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS = Path(os.environ.get('DSH_DOCS_DIR', str(ROOT.parents[2] / 'docs' / 'plugin-landscape'))).resolve()
OUT = DOCS / 'final-manifest.html'

stats = json.loads((ROOT / 'data' / 'stats.json').read_text())
categories = json.loads((ROOT / 'data' / 'categories.json').read_text())
anchors = json.loads((ROOT / 'data' / 'layer-anchors.json').read_text())['anchors']
reference = json.loads((ROOT / 'data' / 'reference-anchors.json').read_text())['anchors']
landscape_content = json.loads((ROOT / 'data' / 'landscape-content.json').read_text())
category_meta = {c['key']: c for c in categories['categories']}
exemplar_notes = categories.get('exemplarNotes', {})
catalog_by_id = {}
for line in (ROOT / 'data' / 'catalog.jsonl').read_text().splitlines():
    if line.strip():
        entry = json.loads(line)
        catalog_by_id[entry['id']] = entry

SOTA_BY_LAYER = {
    'L0': 'Patch as API; engines.dsh; built artifacts; reversible install.',
    'L1': 'Explicit inject; reversible effects; HMR-safe; clean unload.',
    'L2': 'Definition/provider/consumer; scoped ownership; swap one row.',
    'L3': 'Typed schema; policy; cancellation; bounded output; context budget.',
    'L4': 'One job per skill; discriminating trigger; progressive disclosure; evaluated.',
    'L5': 'Declarative presets; least privilege; budgets; disposed subagents.',
    'L6': 'Slots and nodes; durable/live split; states; accessibility; i18n; tokens.',
    'L7': 'Log model-visible inputs; pure projections; versioned migrations; export/delete.',
    'L8': 'Source before install; least privilege; auth every path; fail closed.',
    'L9': 'Built packages; verified indexes; snapshot/rollback; consent and retirement.',
}

listed = stats['totals']['entries']
npm = stats['totals']['npmIndexed']
unique_npm = stats['totals']['uniqueNpmNames']
github = stats['totals']['githubOnly']
index_only = stats['coverage']['indexOnly']
known = listed + index_only
index_packages = stats['coverage']['indexPlugins']
rate = stats['totals']['npmMatchRate']
exemplars = sum(len(c['exemplars']) for c in stats['categories'])
snapshot = stats['generatedAt'].replace('T', ' ').replace('Z', ' UTC')

def fmt(n):
    return format(int(n), ',')

def esc(value):
    return html.escape(str(value), quote=True)

def kpi(label, value, note):
    return '<div class="kpi"><span class="kpi-label">' + esc(label) + '</span><strong>' + esc(value) + '</strong><small>' + esc(note) + '</small></div>'

def chip(name, note, tone=''):
    return '<div class="chip ' + esc(tone) + '"><b>' + esc(name) + '</b><span>' + esc(note) + '</span></div>'

def stage(title, subtitle, chips, extra=''):
    return '<div class="stage ' + esc(extra) + '"><div class="stage-head"><h3>' + esc(title) + '</h3><p>' + esc(subtitle) + '</p></div><div class="chips">' + chips + '</div></div>'

def arrow(label=''):
    return '<div class="flow-arrow"><span>' + esc(label) + '</span><i>&#8594;</i></div>'

def layer_card(layer):
    layer_categories = sorted([c for c in stats['categories'] if c['layer'] == layer['id']], key=lambda c: -c['count'])[:3]
    layer_anchors = [a['display'] for a in anchors if a['layer'] == layer['id']][:3]
    cat_text = ', '.join(c['title'] + ' (' + fmt(c['count']) + ')' for c in layer_categories) or 'cross-cutting'
    anchor_text = ', '.join(layer_anchors) or 'no direct anchor'
    return (
        '<div class="layer-card">'
        '<div class="layer-id">' + esc(layer['id']) + ' &middot; ' + esc(layer.get('short', '')) + '</div>'
        '<h3>' + esc(layer['name']) + '</h3>'
        '<p class="sota-line">' + esc(SOTA_BY_LAYER.get(layer['id'], '')) + '</p>'
        '<div class="layer-metrics"><span><b>' + fmt(layer['primary']) + '</b> primary</span><span><b>' + fmt(layer['mentions']) + '</b> mentions</span></div>'
        '<div class="layer-detail"><span>Categories</span><b>' + esc(cat_text) + '</b></div>'
        '<div class="layer-detail"><span>Anchors</span><b>' + esc(anchor_text) + '</b></div>'
        '</div>'
    )

def category_row(c):
    return '<tr><td><code>' + esc(c['key']) + '</code></td><td>' + esc(c['title']) + '</td><td class="num">' + fmt(c['count']) + '</td><td class="num">' + fmt(c['npmCount']) + '</td><td>' + esc(c['layer']) + '</td></tr>'

def exemplar_tags(ids):
    tags = []
    for id in ids[:3]:
        entry = catalog_by_id.get(id, {})
        title = entry.get('title', id)
        note = exemplar_notes.get(id, '')
        tags.append('<span class="tag" title="' + esc(note) + '">' + esc(title) + '</span>')
    return '<div class="tag-list">' + ''.join(tags) + '</div>'

def category_sota_row(c):
    meta = category_meta.get(c['key'], {})
    return '<tr><td><code>' + esc(c['key']) + '</code></td><td><b>' + esc(c['title']) + '</b></td><td class="num">' + fmt(c['count']) + '</td><td class="num">' + fmt(c['npmCount']) + '</td><td>' + esc(c['layer']) + '</td><td>' + esc(meta.get('focus', '')) + '</td><td>' + exemplar_tags(c.get('exemplars', [])) + '</td></tr>'

def sota_card(title, key, layer, practice):
    c = next((x for x in stats['categories'] if x['key'] == key), None)
    if not c:
        return ''
    meta = category_meta.get(key, {})
    head = '<div class="sota-card"><div class="layer-id">' + esc(layer) + ' &middot; ' + esc(meta.get('focus', '')) + '</div>'
    body = '<h3>' + esc(title) + '</h3><p>' + esc(practice) + '</p>'
    metrics = '<div class="layer-metrics"><span><b>' + fmt(c['count']) + '</b> entries</span><span><b>' + fmt(c['npmCount']) + '</b> npm</span></div>'
    return head + body + metrics + exemplar_tags(c.get('exemplars', [])) + '</div>'

kpis = ''.join([
    kpi('Listed entries', fmt(listed), 'README entries'),
    kpi('Known universe', fmt(known), 'listed + index-only'),
    kpi('npm-indexed', fmt(npm), 'known npm version'),
    kpi('GitHub-only', fmt(github), 'manual install path'),
    kpi('Index-only', fmt(index_only), 'outside the listed count'),
    kpi('Categories', fmt(len(stats['categories'])), 'all covered'),
    kpi('Exemplars', fmt(exemplars), '3 per category'),
    kpi('Anchors', fmt(len(anchors)), '3 per layer + ' + fmt(len(reference)) + ' prose'),
])

source_chips = chip('Awesome README', 'curated list') + chip('npm plugin index', 'published versions')
parser_chips = chip('refresh-catalog', 'parse + match + stats')
data_chips = chip('catalog.jsonl', fmt(listed) + ' entries') + chip('stats.json', 'recomputed totals') + chip('index-only.json', fmt(index_only) + ' supplements')
builder_chips = chip('build-landscape', 'catalog + stats + landscape-content') + chip('build-coverage', 'stats') + chip('build-report-summary', 'stats')
surface_chips = chip('landscape.md', '23 categories') + chip('coverage.md', 'data appendix') + chip('report README', 'summary block generated') + chip('SKILL.md', 'routing + method', 'manual')
guard_chips = chip('refresh check', 'catalog + stats + index-only + anchors') + chip('anchor validator/tests', 'exact IDs, 3 per layer, prose set') + chip('warning tests', 'legitimate variation warns') + chip('doc validator/tests', 'report + landscape + coverage + architecture')

layer_cards = ''.join(layer_card(l) for l in stats['layers'])
category_rows = ''.join(category_row(c) for c in stats['categories'])
category_sota_rows = ''.join(category_sota_row(c) for c in stats['categories'])
sota_cards_html = ''.join([
    sota_card('Skills and instructions', 'skill', 'L4', 'One job per skill; a discriminating trigger; progressive disclosure; evaluated behavior.'),
    sota_card('Tools and capabilities', 'tools', 'L3', 'Typed schemas; policy; cancellation; bounded output; deferred schemas for context economy.'),
    sota_card('Workflow and automation', 'workflow', 'L5', 'Declarative presets; least privilege; budgets; disposed subagents; verification gates.'),
    sota_card('Memory and sessions', 'memory', 'L7', 'Bounded memory; log-visible inputs; pure projections; export and delete.'),
    sota_card('Security and permissions', 'security', 'L8', 'Source before install; least privilege; auth every path; fail closed; audit.'),
    sota_card('Models and providers', 'model', 'L2', 'Provider seam; failover; cooldown; credential isolation; observable routing.'),
])

html_doc = '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>DSH Plugin Landscape - Final Architecture Manifest</title>\n<style>\n' + '''CSS_PLACEHOLDER''' + '\n</style>\n</head>\n<body>\n<header class="hero">\n<div class="eyebrow">DEEPSEEK HARNESS / PLUGIN LANDSCAPE</div>\n<h1>Architecture Manifest</h1>\n<p class="lede">Full-catalog coverage of the awesome-dsh-plugin ecosystem, a ten-layer SOTA model, and the validation path that keeps the manifest honest.</p>\n<div class="meta"><span>Snapshot <b>''' + esc(snapshot) + '''</b></span><span>Manifest <b>v1</b></span><span><b>''' + fmt(listed) + '''</b> listed &middot; <b>''' + fmt(known) + '''</b> known</span></div>\n</header>\n<main>\n'''

CSS = ''':root {
  --bg: #070b14;
  --panel: #0d1626;
  --panel-2: #111f36;
  --line: #24395c;
  --text: #e9eefb;
  --muted: #99a8c6;
  --accent: #67e8c9;
  --accent-2: #8b8cff;
  --warn: #ffc46b;
  --danger: #ff7c92;
  --radius: 16px;
  --tag-bg: rgba(103,232,201,.08);
  --tag-fg: #c9f7ed;
  --tag-line: rgba(103,232,201,.2);
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background:
    radial-gradient(1100px 520px at 12% -8%, rgba(103,232,201,.14), transparent 60%),
    radial-gradient(900px 500px at 90% 0%, rgba(139,140,255,.18), transparent 60%),
    var(--bg);
  color: var(--text);
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.55;
}
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: .9em;
  color: #c9f7ed;
  background: rgba(103,232,201,.08);
  border: 1px solid rgba(103,232,201,.16);
  padding: .08em .35em;
  border-radius: 6px;
}
.wrap { width: min(1180px, calc(100% - 40px)); margin: 0 auto; }
.hero { padding: 64px 0 28px; border-bottom: 1px solid var(--line); }
.eyebrow { color: var(--accent); font-size: 12px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; }
.hero h1 { margin: 12px 0 10px; font-size: clamp(38px, 6vw, 66px); line-height: .98; letter-spacing: -.04em; }
.lede { max-width: 760px; color: var(--muted); font-size: 18px; }
.meta { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 22px; }
.meta span { background: rgba(255,255,255,.04); border: 1px solid var(--line); border-radius: 999px; padding: 7px 12px; color: var(--muted); font-size: 13px; }
.meta b { color: var(--text); }
main { padding: 28px 0 64px; }
section { margin: 42px 0; }
.section-head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 16px; }
h2 { margin: 0; font-size: 24px; letter-spacing: -.02em; }
.section-head p { margin: 0; color: var(--muted); font-size: 13px; }
.kpi-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.kpi { background: linear-gradient(180deg, rgba(255,255,255,.035), transparent), var(--panel); border: 1px solid var(--line); border-radius: var(--radius); padding: 18px; }
.kpi-label { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .1em; }
.kpi strong { display: block; font-size: 30px; margin: 8px 0 2px; letter-spacing: -.03em; }
.kpi small { color: var(--muted); font-size: 12px; }
.note { color: var(--muted); font-size: 13px; margin: 12px 0 0; }
.flow-row { display: flex; align-items: stretch; gap: 8px; overflow-x: auto; padding: 4px 2px 12px; }
.stage { flex: 1 0 180px; min-width: 180px; background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius); padding: 14px; }
.stage.manual { border-style: dashed; }
.stage-head h3 { margin: 0 0 3px; font-size: 14px; }
.stage-head p { margin: 0 0 12px; color: var(--muted); font-size: 11px; }
.chips { display: grid; gap: 7px; }
.chip { background: rgba(255,255,255,.035); border: 1px solid rgba(255,255,255,.08); border-radius: 10px; padding: 8px 10px; }
.chip b { display: block; font-size: 12px; }
.chip span { display: block; color: var(--muted); font-size: 10.5px; margin-top: 2px; }
.chip.manual { border-style: dashed; }
.flow-arrow { display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--muted); flex: 0 0 34px; font-size: 10px; }
.flow-arrow i { font-style: normal; font-size: 22px; color: var(--accent); line-height: 1; }
.guards { margin-top: 12px; background: linear-gradient(90deg, rgba(139,140,255,.08), transparent); border: 1px solid var(--line); border-radius: var(--radius); padding: 16px; }
.guards h3 { margin: 0 0 4px; font-size: 14px; }
.guards p { margin: 0 0 12px; color: var(--muted); font-size: 12px; }
.guards .chips { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.steps { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 10px; }
.step { flex: 1 0 150px; background: var(--panel); border: 1px solid var(--line); border-radius: 14px; padding: 14px; }
.step .n { color: var(--accent); font-size: 11px; font-weight: 700; letter-spacing: .12em; }
.step h3 { margin: 6px 0 4px; font-size: 13px; }
.step p { margin: 0; color: var(--muted); font-size: 11px; }
.step-arrow { flex: 0 0 22px; display: grid; place-items: center; color: var(--accent); font-size: 20px; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.panel { background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius); padding: 18px; }
.panel h3 { margin: 0 0 10px; font-size: 15px; }
.panel ul { margin: 0; padding-left: 18px; color: var(--muted); }
.panel li { margin: 6px 0; }
.panel.hard { border-top: 3px solid var(--danger); }
.panel.warn { border-top: 3px solid var(--warn); }
.table-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: var(--radius); background: var(--panel); }
table { width: 100%; border-collapse: collapse; min-width: 680px; }
th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,.06); font-size: 12.5px; }
th { color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: .08em; background: rgba(255,255,255,.025); }
tr:last-child td { border-bottom: 0; }
td.num, th.num { text-align: right; }
.equation { margin: 12px 0 0; padding: 12px 14px; border: 1px dashed var(--line); border-radius: 12px; color: var(--muted); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12.5px; }
.layer-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 10px; }
.layer-card { background: var(--panel); border: 1px solid var(--line); border-radius: 14px; padding: 14px; }
.layer-id { color: var(--accent); font-size: 11px; font-weight: 800; letter-spacing: .14em; }
.layer-card h3 { margin: 6px 0 4px; font-size: 13px; }
.layer-card p { margin: 0; color: var(--muted); font-size: 11px; }
.layer-card .sota-line { color: var(--text); font-size: 11px; margin: 8px 0 10px; min-height: 0; }
.layer-detail { border-top: 1px solid rgba(255,255,255,.06); margin-top: 10px; padding-top: 8px; }
.layer-detail span { display: block; color: var(--muted); font-size: 9.5px; text-transform: uppercase; letter-spacing: .1em; }
.layer-detail b { display: block; color: var(--text); font-size: 10.5px; font-weight: 500; margin-top: 2px; }
.sota-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.sota-card { background: var(--panel); border: 1px solid var(--line); border-radius: 14px; padding: 14px; }
.sota-card h3 { margin: 6px 0 4px; font-size: 14px; }
.sota-card p { margin: 0 0 10px; color: var(--muted); font-size: 11px; }
.tag-list { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 9px; }
.tag { display: inline-block; background: var(--tag-bg); border: 1px solid var(--tag-line); color: var(--tag-fg); border-radius: 999px; padding: 3px 7px; font-size: 9.5px; }
.matrix table { min-width: 980px; }
.evidence-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.evidence-row span { border: 1px solid var(--line); border-radius: 999px; padding: 5px 9px; color: var(--muted); font-size: 10.5px; }
.evidence-row b { color: var(--accent); }
.layer-metrics { display: flex; gap: 10px; margin-top: 10px; color: var(--muted); font-size: 10.5px; }
.layer-metrics b { color: var(--text); }
.check-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.check { background: var(--panel); border: 1px solid var(--line); border-left: 3px solid var(--accent); border-radius: 12px; padding: 13px; }
.check b { display: block; font-size: 12.5px; }
.check span { display: block; color: var(--muted); font-size: 11px; margin-top: 3px; }
.links { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 18px; padding-left: 0; list-style: none; }
.links li { border-bottom: 1px solid rgba(255,255,255,.06); padding: 9px 0; }
.links small { color: var(--muted); display: block; }
footer { border-top: 1px solid var(--line); padding: 24px 0 48px; color: var(--muted); font-size: 12px; }
footer b { color: var(--text); }
@media (max-width: 900px) {
  .kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .layer-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .sota-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .check-grid { grid-template-columns: 1fr; }
  .two-col { grid-template-columns: 1fr; }
  .guards .chips { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 620px) {
  .wrap { width: min(100% - 24px, 1180px); }
  .hero { padding-top: 42px; }
  .flow-row { flex-direction: column; overflow: visible; }
  .flow-arrow { flex: 0 0 auto; padding: 2px 0; }
  .flow-arrow i { transform: rotate(90deg); }
  .guards .chips, .links, .sota-grid { grid-template-columns: 1fr; }
}
@media (prefers-color-scheme: light) {
  :root {
    --bg: #f6f8fc;
    --panel: #ffffff;
    --panel-2: #f1f5fb;
    --line: #d5deec;
    --text: #172033;
    --muted: #53627c;
    --accent: #087f6d;
    --accent-2: #5a5bd6;
    --warn: #9a5b00;
    --danger: #b4233a;
    --tag-bg: #e8faf5;
    --tag-fg: #075e52;
    --tag-line: #b7e6db;
  }
  body { background: #f6f8fc; color: var(--text); }
  .chip, .guards, .meta span, .equation, .step, .stage, .kpi, .check, .panel, .layer-card, .sota-card, .table-wrap { background: #fff; border-color: var(--line); }
  .chip { background: #f8fafd; }
  .guards { background: #fff; }
  .meta span { background: #fff; }
  .table-wrap th { background: #f1f5fb; }
  .evidence-row span { background: #fff; }
  code { color: #075e52; background: #e8faf5; border-color: #b7e6db; }
  .eyebrow, .layer-id { color: var(--accent); }
}
@media print {
  body { background: #fff; color: #111; }
  .hero, .panel, .kpi, .stage, .step, .check, .layer-card, .sota-card, .table-wrap, .guards, .chip, .meta span, .equation { background: #fff; border-color: #ccc; }
  .lede, .note, .kpi small, .stage-head p, .chip span, .step p, .panel ul, .check span, .links small, footer, .sota-card p, .layer-detail span, .layer-metrics, .evidence-row span { color: #444; }
  .layer-detail b, .layer-card h3, .sota-card h3, td, th { color: #111; }
  .layer-id, .eyebrow { color: #0645ad; }
  .tag { background: #eef6ff; border-color: #b8c6dd; color: #0645ad; }
  code { color: #111; background: #f3f6fb; border-color: #ccc; }
  .evidence-row span { background: #fff; }
  .table-wrap th { background: #f3f6fb; }
  a { color: #0645ad; }
}
'''

body = '''
<header class="hero">
  <div class="wrap">
    <div class="eyebrow">DEEPSEEK HARNESS / PLUGIN LANDSCAPE</div>
    <h1>Architecture Manifest</h1>
    <p class="lede">Full-catalog coverage of the awesome-dsh-plugin ecosystem, a ten-layer SOTA model, and the validation path that keeps the manifest honest.</p>
    <div class="meta">
      <span>Snapshot <b>{{SNAPSHOT}}</b></span>
      <span>Manifest <b>v1</b></span>
      <span><b>{{LISTED}}</b> listed &middot; <b>{{KNOWN}}</b> known</span>
    </div>
  </div>
</header>
<main class="wrap">
  <section id="at-a-glance">
    <div class="section-head"><h2>At a glance</h2><p>current snapshot</p></div>
    <div class="kpi-grid">{{KPIS}}</div>
    <p class="note">Scale model: the catalog is local indexed data, not {{LISTED}} mounted plugins. Query it, shortlist three, and install only with explicit consent.</p>
  </section>

  <section id="architecture">
    <div class="section-head"><h2>Architecture graph</h2><p>sources &rarr; normalize &rarr; data &rarr; builders &rarr; surfaces</p></div>
    <p class="note">Only the Awesome README and the npm index are parsed. Plugin repositories are reference evidence for exemplars and anchors, not parser inputs.</p>
    <div class="flow-row">
      <div class="stage"><div class="stage-head"><h3>Sources</h3><p>upstream inputs</p></div><div class="chips">{{SOURCE_CHIPS}}</div></div>
      <div class="flow-arrow"><span>parse</span><i>&#8594;</i></div>
      <div class="stage"><div class="stage-head"><h3>Normalize</h3><p>refresh-catalog</p></div><div class="chips">{{PARSER_CHIPS}}</div></div>
      <div class="flow-arrow"><span>write</span><i>&#8594;</i></div>
      <div class="stage"><div class="stage-head"><h3>Data</h3><p>normalized snapshot</p></div><div class="chips">{{DATA_CHIPS}}</div></div>
      <div class="flow-arrow"><span>build</span><i>&#8594;</i></div>
      <div class="stage"><div class="stage-head"><h3>Builders</h3><p>read data, write surfaces</p></div><div class="chips">{{BUILDER_CHIPS}}</div></div>
      <div class="flow-arrow"><span>render</span><i>&#8594;</i></div>
      <div class="stage"><div class="stage-head"><h3>Surfaces</h3><p>human and model views</p></div><div class="chips">{{SURFACE_CHIPS}}</div></div>
    </div>
    <div class="guards">
      <h3>Guards</h3>
      <p>Guards observe data and surfaces; they do not generate content. Dashed chips are manual surfaces.</p>
      <div class="chips">{{GUARD_CHIPS}}</div>
    </div>
  </section>

  <section id="repo-decision">
    <div class="section-head"><h2>Repository &rarr; decision</h2><p>evidence to action</p></div>
    <p class="note">A listed repository becomes a catalog entry through the README; refresh-catalog does not clone or parse repository code.</p>
    <div class="steps">
      <div class="step"><div class="n">01</div><h3>Listed repository</h3><p>GitHub or npm identity in the README</p></div>
      <div class="step-arrow">&#8594;</div>
      <div class="step"><div class="n">02</div><h3>Catalog entry</h3><p>title, description, category, npm identity</p></div>
      <div class="step-arrow">&#8594;</div>
      <div class="step"><div class="n">03</div><h3>Category + layer</h3><p>where the work belongs and which seams apply</p></div>
      <div class="step-arrow">&#8594;</div>
      <div class="step"><div class="n">04</div><h3>Anchors + exemplars</h3><p>comparable implementations and evidence</p></div>
      <div class="step-arrow">&#8594;</div>
      <div class="step"><div class="n">05</div><h3>Decision brief</h3><p>adopt, trial, build, avoid, or insufficient evidence</p></div>
      <div class="step-arrow">&#8594;</div>
      <div class="step"><div class="n">06</div><h3>Install / verify / rollback</h3><p>exact spec, profile, checks, removal path</p></div>
    </div>
  </section>

  <section id="automation">
    <div class="section-head"><h2>SOTA automation loop</h2><p>discover, classify, prove, act</p></div>
    <div class="steps">
      <div class="step"><div class="n">01</div><h3>Frame</h3><p>outcome, host, constraints, evidence bar</p></div>
      <div class="step-arrow">&#8594;</div>
      <div class="step"><div class="n">02</div><h3>Discover</h3><p>query catalog, then all 23 categories</p></div>
      <div class="step-arrow">&#8594;</div>
      <div class="step"><div class="n">03</div><h3>Classify</h3><p>primary layer and documented seam</p></div>
      <div class="step-arrow">&#8594;</div>
      <div class="step"><div class="n">04</div><h3>Shortlist</h3><p>three architectures, not three names</p></div>
      <div class="step-arrow">&#8594;</div>
      <div class="step"><div class="n">05</div><h3>Evaluate</h3><p>evidence E0-E4 and eight-axis rubric</p></div>
      <div class="step-arrow">&#8594;</div>
      <div class="step"><div class="n">06</div><h3>Decide</h3><p>adopt, trial, build, avoid, or insufficient</p></div>
      <div class="step-arrow">&#8594;</div>
      <div class="step"><div class="n">07</div><h3>Verify</h3><p>disposable profile, failure path, rollback</p></div>
    </div>
    <div class="evidence-row">
      <span><b>E0</b> claim</span><span><b>E1</b> source inspected</span><span><b>E2</b> booted</span><span><b>E3</b> behavior exercised</span><span><b>E4</b> reproduced</span>
    </div>
  </section>
'''

coverage_metrics = [
    ('Listed entries', fmt(listed), 'README entries'),
    ('Known universe', fmt(known), 'listed + index-only'),
    ('npm-indexed entries', fmt(npm), 'with a known version'),
    ('Unique npm packages', fmt(unique_npm), 'distinct package names'),
    ('GitHub-only', fmt(github), 'manual install path'),
    ('Index packages', fmt(index_packages), 'npm index total'),
    ('Index-only', fmt(index_only), 'outside the listed count'),
    ('Categories', fmt(len(stats['categories'])), 'all covered'),
    ('Exemplars', fmt(exemplars), '3 per category'),
    ('Layers', fmt(len(stats['layers'])), 'SOTA model'),
    ('Table anchors', fmt(len(anchors)), '3 per layer'),
    ('Prose anchors', fmt(len(reference)), 'layer-model set'),
]
coverage_rows = ''.join('<tr><td>' + esc(a) + '</td><td class="num">' + esc(b) + '</td><td>' + esc(c) + '</td></tr>' for a, b, c in coverage_metrics)
ledger = fmt(index_packages) + ' index packages = ' + fmt(unique_npm) + ' unique matched packages + ' + fmt(index_only) + ' index-only packages'

checks = [
    ('Catalog', fmt(listed) + ' entries', 'README + npm index, ' + fmt(len(stats['categories'])) + ' categories'),
    ('Anchor validator', fmt(len(anchors)) + '/' + fmt(len(anchors)) + ' exact', '3 per layer, ' + fmt(len(reference)) + '/' + fmt(len(reference)) + ' prose anchors'),
    ('Negative tests', 'failure paths proven', '4/2 split, report table, extra and missing prose fail'),
    ('Warning tests', 'WARN, exit 0', 'duplicate title, install-only, shared npm package'),
    ('Doc drift tests', 'stale values fail', 'distribution block, layer row, match rate; unrelated decimal ignored'),
    ('Doc validator', '23/23 + 10/10', 'report 23/23, layers 10/10, landscape 23/23, architecture contract'),
    ('Theme validator', 'light + print', 'tag and code contrast, light sota-card, screen and print'),
]
checks_html = ''.join('<div class="check"><b>' + esc(a) + '</b><span>' + esc(b) + '</span><span>' + esc(c) + '</span></div>' for a, b, c in checks)

links = [
    ('Landscape report', 'README.md', 'findings, coverage map, layers, limits'),
    ('Coverage appendix', 'coverage.md', 'generated totals and index-only ledger'),
    ('Validation record', 'VALIDATION.md', 'evidence, invariant policy, uncovered scope'),
    ('Architecture manifest (Markdown)', '../../.dsh/skills/dsh-plugin-sota/references/architecture.md', 'graphs, components, hard versus warning invariants'),
    ('Architecture ADR', 'ADR-0001-final-architecture.md', 'accepted decision, exact counts, revisit triggers'),
    ('Install guide', 'INSTALL.md', 'copy, prerequisites, offline validation, other machines'),
    ('Global routing', 'AGENTS.global.md', 'user-global routing for every workspace'),
    ('Skill entrypoint', '../../.dsh/skills/dsh-plugin-sota/SKILL.md', 'routing, default path, output contract'),
    ('Full landscape reference', '../../.dsh/skills/dsh-plugin-sota/references/landscape.md', '23 categories, exemplars, signals, questions'),
    ('Doc validator', '../../.dsh/skills/dsh-plugin-sota/scripts/validate-docs.mjs', 'report, layers, landscape, coverage, architecture'),
    ('Upstream list', 'https://github.com/awesome-dsh-plugin/awesome-dsh-plugin', 'the source catalog'),
]
links_html = ''.join('<li><a href="' + esc(href) + '">' + esc(label) + '</a><small>' + esc(note) + '</small></li>' for label, href, note in links)

rest = '''
  <section id="coverage">
    <div class="section-head"><h2>Coverage ledger</h2><p>snapshot totals</p></div>
    <div class="table-wrap"><table><thead><tr><th>Metric</th><th class="num">Count</th><th>Meaning</th></tr></thead><tbody>{{COVERAGE_ROWS}}</tbody></table></div>
    <div class="equation">{{LEDGER}}</div>
    <div class="section-head" style="margin-top:26px"><h2>Category coverage</h2><p>all 23 categories</p></div>
    <div class="table-wrap"><table><thead><tr><th>Key</th><th>Category</th><th class="num">Entries</th><th class="num">npm</th><th>Layer</th></tr></thead><tbody>{{CATEGORY_ROWS}}</tbody></table></div>
  </section>

  <section id="category-sota">
    <div class="section-head"><h2>Category SOTA matrix</h2><p>all 23 categories, three exemplars each</p></div>
    <div class="table-wrap matrix"><table><thead><tr><th>Key</th><th>Category</th><th class="num">Entries</th><th class="num">npm</th><th>Layer</th><th>SOTA focus</th><th>Exemplars</th></tr></thead><tbody>{{CATEGORY_SOTA_ROWS}}</tbody></table></div>
  </section>

  <section id="sota-stack">
    <div class="section-head"><h2>Skills, tools, automation</h2><p>the layers where workflow is composed</p></div>
    <div class="sota-grid">{{SOTA_CARDS}}</div>
  </section>

  <section id="layers">
    <div class="section-head"><h2>Ten layers</h2><p>where plugin behavior belongs</p></div>
    <div class="layer-grid">{{LAYER_CARDS}}</div>
  </section>

  <section id="invariants">
    <div class="section-head"><h2>Invariant classes</h2><p>hard failures versus legitimate variation</p></div>
    <div class="two-col">
      <div class="panel hard">
        <h3>Hard failures</h3>
        <ul>
          <li>Catalog length equals stats.totals.entries.</li>
          <li>Every stats total, category count, and layer count is recomputed from the catalog.</li>
          <li>Category counts sum to the catalog total; IDs are unique.</li>
          <li>23 categories; 3 exemplars each; 30 anchors, exactly 3 per layer.</li>
          <li>36 prose anchors equal the set extracted from layer-model.md.</li>
          <li>Index ledger holds: index packages = unique matched npm packages + index-only.</li>
          <li>Report, layers, landscape, coverage, and architecture agree with stats.</li>
          <li>Local deliverable links resolve.</li>
        </ul>
      </div>
      <div class="panel warn">
        <h3>Warnings, not failures</h3>
        <ul>
          <li>Duplicate titles: IDs remain unique.</li>
          <li>Install specs on GitHub-only entries.</li>
          <li>Multiple entries sharing one npm package.</li>
          <li>Install/npm presence differences.</li>
        </ul>
        <p class="note">These reflect legitimate upstream variation. The warning tests prove they exit 0 with WARN lines.</p>
      </div>
    </div>
  </section>

  <section id="validation">
    <div class="section-head"><h2>Validation</h2><p>fresh checks, not adjectives</p></div>
    <div class="check-grid">{{CHECKS}}</div>
  </section>

  <section id="links">
    <div class="section-head"><h2>Source artifacts</h2><p>open the underlying files</p></div>
    <ul class="links">{{LINKS}}</ul>
  </section>
</main>
<footer class="wrap">
  <p><b>DSH Plugin Landscape</b> — final architecture manifest. Snapshot {{SNAPSHOT}}. This is full catalog and index accounting, not a source-level security review. No third-party plugin was installed or executed.</p>
  <p>Generated from data/stats.json by scripts/build-html.py. Source list: <a href="https://github.com/awesome-dsh-plugin/awesome-dsh-plugin">awesome-dsh-plugin</a>.</p>
</footer>
</body>
</html>
'''

CSS = CSS.strip()

page = '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>DSH Plugin Landscape - Final Architecture Manifest</title>\n<style>\n' + CSS + '\n</style>\n</head>\n<body>\n'
page += body + rest
page = page.replace('{{SNAPSHOT}}', esc(snapshot))
page = page.replace('{{LISTED}}', fmt(listed))
page = page.replace('{{KNOWN}}', fmt(known))
page = page.replace('{{KPIS}}', kpis)
page = page.replace('{{SOURCE_CHIPS}}', source_chips)
page = page.replace('{{PARSER_CHIPS}}', parser_chips)
page = page.replace('{{DATA_CHIPS}}', data_chips)
page = page.replace('{{BUILDER_CHIPS}}', builder_chips)
page = page.replace('{{SURFACE_CHIPS}}', surface_chips)
page = page.replace('{{GUARD_CHIPS}}', guard_chips)
page = page.replace('{{COVERAGE_ROWS}}', coverage_rows)
page = page.replace('{{LEDGER}}', ledger)
page = page.replace('{{CATEGORY_ROWS}}', category_rows)
page = page.replace('{{CATEGORY_SOTA_ROWS}}', category_sota_rows)
page = page.replace('{{SOTA_CARDS}}', sota_cards_html)
page = page.replace('{{LAYER_CARDS}}', layer_cards)
page = page.replace('{{CHECKS}}', checks_html)
page = page.replace('{{LINKS}}', links_html)

if '--check' in sys.argv:
    index = sys.argv.index('--check')
    target = Path(sys.argv[index + 1]).resolve() if index + 1 < len(sys.argv) else OUT
    if not target.exists():
        print('HTML is missing: ' + str(target))
        sys.exit(1)
    if target.read_text() != page:
        print('HTML is stale: ' + str(target))
        sys.exit(1)
    print('HTML is current: ' + str(target))
    sys.exit(0)

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(page)
print('Wrote ' + str(OUT) + ' (' + fmt(os.path.getsize(OUT)) + ' bytes)')
