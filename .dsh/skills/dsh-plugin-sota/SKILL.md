---
name: dsh-plugin-sota
description: Use when discovering, evaluating, installing, authoring, reviewing, or mapping DeepSeek Harness (dsh) plugins. Covers all 23 awesome-dsh-plugin categories, a ten-layer model of plugin work, SOTA practices per layer, safety and supply-chain checks, and a queryable full catalog of the listed ecosystem.
---

# DSH plugin SOTA workflow

Use this skill when the task involves DSH plugins: choosing one, comparing
candidates, auditing an installed plugin, authoring a bundle, designing a
client surface, publishing, or mapping the whole ecosystem.

It combines three things:

- a full catalog of the awesome-dsh-plugin list (all 23 categories)
- a ten-layer model of where plugin behavior belongs
- an evidence-based method for deciding what is SOTA for the user's objective

It is not a ranking and not a security review. A listing proves only that the
entry met the list's inclusion rules.

## Route in one step

| Request | Do this |
|---|---|
| "What plugin does X?" | Workflow 1 in references/workflows.md |
| "Is this plugin safe / good?" | Workflow 2 plus references/evaluation.md |
| "Install / try this" | Workflow 3; record before/after and a rollback |
| "Build a plugin" | references/authoring.md plus layer-model.md |
| "Write or fix a skill" | Workflow 5; keep the skill surface minimal |
| "Cover the whole landscape" | Workflow 6; all 23 categories, not just the obvious ones |
| "What is the best plugin?" | Workflow 8; refuse the universal framing or state an assumption |

## Non-negotiables

1. **Source before install.** Installing a plugin runs third-party host code with
   the user's permissions. Tool approvals do not sandbox plugin code. A listing
   is not a security review.
2. **Objective before ranking.** "Best" requires a user, host, constraint set,
   and evidence level. Declare the assumption or ask.
3. **Seam before new code.** Prefer a documented provider, tool, skill, preset,
   or client slot over a parallel mechanism or a core patch.
4. **Evidence, not adjectives.** Mark material claims E0–E4. A README claim is
   E0. Source is E1. A booted install is E2. An exercised behavior is E3.
5. **Reversible by design.** Every recommendation names the unload, remove, or
   restore path. No irreversible migration without a backup.
6. **Bounded.** Time, tokens, output, storage, privileges, and retries have
   limits. An unbounded loop is not autonomy.
7. **Fail closed.** Unknown target, ambiguous policy, or missing approval means
   no action.
8. **Do not install without consent.** Recommend first; install only when the
   user asked or approved the exact spec.

## Default path

### 0. Session brief

~~~sh
node scripts/session-brief.mjs
~~~

Confirm READY, the snapshot, catalog counts, docs path, and HTML size before
the first plugin decision.

### 1. Frame

State the outcome, user, host/profile, constraints, and what would count as
success. Identify the primary layer from the layer table.

### 2. Query the catalog

~~~sh
node scripts/query.mjs stats
node scripts/query.mjs search "outcome words" --limit 15
node scripts/query.mjs category <key> --limit 20
node scripts/query.mjs exemplars --category <key>
~~~

Use --npm-only for installable candidates, --layer L3 to narrow by layer, and
--json when you need to process results.

### 3. Shortlist three

Prefer different architectures, not three variants of the same plugin. Read the
category's SOTA signals, vet questions, and pitfall in references/landscape.md.

### 4. Evaluate

Apply the eight-axis rubric in references/evaluation.md. Record the evidence
level per material claim. Any blocker overrides the score.

### 5. Decide and verify

Choose adopt, trial, build, avoid, or insufficient evidence. If installing, use
a disposable profile first, record the profile dump, and test the failure path.
Do not use a compatibility exemption to skip a failure you have not diagnosed.

### 6. Report

Return the decision, layer and seam, evidence, risks, exact install/verify/
rollback, and the one check that would change the decision. Keep it proportional
to the request.

## Layer router

| If the work is about... | Primary layer | Read |
|---|---|---|
| manifest, bundle, profile, install, update | L0 | layer-model.md L0 |
| plugin lifecycle, inject, effects, services | L1 | layer-model.md L1 |
| a swappable capability or provider | L2 | layer-model.md L2 |
| a tool, schema, policy, result shape | L3 | layer-model.md L3 |
| a skill, instruction pack, catalog | L4 | layer-model.md L4 |
| preset, hook, subagent, goal, schedule | L5 | layer-model.md L5 |
| sidebar, panel, chat node, settings, theme | L6 | layer-model.md L6 |
| session event, projection, storage, migration | L7 | layer-model.md L7 |
| auth, approval, sandbox, secrets, supply chain | L8 | layer-model.md L8 |
| publish, index, market, diagnostics, rollback | L9 | layer-model.md L9 |

Cross-cutting: L0 and L9 apply to every plugin; L8 is never optional.

## Category coverage

The catalog covers all 23 categories. Use the key, not the display name, in
commands.

