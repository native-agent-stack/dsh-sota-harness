# DSH plugin layers and SOTA practices

This reference is the layer model behind the workflow. It answers one question:
**where does this plugin belong, and what does "good" look like there?**

The model is derived from the official DSH architecture and extension docs, then
checked against the curated landscape. It is a practice model, not an official
ranking. "SOTA" below means the strongest current practice visible in the
protocol, the official docs, and the leading catalog entries — not popularity.

## The ten layers

| Layer | Owns | Typical artifacts |
|---|---|---|
| L0 Distribution & Composition | How code becomes a runnable profile | package.json, dsh.bundle, patch YAML, profile, npm/Git install |
| L1 Host Runtime & Lifecycle | How a plugin mounts, injects, and disposes | Cordis plugin, service class, effects, config schema |
| L2 Capability Seams & Services | How a capability is defined and swapped | Service Definition, Provider, Consumer, ctx key |
| L3 Tools & Model-Facing Context | What the model can call and see | tool schema, execution policy, result shaping |
| L4 Skills & Agent Instructions | When and how instructions load | SKILL.md, skill provider, catalog, resources |
| L5 Agent Composition & Orchestration | How work is composed and delegated | preset, hook, subagent, goal, schedule, team |
| L6 Client UI & Experience | What the human sees and operates | dsh.client entry, slots, chat nodes, settings, resources |
| L7 Data, Sessions & Persistence | What survives and how it is replayed | session events, projections, SQLite, migrations |
| L8 Security, Privacy & Supply Chain | What is trusted and what is confined | sandbox, approval, auth, secrets, provenance |
| L9 Operations, Market & Ecosystem | How plugins are found, installed, updated, retired | index, market, diagnostics, snapshots, rollback |

L0 and L9 are cross-cutting: every plugin has a distribution and an operational
life. L1–L8 are the runtime stack. A plugin can touch several layers; assign one
**primary** layer for the decision and list the rest as dependencies.

## How to use this reference

1. Classify the request by primary layer.
2. Read that layer's contracts and SOTA practices.
3. Read the adjacent layers it depends on.
4. Use the verification list before recommending or shipping.
5. Use the landscape reference to find comparable implementations.

Do not use the layer map to justify a new plugin. First prove no existing
provider or seam can carry the behavior.

---

## L0 — Distribution & Composition

### What belongs here

Profiles, bundles, patch layers, package manifests, install/update mechanics,
platform gating, display metadata, and release artifacts.

### Contracts

- A **profile** is a named composition in the Harness home. Its package.json
  declares dsh.profile.bundles in order.
- A **bundle** is an npm package with dsh.bundle.patch: one patch file or an
  ordered list. The patch inserts or overrides plugin rows.
- Layers apply to an empty tree in order: profile bundles, profile patch, home
  patch, then --patch overlays. Later layers win per row, and a patch replaces
  the whole config of a row rather than deep-merging it.
- Declare engines.dsh for the supported Harness range, and mirror every DSH
  peer dependency in both peerDependencies and devDependencies.
- dsh.bundle.platforms restricts host operating systems. dsh.bundle.listedByDefault
  hides optional bundles from default lists without removing management access.
- A package with dsh.client also ships a browser half. A package without a
  dsh.bundle declaration installs as a plain dependency but activates no layer.

### SOTA practices

1. **Treat row ids and patch shape as public API.** Stable ids, minimal overrides,
   and a full config restatement whenever you replace a row.
2. **Declare compatibility.** engines.dsh plus matching peers; test the oldest and
   newest supported host, not only the development checkout.
3. **Ship built artifacts by default.** npm or a tarball. If installing from Git,
   provide a self-contained prepare script and document the build allowlist;
   pin a commit so a push cannot silently change what runs.
4. **Keep layers separable.** Host patch, client patch, and preset patch should be
   independently reviewable. Use the ordered-list form only when order matters.
5. **Let configuration default.** Put defaults in a schema; expose only the keys a
   user is likely to change. Never require a hand-edited profile.
