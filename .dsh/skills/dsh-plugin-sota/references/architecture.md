# Workflow architecture manifest

This document is the ownership and invariant map for the DSH plugin landscape
workflow. It answers three questions:

1. Which component owns which artifact?
2. Which conditions must fail a refresh, and which are legitimate upstream
   variation that should only warn?
3. How does a change flow from the upstream list to the report, the skill, and
   the validators?

Snapshot: 2026-11-14 UTC.

## Components and ownership

| Component | File | Owns | Output |
|---|---|---|---|
| Source adapters | scripts/refresh-catalog.mjs | Fetch or read README + npm index | raw sources, parsed entries |
| Parser | scripts/refresh-catalog.mjs | Read 23 categories and list entries | normalized entries |
| Matcher | scripts/refresh-catalog.mjs | Exact title / fragment / directory npm matching | npm identity or GitHub-only |
| Stats builder | scripts/refresh-catalog.mjs | Recompute totals, categories, layers, tags | data/stats.json |
| Catalog writer | scripts/refresh-catalog.mjs | One JSON entry per listed plugin | data/catalog.jsonl |
| Index-only ledger | scripts/refresh-catalog.mjs | Record index entries absent from the README | data/index-only.json |
| Layer anchor data | data/layer-anchors.json | 30 table anchors, 3 per layer | exact identities |
| Prose anchor data | data/reference-anchors.json | 36 names used in layer-model prose | exact identities |
| Category data | data/categories.json | 23 categories, layers, exemplars, notes | category metadata |
| Landscape builder | scripts/build-landscape.mjs | Render all 23 category sections | references/landscape.md |
| Coverage builder | scripts/build-coverage.mjs | Render the data appendix | docs/plugin-landscape/coverage.md |
| Report summary builder | scripts/build-report-summary.mjs | Render executive distribution block | docs/plugin-landscape/README.md |
| Anchor validator | scripts/validate-anchors.mjs | Exact identity, 3 per layer, prose set equality, report table | pass/fail |
| Anchor negative tests | scripts/test-anchors.mjs | Prove the anchor failure paths fail | pass/fail |
| Catalog warning tests | scripts/test-warnings.mjs | Prove legitimate variation warns, not fails | pass/fail |
| Doc drift tests | scripts/test-docs.mjs | Prove stale summary counts and match rate fail | pass/fail |
| Theme validator | scripts/validate-themes.mjs | Verify light-screen and print computed styles; SKIP without Node 22+ WebSocket/Chrome, --require fails | pass/fail/skip |
| Doc validator | scripts/validate-docs.mjs | Cross-check report, landscape, coverage, stats, architecture | pass/fail |
| HTML renderer | scripts/build-html.py | Render and freshness-check the self-contained manifest | docs/plugin-landscape/final-manifest.html |
| Session brief | scripts/session-brief.mjs | Readiness, snapshot, counts, docs, renderer, HTML size | READY/NOT READY |
| Brief tests | scripts/test-brief.mjs | Prove READY and NOT READY/exit 1 paths | pass/fail |
| Offline catalog test | scripts/test-catalog-offline.mjs | Child process + fetch counter proves zero fetch calls | pass/fail |
| Refresh PR body | scripts/pr-body.mjs | Build the scheduled refresh PR summary from stats | markdown |
| Query CLI | scripts/query.mjs | Search, category, layer, tag, exemplar, get | terminal/JSON |
| Skill entrypoint | SKILL.md | Route, rules, output contract | model instructions |
| Landscape report | docs/plugin-landscape/README.md | Findings, coverage map, limits | human report |
| Validation record | docs/plugin-landscape/VALIDATION.md | Evidence and uncovered scope | delivery proof |

## Data flow

~~~text
awesome README ─┐
                ├─> refresh-catalog ─> catalog.jsonl
npm index ──────┘                    ├─> stats.json
                                     ├─> index-only.json
                                     └─> raw/ (source snapshot)

catalog.jsonl + stats.json ─> build-landscape ─> references/landscape.md
catalog.jsonl + stats.json ─> build-coverage  ─> docs/plugin-landscape/coverage.md
catalog.jsonl + stats.json ─> build-report-summary ─> report distribution block
stats + docs ─> build-html ─> final-manifest.html

layer-anchors.json + catalog.jsonl + layer-model.md + report
  ─> validate-anchors ─> test-anchors

report + landscape + coverage + stats + catalog + index-only
  ─> validate-docs

catalog.jsonl + stats.json + index-only.json
  ─> refresh-catalog --check
~~~

