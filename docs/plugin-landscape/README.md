# DSH Plugin Landscape and SOTA Workflow

**Full coverage of the awesome-dsh-plugin list, mapped to ten plugin layers and
turned into an operational decision workflow.**

Snapshot: 2026-11-14 UTC (2026-11-14 America/New_York). Catalog: 11,111 listed
entries, 23 categories, 5,635 with a known npm version (50.7%), 5,476 GitHub-only.
Eight additional index-only plugins are recorded separately (known universe: 11,119).

A self-contained final HTML manifest is available at [final-manifest.html](final-manifest.html).
The accepted architecture and counts are in
[ADR-0001](ADR-0001-final-architecture.md); scheduled upstream refresh is in
[ADR-0002](ADR-0002-scheduled-upstream-refresh.md); portable setup is in
[INSTALL.md](INSTALL.md); global routing is in
[AGENTS.global.md](AGENTS.global.md).

---

## Executive summary

The DSH plugin ecosystem is large, fast-moving, and unevenly reviewed. The
awesome list now carries 11,111 entries across 23 categories. Roughly half have a
published npm version that the plugin index can resolve; the other half are
GitHub-only and need a manual install path.

The distribution is concentrated:

<!-- BEGIN GENERATED DISTRIBUTION -->
- UI Enhancements: 2,232 entries
- Tools & Capabilities: 1,528 entries
- Sessions & Messages: 855 entries
- Workflow & Automation: 667 entries
- Development & Runtime: 632 entries
- Usage & Billing: 598 entries
- Models & Providers: 562 entries
<!-- END GENERATED DISTRIBUTION -->

That concentration is useful, but it is not a quality signal. The list explicitly
does not rank plugins or review their security. Many entries are ambitious; some
are experiments; a few disclose serious risk in their own descriptions. The
workflow in this pack is designed around that gap.

**The core move:** do not ask "which plugin is best?" Ask "which layer owns the
outcome, which seam should carry it, what evidence do we have, and how do we
remove it?" The answer is a shortlist with evidence, not a leaderboard.

## How the 10k+ catalog is used

The catalog is local indexed data, not a mounted plugin tree. The workflow:

1. queries the JSONL catalog by category, layer, tag, or keyword;
2. shortlists three architectures;
3. evaluates E0–E4 and the eight-axis rubric;
4. installs only an approved candidate into a disposable profile;
5. records verification and rollback;
6. refreshes the manifest before making a landscape claim.

The 30 layer anchors and 69 category exemplars are the review surface. The full
catalog remains queryable data; the HTML manifest is 54 KB, not an embed of every
plugin row. That separation is why discovery stays seamless at 10k+ scale.

---

## What was delivered

A project-local skill pack at .dsh/skills/dsh-plugin-sota:

- **SKILL.md** — routing, non-negotiables, default path, output contract.
- **references/layer-model.md** — ten layers with contracts, SOTA practices,
  anti-patterns, verification, and landscape anchors.
- **references/landscape.md** — all 23 categories with counts, three exemplars,
  SOTA signals, vet questions, and a pitfall.
- **references/evaluation.md** — evidence levels E0–E4, an eight-axis rubric,
  blockers, compatibility, supply chain, privacy, and a decision matrix.
- **references/authoring.md** — package shape and per-layer authoring checklists.
- **references/workflows.md** — ten recipes from discovery to compatibility triage.
- **references/architecture.md** — component map, Mermaid architecture and
  repository-to-decision graphs, coverage contract, hard versus warning invariants,
  and change policy.
- **data/catalog.jsonl** — one JSON entry per listed plugin (full coverage).
- **data/stats.json** — coverage, category, layer, tag, and keyword statistics.
- **data/categories.json** — category metadata, layers, and curated exemplars.
- **data/landscape-content.json** — editorial signals, questions, pitfalls.
- **data/layer-anchors.json** — exact IDs, titles, npm names, and reasons for the
  30 layer anchors.
- **data/reference-anchors.json** — exact names used in the layer-model prose.
- **data/index-only.json** — the npm-index-only supplement outside the 11,111 listed
  count.
- **scripts/refresh-catalog.mjs** — rebuild from the README plus npm index.
- **scripts/build-landscape.mjs** — regenerate the 23-category landscape.
- **scripts/session-brief.mjs** — READY/NOT READY, snapshot, counts, docs,
  renderer, and HTML size for future sessions.
