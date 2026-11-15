# ADR-0001: Final DSH plugin landscape and SOTA workflow architecture

- **Status:** Accepted
- **Date:** 2026-11-14
- **Snapshot:** 2026-11-14 UTC
- **Owner:** dsh-plugin-sota skill pack
- **Supersedes:** none
- **Revisit:** upstream schema change, DSH version bump, category/anchor change, or annual review

## Context

The awesome-dsh-plugin list is large, fast-moving, and description-level. A flat
list cannot answer which layer a plugin belongs to, which seams it should use,
what evidence supports adoption, or whether the manifest is still current.

The workflow needed four properties:

1. full catalog accounting, including index-only entries;
2. a stable layer model that survives upstream churn;
3. evidence and safety rules that do not treat a listing as a review;
4. reproducible generation and validation, including a portable rendered manifest.

## Scale model

The 11,111 entries are catalog rows, not a mounted plugin tree. The workflow
loads none of them at rest. It queries the local JSONL catalog, ranks a small
shortlist, evaluates E0-E4, and installs only a candidate the user explicitly
approves. The 30 layer anchors and 69 category exemplars are the review surface;
the full catalog remains data.

This is why the workflow is seamless at 10k+ scale: discovery is an index scan,
not a runtime plugin tree.

## Decision

Adopt a project-local skill pack at .dsh/skills/dsh-plugin-sota with:

- a normalized catalog, stats snapshot, and separate index-only ledger;
- a ten-layer SOTA model (L0–L9);
- 30 exact layer anchors and 36 exact prose anchors;
- 69 category exemplars (3 per category);
- hard structural invariants and warning-level upstream variation;
- validators for counts, anchors, prose, docs, HTML freshness, and light/print themes;
- a self-contained HTML manifest;
- a session brief for future agents and an install guide for another machine.

The workflow does not install or execute third-party plugins and does not claim a
source-level security review.

## Finalized counts

| Universe | Count |
|---|---:|
| Listed plugin entries | 11,111 |
| Unique repository roots | 10,703 |
| Index-only entries | 8 |
| Known entries | 11,119 |
| npm-indexed entries | 5,635 |
| Unique npm packages | 5,635 |
| GitHub-only entries | 5,476 |
| npm index packages | 5,643 |
| Categories | 23 |
| Category exemplars | 69 |
| SOTA layers | 10 |
| Table anchors | 30 (3 per layer) |
| Prose anchors | 36 |

**Repository count:** 10,703 unique GitHub roots. The 11,111 listed entries are
larger because monorepos can contribute multiple entries. **Plugin count:**
11,111 listed entries, or 11,119 known entries including the 8 index-only
packages. **npm package count:** 5,635 unique packages.

## Consequences

### Positive

- The same catalog answers discovery, comparison, authoring, and review.
- Layer ownership is explicit; a plugin cannot silently become a parallel seam.
- Counts are checked, not merely written.
- Generated HTML is freshness-checked and light/print-safe.
- The pack can be copied to another machine and validated offline from data/raw.

### Negative

- The catalog is a description-level snapshot, not source verification.
- Layer and tag inference is heuristic.
- Chrome is optional but required for the theme check.
- The manifest must be regenerated after a refresh.

## Portability and prerequisites

Core catalog and validation:

- Node.js 22 or newer.
- Python 3 for the HTML renderer.
- No network is required for the offline refresh when data/raw is present.
- No third-party plugin installation is required.
- Docs resolve at the repo layout by default. Set DSH_DOCS_DIR to an absolute
  docs directory when the skill and docs are copied separately.

Optional light/print theme check:

- Node.js 22+ global WebSocket.
- Chrome or Chromium.
- Set DSH_CHROME when Chrome is not in a standard path.
- Without Chrome the check prints SKIP and exits 0.
- Use --require (or DSH_REQUIRE_THEME_CHECK=1) to make it a hard CI error.

See [INSTALL.md](INSTALL.md) for copy and validation commands.

## Session bootstrap

Future sessions use the project AGENTS.md and the user-global
$DSH_HOME/AGENTS.md chain to load the skill and run:

~~~sh
node .dsh/skills/dsh-plugin-sota/scripts/session-brief.mjs
~~~

The brief reports READY or NOT READY, the snapshot, catalog counts, docs path,
HTML size, Python status, and the next query command. It exits non-zero when the
catalog, docs, renderer, or final HTML is missing. test-brief.mjs proves both the
empty-docs and missing-renderer NOT READY paths.

## Revisit and update

1. Refresh upstream:

~~~sh
node scripts/refresh-catalog.mjs
~~~

2. Rebuild surfaces:

~~~sh
node scripts/build-landscape.mjs
node scripts/build-coverage.mjs
node scripts/build-report-summary.mjs
python3 scripts/build-html.py
~~~

3. Run the full pipeline, including --require for the theme check in CI:

~~~sh
node scripts/refresh-catalog.mjs --check
node scripts/validate-anchors.mjs
node scripts/test-anchors.mjs
node scripts/test-warnings.mjs
node scripts/test-docs.mjs
python3 scripts/build-html.py --check
node scripts/validate-themes.mjs --require
node scripts/validate-docs.mjs
~~~

4. Review WARN lines for duplicate titles, install-only entries, or shared npm
   packages. Warnings are legitimate variation; hard failures require a parser or
   data fix.

5. Update the counts in this ADR only when the snapshot changes materially, and
   record the new snapshot date.

## Related artifacts

- [Architecture manifest](../../.dsh/skills/dsh-plugin-sota/references/architecture.md)
- [Skill entrypoint](../../.dsh/skills/dsh-plugin-sota/SKILL.md)
- [Landscape report](README.md)
- [Scheduled refresh ADR](ADR-0002-scheduled-upstream-refresh.md)
- [Validation record](VALIDATION.md)
- [Install guide](INSTALL.md)
- [Global routing template](AGENTS.global.md)
- [Final HTML manifest](final-manifest.html)