No hand edit is authoritative for a generated file. The source of truth is the
upstream list plus the npm index; the catalog and stats are the normalized
snapshot; the report and landscape are rendering layers.

## Architecture graph

~~~mermaid
flowchart LR
  subgraph Sources
    A[Awesome README]
    B[npm plugin index]
  end
  subgraph Normalize
    D[Parser and matcher]
    E[catalog.jsonl]
    F[stats.json]
    G[index-only.json]
  end
  subgraph Knowledge
    H[categories.json]
    I[landscape-content.json]
    J[layer-anchors.json]
    K[reference-anchors.json]
  end
  subgraph Builders
    B1[build-landscape]
    B2[build-coverage]
    B3[build-report-summary]
  end
  subgraph Surfaces
    L[landscape.md]
    M[report README]
    N[coverage.md]
    O[SKILL.md]
  end
  subgraph Guards
    P[refresh check]
    Q[anchor validator and tests]
    R[warning tests]
    S[doc validator and drift tests]
  end
  A --> D
  B --> D
  D --> E
  D --> F
  D --> G
  H --> E
  E --> B1
  F --> B1
  I --> B1
  B1 --> L
  F --> B2
  B2 --> N
  F --> B3
  B3 -->|summary block| M
  J --> Q
  K --> Q
  E --> Q
  F --> Q
  M --> S
  L --> S
  N --> S
  E --> P
  F --> P
  G --> P
  Q --> P
  R --> P
  S --> P
~~~

Plugin repositories are reference evidence for exemplars and anchors;
refresh-catalog parses only the Awesome README and the npm index. The
repository-to-decision graph below shows the human path from a repository to a
decision.

## Repository-to-decision graph

~~~mermaid
flowchart TD
  R[GitHub repository] --> E[Catalog entry]
  E --> C[Category]
  E --> L[Layer set]
  E --> T[Tags]
  E --> N[npm identity or GitHub-only]
  C --> X[Exemplar or anchor]
  L --> X
  X --> B[Decision brief]
  N --> B
  B --> D[Install / verify / rollback]
  D --> H[Human outcome]
~~~

## Manifest status

- Manifest version: 1
- Owner: the dsh-plugin-sota skill pack
- Normalized data: data/catalog.jsonl, data/stats.json, data/index-only.json
- Knowledge data: data/categories.json, data/landscape-content.json,
  data/layer-anchors.json, data/reference-anchors.json
- Validation: session brief and negative brief tests, offline catalog check,
  refresh check, anchor
  validator and tests, warning tests, doc drift tests, HTML freshness check,
  theme validator, and doc validator.
- Rendered manifest: docs/plugin-landscape/final-manifest.html (self-contained,
  no external scripts or styles).
- Decision record: docs/plugin-landscape/ADR-0001-final-architecture.md.
- Global routing: docs/plugin-landscape/AGENTS.global.md, installed at
  $DSH_HOME/AGENTS.md, so every workspace resolves the skill and brief.
- CI: .github/workflows/validate.yml (offline snapshot checks) and
  .github/workflows/refresh-upstream.yml (weekly token refresh + PR).
- Portability: docs/plugin-landscape/INSTALL.md (Node 22+, Python 3, optional
  Chrome/DSH_CHROME, offline data/raw, DSH_DOCS_DIR for split skill/docs).

## Coverage contract


The current snapshot has two universes:

| Universe | Count | Meaning |
|---|---:|---|
| Listed entries | 11,111 | Entries in the awesome README |
| Index-only entries | 8 | In the npm index, absent from the README |
| Known universe | 11,119 | Listed + index-only |

Within the listed universe:

| Metric | Count |
|---|---:|
| npm-indexed entries | 5,635 |
| unique npm packages | 5,635 |
| GitHub-only entries | 5,476 |
| categories | 23 |
| curated exemplars | 69 |
| layers | 10 |
| table anchors | 30 (3 per layer) |
| prose anchors | 36 |

The index ledger is:

~~~text
5,643 index packages = 5,635 unique matched packages + 8 index-only packages
~~~

The npm-indexed entry count and the unique-package count are reported
separately. Their equality is **not** an invariant; a future monorepo can map two
entries to one package.

## Invariant classes

### Hard invariants — must fail the check

- Catalog length equals stats.totals.entries.
- Every stats total is recomputed from the catalog, not asserted against an
  unrelated total.
- Category counts sum to the catalog length.
- Every category count and npmCount equals the catalog.
- Every layer primary/mention count equals the catalog.
- 23 category rows exist and every category is non-empty.
- Every category has exactly 3 curated exemplars, and every exemplar ID resolves.
- Catalog IDs are unique.
- The index ledger holds: index packages = unique matched npm packages +
  index-only packages.