6. **Ship discoverable metadata.** Locale title/description, icon, optional detail
   document, and a files list that actually contains them.
7. **Gate the optional.** Use platforms and listedByDefault for experimental or
   platform-specific bundles.
8. **Make install reversible.** Record the profile state, verify with
   dsh --profile <name> --dump-config, and know the remove path before adding.

### Anti-patterns

- No dsh.bundle declaration, or a bundle whose patch references missing files.
- Deep-merge assumptions that silently drop sibling config keys.
- Unpinned Git installs, mutable tags, or a postinstall script that fetches code.
- Duplicate plugin ids or package names that shadow another owner.
- Shipping source without a build path, or built artifacts without sources.

### Verification

- dsh plugin --profile <profile> add <spec>
- dsh --profile <profile> --dump-config
- confirm layer order and row ids
- pnpm pack and inspect the files list
- remove and re-add; confirm the profile returns to its prior state
- check engines.dsh and peer ranges against the running host

### Landscape anchors

dsh-doublecheck and dsh-memento show explicit manifests, compatibility ranges,
and capability declarations. tangyixiao/dsh-version-manager and
xiaoyuyu6420/dsh-backup show the operational side: snapshots, restore, and
evidence-gated recovery.

---

## L1 — Host Runtime & Lifecycle

### What belongs here

The Cordis plugin itself: apply, inject, services, effects, configuration,
lifecycle, and hot reload.

### Contracts

- A plugin exports name and apply(ctx). It can also use object or class form.
- inject declares required services; the framework waits for them before apply.
- Registrations are effects. Anything registered through ctx is disposed when the
  plugin unloads. External resources need ctx.effect with an explicit disposer.
- A service is a class extending Service, constructed with a ctx key. Use a
  class only when the plugin provides a service to others.
- Config schema belongs to the plugin; validate at the boundary, not deep in
  call sites.

### SOTA practices

1. **One responsibility per plugin.** Split capability definition, provider,
   consumer, and UI when they evolve at different speeds.
2. **Inject explicitly.** No optional service reached through a global. If a
   dependency is optional, model it as an optional injection or a separate row.
3. **No top-level side effects.** Imports must be safe; apply must be
   deterministic and repeatable.
4. **Make every effect reversible.** Timers, sockets, watchers, child processes,
   and subscriptions all get a disposer.
5. **Survive HMR.** Unload and reload must leave no stale listener, timer, or
   duplicated registration.
6. **Validate config once.** Reject bad values with a clear message; do not
   scatter coercions through the runtime.
7. **Fail visibly, not loudly.** A failed optional provider should degrade; a
   required provider should fail its row with an actionable error.
8. **Keep logs proportional.** Debug detail behind a flag; no secrets, tokens,
   or full prompts in normal logs.

### Anti-patterns

- Global timers/listeners that outlive unload.
- Reading environment or files at import time.
- Blocking apply on network I/O.
- Throwing from an event handler and taking down the turn.
- Monkey-patching another plugin's service or the agent loop.
- Hidden singletons shared across profiles.

### Verification

- mount, unload, and mount again; check for duplicate registrations
- trigger HMR and repeat
- start with a missing required dependency; confirm a clean failure
- pass invalid config; confirm a clear rejection
- inspect disposal of timers, sockets, and watchers
- run a long session and check memory/listener growth

### Landscape anchors

dsh-memento (typed service plus provider), dsh-fail-guard (small event-driven
guard), omdsh-dev/dsh-advisor (host plus client halves), and Rxiain/dsh-openviking
(provider with client surfaces) show the range of lifecycle shapes.

---

## L2 — Capability Seams & Services

### What belongs here

A swappable capability with three roles: Service Definition (interface),
Service Provider (implementation), and Consumer (usually a tool, command, or UI).
The registry or service key is the seam.

### Contracts

- One ctx key names one engine, runtime, policy, controller, resolver, store, or
  current configuration. Plural keys are registries that own multiple named
  members.
- Providers register effects; consumers depend on the interface, not the
  implementation.