- **agi** — AGI Architecture Exploration (L5)
- **ui** — UI Enhancements (L6)
- **usage** — Usage & Billing (L6)
- **theme** — Themes & Appearance (L6)
- **model** — Models & Providers (L2)
- **identity** — Identity & Communication (L5)
- **session** — Sessions & Messages (L7)
- **memory** — Memory (L7)
- **tools** — Tools & Capabilities (L3)
- **wsl** — WSL & Windows Interop (L3)
- **browser** — Browser & Web (L3)
- **vision** — Vision & Multimodal (L3)
- **voice** — Voice & Audio (L3)
- **docs** — Docs & Rendering (L6)
- **skill** — Skills (L4)
- **workflow** — Workflow & Automation (L5)
- **git** — Git & Code Review (L3)
- **notify** — Notifications & Integrations (L5)
- **dev** — Development & Runtime (L1)
- **security** — Security & Permissions (L8)
- **remote** — Remote & Mobile (L6)
- **market** — Plugin Markets & Managers (L9)
- **fun** — Just for Fun (L6)

## Output contract

For a recommendation or review:

- **Decision:** adopt, trial, build, avoid, or insufficient evidence.
- **Layer and seam:** where it belongs and why.
- **Evidence:** E0–E4 for the material claims.
- **Risks:** blockers, majors, unknowns.
- **Install / verify / rollback:** exact commands, or "not installed".
- **Next check:** the one test that would change the decision.

For a landscape review, add the snapshot date, category counts, npm coverage,
layer distribution, gaps, and a shortlist by outcome. A list of names is not a
landscape.

## Reference map

- **references/layer-model.md** — ten layers, contracts, SOTA practices,
  anti-patterns, verification, exemplars.
- **references/landscape.md** — all 23 categories with counts, exemplars, SOTA
  signals, vet questions, and pitfalls. Generated from the catalog.
- **references/architecture.md** — component map, Mermaid architecture and
  repository-to-decision graphs, coverage contract, hard versus warning invariants,
  change policy, and recovery.
- **references/evaluation.md** — evidence levels, eight-axis rubric, red flags,
  compatibility, supply chain, privacy, decision matrix.
- **references/authoring.md** — package shape and per-layer authoring checklists.
- **references/workflows.md** — ten recipes from discovery to compatibility triage.
- **data/catalog.jsonl** — one JSON entry per listed plugin.
- **data/stats.json** — coverage, category, layer, tag, and keyword statistics.
- **data/categories.json** — category metadata and curated exemplars.
- **data/landscape-content.json** — editorial signals, questions, and pitfalls.
- **data/layer-anchors.json** — exact IDs, titles, npm names, and reasons for the
  30 layer anchors.
- **data/reference-anchors.json** — exact names used in the layer-model prose.
- **data/index-only.json** — npm-index-only supplements outside the 11,111 listed count.
- **scripts/refresh-catalog.mjs** — rebuild the catalog from README + index.
- **scripts/build-landscape.mjs** — regenerate references/landscape.md.
- **scripts/build-coverage.mjs** — regenerate the coverage appendix.
- **scripts/build-report-summary.mjs** — regenerate the executive distribution block.
- **scripts/build-html.py** — render and freshness-check the self-contained final
  HTML manifest.
- **scripts/validate-anchors.mjs** — verify the 30 layer anchors, the 36 prose
  anchors, and the report table.
- **scripts/test-anchors.mjs** — negative tests for the anchor validator.
- **scripts/test-warnings.mjs** — prove legitimate catalog variation warns, not fails.
- **scripts/test-docs.mjs** — prove stale summary counts and match rate fail.
- **scripts/validate-themes.mjs** — verify light-screen and print computed styles.
- **scripts/validate-docs.mjs** — cross-check report, landscape, coverage, stats,
  and the architecture contract.
- **scripts/session-brief.mjs** — readiness, snapshot, counts, docs, renderer, and
  HTML status for a future session.
- **scripts/test-brief.mjs** — prove READY and NOT READY failure paths.
- **scripts/test-catalog-offline.mjs** — prove --check makes no network calls.
- **scripts/pr-body.mjs** — build the scheduled refresh pull-request summary.
- **scripts/query.mjs** — query and inspect the catalog.

## Validation

Before claiming the catalog or landscape is current:

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
# optional: Node 22+ / Chrome; SKIP without; use --require in CI
node scripts/validate-themes.mjs
node scripts/validate-docs.mjs
node scripts/query.mjs stats
node scripts/query.mjs exemplars --category security
~~~

The check must report 11,111 entries (or the current upstream count), 23
categories, all category counts non-zero, every exemplar resolvable, 8 index-only
entries, 30 exact layer anchors (3 per layer) whose IDs, titles, npm names, and
displays match catalog.jsonl, and 36 exact reference anchors used in the
layer-model prose.

## Freshness and limits

- The catalog is a snapshot. Refresh it when the upstream list changes.
- npm-indexed means the index carried a known version; GitHub-only entries have
  no verified install spec.
- Category assignment is upstream. Layer and tag assignment is a keyword
  heuristic over the one-line description, not source inspection.
- The three exemplars per category are a starting shortlist, not a quality
  ranking or a security review.
- A search miss is not proof that no plugin exists. Check the category, the
  live repository search, and the marketplace indexes before saying "none".
