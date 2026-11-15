# Authoring a DSH plugin

This is the build-side companion to the layer model. It is a checklist, not a
scaffold generator. The snippets show shape; use the official package templates
and generated docs for exact signatures.

## Before writing code

Answer these in order:

1. **What outcome is missing?** Name the user-visible behavior, not the feature.
2. **Which layer owns it?** L0–L9 from layer-model.md.
3. **Which existing seam could carry it?** Tool, provider, skill, preset, client
   slot, resource, command, hook, storage backend.
4. **Why is composition insufficient?** A new plugin must beat the smallest
   existing provider or a configuration change.
5. **What is the failure mode?** If the plugin is wrong, what breaks, and how is
   it removed?
6. **What evidence will prove it?** A test, replay, or reproducible check.

If you cannot answer 3 and 4, stop. You are probably about to duplicate an owner.

## Choose the package shape

| Need | Shape |
|---|---|
| One capability implementation | One package, host plugin plus optional client entry |
| Swappable capability | Definition package, provider package, consumer package |
| Instructions only | Skill directory, optionally packaged in a bundle |
| Agent composition | Preset declaration plus the plugins it mounts |
| UI only | Client plugin with dsh.client and a slot/node contribution |
| Storage only | Persistence provider behind the documented seam |

A single-purpose plugin should stay one package. Split only when the roles evolve
independently or have different compatibility or security needs.

## Package skeleton

~~~text
my-plugin/
  package.json
  cordis.patch.yml
  src/
    index.ts
    client.ts        # optional browser half
  locale/
    en.json
    zh.json
  test/
  README.md
~~~

## L0 — Distribution manifest

A host bundle:

~~~json
{
  "name": "dsh-my-plugin",
  "version": "0.1.0",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "files": ["lib", "cordis.patch.yml", "locale"],
  "engines": {
    "node": ">=22.19",
    "dsh": ">=0.2.1-0 <0.3.0-0"
  },
  "dsh": {
    "manifestVersion": 1,
    "bundle": { "patch": "./cordis.patch.yml" },
    "capabilities": ["tools:register"]
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "~4.1.0"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "~4.1.0"
  }
}
~~~

A client-bearing package adds:

~~~json
{
  "dsh": {
    "bundle": { "patch": ["./host.patch.yml", "./client.patch.yml"] },
    "client": {
      "platform": "web",
      "inject": ["@deepseek-ai/dsh-client-locale"]
    }
  },
  "exports": {
    ".": { "types": "./lib/types/index.d.ts", "default": "./lib/index.js" },
    "./client": { "types": "./lib/types/client.d.ts", "default": "./lib/client.js" },
    "./package.json": "./package.json"
  }
}
~~~

The patch inserts rows:

~~~yaml
- insert:
    - id: my-plugin
      name: dsh-my-plugin
~~~

Checklist:

- dsh.bundle.patch is present and every referenced file exists.
- engines.dsh covers the host you tested; peers are mirrored in devDependencies.
- files includes every runtime artifact, locale, icon, and detail doc.
- platform gating is explicit for OS-specific bundles.
- listedByDefault is false for optional or experimental bundles.
- The patch uses stable row ids and restates a full config when overriding.
- Install, upgrade, and remove work in a disposable profile.
- package.json and README tell the same story.

## L1 — Host plugin

~~~ts
import type { Context } from '@deepseek-ai/cordis'

export const name = 'my-plugin'
export const inject = ['tools']

export function apply(ctx: Context) {
  ctx.effect(() => {
    const timer = setInterval(() => {
      // bounded, observable work
    }, 30_000)
    return () => clearInterval(timer)
  })
}
~~~

Checklist:

- name is stable and unique; inject lists every required service.
- apply is deterministic and safe to run twice.
- Every timer, listener, socket, watcher, and child process has a disposer.
- No network or filesystem work at import time.
- Config is validated once with a schema; errors name the bad field.
- Logs are proportional and never contain secrets or full prompts.
- Optional dependencies degrade; required dependencies fail the row visibly.
- Unload/reload leaves no duplicate registration.

## L2 — Service and seam

Use a service class only when other plugins consume the capability.

~~~ts
import { Service, type Context } from '@deepseek-ai/cordis'

export class MyStore extends Service {
  static inject = ['tools']

  constructor(ctx: Context) {
    super(ctx, 'myStore')
  }
}
~~~

Checklist:

- The ctx key names one role: Store, Registry, Runtime, Provider, Policy, etc.
- The interface is separate from the implementation when it is swappable.
- Providers register effects; consumers depend on the interface.
- Duplicate names, fallback order, and disposal are documented and tested.
- Per-agent or per-preset registrations do not leak into the global layer.
- A fake provider passes the consumer tests.
- The package README documents the ctx key, lifecycle, and failure behavior.

## L3 — Tool

~~~ts
import { defineTool } from '@deepseek-ai/dsh-tools'

ctx.tools.register(defineTool({
  name: 'my_lookup',
  description: 'Look up one record by id. Use when the id is known; do not use for free-text search.',
  parameters: {
    type: 'object',
    properties: { id: { type: 'string', minLength: 1 } },
    required: ['id'],
    additionalProperties: false,
  },
  async execute({ id }, exec) {
    exec.signal.throwIfAborted()
    return { id, found: false }
  },
}))
~~~

Policy shape:

~~~ts
ctx.on('tools/pre-execute', async (exec, next) => {
  if (exec.name === 'my_lookup' && !isAllowed(exec)) {
    return { kind: 'deny', reason: 'Not permitted for this workspace.' }
  }
  return next()
})
~~~