- The official seams include ctx.llm, ctx.tools, ctx.fs, ctx.shell, ctx.sandbox,
  ctx.subagents, ctx.sessions, ctx.skills, ctx.approval, ctx.compaction,
  ctx.browser, ctx.terminals, and ctx.goals. Use the documented seam before
  inventing a parallel one.
- Scoped registrations isolate a capability to one agent or preset. Service rows
  mounted inside a preset need an isolate realm.

### SOTA practices

1. **Design the interface first.** Name the role honestly: Provider, Backend,
   Registry, Runtime, Resolver, Policy, Gateway, Store. Avoid Service when a
   sharper role exists.
2. **Separate roles when they evolve independently.** The shell trio is the
   template: definition, provider, consumer.
3. **Swap without forking.** A new provider should change one row, not the loop.
4. **Make precedence explicit.** Duplicate names, fallback order, and disposal
   must be documented and tested.
5. **Respect scope.** Per-agent and per-preset registrations must not leak into
   the global layer.
6. **Use capability events for policy and observation.** Do not import the loop
   to intercept it.
7. **Test with a fake provider.** The consumer should pass against the interface
   without the real backend.
8. **Document the ctx key and contract** in the package README, including
   lifecycle and failure behavior.

### Anti-patterns

- A provider that imports its consumer, or a consumer that hardcodes a provider.
- Reusing one ctx key for incompatible host and client declarations.
- A registry with undocumented duplicate/fallback rules.
- A new service that duplicates an existing seam under another name.
- Global mutable state that bypasses scope.

### Verification

- replace the provider with a fake; consumer behavior unchanged
- register duplicate names; confirm the documented precedence
- mount the provider in a preset scope; confirm global isolation
- unload the provider; confirm consumers fail closed or degrade as documented
- check the ctx key against the generated Cordis catalog

### Landscape anchors

dsh-browser-service (ctx.browser provider), dsh-memento (ctx.memory seam),
ArcaneOrion/dsh-model-channel-manager (routing over model providers), and
dsh-armory (capability management) show provider, seam, and consumer roles.

---

## L3 — Tools & Model-Facing Context

### What belongs here

Model-callable tools, their schemas, execution policy, result shaping, and the
context cost they add to every request.

### Contracts

- Register tools on ctx.tools. defineTool is the typed helper; raw JSON-Schema
  definitions are accepted for MCP-sourced tools.
- The execution pipeline exposes distinct interception points:
  tools/pre-execute is the reorderable policy waterfall; ctx.tools.guard() is a
  monotonic final denial; tools/execute wraps dispatch; tools/post-execute
  transforms results; tools/result observes the immutable final outcome.
- Cancellation arrives through the execution signal. Background work uses the
  documented run_in_background pattern.
- A terminal tool can call concludeTurn() so the loop stops after the step.
- Tool schemas join prompt assembly. They are model-visible context, not free.

### SOTA practices

1. **Type the inputs.** Narrow schemas, enums, bounds, and clear descriptions.
   Avoid one giant free-form string.
2. **Say when to use it and when not to.** The description is routing text; it
   should discriminate the tool from neighbors.
3. **Fail closed on policy.** Deny by default when the target or intent is
   ambiguous; return a reason the model can act on.
4. **Respect cancellation.** Do not swallow AbortSignal; stop child work.
5. **Bound the output.** Summarize, truncate, or spill large results; never return
   an unbounded log or secret-bearing dump.
6. **Make errors structured.** Stable codes, human-readable reasons, and enough
   context to recover — no stack traces or credentials.
7. **Keep the tool surface small.** Use deferred schemas / ToolSearch for large
   MCP servers; names-only until a schema is needed.
8. **Test the policy and the edge.** Allow, deny, ask, cancel, empty result,
   oversized result, and background completion.

### Anti-patterns

- A tool that can do anything through an unvalidated string.
- Returning raw secrets, tokens, or full environment dumps.
- Ignoring the abort signal and leaving child processes running.
- A wrapper that changes the result without declaring it.
- Registering dozens of low-value tools that bloat every prompt.
- A tool that performs a terminal action and lets the loop continue.

