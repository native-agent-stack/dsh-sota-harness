# Workflow recipes

Each recipe is a decision path. Use the smallest one that answers the request;
do not run the full audit for a simple "what exists" question.

## Recipe 1 — Choose a plugin for an outcome

**Trigger:** "find me a plugin for X", "what should I use for X", "compare these
plugins".

1. **Frame the outcome.** User, host/profile, workflow, constraints (offline,
   privacy, platform, cost, team size), and what "good" means.
2. **Classify the layer.** Use the layer table. If the request is really a
   configuration or preset change, say that instead of recommending a plugin.
3. **Query the catalog.** Start broad, then narrow:
   ~~~sh
   node scripts/query.mjs search "outcome words" --limit 15
   node scripts/query.mjs category <key> --limit 20
   node scripts/query.mjs search "outcome" --npm-only --layer L3 --limit 10
   ~~~
4. **Shortlist three.** Prefer different architectures (provider vs monolithic,
   local vs remote, host vs client), not three names from the same lineage.
5. **Read the category section.** In references/landscape.md, use the SOTA
   signals, vet questions, and pitfall for that category.
6. **Evaluate.** Apply evaluation.md. Record evidence level per claim.
7. **Recommend.** One primary, one alternate, one "build or wait". Include exact
   install spec, profile, verification, and rollback.
8. **Do not install** unless the user asked or approved it.

Output shape:

- objective and constraints
- layer and seam
- comparison table (3 rows)
- recommendation with evidence level
- install/verify/rollback
- unknowns that would change the decision

## Recipe 2 — Audit an installed plugin

**Trigger:** "is this safe?", "review this plugin", "why is my profile broken?".

1. Read the manifest and patch, not the README.
2. Map it to a layer and seam. Does it own something it should not?
3. Inventory capabilities: tools, network egress, filesystem, credentials,
   routes, scheduled work, subagents.
4. Check lifecycle: unload, HMR, timers, sockets, child processes, disposal.
5. Check data: what is stored, where, for how long, and how it is deleted.
6. Check policy: approvals, sandbox, auth, fail-closed paths.
7. Check compatibility: engines, peers, session format, client shell.
8. Run the smallest runtime test that could falsify the claim:
   install in a disposable profile, boot, exercise the risky path, uninstall.
9. Report blockers first, then majors, then unknowns. Do not bury a blocker in
   a score.

Use the eight-axis rubric. A high total does not excuse a blocker.

## Recipe 3 — Install, verify, roll back

**Trigger:** the user approved an install or a trial.

1. Record the current profile state:
   ~~~sh
   dsh --profile <profile> --dump-config > /tmp/profile-before.txt
   ~~~
2. Prefer a disposable profile for a first trial:
   ~~~sh
   dsh plugin --profile trial add <spec>
   dsh --profile trial --dump-config
   ~~~
3. Install the exact spec:
   ~~~sh
   dsh plugin --profile <profile> add <name>@<version>
   ~~~
4. If the package needs a build script, stop and review it. Only approve the
   exact key pnpm printed, and only after reading the script.
5. Boot and verify the claimed behavior in a scratch session. Do not test on
   important data.
6. Check the failure path: disable the row, unload, restart, and remove.
7. If anything is wrong, remove the bundle and restore the profile:
   ~~~sh
   dsh plugin --profile <profile> remove <name>
   ~~~
8. Record the exact version, the result, and the rollback command.

Never use a compatibility exemption to skip a failure you have not diagnosed.
An exemption is a risk acceptance, not a fix.

## Recipe 4 — Build a new plugin

**Trigger:** no existing provider fits, or the user explicitly wants a plugin.

1. Prove the gap: query all plausible categories and seams; record what was
   rejected and why.
2. Pick the primary layer and package shape. Prefer one package.
3. Write the manifest and patch first; install a no-op plugin into a disposable
   profile. If that fails, stop before writing behavior.
4. Implement the smallest provider or tool that proves the seam.
5. Add policy, cancellation, bounded output, and structured errors.
6. Add the client surface only if the outcome needs one. Extend a slot; do not
   fork the shell.
7. Add tests from the test matrix in authoring.md.
8. Run the release gate. Publish built artifacts, then list with a truthful
   description and exact install command.

If the plugin is a skill, follow Recipe 5 instead.