- **scripts/test-brief.mjs** — prove empty-docs and missing-renderer failure paths.
- **scripts/test-catalog-offline.mjs** — prove the CI catalog check never fetches.
- **scripts/query.mjs** — search, filter, stats, exemplars, and entry lookup.
- **scripts/build-coverage.mjs** — regenerate the coverage appendix.
- **scripts/build-report-summary.mjs** — regenerate the executive distribution block.
- **scripts/validate-anchors.mjs** — exact table/prose anchor and report-table checks.
- **scripts/test-anchors.mjs** — negative tests for the anchor validator.
- **scripts/test-warnings.mjs** — prove legitimate catalog variation warns, not fails.
- **scripts/test-docs.mjs** — prove stale summary counts and match rate fail.
- **scripts/validate-themes.mjs** — verify light-screen and print computed styles.
- **scripts/validate-docs.mjs** — cross-check report, landscape, coverage, stats, and
  the architecture contract.
- **final-manifest.html** — self-contained rendered architecture and coverage
  manifest with inline diagrams and no external assets.

Project routing is in AGENTS.md: plugin work loads this skill before acting.

The pack is project-scoped at .dsh/skills/dsh-plugin-sota. To use it in every
workspace, copy that directory to ~/.dsh/skills/dsh-plugin-sota (user scope). To
distribute it, package it as a bundle with a dsh.bundle patch.

The data appendix is [coverage.md](coverage.md). The generated category map is
[landscape.md](../../.dsh/skills/dsh-plugin-sota/references/landscape.md).

## Architecture at a glance

~~~mermaid
flowchart LR
  R[Listed plugin repositories] -.->|listed in README| C[Catalog entry]
  C --> K[Category, layer, tags]
  K --> S[SOTA anchors and exemplars]
  S --> D[Decision brief]
  D --> V[Install / verify / rollback]
~~~

Repositories are listed evidence: the catalog is parsed from the README and npm
index, not from repository code. The repository-to-runtime and validation graphs,
component ownership, and invariant classes are in
[architecture.md](../../.dsh/skills/dsh-plugin-sota/references/architecture.md).

---

## The ten layers


| Layer | Owns | Primary entries | Mentions |
|---|---|---:|---:|
| L0 Distribution & Composition | manifest, bundle, profile, install, update | 0 | 2,304 |
| L1 Host Runtime & Lifecycle | Cordis plugin, inject, effects, services | 632 | 2,797 |
| L2 Capability Seams & Services | definition, provider, consumer, ctx key | 562 | 2,650 |
| L3 Tools & Model-Facing Context | tool schema, policy, result, prompt cost | 2,378 | 6,959 |
| L4 Skills & Agent Instructions | SKILL.md, catalog, resources, invocation | 397 | 891 |
| L5 Agent Composition & Orchestration | preset, hook, subagent, goal, schedule | 1,250 | 3,297 |
| L6 Client UI & Experience | slots, chat nodes, settings, resources, theme | 4,128 | 7,586 |
| L7 Data, Sessions & Persistence | events, projections, storage, migrations | 1,333 | 4,378 |
| L8 Security, Privacy & Supply Chain | sandbox, approval, auth, secrets, provenance | 286 | 2,426 |
| L9 Operations, Market & Ecosystem | index, market, diagnostics, rollback | 145 | 145 |

L0 is cross-cutting: every plugin has a distribution, but no category owns it.
L9 owns the market/manager category. "Primary entries" counts a plugin's assigned
category layer; "mentions" counts every entry whose heuristic layer set includes
that layer. They answer different questions.

### SOTA anchors by layer

These are architecture references for each layer, chosen for explicit mechanisms.
They are not a ranking, and a plugin can anchor more than one layer. The full
rationale for each is in the 23-category landscape.

