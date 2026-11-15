# Evaluating a DSH plugin

The catalog tells you what exists. This reference tells you whether a plugin is
safe, well-placed, and worth adopting — and what evidence justifies the answer.

## Stance

- A listing is not a review. The awesome list explicitly does not rank quality.
- A one-line description is a claim. Source, manifest, and runtime behavior are
  evidence.
- "SOTA" is relative to a stated objective. A plugin can be excellent for one
  workflow and wrong for another. State the objective before ranking.
- Prefer the smallest provider that solves the problem. A large plugin that
  replaces the workflow is a bigger risk than a narrow provider that fits a seam.

## Evidence levels

Record one level per claim. Do not upgrade a claim because the README is detailed.

| Level | Name | What it means |
|---|---|---|
| E0 | Claim | Description, README, screenshot, or marketplace copy only |
| E1 | Inspected | Repository, package.json, manifest, patch, and source read |
| E2 | Installed | Installed in a disposable profile and booted successfully |
| E3 | Tested | The relevant behavior was exercised: allow/deny, cancel, restart, rollback |
| E4 | Reproduced | Independent or CI reproduction, with a durable artifact |

A recommendation at E0 is a lead. At E1 it is a candidate. At E2 it is a trial.
At E3 it is adoptable for the tested scope. At E4 it is a reference.

## The eight-axis rubric

Score each axis 0–3. A score of 2 means documented and plausible; 3 means
verified in source, test, or runtime.

### 1. Protocol fit

- 3: declares dsh.bundle (or dsh.client), installs with the documented command,
  composes cleanly, and uninstalls without residue.
- 2: manifest and patch are coherent; one minor packaging gap.
- 1: installs only by hand, or the manifest claims more than it delivers.
- 0: no bundle/client declaration, broken patch, or undocumented loader hacks.

### 2. Ownership and seam

- 3: attaches to a documented seam or extension point; one clear owner.
- 2: uses an official mechanism with a small workaround.
- 1: duplicates an existing seam or patches around the lifecycle.
- 0: forks the loop, monkey-patches another plugin, or hides global state.

### 3. Security and permissions

- 3: least privilege, fail-closed policy, authenticated surfaces, no secret leaks.
- 2: reasonable defaults with a documented limitation.
- 1: broad permissions or weak auth, but no observed exploit path.
- 0: unauthenticated routes, arbitrary code execution, hidden credential access,
  or a default that exposes the host.

### 4. Data and privacy

- 3: bounded storage, explicit retention, export/delete, redaction, consent.
- 2: clear storage with one missing lifecycle control.
- 1: unclear retention or a second source of truth.
- 0: unbounded collection, undisclosed egress, or secrets in logs.

### 5. Compatibility and lifecycle

- 3: engines.dsh and peers declared; install, upgrade, and uninstall tested;
  migrations are versioned and reversible.
- 2: ranges declared but only one host version tested.
- 1: no ranges or a known break on the running host.
- 0: silently incompatible, destructive migration, or no remove path.

### 6. Reliability and observability

- 3: bounded retries/timeouts, cancellation, structured errors, health/diagnostics.
- 2: basic error handling, limited metrics.
- 1: silent failure or unbounded retry.
- 0: crash loops, swallowed errors, or no way to tell what happened.

### 7. UX and accessibility

- 3: clear states, keyboard and screen-reader support, responsive, themed, localized.
- 2: usable with minor gaps.
- 1: desktop-only, hardcoded visuals, or missing error states.
- 0: blocks the UI, traps focus, or exposes raw errors to the user.

### 8. Evidence and maintenance

- 3: tests, reproducible build, changelog, recent compatible release, responsive
  issue handling.
- 2: some tests and a release history.
- 1: claims without tests or a stale release.
- 0: abandoned, no license, or a history of breaking installs.

Total: 24 points. A blocker on axis 3, 4, or 5 overrides the total.

## Decision matrix

| Score | Evidence | Decision |
|---:|---|---|
| 20–24 | E2+ and no blocker | Adopt for the tested scope |
| 14–19 | E1–E2 and no blocker | Trial in a disposable profile |
| 8–13 | E1 | Build or keep looking; do not install by default |
| 0–7 | any | Avoid |