### Verification

- schema validation for missing/extra/boundary inputs
- policy: allow, deny, ask, and guard precedence
- cancellation during a long call
- oversized output and spill behavior
- structured error paths
- prompt/token delta for the added schema

### Landscape anchors

dsh-claude-delegate (delegation tool with explicit controls), dsh-toolbox-ui
(deferred MCP schemas), dsh-armory (capability management), and dsh-diff-approval
(review-oriented tooling) show the range.

---

## L4 — Skills & Agent Instructions

### What belongs here

Reusable instructions that load on demand: SKILL.md, skill providers, catalogs,
resources, and invocation policy.

### Contracts

- The local provider scans roots in rank order: project .dsh/skills, project
  .agents/skills, custom directories, user .dsh/skills, user .agents/skills,
  and a configured bundled root.
- Skills are directory bundles (<name>/SKILL.md) or flat <name>.md files. Names
  are kebab-case. Recursive **/SKILL.md discovery is not supported.
- Frontmatter controls model and user invocation. The catalog exposes name and
  description only; the body loads on demand.
- Resources resolve through resourceBase. The tool result points at relative
  resources but does not enumerate the directory.

### SOTA practices

1. **One skill, one job.** A skill is a decision procedure, not a knowledge dump.
2. **Make the description discriminating.** State the capability and the trigger;
   add an exclusion only when it prevents a likely misroute.
3. **Use progressive disclosure.** Keep the executable path and non-negotiable
   constraints in SKILL.md; move conditional detail to one-level references.
4. **Write scripts that are idempotent and self-checking.** A script should print
   evidence, not just "ok".
5. **Use resources deliberately.** Reference scripts/assets with paths relative to
   the skill; do not hardcode absolute host paths.
6. **Choose invocation policy.** Model-invocable for routing; user-only for
   human workflows; both false only for trusted programmatic callers.
7. **Evaluate triggers.** Positive, negative near-miss, and pressure cases. A
   skill that never fires is dead weight; one that fires everywhere is noise.
8. **Keep provenance.** Version, owner, source, and the evidence behind changes.

### Anti-patterns

- A megaskill that tries to cover every domain.
- A vague description that competes with every other skill.
- Hidden instructions in references that the main body never triggers.
- Absolute paths, interactive prompts, or destructive scripts.
- Duplicating the system prompt or another skill's content.
- Stale catalogs after body edits.

### Verification

- positive trigger, negative near-miss, and pressure scenario
- load the body and each conditional reference
- resolve every referenced resource
- check invocation flags on both model and user surfaces
- edit the body; confirm the next load sees it
- run the skill's scripts and check their output

### Landscape anchors

dsh-research-suite (skills plus tools and a ledger),
PolinniZhong/dsh-skill-intelligence (observed loading evidence), and
dsh-plugin-superpowers (a coherent method pack) show discovery, provenance, and
composition.

---

## L5 — Agent Composition & Orchestration

### What belongs here

Presets, hooks, subagents, goals, schedules, teams, and any policy that composes
work across agents or turns.

### Contracts

- A preset is a declaration whose config.plugins composes a standing tree. A
  service row inside a preset needs an isolate realm.
- Hooks map to the documented waterfalls: agent/created, agent/pre-step,
  tools/pre-execute, tools/post-execute, and agent/turn-stopping. Return typed
  decisions; do not throw to signal a normal denial.
- Subagents come from the ctx.subagents provider registry. The handle owns
  identity, messaging, interruption, and disposal. Dispose to quiescence.
- Goals are durable same-session state on ctx.goals. Schedules deliver through
  followup with a schedule source.
- Agent Teams is opt-in for a root session; it is not a default orchestration
  layer.

### SOTA practices

1. **Compose declaratively.** Put the tree in a preset or bundle patch; do not
   assemble agents in ad-hoc code.
2. **Least privilege per agent.** Each preset gets only the tools, skills, and
   services its role needs.
3. **Define stop conditions.** Budgets, max rounds, deadlines, and a clear
   terminal state. No unbounded delegation loops.
