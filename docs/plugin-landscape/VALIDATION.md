# Delivery validation

Scope: the project-local DSH plugin landscape workflow (skill pack, catalog,
generated landscape/coverage, and AGENTS.md routing). This is a content and data
delivery; it has no application runtime or TDD red/green timeline.

Generated: 2026-11-14.

## Evidence

| Check | Command / action | Result | Covered scope |
|---|---|---|---|
| Session brief | node scripts/session-brief.mjs | READY; snapshot, 11,111/11,119, 23 categories, docs, renderer, HTML 54,118 bytes | Bootstrap |
| Global routing | ~/.dsh/AGENTS.md + ~/.dsh/skills + ~/docs | User-global chain loads in every workspace; skill and brief READY from /tmp; project instructions explicitly take precedence | Native default |
| Brief failure paths | node scripts/test-brief.mjs | READY baseline; empty docs and missing renderer both NOT READY, exit 1 | Bootstrap guard |
| Catalog parse | node scripts/refresh-catalog.mjs | 11,111 entries, 23 categories, 5,635 npm-indexed, 5,476 GitHub-only, 8 index-only | Full README + index |
| Offline catalog check | node scripts/test-catalog-offline.mjs | Child process with fetch-counting preload; exit 0, fetch calls 0 | Snapshot path |
| Category totals | node scripts/refresh-catalog.mjs --check | Counts sum to 11,111; no empty category; 3 exemplars each | All 23 categories |
| Npm ledger | node scripts/refresh-catalog.mjs --check | 5,635 unique npm names; 5,643 index = 5,635 matched + 8 index-only | Match integrity |
| Exemplars | exemplars --json + get per id | 69/69 resolve; 69/69 notes present | Curated shortlist |
| Layer anchors | refresh-catalog.mjs --check + validate-anchors.mjs | 30/30 exact IDs, titles, and npm names; 3 per layer; report table matches; 36/36 reference anchors exact | SOTA anchors table and layer-model prose |
| Scripts | node --check on all scripts | Pass | Syntax and ESM parse |
| Negative tests | node scripts/test-anchors.mjs | 4/2 split, report table mismatch, extra prose, and missing prose all fail; exact set passes | Validator failure paths |
| Docs consistency | node scripts/validate-docs.mjs | Report 23/23, layers 10/10, landscape 23/23, coverage totals, architecture contract match; 3 exemplars each | Generated and hand-maintained docs |
| Executive summary | node scripts/build-report-summary.mjs + validate-docs.mjs | Top 7 category counts and 50.7% match rate match stats | Report distribution block |
| Warning invariants | node scripts/test-warnings.mjs | Duplicate title, install-only entry, and shared npm package all pass with WARN | Legitimate upstream variation |
| Doc drift tests | node scripts/test-docs.mjs | Stale distribution bullet, layer row, match rate, and HTML all fail; unrelated decimal ignored; exact docs pass | Executive summary, layer table, and HTML freshness guard |
| Index-only ledger | refresh-catalog.mjs --check | 8 entries match stats; source is npm-index-only | Known universe accounting |
| Query | stats --json, search --json, get | Pass | Query surface |
| Skill discovery | load dsh-plugin-sota through the live skill catalog | Loaded; filesystem provider | Runtime discovery |
| Local links | link scan of 16 deliverable markdown files | 0 broken | Report, ADRs, install, global routing, skill, references |
| Install layouts | temp-home whole-repo copy and split copy + DSH_DOCS_DIR | refresh, HTML check, anchors, docs, and themes pass in both layouts | Portability |
| User mirror | rsync -a --delete + diff -r | Docs and skill trees identical; stale probes pruned; user brief READY; user HTML 12 hrefs, 0 broken | User scope |
| GitHub CI definition | .github/workflows/validate.yml | Node 22/Python 3.12; brief, offline catalog, anchors, docs, HTML, optional theme | Not executed on GitHub |
| Scheduled refresh definition | .github/workflows/refresh-upstream.yml | Weekly/manual; REFRESH_TOKEN or github.token; fixed branch fetch + explicit lease; open-PR gate; merged/closed old PR ignored; never main | Not executed on GitHub |
| Refresh demo | temp copy: refresh --offline, rebuild, full suite | 11,111 entries; READY; fetch calls 0; docs 23/23; themes pass | Complex workflow |
| Workflow lint | actionlint -shellcheck= -pyflakes= .github/workflows/validate.yml .github/workflows/refresh-upstream.yml | Pass; trigger keys parsed as YAML 1.2 by actionlint | Workflow syntax |
| Generated docs | build-landscape, build-coverage, build-report-summary, build-html, check | Landscape 829 lines; coverage and summary current | Regeneration path |
| Final HTML | python3 scripts/build-html.py --check + Chrome headless render | 54,118 bytes, self-contained, current check passes, screenshot verified | Rendered manifest |
| Light/print render | node scripts/validate-themes.mjs | Screen: tag 7.11:1, code 7.11:1; print: tag 7.82:1, code 17.43:1; sota-card light; SKIP without Chrome/WebSocket, --require fails | CSS theme surface |
| HTML links | href scan | 12 hrefs (10 local, 2 external), 0 local broken; no external scripts or styles | Rendered manifest |