A plugin with a blocker is avoid regardless of score. A plugin with a high score
but E0 evidence is a lead, not an adoption.

## Red flags

### Blockers

- No authentication on HTTP routes or WebSocket upgrades.
- Binding the full GUI to 0.0.0.0 or a public interface by default.
- Unpinned Git install with a postinstall script that fetches or executes code.
- Requests danger-full-access or a broad approval bypass as the default.
- Hidden telemetry, credential collection, or undisclosed network egress.
- Destructive migration or data deletion without a backup and confirmation.
- Monkey-patching the agent loop or another plugin's private internals.
- No license, or a license incompatible with the user's distribution.

### Major

- Duplicate plugin id, package name, or service key.
- Unbounded context injection or tool schemas in every request.
- No cancellation, timeout, or retry bound.
- Secrets or full prompts in logs or session events.
- No uninstall/stop path, or orphaned scheduled work.
- A "security" feature that is prompt-only with no execution-boundary enforcement.
- A marketplace/index entry that installs unverified code or auto-updates silently.

### Minor

- Missing locale, icon, or display metadata.
- One platform untested.
- No changelog but a clean release history.
- A dashboard that labels estimates as estimates.
- A narrow feature that overlaps an existing provider.

## Compatibility checklist

- Running DSH version and engines.dsh range.
- Node version and package manager.
- Host OS and architecture; platform-gated bundles.
- Peer dependency ranges actually resolved, not just declared.
- Session format version and migrations.
- Client platform (web/desktop) and shell version.
- Config schema defaults and existing user overrides.
- Upgrade and downgrade path; restart-required behavior.

## Supply-chain checklist

- Source repository matches the published package.
- Exact version or commit pinned; lockfile updated.
- Build scripts reviewed; no unnecessary postinstall.
- Dependencies minimized; license and provenance checked.
- Package contents match the files list; no test fixtures or secrets.
- Install does not fetch code from an unverified URL.
- Uninstall removes code, routes, scheduled work, and credentials.

## Privacy checklist

- What data leaves the machine, to which endpoint, under which identity?
- Is egress disclosed and configurable?
- Are prompts, images, audio, and files redacted before storage or upload?
- Is retention bounded and visible?
- Can the user export and delete?
- Are credentials stored in the credentials service, not config or logs?

## Comparison sheet

Use this for a shortlist of three. Fill only what you verified.

| Candidate | Primary layer | Evidence | Security | Compat | UX | Maintenance | Total | Verdict |
|---|---|---|---|---|---:|---:|---:|---|
| A | | | | | | | | |
| B | | | | | | | | |
| C | | | | | | | | |

## Recommendation record

Keep the recommendation compact and auditable:

- **Objective:** the user outcome, not the plugin category.
- **Primary layer:** L0–L9 and the seam.
- **Candidates:** three, with the reason each was shortlisted.
- **Evidence:** E0–E4 per material claim.
- **Risks:** blockers, majors, and unknowns.
- **Decision:** adopt, trial, build, or avoid.
- **Install:** exact spec and profile.
- **Verify:** the checks that would change the decision.
- **Rollback:** remove/revert path.

## Rules for "best" questions

A request for "the best plugin" is underspecified. Resolve it before ranking:

1. What outcome, for which user, in which host/profile?
2. Which layer owns the outcome?
3. Which constraints are hard: offline, privacy, platform, cost, latency, team size?
4. What evidence level is required for the decision?

Then compare candidates on the same objective. If the user will not define the
objective, present a small decision matrix and state the assumption instead of
declaring a universal winner.

## Full-landscape audit

When asked to cover the whole ecosystem:

1. Query all 23 categories, not only the ones named in the request.
2. For each category, record count, npm coverage, primary layer, and the three
   exemplars.
3. Mark categories with no credible candidate as a gap; do not fill them with a
   weak match.
4. Distinguish "no plugin found" from "no plugin exists". A search miss is not
   proof of absence.
5. Summarize the concentration by layer and the recurring risks.
6. End with a shortlist, not a list of 11,111 names.