4. **Make delegation contracts explicit.** Input, output, evidence, and what the
   child may not do.
5. **Own the lifecycle.** Cancel, await, and dispose subagents; clean up job and
   terminal handles.
6. **Record durable state.** Use goals, schedules, and the session log; do not
   keep orchestration state only in memory.
7. **Observe the tree.** Emit enough status for a human to see what is running,
   waiting, blocked, or done.
8. **Gate destructive steps.** Approval or explicit user consent at the boundary;
   do not let a child inherit a broad grant silently.

### Anti-patterns

- ad-hoc loops instead of goals, schedules, or workflows
- fire-and-forget subagents with no disposal
- a preset with every tool and every service "just in case"
- hooks that swallow errors and let the turn continue
- unbounded retries, delegation, or recursion
- duplicate orchestration owners that fight over the same state

### Verification

- compose the preset; inspect the standing tree
- hook allow/deny/ask; confirm typed decisions
- cancel a running subagent; confirm quiescence
- exhaust the budget; confirm a clean stop
- resume a schedule; confirm no duplicate delivery
- inspect the agent tree and task board for orphans

### Landscape anchors

dsh-proactive (durable alarms), dsh-switchman (dispatch plus verification),
ECCVIK/lmtagent (role presets and wave scheduling), and
dsh-plugin-agent-collaboration (persistent bots and rooms) show the orchestration
spectrum.

---

## L6 — Client UI & Experience

### What belongs here

Browser code that extends the Web Client: client plugin entries, slots, chat
nodes, settings cards, resources, theming, and interaction states.

### Contracts

- A client package declares dsh.client, exports ./client, and builds through the
  shared client preset. The browser half runs in the page, not in the host.
- Slots are the composition seam: register into a named slot with a key; do not
  replace the shell.
- A Conversation business node registers a ConversationNodeDefinition plus a
  keyed renderer. Render from durable session/event records and transient
  agent/assistant-stream frames; drive input through agent.followup/steer.
- Client resources use dsh-resource:// addresses and the resource provider
  registry. Do not import the content owner's runtime.
- Settings cards and plugin metadata are discoverable surfaces, not a place for
  hidden behavior.

### SOTA practices

1. **Extend, do not fork.** Use slots, nodes, resources, and settings cards.
2. **Separate durable from live.** History comes from session/event; tokens come
   from assistant-stream. Reconcile them explicitly.
3. **Design the states.** Loading, empty, partial, error, offline, permission
   denied, and plugin unloaded.
4. **Keyboard and screen reader first.** Focus order, labels, escape, and no
   keyboard traps.
5. **Responsive by default.** The Web Client is used on narrow screens and mobile
   browsers; test the collapsed and overlay layouts.
6. **Use theme tokens.** No hardcoded colors; support light and dark.
7. **Localize.** Ship locale files; do not concatenate translated fragments.
8. **Lazy load and bound the bundle.** A plugin should not delay first paint.
9. **Escape and sandbox user content.** No raw HTML from a model or remote page
   without a sanitizer and a clear policy.
10. **Test in a real browser.** HMR, unload/reload, slow network, and CSP.

### Anti-patterns

- DOM hacks or monkey-patching React internals.
- Importing host packages into the browser bundle.
- Inline remote HTML, unsanitized Markdown, or dangerouslySetInnerHTML without a
  trust boundary.
- Hardcoded colors, fonts, or pixel sizes that break themes and mobile.
- English-only strings in a user-facing surface.
- A client plugin that performs privileged host work directly.

### Verification

- light/dark, narrow viewport, keyboard-only
- loading, empty, error, and plugin-unloaded states
- HMR and full reload
- CSP and sanitizer behavior
- bundle size and first-paint impact
- i18n switch and fallback

### Landscape anchors

OrderG-X/dsh-design-studio (canvas workbench), baitouwuya/dsh-super-cards
(native generative UI), CheeseFox259/dsh-better-composer (input UX),
cherrchen/dsh-theme-studio (token-level theming), and
user-Mrz/dsh-system-prompt-studio (inspectable prompt override) show the surface
range.