## Evidence slots

- **Evidence action / check performed:** catalog parse, strict npm match audit,
  index-only ledger reconciliation, category reconciliation, exemplar resolution,
  anchor set extraction, executive-summary reconciliation, negative validator
  tests, warning-invariant tests, doc-drift tests, HTML freshness check, light/print
  computed-style checks, session brief failure paths, temp-home whole-repo and split
  installs, render and screenshot, script syntax, query smoke tests, live skill
  load, local link scan.
- **Result / exit status:** all checks returned exit 0; 0 broken links; 69/69
  exemplars resolved; 5,635 unique npm matches; 8 index-only entries; negative
  tests observed the expected 4/2, extra-prose, missing-prose, stale-distribution,
  stale-layer-row, stale-match-rate, and stale-HTML failures.
- **Covered scope:** the generated catalog, the 23-category landscape, the
  30 exact layer-anchor identities, the 36 prose anchors, the index-only ledger,
  the executive distribution block, the negative-test failure paths, the
  warning-level variation policy, the doc-drift guard, HTML freshness, light and
  print computed styles, session brief failure paths, both temp-home install
  layouts, the rendered HTML manifest, the skill's discoverability, its scripts,
  and the report's local links.
- **Uncovered scope:** source-level review of all 11,111 repositories; installation
  or runtime exercise of any listed plugin; popularity or maintenance ranking;
  upstream changes after the snapshot.
- **Residual risk:** descriptions are author claims; layer/tag assignment is a
  keyword heuristic; roughly half the entries are GitHub-only; upstream counts
  can change.
- **Confidence grade:** B. Target evidence is fresh and reproducible; the
  remaining risk is the stated sampling and heuristic scope, not a hidden
  execution claim.

## Anchor audit

The 30 layer anchors are exact catalog identities, not substring matches. The
check rejects an anchor when its ID is absent, its title differs, its npm name
differs, or its display is neither the exact title nor the exact npm name. Current
result: 30/30 pass, 3 per layer; the 36 exact names used in the layer-model
prose also pass 36/36. Negative tests prove a 4/2 split, a report table mismatch, an
extra prose name, and a missing prose name each fail. The audit intentionally distinguishes
light-cheng/dsh-strata (npm @lightcheng/dsh-strata) from jsdvjx/dsh-strata (npm
dsh-strata), and records that PolinniZhong/dsh-skill-intelligence publishes as
dsh-skill-trace and ECCVIK/lmtagent is GitHub-only.

## Invariant policy

Hard invariants protect structural correctness: catalog and stats agreement,
category sums, unique IDs, 3 exemplars and 3 anchors per layer, exact anchor and
prose identities, the index ledger, and cross-document counts. Legitimate
upstream variation is warning-level: duplicate titles, install specs on
GitHub-only entries, shared npm packages, and install/npm presence differences.
The warning tests prove those cases exit 0 with WARN lines. The full ownership
and invariant map is in
[references/architecture.md](../../.dsh/skills/dsh-plugin-sota/references/architecture.md).

## Not claimed

- Not a security review of the ecosystem.
- Not a ranking of plugin quality or popularity.
- Not proof that every GitHub-only entry installs.
- Not a substitute for reading the source of a plugin before installing it.
- No third-party plugin was installed or executed to produce this delivery.

## Formal report note

The doublecheck report tool returned a grill verdict with a null spec and no
test timeline for this content workflow. That verdict is recorded here rather
than rounded up. The evidence above is the delivery proof for the stated scope.

## Next most valuable check

Pick one category, choose one npm-indexed exemplar, install it into a disposable
profile, boot, exercise the claimed behavior, and remove it. That would upgrade
the exemplar evidence from E0/E1 to E2/E3 for that one candidate.