| Layer | Exact catalog anchors | Why they are useful references |
|---|---|---|
| L0 | PerryLink/dsh-doublecheck, PerryLink/dsh-memento, tangyixiao/dsh-version-manager | Explicit manifests, compatibility ranges, capability declarations, snapshots, and restore |
| L1 | FenrirCait/dsh-fail-guard, omdsh-dev/dsh-advisor, PerryLink/dsh-memento | Small event guard, host-plus-client reviewer, typed service lifecycle |
| L2 | lyp88997/dsh-browser-service, ArcaneOrion/dsh-model-channel-manager, PerryLink/dsh-memento | Provider behind a seam, routing over providers, typed service key |
| L3 | project-hy/dsh-claude-delegate, Imzl-zl/dsh-toolbox-ui, 2026heshao/dsh-armory | Explicit tool controls, deferred schemas, capability management |
| L4 | xuzhecomeon/dsh-research-suite, PolinniZhong/dsh-skill-intelligence, LittleBlackTong/dsh-plugin-superpowers | Skill plus tools, observed loading evidence, coherent method pack |
| L5 | dsh-proactive, mrzturn/dsh-switchman, ECCVIK/lmtagent | Durable alarms, dispatch plus verification, role presets and wave scheduling |
| L6 | OrderG-X/dsh-design-studio, baitouwuya/dsh-super-cards, cherrchen/dsh-theme-studio | Canvas workbench, native generative UI, token-level theming |
| L7 | light-cheng/dsh-strata, YeqingTang/dsh-session-flow, xiaoyuyu6420/dsh-backup | Layered context, cross-session archive, backup and restore |
| L8 | 0QwQ0/dsh-ui-auth, AskTheWay/dsh-jev-interceptor, liuwenji007/dsh-trust-check | Route auth, pre-execute policy, capability disclosure |
| L9 | moldkey/dsh-deepseekbase, hoyyang/dsh-mall, tangyixiao/dsh-version-manager | Index integration, refreshed catalog with review, snapshot and recovery |

Names are **exact catalog titles**, not substring matches. The matching npm
package can differ: PolinniZhong/dsh-skill-intelligence publishes as
dsh-skill-trace, and light-cheng/dsh-strata (npm @lightcheng/dsh-strata) is a
different plugin from jsdvjx/dsh-strata (npm dsh-strata). The canonical identity,
title, npm name, and layer for all 30 anchors are recorded in
data/layer-anchors.json and checked by refresh-catalog.mjs --check.

### The layer rule

A plugin should attach to **one primary layer** and use **only documented seams**
from the others. A UI plugin that performs privileged host work directly is not a
UI plugin; it is a host plugin with an undeclared trust boundary. A tool that
implements its own sandbox is not a tool; it is a parallel security owner.

---

## Coverage map

All 23 categories are present. Counts are entries; npm is the subset with a
known published version. The anchor is one high-signal exemplar, not a ranking.

| Category | Entries | npm | Layer | Anchor |
|---|---:|---:|---|---|
| AGI Architecture Exploration | 82 | 45 | L5 | kenz1117/dsh-engram |
| UI Enhancements | 2,232 | 1,078 | L6 | OrderG-X/dsh-design-studio |
| Usage & Billing | 598 | 285 | L6 | ShallBay/dsh-token-stats |
| Themes & Appearance | 405 | 181 | L6 | cherrchen/dsh-theme-studio |
| Models & Providers | 562 | 299 | L2 | ArcaneOrion/dsh-model-channel-manager |
| Identity & Communication | 132 | 71 | L5 | UnknowCao/dsh-outlook |
| Sessions & Messages | 855 | 435 | L7 | light-cheng/dsh-strata |
| Memory | 478 | 244 | L7 | PerryLink/dsh-memento |
| Tools & Capabilities | 1,528 | 825 | L3 | project-hy/dsh-claude-delegate |
| WSL & Windows Interop | 88 | 12 | L3 | stallenlu/dsh-wsl-suite |
| Browser & Web | 219 | 134 | L3 | lyp88997/dsh-browser-service |
| Vision & Multimodal | 200 | 100 | L3 | Anionex/dsh-vision-toolkit |
| Voice & Audio | 148 | 81 | L3 | kekydream/dsh-meeting-room |
| Docs & Rendering | 208 | 113 | L6 | PolinniZhong/dsh-knit |
| Skills | 397 | 167 | L4 | xuzhecomeon/dsh-research-suite |
| Workflow & Automation | 667 | 368 | L5 | mrzturn/dsh-switchman |
| Git & Code Review | 195 | 104 | L3 | Binaryinject/dsh-review-checkout |
| Notifications & Integrations | 369 | 185 | L5 | Leo-Cjw/dsh-pharos |
| Development & Runtime | 632 | 337 | L1 | xiaoyuyu6420/dsh-backup |
| Security & Permissions | 286 | 155 | L8 | 0QwQ0/dsh-ui-auth |
| Remote & Mobile | 322 | 179 | L6 | drscrewdriver/dsh-im-union |
| Plugin Markets & Managers | 145 | 75 | L9 | moldkey/dsh-deepseekbase |
| Just for Fun | 363 | 162 | L6 | xkk6663/dsh-live2d-mao |