---

## L7 — Data, Sessions & Persistence

### What belongs here

Durable facts, projections, storage backends, migrations, export/import, backup,
and retention.

### Contracts

- The session log is the source of context the model sees. Every model-visible
  input must be reconstructable from the log.
- Session events are durable and broadcast through session/event. Live events
  (agent/assistant-stream) are transient and process-local.
- Log-only events record facts without joining the model surface. Surface events
  produce messages. Extending SessionEventMap is a format change.
- Plugins changing existing message content register pure message projections.
- The JSONL provider owns framing, compression, generation selection, and
  exclusive publication. Migrations are adjacent vN -> vN+1 steps.

### SOTA practices

1. **Log the model-visible input.** No side channel that changes what the model
   sees without a durable record.
2. **Choose durable vs live deliberately.** UI incrementality is not history.
3. **Keep projections pure.** Same events in, same view out; no hidden I/O.
4. **Version the format.** One adjacent migration per step; refuse a future
   version; never rewrite a committed generation in place.
5. **Write atomically.** Temp file plus rename; verify after write.
6. **Bound growth.** Retention, compaction, pruning, and size limits are part of
   the design, not an afterthought.
7. **Make export/delete first-class.** A user must be able to take their data and
   remove it.
8. **Protect secrets and personal data.** Redact at the boundary; do not put
   credentials in event payloads.
9. **Test replay and recovery.** Restart, reload, corrupt tail, interrupted write,
   migration, and rollback.

### Anti-patterns

- Model-visible state held only in memory.
- Rewriting history or mutating committed events.
- Unversioned schemas or destructive migrations.
- Secrets, tokens, or full prompts in durable logs.
- Unbounded event payloads or logs that never rotate.
- A second source of truth that disagrees with the session log.

### Verification

- replay a session from the log; compare model history
- restart during a write; confirm recovery
- migrate an old generation; confirm the source is unchanged
- compact and re-open; confirm projections survive
- export, delete, and re-import
- check retention and size bounds

### Landscape anchors

light-cheng/dsh-strata (layered context and archive), dsh-session-flow
(cross-session archive and lineage), dsh-memento (bounded memory), and
xiaoyuyu6420/dsh-backup (backup and restore) show the data lifecycle.

---

## L8 — Security, Privacy & Supply Chain

### What belongs here

Threat modeling, trust boundaries, approvals, sandboxing, authentication,
secrets, privacy, dependency and install safety, and disclosure.

### Contracts

- Installing a plugin runs third-party code with the user's permissions. Tool
  approvals do not sandbox plugin code. Being on the awesome list is not a
  security review.
- The sandbox and approval axes are independent. A permission preset bundles a
  sandbox mode and an approval policy; neither implies the other.
- The approval seam fails closed unless the outcome is allowed-once.
- HTTP routes and WebSocket upgrades need their own access checks. Binding to
  0.0.0.0 without auth exposes the whole local agent.

### SOTA practices

1. **Assume host code is privileged.** Review the source, not the description.
2. **Pin and verify.** Exact version or commit, lockfile, checksum/provenance
   where available.
3. **Minimize the dependency and script surface.** Fewer packages, no unnecessary
   postinstall, no dynamic code from the network.
4. **Request least privilege.** Declare only the capabilities and network egress
   you need, and explain why.
5. **Authenticate every path.** Pages, API routes, plugin bundles, and WebSocket
   upgrades. Deny by default; allowlist explicitly.
6. **Keep secrets out of logs and prompts.** Use the credentials service; redact
   before persistence and display.
7. **Fail closed.** Unknown target, ambiguous policy, or missing approval means
   no action.
8. **Make behavior auditable.** Record who asked, what was decided, and why,
   without recording the secret.
9. **Disclose capability.** A trust-check surface should list tools, network
   destinations, install scripts, and prompt/skill injections.
10. **Plan removal.** Uninstall must stop code, remove routes, and leave no
    orphaned credentials or scheduled jobs.

### Anti-patterns

