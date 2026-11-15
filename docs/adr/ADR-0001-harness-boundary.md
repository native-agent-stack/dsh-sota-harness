# ADR-0001: Practice harness boundary

- **Status:** Accepted
- **Date:** 2026-11-14
- **Related:** ../plugin-landscape/ADR-0001-final-architecture.md

## Context

The catalog repo covers 11,111 listed entries across 23 categories. That is a
discovery surface, not a runtime test suite. Installing all entries would be
unsafe, slow, and impossible to verify.

The ecosystem needs a small practice harness that exercises the layer contracts
and the SOTA workflow against a pinned snapshot.

## Decision

Create a separate repository, dsh-sota-harness, with:

- a vendored snapshot of the dsh-plugin-sota skill and its docs;
- ten probes covering L0 through L9;
- one fixture per probe;
- a curated layer-anchor check plus catalog-layer membership;
- an allowlist with an E1 evidence requirement;
- an offline probe runner and CI;
- a sync script that rsyncs --delete and verifies with diff -r.

No third-party plugin is installed or executed in CI. The catalog repo remains
the source of truth; the harness is the practice surface.

## Consequences

- The harness is reproducible offline.
- The vendored snapshot must be synced explicitly; a READY brief alone is not
  proof of sync.
- Ten probes do not prove the other 11,101 entries. They prove all ten layer
  contracts and the workflow surface.
- A future version can replace the vendored copy with a submodule or a released
  package once the catalog repo has a remote.

## Revisit

Revisit when the skill contract changes, a scenario is added or retired, or the
catalog repo publishes a versioned package.