The full table with three exemplars, SOTA signals, vet questions, and a pitfall
per category is in the generated landscape reference.

---

## SOTA practices by layer

### L0 — Distribution and composition

Treat the patch as public API: stable row ids, minimal overrides, and a full
config restatement when replacing a row. Declare engines.dsh and mirror peers.
Ship built artifacts; for Git installs, provide a self-contained prepare script,
pin the commit, and document the build allowlist. Make install reversible and
verify the composed tree with a profile dump.

### L1 — Host runtime and lifecycle

One responsibility per plugin. Inject dependencies explicitly. Make every effect
reversible, survive HMR, validate config once, and keep logs proportional. A
plugin that cannot unload cleanly is not ready.

### L2 — Capability seams

Design the interface first. Separate definition, provider, and consumer when they
evolve independently. Make precedence and scope explicit. Swap a provider by
changing one row, not by forking the loop. Test the consumer against a fake
provider.

### L3 — Tools and model-facing context

Type the inputs, discriminate the description, and bound the output. Use the
documented policy layers: pre-execute for policy, guard for monotonic denial,
execute for wrappers, post-execute for transforms, result for observation.
Respect cancellation, make errors structured, and treat the schema as a recurring
token cost.

### L4 — Skills and instructions

One skill, one job. Make the description a trigger, not a summary. Keep the
executable path in SKILL.md and move conditional detail one level down. Evaluate
positive, negative near-miss, and pressure scenarios. Keep provenance.

### L5 — Agent composition and orchestration

Compose declaratively. Give each role least privilege. Define budgets, deadlines,
stop conditions, and a terminal state. Subagents are owned handles: cancel, await,
dispose. Orchestration state belongs in goals, schedules, or the session log, not
in memory.

### L6 — Client UI

Extend slots, nodes, resources, and settings cards. Separate durable history from
live stream frames. Design loading, empty, error, offline, denied, and unloaded
states. Keyboard, screen reader, narrow screen, theme tokens, locale, sanitizer,
lazy bundle, and a real browser test are the baseline.

### L7 — Data, sessions, and persistence

Log every model-visible input. Distinguish durable events from live frames. Keep
projections pure. Version the format and make migrations adjacent. Write
atomically. Bound growth. Make export and delete first-class. Test replay,
restart, corrupt tail, migration, and rollback.

### L8 — Security and supply chain

Assume host code is privileged. Review the source, pin the version, minimize
dependencies and install scripts, request least privilege, authenticate every
route and WebSocket upgrade, keep secrets out of logs and prompts, fail closed,
and make behavior auditable. Uninstall must stop code and remove routes.

### L9 — Operations and ecosystem

Publish reproducible built packages. Make versions meaningful. Verify before
listing. Snapshot before update. Diagnose installs read-only. Respect consent for
updates. Retire cleanly.

The full detail, including anti-patterns, verification lists, and anchors, is in
[layer-model.md](../../.dsh/skills/dsh-plugin-sota/references/layer-model.md).

---

## Twelve cross-cutting rules

1. **Seam first.** Use the documented extension point before a new mechanism.
2. **Evidence over adjectives.** E0 claim, E1 source, E2 booted, E3 exercised,
   E4 reproduced.
3. **Reversible by design.** Unload, remove, restore, roll back.
4. **Bounded.** Time, tokens, output, storage, privileges, retries.
5. **Fail closed.** Ambiguity is a no.
6. **One owner per behavior.** Duplicate owners are future conflicts.
7. **Log the model-visible input.** If the model saw it, it must be replayable.
8. **Context is a budget.** Every schema, skill, and injection has a cost.
9. **Least privilege per agent.** Presets are security boundaries, not labels.
10. **Auth every path.** Pages, API, plugin bundles, WebSocket upgrades.
11. **Snapshot before mutation.** Install, update, migration, bulk edit.
12. **Verify the install, not the description.** Fresh profile, boot, risky path,
    uninstall.