- No auth on HTTP/WS routes; broad LAN exposure by default.
- Running arbitrary downloaded code, eval, or unsandboxed shell from a plugin.
- Hidden telemetry, credential collection, or undisclosed network calls.
- Plaintext secrets in config, logs, or session events.
- A plugin that asks for danger-full-access as the default.
- An approval prompt that can be bypassed by a retry or a child agent.

### Verification

- route inventory: pages, API, plugin bundles, WebSocket upgrades
- auth bypass attempts and CSRF/CORS checks
- dependency audit and install-script review
- secret scan of config, logs, and prompts
- approval deny/ask/allow-once paths
- uninstall and verify no running code, routes, or scheduled work

### Landscape anchors

dsh-ui-auth (route and WS auth), dsh-jev-interceptor (pre-execute policy),
dsh-trust-check (capability disclosure), and @shypie_privacy/dsh-privacy-gate
(local extraction before the session log) show the defensive surface.

---

## L9 — Operations, Market & Ecosystem

### What belongs here

Publishing, indexing, discovery, install/update/rollback, diagnostics,
observability, deprecation, and profile lifecycle.

### Contracts

- Publish built artifacts to npm, or ship a tarball. Git installs fetch sources;
  a self-contained prepare script is required and the user must allow the build.
- Use SemVer, engines.dsh, a changelog, and immutable releases.
- The plugin index format is format 1; entries carry identity, metadata,
  repository, versions, and source. The awesome list is a curated view, not a
  security verdict.
- The Plugin Manager owns profile install/remove/update, compatibility checks,
  build-script approval, and restart-required reporting.
- Compatibility exemptions are exact package@version pairs and require explicit
  risk acceptance. They do not authorize dependency scripts.

### SOTA practices

1. **Publish reproducible, built packages.** Include the files list, locale,
   icon, and detail doc; exclude tests and secrets.
2. **Make versions meaningful.** SemVer, changelog, migration notes, and a
   deprecation policy.
3. **Verify before listing.** A market/index entry should prove the package
   declares a bundle, installs, and matches its description.
4. **Snapshot before update.** Record the profile, lockfile, and enabled set;
   offer rollback only with replay evidence.
5. **Diagnose the install.** Boot crashes, config drift, peer conflicts,
   duplicate ids, stale backups, and unsupported platforms need a read-only
   diagnostic path.
6. **Respect consent for updates.** No silent auto-update that changes behavior.
7. **Observe health.** Install/update results, startup failures, and plugin
   errors should be visible without reading raw logs.
8. **Retire cleanly.** Remove the listing, mark the package deprecated, keep a
   migration note, and do not leave a half-working loader row.

### Anti-patterns

- Unpinned Git installs, mutable tags, or source-only packages.
- Auto-update without consent or rollback.
- Index entries that were never install-tested.
- Silent breaking changes in a patch release.
- Orphaned rows after uninstall, or a profile that cannot boot.
- Compatibility exemptions used as a substitute for a fix.

### Verification

- fresh install, upgrade, downgrade guard, uninstall
- offline install and index refresh
- profile dump before/after
- compatibility check against the running host
- startup diagnostics after a forced failure
- restore from snapshot

### Landscape anchors

moldkey/dsh-deepseekbase (third-party index), dsh-mall (refreshed catalog with
pre-install review), dsh-version-manager (snapshots and recovery),
xiaoyuyu6420/dsh-backup, stallenlu/dsh-steward (install diagnostics), and
dsh-conflict-doctor (loader vs on-disk drift) show the operational layer.

---

## Cross-cutting quality bar

Every layer is judged on the same five questions:

1. **Correct owner.** Is this the documented seam, or a parallel mechanism?
2. **Reversible.** Can it be unloaded, rolled back, and removed without residue?
3. **Observable.** Can a human tell what it did, what it cost, and why it failed?
4. **Bounded.** Are time, tokens, output, storage, and privileges bounded?
5. **Proven.** Is there a test, a replay, or a reproducible check — not a claim?

If any answer is "no", the plugin is a trial, not SOTA.