## Recipe 5 — Author or update a skill

**Trigger:** the user wants a reusable workflow, a method pack, or a skill edit.

1. Name the behavior gap and the existing owner. If a project rule or another
   skill already owns it, change that owner instead.
2. Write positive, negative near-miss, and pressure scenarios before editing.
3. Keep the executable default path and non-negotiable constraints in SKILL.md.
   Move conditional detail to one-level references.
4. Write a discriminating description. State capability and trigger, not a
   procedure.
5. Make scripts idempotent and evidence-printing.
6. Validate: trigger behavior, reference reachability, script execution, and
   invocation policy.
7. Record status: verified, needs-verification, or blocked. Do not claim
   deployment-ready without behavior evidence.

For this pack, update references and run the catalog checks after any data or
landscape change.

## Recipe 6 — Full landscape review

**Trigger:** "cover the whole plugin ecosystem", "what are the best plugins in
each layer", "map the landscape".

1. State the snapshot and the limits: complete catalog, sampled source review.
2. Query all 23 categories. Do not skip a category because it looks irrelevant.
3. For each category, record count, npm coverage, primary layer, three
   exemplars, and the category's SOTA signals and pitfall.
4. Summarize the layer distribution and the recurring risks. Name categories
   with no credible candidate as gaps.
5. Shortlist across categories by outcome, not by count.
6. End with a decision matrix and a refresh command. A list of 11,111 names is
   not an answer.

Use references/landscape.md as the category map and references/evaluation.md
for the comparison method.

## Recipe 7 — Refresh the catalog

**Trigger:** the list may have changed, or a category count looks stale.

1. Run:
   ~~~sh
   node scripts/refresh-catalog.mjs
   node scripts/build-landscape.mjs
   node scripts/build-coverage.mjs
   node scripts/build-report-summary.mjs
   python3 scripts/build-html.py
   node scripts/refresh-catalog.mjs --check
   ~~~
2. Review the diff: category counts, npm match rate, duplicate ids, exemplar
   resolution, and any category that lost entries.
3. If a category changed materially, re-read its section and update
   data/landscape-content.json.
4. Do not edit data/catalog.jsonl by hand. It is generated.
5. If the upstream schema changes, update the parser and add a fixture before
   trusting the output.

Offline refresh:
~~~sh
node scripts/refresh-catalog.mjs --offline
~~~

## Recipe 8 — Answer "what is the best plugin?"

1. Refuse the universal framing: ask for the outcome and constraints, or state
   an explicit assumption.
2. Pick the layer and seam.
3. Shortlist three with different architectures.
4. Compare on the same rubric and evidence level.
5. Declare a winner only for the stated objective. Otherwise present the matrix.

A truthful "it depends" with a decision procedure is more useful than a false
universal ranking.

## Recipe 9 — Security review of a candidate

1. Identify the trust boundary: host code, browser code, network service, or
   external content.
2. Inventory routes and upgrades; check auth on each, not just the UI.
3. Inventory egress: endpoints, credentials, payloads, and consent.
4. Review install scripts and dependencies.
5. Test fail-closed behavior: deny, cancel, missing approval, expired token.
6. Test uninstall: code stops, routes disappear, scheduled work is cancelled.
7. Report blockers as blockers. Do not average them into a score.

## Recipe 10 — Compatibility triage

1. Capture the running host version, profile, and last good state.
2. Read engines.dsh, peers, and the bundle platform declaration.
3. Check the patch against the composed tree; look for duplicate ids and
   replaced rows.
4. Reproduce in a disposable profile with the same lockfile.
5. If the plugin is the cause, disable its row first; remove only if disabling
   is insufficient.
6. Prefer a fixed version or a provider swap over a compatibility exemption.
7. Record the exact failing pair and the evidence.

## Output contract

For any plugin recommendation or review, return:

- **Decision:** adopt, trial, build, avoid, or insufficient evidence.
- **Layer and seam:** where it belongs and why.
- **Evidence:** E0–E4 for the material claims.
- **Risks:** blockers, majors, unknowns.
- **Install/verify/rollback:** exact commands, or "not installed".
- **Next check:** the one test that would change the decision.

Keep it proportional. A one-line "what exists" question does not need a
scorecard; a "should we adopt this" question does.