Checklist:

- Inputs are typed, bounded, and validated; no unvalidated catch-all string.
- The description says when to use it and when not to.
- Cancellation is honored and child work stops.
- Output is bounded; large data is spilled or summarized.
- Errors are structured and secret-free.
- Policy uses the documented waterfall or guard, not a prompt.
- The schema is worth its token cost; large sets are deferred.
- Terminal tools conclude the turn.
- Tests cover allow, deny, ask, cancel, empty, oversized, and background.

## L4 — Skill

~~~text
my-skill/
  SKILL.md
  references/
    detail.md
  scripts/
    check.mjs
~~~

~~~markdown
---
name: my-skill
description: Use when ...; do not use for ...
---

# My skill

## Default path

1. ...
2. ...

## References

- Read references/detail.md only when ...
~~~

Checklist:

- Name is kebab-case; description states capability and trigger.
- The main body holds the executable path and non-negotiable constraints.
- Conditional detail is one level deep and has an explicit read trigger.
- Resources resolve relative to the skill; no absolute host paths.
- Scripts are idempotent, non-interactive, and print evidence.
- Model/user invocation flags match the intended surface.
- Positive, negative near-miss, and pressure scenarios were evaluated.
- Body edits are visible on the next load; the catalog is not stale.

## L5 — Preset, hook, subagent

Preset shape:

~~~yaml
- insert:
    - id: preset-my
      name: dsh-my-preset
      config:
        plugins:
          - id: my-tools
            name: dsh-my-plugin/tools
          - id: my-store
            name: dsh-my-plugin/store
            isolate: true
~~~

Hook shape:

~~~ts
ctx.on('agent/pre-step', async (decision, next) => {
  if (!isRelevant(decision)) return next()
  return next()
})
~~~

Checklist:

- Composition is declarative; the preset owns its standing tree.
- Service rows inside a preset use an isolate realm.
- Each role gets least privilege: only the tools, skills, and services it needs.
- Budgets, max rounds, deadlines, and a terminal state are explicit.
- Hooks return typed decisions; errors are not swallowed.
- Subagents are cancelled, awaited, and disposed; no orphans.
- Durable state uses goals, schedules, or the session log.
- The tree is observable: running, waiting, blocked, done.

## L6 — Client UI

~~~ts
export const inject = ['slots']

export function apply(ctx: Context) {
  ctx.slots.inject('sidebar.footer', () =>
    ctx.slots.register({ name: 'sidebar.footer', key: 'my-status' }, StatusRow))
}
~~~

Checklist:

- dsh.client is declared; the client entry is exported and built.
- The surface extends a documented slot, node, resource, or settings card.
- Durable history uses session/event; live tokens use assistant-stream.
- Loading, empty, partial, error, offline, denied, and unloaded states exist.
- Keyboard, focus, labels, and escape are handled.
- Narrow screens and collapsed layouts are tested.
- Colors come from theme tokens; light and dark both work.
- Strings are localized; no concatenated translated fragments.
- User/model content is escaped or sanitized.
- The bundle is lazy and does not delay first paint.
- HMR, full reload, CSP, and plugin unload were tested.

## L7 — Data and events

Checklist:

- Every model-visible input has a durable session event.
- Durable facts and transient frames are not conflated.
- Message projections are pure and replayable.
- New session events extend the typed map and are versioned.
- Writes are atomic; a crash leaves a recoverable state.
- Migrations are adjacent, idempotent, and preserve the source.
- Retention, compaction, export, delete, and restore exist.
- Secrets and personal data are redacted before persistence.
- Replay, restart, corrupt tail, migration, and rollback are tested.

## L8 — Security review

- Source reviewed, not just the description.
- Exact version or commit pinned; lockfile updated.
- Install scripts and dependencies minimized and reviewed.
- Capabilities declared: tools, network egress, filesystem, credentials.
- Every HTTP route and WebSocket upgrade authenticated and scoped.
- Loopback by default; no 0.0.0.0 exposure without an explicit opt-in.
- Secrets in the credentials service, never in config, logs, or prompts.
- Approval fails closed; no child or retry bypass.
- Audit records who, what, and why, without the secret.
- Uninstall stops code, removes routes, and cleans scheduled work.

## L9 — Publish and list

Checklist:

- Built artifacts, not source; pnpm pack contents reviewed.
- SemVer, changelog, migration notes, and deprecation policy.
- npm provenance or a verifiable build; immutable release.
- engines.dsh and peers correct for the published version.
- Locale metadata, icon, and optional detail doc included.
- Fresh install, upgrade, downgrade guard, and uninstall tested.
- A disposable profile booted and dumped before/after.
- Index entry verified against the package and repository.
- The awesome-list PR includes the exact install command and a truthful
  one-line description.

## Test matrix

| Area | Minimum |
|---|---|
| Unit | Pure logic, schema validation, formatting |
| Composition | Plugin loads with its real peers; missing dependency fails cleanly |
| Lifecycle | Mount, unload, remount, HMR |
| Policy | Allow, deny, ask, guard, cancellation |
| Data | Replay, restart, migration, export/delete |
| Client | Light/dark, narrow, keyboard, loading/error, unload |
| Install | Fresh, upgrade, remove, rollback |
| Security | Route/auth inventory, secret scan, dependency audit |

## Release gate

Do not publish until:

1. The package installs into a fresh profile and boots.
2. The patch composes with the current base and does not duplicate an id.
3. The uninstall path works and leaves no residue.
4. The test matrix has evidence, not assertions.
5. The README, locale metadata, and package contents agree.
6. The security checklist has no open blocker.