- The index-only file count and source match the stats.
- Exactly 30 table anchors exist, exactly 3 per layer, and every ID, title, npm
  name, and display matches the catalog.
- The 36 prose anchor names equal the set extracted from layer-model.md.
- The report table matches the anchor data.
- The report, landscape, and coverage agree with the stats on 23 categories.
- The report distribution block and every npm/match-rate-context percentage match the stats.
- The committed final-manifest.html matches a fresh build from the current stats.
- When the optional theme validator runs, light-screen and print computed styles
  keep readable tag/code contrast and light sota-cards.
- Local deliverable links resolve.

### Warning invariants — report, do not fail

These are legitimate upstream variation:

- Duplicate titles. IDs remain unique; the title is not the primary key.
- Install specs that do not correspond to npm entries. A GitHub-only plugin may
  ship a reviewed manual install command.
- Multiple listed entries sharing one npm package. A monorepo or a multi-entry
  distribution can do this.
- Install/npm presence differences. An npm entry may lack a usable install spec,
  or a GitHub-only entry may have one.

The check prints these as WARN lines and exits 0. The refresh writes stats from
the current catalog, so the warning reflects the new snapshot rather than
failing on the old one.

### Why the distinction exists

A catalog is a snapshot of an external ecosystem. Refusing to refresh because a
new duplicate title appears, or because a GitHub-only plugin documents an
install command, would make the workflow brittle and would not improve data
quality. The hard invariants protect structural correctness; the warnings
surface changes a human should review.


## Validation pipeline

Run from the skill directory:

~~~sh
node scripts/session-brief.mjs
node scripts/test-brief.mjs
node scripts/test-catalog-offline.mjs
node scripts/refresh-catalog.mjs --check
node scripts/validate-anchors.mjs
node scripts/test-anchors.mjs
node scripts/test-warnings.mjs
node scripts/test-docs.mjs
python3 scripts/build-html.py --check
# optional theme check: Node 22+ / Chrome; set DSH_CHROME; use --require in CI
node scripts/validate-themes.mjs
node scripts/validate-docs.mjs
node scripts/query.mjs stats
~~~

Expected shape:

~~~text
Catalog: 11111 entries, 5635 npm-indexed, 23 categories
Anchors: 30 exact catalog identities
OK
Anchors: 30/30 exact identities; report table matches; 3 per layer
Reference anchors: 36/36 exact identities; prose set matches
PASS duplicate title is warning
PASS install-only entry is warning
PASS shared npm package is warning
PASS html current
PASS stale HTML fails
PASS baseline
PASS stale distribution bullet fails
PASS stale layer row fails
PASS stale match rate fails
PASS unrelated decimal is ignored
PASS restored
screen: body light, sota-card light, tag 7.11:1, code 7.11:1
print: body light, sota-card light, tag 7.82:1, code 17.43:1
Themes: light screen + print pass
Docs: report 23/23, layers 10/10, landscape 23/23, coverage totals match; architecture contract matches; 3 exemplars each
~~~

## Change policy

1. **Upstream change:** run the online refresh, inspect WARN lines, then run the
   whole validation pipeline.
2. **Warning only:** review the changed identity or mapping. If it is legitimate,
   keep it and update any downstream editorial claim. Do not add a hard
   assertion that freezes the old shape.
3. **Hard failure:** fix the parser, matcher, stats builder, or the data contract.
   Do not hand-edit generated catalog or stats to silence the check.
4. **Category or anchor change:** update categories.json, layer-anchors.json,
   reference-anchors.json, and the report table together; the validators will
   reject a partial update.
5. **New SOTA claim:** add a source or a check. A prose claim without a catalog
   identity or validation command is not evidence.

## Failure recovery

- If the network fails, use --offline; the raw snapshot is in data/raw.
- If a refresh writes a suspiciously small catalog, the script refuses to write.
- If the report table drifts, run validate-docs and correct the table or the
  stats; do not patch the report alone.
- If an anchor is renamed upstream, update the anchor ID/title/npm in
  layer-anchors.json and the report table, then re-run test-anchors.
- If an index-only entry disappears, regenerate; the ledger count and file both
  change together.

## Limits

- The catalog is a description-level view, not a source audit.
- Layer and tag assignment is heuristic.
- Npm matching is conservative: an unmatched subpackage stays GitHub-only rather
  than inheriting a root package.
- The known universe includes eight index-only plugins; it is not merged into the
  11,111 listed count.
- No third-party plugin is installed or executed by this workflow.
