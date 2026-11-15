# ADR-0002: Scheduled upstream refresh and PR automation

- **Status:** Accepted
- **Date:** 2026-11-14
- **Supersedes:** none
- **Related:** ADR-0001-final-architecture.md
- **Revisit:** upstream schema change, anchor drift, token-permission change, or quarterly

## Context

ADR-0001 defines a snapshot-based landscape. The validation workflow must stay
offline and fast: it must not crawl thousands of GitHub-only entries or consume
unauthenticated API budget on every pull request.

Upstream still changes. The landscape needs a separate path that:

1. fetches the current awesome-list README and npm index with a token;
2. rebuilds catalog, stats, landscape, coverage, summary, and HTML;
3. validates the refreshed snapshot;
4. opens a reviewable pull request instead of pushing to main.

## Decision

Use two workflows.

### Validation workflow

~~~text
.github/workflows/validate.yml
~~~

Runs on push, pull request, and manual dispatch. It uses committed data only:
session brief, brief failure tests, offline catalog guard, anchors, warning
invariants, doc drift, HTML freshness, docs validation, and optional theme check.
No upstream network calls; no token needed for data.

### Scheduled refresh workflow

~~~text
.github/workflows/refresh-upstream.yml
~~~

Runs weekly at 06:17 UTC on Monday and on manual dispatch. It has:

- permissions: contents write, pull requests write;
- REFRESH_TOKEN preferred, with github.token fallback;
- Node 22 and Python 3.12;
- network refresh of the README and npm index;
- rebuild of all generated surfaces;
- the same validation suite;
- a fixed branch named chore/upstream-refresh, fetched then force-with-lease updated;
- an open pull request for that head branch, updated by number; merged or closed
  PRs are ignored and a new PR is created on the next run.

The workflow never pushes directly to main and never auto-merges. A human reviews
count and anchor changes before merge.

## Token and required checks

Use a fine-grained PAT or GitHub App token in secrets.REFRESH_TOKEN with:

- contents: write;
- pull requests: write;
- no workflow-file scope needed, because this job does not edit workflows.

The workflow falls back to github.token when REFRESH_TOKEN is absent. GitHub
suppresses workflow runs for events authored by GITHUB_TOKEN, so that fallback
PR will NOT trigger validate.yml. The in-job validation still runs, but branch
protection must not require an external check for that fallback, or a maintainer
must bypass it.

Recommended: set REFRESH_TOKEN. Then the PR is authored by the PAT/App, the
pull_request event runs validate.yml, and normal required checks apply. The
workflow prints a warning whenever it uses the fallback.

The refresh script uses GITHUB_TOKEN for GitHub source requests when present.
It does not make one request per catalog row; it fetches the two upstream
documents and derives the catalog locally.

## Why this split

- PR validation stays deterministic, offline, and fast.
- The network crawl runs once per schedule, not per pull request.
- A refresh cannot silently rewrite main.
- Count and anchor drift is visible in a pull request.
- Token scope is explicit and limited to the refresh job.

## Failure modes

| Failure | Behavior |
|---|---|
| Upstream schema changes | Refresh fails or validator fails; no PR |
| Counts or anchors drift | PR opens; human review required |
| GITHUB_TOKEN missing/insufficient | Refresh or PR creation fails loudly |
| REFRESH_TOKEN absent | Warning; fallback PR does not trigger validate.yml |
| Fixed branch already exists | Fetch the remote-tracking ref, then force-with-lease with the fetched SHA |
| Previous refresh PR merged/closed | No open PR is found; a new PR is created |
| Open refresh PR exists | Its body is edited by PR number; no duplicate PR |
| No upstream changes | Workflow exits cleanly without a PR |
| Theme unavailable | Optional theme check skips; core checks still run |
| Network rate limit | Refresh job fails; validation job is unaffected |

## Consequences

- The repository gains a second, higher-privilege workflow.
- Scheduled jobs consume Actions minutes weekly.
- A maintainer must review refresh PRs.
- The offline validation path remains the default for normal work.

## Demonstration

Local offline rebuild path:

~~~sh
node scripts/refresh-catalog.mjs --offline
node scripts/build-landscape.mjs
node scripts/build-coverage.mjs
node scripts/build-report-summary.mjs
python3 scripts/build-html.py
node scripts/session-brief.mjs
node scripts/test-catalog-offline.mjs
node scripts/validate-anchors.mjs
node scripts/test-anchors.mjs
node scripts/test-warnings.mjs
node scripts/test-docs.mjs
python3 scripts/build-html.py --check
node scripts/validate-docs.mjs
~~~

The scheduled workflow uses the same commands without --offline.

## Related artifacts

- [ADR-0001](ADR-0001-final-architecture.md)
- [Validation record](VALIDATION.md)
- [Install guide](INSTALL.md)
- [Final HTML manifest](final-manifest.html)
- [Refresh workflow](../../.github/workflows/refresh-upstream.yml)
- [Validation workflow](../../.github/workflows/validate.yml)