---

## How to use the workflow

From the workspace root:

~~~sh
cd .dsh/skills/dsh-plugin-sota
node scripts/query.mjs stats
node scripts/query.mjs search "browser automation" --npm-only --limit 10
node scripts/query.mjs category security --limit 20
node scripts/query.mjs exemplars --category memory
node scripts/query.mjs get gh:perrylink/dsh-memento
~~~

Refresh the catalog and the generated landscape:

~~~sh
node scripts/refresh-catalog.mjs
node scripts/build-landscape.mjs
node scripts/build-coverage.mjs
node scripts/refresh-catalog.mjs --check
~~~

The skill can also be invoked directly by name, dsh-plugin-sota, in a new
session. The current session discovers it through the project skill root.

---

## Evidence and limits

The delivery validation record is [VALIDATION.md](VALIDATION.md).

**What is verified:**

- The catalog parses all 11,111 README entries and all 5,643 npm index entries.
- 5,635 listed entries resolve to unique npm packages; 8 index-only plugins are
  recorded separately, so the known universe is 11,119.
- All 23 categories have non-zero counts and three resolvable exemplars.
- Category counts sum to the catalog total.
- The refresh and query scripts run and self-check; the 30 table anchors and 36
  layer-model prose anchors pass exact-identity validation.
- Negative tests prove a 4/2 layer split, a report table mismatch, an extra
  prose anchor, and a missing prose anchor each fail.
- Warning-invariant tests prove duplicate titles, install-only entries, and
  shared npm packages pass with WARN, not a refresh failure.
- Doc-drift tests prove a stale distribution bullet, layer row, npm match rate,
  or committed HTML fails validation, while an unrelated decimal percentage is
  ignored.
- A cross-document validator confirms report 23/23, layers 10/10, landscape
  23/23, coverage totals, and the architecture contract against the catalog.
- The final HTML manifest has 12 hrefs (10 local, 2 external), 0 local broken
  links, no external scripts or styles, and a verified headless-browser screenshot.
- The theme validator checks light-screen and print computed styles: tag contrast
  7.11:1 screen and 7.82:1 print, code 7.11:1 and 17.43:1, light sota-cards.
- The session brief reports READY with the current snapshot, docs path, HTML
  size, and catalog counts; empty-docs and missing-renderer tests both exit 1.
- The offline catalog test replaces fetch with a throwing stub; --check still passes.
- The skill is discoverable in the live session skill catalog.

**What is not verified:**

- The one-line descriptions are author/community claims, not source reviews.
- Only a small set of installed or locally inspected plugins was read at source
  level. The exemplars are a shortlist, not a security audit.
- Layer and tag assignment is a keyword heuristic over descriptions.
- npm coverage is 50.7%; GitHub-only entries have no verified install spec here.
- Popularity, stars, downloads, and long-term maintenance were not ranked.

This is a complete **catalog** view and a rigorous **decision workflow**, not a
certification of 11,111 repositories. The workflow is designed to make that
distinction explicit every time.

---

## Recommended next moves

1. **Adopt the layer vocabulary.** Use L0–L9 in issues and reviews; it makes
   "where does this belong?" answerable.
2. **Run one real decision through the rubric.** Pick a category you care about,
   shortlist three, and record E0–E4. The output will show where the evidence is
   thin.
3. **Refresh before every landscape claim.** The list changes fast; stale counts
   are worse than no counts.
4. **Treat security as a gate, not a score.** A blocker is a no, even if the
   feature is excellent.
5. **Prefer composition.** The best plugin is often the smallest provider that
   fits the seam, not the largest bundle that replaces the workflow.

---

## Sources

- Awesome DSH Plugin: https://github.com/awesome-dsh-plugin/awesome-dsh-plugin
- Plugin index: https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json
- DSH architecture: https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md
- DSH extension cookbook: https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cookbook/extension-cookbook.md
- DSH skills subsystem: https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/skills.md
- DSH plugin authoring: https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/index.md
- DSH packaging: https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.md
