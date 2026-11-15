# DSH SOTA Practice Harness

A runnable practice repo for the DSH plugin ecosystem. It is deliberately small:
five layer probes, not a mount of all 11,111 catalog entries.

## What this proves

- the vendored dsh-plugin-sota skill is discoverable and its session brief is READY;
- the anchor for each probe resolves in the committed catalog;
- each fixture satisfies its layer contract;
- the catalog, anchor, doc, and HTML validators still pass;
- no third-party plugin is installed in CI.

## What this does not prove

- that every catalog entry is safe or works;
- that all 11,111 entries are installed;
- that a fixture is a production plugin.

The catalog repo is the discovery and evidence source. This repo is the practice
surface.

## Quick start

~~~sh
node harness/run.mjs
node .dsh/skills/dsh-plugin-sota/scripts/session-brief.mjs
~~~

The first command runs the five probes; the second confirms the vendored skill,
catalog, docs, renderer, and final HTML are ready.

## Sync from the catalog repo

~~~sh
./harness/scripts/sync-skill.sh
~~~

The default source is ../dsh. The script rsyncs the skill and docs with
--delete, then runs diff -r. A READY brief alone does not prove the snapshot
matches; the diff does.

## Mirrored docs

The docs/plugin-landscape tree is a sync mirror. It retains catalog-repo links,
including links to the catalog's refresh workflow, which is not duplicated here.
Treat the catalog repo as the source of truth for those cross-repo links.

## Layout

~~~text
.dsh/skills/dsh-plugin-sota/   vendored skill snapshot
docs/plugin-landscape/          copied docs and final HTML
harness/scenarios/              five probe definitions
harness/fixtures/               one fixture per layer probe
harness/policies/               allowlist and evidence bar
harness/run.mjs                 offline probe runner
harness/scripts/sync-skill.sh   rsync + diff sync
profiles/                        guidance, no global profile edits
presets/                         reserved for DSH presets
docs/adr/                       harness boundary decisions
.github/workflows/validate.yml  offline CI
~~~

## Probes

| Layer | Anchor | Fixture |
|---|---|---|
| L1 | FenrirCait/dsh-fail-guard | lifecycle fixture |
| L3 | project-hy/dsh-claude-delegate | typed tool schema |
| L4 | xuzhecomeon/dsh-research-suite | skill contract |
| L7 | light-cheng/dsh-strata | session event provenance |
| L8 | 0QwQ0/dsh-ui-auth | install policy |

## CI

The workflow runs the probes, the session brief, brief failure paths, the
offline catalog guard, anchors, warning invariants, doc drift, HTML freshness,
docs validation, and the optional light/print theme check.

There is no network refresh here. Upstream refresh belongs to the catalog repo's
scheduled workflow.
