# The full DSH plugin landscape

Snapshot: 2026-11-14T20:37:26.554Z. Source: the awesome-dsh-plugin list plus the npm plugin index.

**Coverage:** 11111 listed entries across 23 categories; 5635 have a known npm version (50.7%), 5476 are GitHub-only.

This is a complete catalog view, not a claim that every entry was source-reviewed. The three exemplars per category are a starting shortlist chosen for explicit mechanisms, not a quality ranking. One-line descriptions are author/community claims.

## How to use this landscape

1. Start with the category that owns the user outcome, not the category that names the technology.
2. Read the SOTA signals and vet questions before opening a repository.
3. Shortlist three candidates; compare them on the evaluation rubric in evaluation.md.
4. Treat an exemplar as an architecture reference, not an endorsement to install.
5. Refresh this file when the upstream list changes: node scripts/refresh-catalog.mjs && node scripts/build-landscape.mjs

## Coverage by category

| Category | Entries | npm | Primary layer | SOTA focus |
|---|---:|---:|---|---|
| [AGI Architecture Exploration](#agi) | 82 | 45 | L5 | Durable cognition loops with explicit evidence, budgets, and rollback. |
| [UI Enhancements](#ui) | 2232 | 1078 | L6 | Composable surfaces that extend slots/nodes without forking the Web Client. |
| [Usage & Billing](#usage) | 598 | 285 | L6 | Reconstructable accounting from session logs, with cache and cost provenance. |
| [Themes & Appearance](#theme) | 405 | 181 | L6 | Token-level theming with preview, persistence, and import/export. |
| [Models & Providers](#model) | 562 | 299 | L2 | Provider routing with failover, observability, and credential isolation. |
| [Identity & Communication](#identity) | 132 | 71 | L5 | Identity and messaging that reuse native auth without leaking credentials. |
| [Sessions & Messages](#session) | 855 | 435 | L7 | Context economics: deterministic folding, provenance, and recoverable history. |
| [Memory](#memory) | 478 | 244 | L7 | Bounded, auditable memory with consent, conflict handling, and retrieval quality. |
| [Tools & Capabilities](#tools) | 1528 | 825 | L3 | Typed, cancellable tools with deferred schemas and policy-aware execution. |
| [WSL & Windows Interop](#wsl) | 88 | 12 | L3 | Native platform bridging without breaking sandbox or write-root semantics. |
| [Browser & Web](#browser) | 219 | 134 | L3 | Reusable browser providers with authenticated, loopback-only control. |
| [Vision & Multimodal](#vision) | 200 | 100 | L3 | Modality adapters that keep evidence and degrade gracefully. |
| [Voice & Audio](#voice) | 148 | 81 | L3 | Local-first audio pipelines with explicit device and permission handling. |
| [Docs & Rendering](#docs) | 208 | 113 | L6 | Source-grounded rendering with stable anchors and offline artifacts. |
| [Skills](#skill) | 397 | 167 | L4 | Progressive-disclosure skills with discovery, provenance, and evaluation. |
| [Workflow & Automation](#workflow) | 667 | 368 | L5 | Durable orchestration with budgets, stop conditions, and verification gates. |
| [Git & Code Review](#git) | 195 | 104 | L3 | Review surfaces that make diffs, lineage, and approval auditable. |
| [Notifications & Integrations](#notify) | 369 | 185 | L5 | Event-driven outbound channels with resumable sessions and consent. |
| [Development & Runtime](#dev) | 632 | 337 | L1 | Install-time diagnostics, drift detection, and reversible operations. |
| [Security & Permissions](#security) | 286 | 155 | L8 | Fail-closed policy, least privilege, and disclosure of plugin capability. |
| [Remote & Mobile](#remote) | 322 | 179 | L6 | Authenticated narrow surfaces, not broad exposure of the local GUI. |
| [Plugin Markets & Managers](#market) | 145 | 75 | L9 | Index-driven discovery with verification, provenance, and safe install. |
| [Just for Fun](#fun) | 363 | 162 | L6 | Event-derived state machines that stay decoupled from rendering. |

## Layer distribution

| Layer | Primary categories | Entries mentioning |
|---|---:|---:|
| L0 Distribution & Composition | 0 | 2304 |
| L1 Host Runtime & Lifecycle | 632 | 2797 |
| L2 Capability Seams & Services | 562 | 2650 |
| L3 Tools & Model-Facing Context | 2378 | 6959 |
| L4 Skills & Agent Instructions | 397 | 891 |
| L5 Agent Composition & Orchestration | 1250 | 3297 |
| L6 Client UI & Experience | 4128 | 7586 |
| L7 Data, Sessions & Persistence | 1333 | 4378 |
| L8 Security, Privacy & Supply Chain | 286 | 2426 |
| L9 Operations, Market & Ecosystem | 145 | 145 |

A high mention count means the layer is cross-cutting, not that those entries are all good examples of it.

## Signals in the catalog

Most frequent curated terms: deepseek (2894), plugin (1716), tool (1572), memory (934), token (780), skill (766), context (736), image (719), browser (695), mcp (680), markdown (512), server (499), git (453), approval (427), client (338), preset (330), theme (323), cache (299).

Most frequent heuristic tags: models (4815), client-ui (4789), sessions (3893), tools (3387), platform (1912), media (1690), security (1292), distribution (1277), service-seam (1260), persistence (1103), format (1036), orchestration (975).

The distribution shows where the ecosystem concentrates: UI surfaces, tools, sessions/context, orchestration, and platform bridges. It does not show where the quality is. Use the signals and questions below.

---

<a id="agi"></a>
## AGI Architecture Exploration

**82 entries · 45 npm-indexed · primary layer L5 (Durable cognition loops with explicit evidence, budgets, and rollback.)**

### SOTA looks like

- Durable state with an explicit evidence trail.
- Bounded autonomy: budgets, stop conditions, and a human-visible terminal state.
- Auditable evolution with baseline, rollback, and a measurable objective.

### Exemplars

- **kenz1117/dsh-engram** (@kenz1117/dsh-engram@0.13.10) — Hybrid FTS5 + local-vector retrieval with RRF, an evidence gate, and a provenance chain. Install: dsh plugin --profile web add @kenz1117/dsh-engram@0.13.10
  Cross-session long-term memory as a local SQLite store: dual scopes (user + per-git-origin project), hybrid FTS5 + local-vector retrieval fused with RRF, an evidence gate that forces an explicit sufficiency judgement, provenance audit chains, SM-2 spaced-repe...
- **dsh-proactive** (dsh-proactive@0.3.2) — Durable host alarms with quiet hours, budgets, cold-session wake, and silent-turn tombstones. Install: dsh plugin --profile web add dsh-proactive@0.3.2
  Host-level proactive wake-ups for DeepSeek Harness: the model schedules its own alarms (once, recurring interval, or cron, with optional random jitter), cold sessions are woken on time by session resume, model-initiated follow-ups are gated by quiet hours and...
- **DDL095/dsh-moa-native** (dsh-moa-native@4.5.3) — Generation-time Mixture-of-Agents with parallel drafts and a tool-capable aggregator. Install: dsh plugin --profile web add dsh-moa-native@4.5.3
  Native generation-time Mixture-of-Agents: every turn, reference models run the same session context in parallel as pre-run drafts and one aggregator executes with full tooling; config-as-model recipes, F mirror / R trimmed views, enforced subagent gating (dua...

### Vet before adopting

- Where is state stored, and can it be replayed?
- What stops a runaway loop or an unbounded self-modification?
- Can a human inspect, approve, and roll back a change?

**Pitfall:** Self-evolution without a baseline, a budget, or a rollback path is an uncontrolled mutation, not progress.

Query this category: node scripts/query.mjs category agi --limit 20

---

<a id="ui"></a>
## UI Enhancements

**2232 entries · 1078 npm-indexed · primary layer L6 (Composable surfaces that extend slots/nodes without forking the Web Client.)**

### SOTA looks like

- Composition through slots, nodes, resources, and settings cards.
- A clean split between durable session records and transient stream frames.
- Explicit loading, empty, error, keyboard, narrow-screen, theme, and locale states.

### Exemplars

- **OrderG-X/dsh-design-studio** (dsh-design-studio@0.19.1) — Canvas workbench with floating tool groups, recent work, and template-first entry. Install: dsh plugin --profile web add dsh-design-studio@0.19.1
  Design workbench in the right sidebar. Its tools sit in floating groups at the canvas corners and a bottom dock with text labels, and a home screen offers one prompt box, recent designs and large template cards. When the home screen's style is Auto, the plugi...
- **baitouwuya/dsh-super-cards** (dsh-super-cards@0.16.0) — Model-callable native cards (29 block types) instead of Markdown, with auto-layout. Install: dsh plugin --profile web add dsh-super-cards@0.16.0
  Native UI cards instead of Markdown: the assistant calls render_ui and the answer renders as a card in the conversation — 29 block types (metrics, tables, charts, timelines, kanban, flow charts, clickable actions), a content auto-layout mode, four placements ...
- **CheeseFox259/dsh-better-composer** (@cheesefox/dsh-better-composer@1.1.0) — Composer-level Markdown semantics, deterministic completions, and list continuation. Install: dsh plugin --profile web add @cheesefox/dsh-better-composer@1.1.0
  Markdown visual enhancement and session workbench for DSH Web Composer: live syntax presentation with caret-row source reveal (inactive-line markers can be hidden or faded), deterministic local completions, and list/quote continuation on line break with order...

### Vet before adopting

- Does it extend a documented slot or fork the shell?
- Does it behave when the plugin is unloaded or the network is slow?
- Is it keyboard-operable and readable in both themes?

**Pitfall:** DOM hacks, hardcoded colors, and untranslated strings break on the next shell release.

Query this category: node scripts/query.mjs category ui --limit 20

---

<a id="usage"></a>
## Usage & Billing

**598 entries · 285 npm-indexed · primary layer L6 (Reconstructable accounting from session logs, with cache and cost provenance.)**

### SOTA looks like

- Accounting folded from the session log rather than a parallel counter.
- Cache classes, pricing, and the billing instant made explicit.
- Per-session, per-turn, and per-model views that a user can verify.

### Exemplars

- **ShallBay/dsh-token-stats** (@shallbay/dsh-token-stats@1.2.2) — Per-session/turn token accounting with cache classes and peak/off-peak cost. Install: dsh plugin --profile web add @shallbay/dsh-token-stats@1.2.2
  Token usage dashboard for the whole harness: billed tokens from every session are rolled up per session and turn (uncached input, cache read, cache write and output) with a peak/off-peak CNY cost estimate, and a "Token 用量" entry above Settings in the sidebar ...
- **Lovenndme/dsh-profile-stats** (dsh-profile-stats@2.4.20) — Usage profile folded from local session logs through ctx.sessionQuery. Install: dsh plugin --profile web add dsh-profile-stats@2.4.20
  A personal usage profile page in the DSH sidebar, folded from this machine's own session logs through ctx.sessionQuery. Five headline numbers (tokens with a small trend and the change against the previous period, spend, longest task, the active-day streak wit...
- **bushizhanghan/dsh-routing-forensics** (@bushizhanghan/dsh-routing-forensics@0.1.3) — Deterministic replay that finds expensive-model-on-cheap-work waste. Install: dsh plugin --profile web add @bushizhanghan/dsh-routing-forensics@0.1.3
  Forensic analysis of past model-routing decisions. Replays each session, classifies every turn's task complexity from its request shape (deterministic, no LLM), and reports two kinds of waste: an expensive model on cheap work (the difference is measurable), a...

### Vet before adopting

- Where does each number come from?
- Are cache reads/writes and peak/off-peak prices labeled?
- Can a user trace a cost back to one turn?

**Pitfall:** A dashboard that presents an estimate as a bill without saying so.

Query this category: node scripts/query.mjs category usage --limit 20

---

<a id="theme"></a>
## Themes & Appearance

**405 entries · 181 npm-indexed · primary layer L6 (Token-level theming with preview, persistence, and import/export.)**

### SOTA looks like

- Changes expressed through theme tokens, not global CSS overrides.
- Preview and persistence separated; apply is explicit.
- Import/export and light/dark coverage.

### Exemplars

- **cherrchen/dsh-theme-studio** (@dsh-electron/dsh-theme-studio@0.1.8) — Settings-integrated theme row with previews, persistence, and JSON import/export. Install: dsh plugin --profile web add @dsh-electron/dsh-theme-studio@0.1.8
  Adds a Theme row to Settings → General between Appearance and Font size — 8 builtin palettes plus Default, hover previews without writing, click applies and is persisted by the host; imports/exports custom dsh-theme.json files, with an optional Theme Creator ...
- **Tkingxiao/dsh-any-background** (dsh-any-background@0.4.5) — Independent opacity/blur controls across eight shell surfaces. Install: dsh plugin --profile web add dsh-any-background@0.4.5
  DeepSeek Harness appearance toolkit. Independently tune opacity + frosted-glass blur across 8 surfaces (main background, sidebar, cards & panels, inputs & controls, settings, conversation frame, trajectory view, produced/highlights — 9 with dsh-better-sidebar...
- **1020252969/dsh-wallpaper** (dsh-shell-wallpaper@0.4.4) — Uses shell tokens and a negative z-index layer, with a bundled fallback image. Install: dsh plugin --profile web add dsh-shell-wallpaper@0.4.4
  One image behind the whole DSH shell. The image layer sits at z-index -1 and the shell's two --dsw-* tokens are repointed at translucent tints, so the picture shows through the frame, sidebar and composer. Ships a bundled default picture so it works with zero...

### Vet before adopting

- Does it use the official theme tokens?
- Does hover preview write anything before the user applies?
- Does it survive reload and the other theme?

**Pitfall:** Global selectors that leak into unrelated surfaces and break after an upstream class rename.

Query this category: node scripts/query.mjs category theme --limit 20

---

<a id="model"></a>
## Models & Providers

**562 entries · 299 npm-indexed · primary layer L2 (Provider routing with failover, observability, and credential isolation.)**

### SOTA looks like

- Provider adapter behind the official LLM seam.
- Explicit failover, retry, cooldown, and timeout policy.
- Credential isolation and observable request outcomes.

### Exemplars

- **ArcaneOrion/dsh-model-channel-manager** (@arcaneorion/dsh-model-channel-manager@0.4.0) — Virtual round-robin route with failover, retry, cooldown, and speed tests. Install: dsh plugin --profile web add @arcaneorion/dsh-model-channel-manager@0.4.0
  Model channel manager: several provider/model candidates share one virtual route (roundrobin/<group>) with failover, retry, timeout and cooldown; a settings tab edits providers and groups, runs per-model speed tests and real single-model request tests, and a ...
- **Leafyezi233/dsh-model-gateway** (@leaf233/dsh-model-gateway@1.2.2) — OpenAI-compatible egress over configured models with named ordered groups. Install: dsh plugin --profile web add @leaf233/dsh-model-gateway@1.2.2
  Exposes the models already configured in DeepSeek Harness through an OpenAI-compatible gateway, so other local projects can call them with any standard OpenAI client. Multiple provider candidates share one named group with ordered, balanced or random dispatch...
- **good-saltfish/dsh-auto-rerun** (dsh-auto-rerun@1.8.5) — In-turn retry with capped jittered backoff, server hints, and fallback. Install: dsh plugin --profile web add dsh-auto-rerun@1.8.5
  Automatically retries model failures (drops, timeouts, rate limits, 5xx) in-turn. Retry count, delays, backoff, fallback and more are configurable. Rate-limit backoff is capped and jittered, server retry hints are honored, and optional retry-until-success kee...

### Vet before adopting

- Does it register an adapter rather than patch the loop?
- Where do credentials live, and do they reach logs?
- What happens on 429, 5xx, timeout, and cancellation?

**Pitfall:** Silently switching models or spending a subscription quota without consent.

Query this category: node scripts/query.mjs category model --limit 20

---

<a id="identity"></a>
## Identity & Communication

**132 entries · 71 npm-indexed · primary layer L5 (Identity and messaging that reuse native auth without leaking credentials.)**

### SOTA looks like

- Reuse of the native auth/client instead of copying cookies.
- Explicit binding between an external identity and one session.
- Message provenance and least data retention.

### Exemplars

- **UnknowCao/dsh-outlook** (dsh-outlook@2.6.1) — Zero-credential COM automation with 13 tools and a sidebar badge. Install: dsh plugin --profile web add dsh-outlook@2.6.1
  Zero-credential Outlook automation: 13 tools that drive the local desktop Outlook client via COM — search/read mail, drafts, reply/forward, calendar, address book, rooms, free/busy — plus a sidebar new-mail badge. No Graph API registration, no SMTP passwords;...
- **elfmingh/dsh-prompt-manager** (@vertixara/dsh-prompt-manager@0.4.1) — Layered global/workspace/session prompt profiles with line-level override diffs. Install: dsh plugin --profile web add @vertixara/dsh-prompt-manager@0.4.1
  Layered system-prompt profiles — global, per-workspace and per-session entries injected in order — where individual builtin sections and runtime contexts can be disabled or overridden, with a line-level diff of what an override changed; each entry carries a s...
- **buger-gif/cyber-im-avatar#dsh-plugin** (dsh-cyber-im-avatar@0.21.0) — Reuses logged-in IM CLIs, polls only watched chats, and wakes the bound session. Install: dsh plugin --profile web add dsh-cyber-im-avatar@0.21.0
  Sidebar IM stand-in for DeepSeek Harness. Reuses your logged-in Feishu/Lark, WeCom and DingTalk CLIs (DingTalk is enabled from the panel) to poll only the chats you watch; an @-mention or a new message wakes the bound DSH session, which reads context, researc...

### Vet before adopting

- What identity does it assume on the user's behalf?
- Where are tokens stored, and how are they scoped?
- Can a message be traced to the exact session and sender?

**Pitfall:** Driving a logged-in client or scraping cookies without disclosure and a revocation path.

Query this category: node scripts/query.mjs category identity --limit 20

---

<a id="session"></a>
## Sessions & Messages

**855 entries · 435 npm-indexed · primary layer L7 (Context economics: deterministic folding, provenance, and recoverable history.)**

### SOTA looks like

- Views reconstructed from the append-only session log.
- Context folding with provenance and a way back to the original.
- Recovery of interrupted turns and cross-session lineage.

### Exemplars

- **light-cheng/dsh-strata** (@lightcheng/dsh-strata@0.4.1) — Deterministic tool-output cards, tiered summaries, and a local decompression archive. Install: dsh plugin --profile web add @lightcheng/dsh-strata@0.4.1
  Layered context management: at each turn end older tool output becomes a deterministic card, the model can fold older ranges into its own summaries in up to three tiers (compress), and every original is archived locally for decompress and search_context. Work...
- **YeqingTang/dsh-session-flow** (dsh-session-flow@1.5.0) — Cross-session archive with lineage, search, summaries, export, and native embeds. Install: dsh plugin --profile web add dsh-session-flow@1.5.0
  Cross-session archive: overview workbench, folded timeline, subagent lineage, full-text search, rule+LLM summaries, ZIP export, live tracking. Native session-page embeds: turn rail, docked right panel (live mode, pinned to original session on switch), rename ...
- **Frog755/dsh-client-auto-retry** (@frog755/dsh-client-auto-retry@0.4.0) — Resumes interrupted turns with backoff, cooldown, a cap, and boot-time scanning. Install: dsh plugin --profile web add @frog755/dsh-client-auto-retry@0.4.0
  Auto-resumes interrupted DSH turns: sends a queued 「继续」 after turn/end with error, interrupted or max-tokens reasons, with a grace period, cooldown, exponential backoff, a consecutive-attempts cap, boot-time scanning, a settings card and a per-session stop/re...

### Vet before adopting

- Is the view reconstructable from the log alone?
- What is folded away, and can it be decompressed?
- Can it recover an interrupted turn without duplicating work?

**Pitfall:** A second history store that slowly disagrees with the session log.

Query this category: node scripts/query.mjs category session --limit 20

---

<a id="memory"></a>
## Memory

**478 entries · 244 npm-indexed · primary layer L7 (Bounded, auditable memory with consent, conflict handling, and retrieval quality.)**

### SOTA looks like

- Bounded, layered storage with an explicit retention policy.
- Consent, approval, and an audit trail for writes.
- Conflict handling, staleness checks, and measured recall quality.

### Exemplars

- **PerryLink/dsh-memento** (dsh-memento@0.5.30) — Typed ctx.memory seam, SQLite provider, frozen snapshot, and approval-gated writes. Install: dsh plugin --profile web add dsh-memento@0.5.30
  Bounded, layered, approval-gated, auditable cross-session memory: a typed `ctx.memory` seam with a zero-dependency SQLite provider, a `memory` tool, and frozen snapshot injection, plus the dsh-memory-protocol v1 rehearsal with an adapter registry and a distri...
- **slow-stack/mneme#dsh-mneme** (@modusensus/dsh-mneme@0.15.1) — Idle-time consolidation, conflict freezing, and a replayable audit trail. Install: dsh plugin --profile web add @modusensus/dsh-mneme@0.15.1
  The memory that dreams — cross-session memory for DeepSeek Harness: recalls you and your projects across sessions, consolidates memories while idle (autoDream), freezes conflicting memories for your review, and keeps a replayable audit trail. Memory stays on ...
- **EternalNight996/memory-eternal** (memory-eternal@0.45.0) — Human-approved writes, an immutable audit log, and model-free FTS5/BM25 recall. Install: dsh plugin --profile web add memory-eternal@0.45.0
  Other memory plugins help your agent remember more. This one decides what is allowed to count: agents propose, a human approves (three-store gate + immutable audit log), and recall runs on SQLite FTS5/BM25 with zero model calls (measured p50 2.3ms). A token l...

### Vet before adopting

- What is stored, where, and for how long?
- Who approves a write, and can a memory be corrected or forgotten?
- How are conflicts, duplicates, and stale facts handled?

**Pitfall:** Unbounded memory injection that quietly consumes the context window.

Query this category: node scripts/query.mjs category memory --limit 20

---

<a id="tools"></a>
## Tools & Capabilities

**1528 entries · 825 npm-indexed · primary layer L3 (Typed, cancellable tools with deferred schemas and policy-aware execution.)**

### SOTA looks like

- Typed, narrow schemas with discriminative descriptions.
- Policy, cancellation, bounded output, and structured errors.
- Deferred schemas for large capability sets.

### Exemplars

- **project-hy/dsh-claude-delegate** (dsh-claude-delegate@0.8.1) — Official Agent SDK delegation with 19 per-call controls and result return. Install: dsh plugin --profile web add dsh-claude-delegate@0.8.1
  Delegates self-contained coding subtasks to the local Claude Code subscription through the official Agent SDK and returns the result to the host session. Nineteen per-call parameters control model, thinking effort, permission mode, allowed tools, turn count a...
- **Imzl-zl/dsh-toolbox-ui** (dsh-toolbox-ui@1.11.2) — Deferred MCP tool schemas via ToolSearch: names only until a tool is needed. Install: dsh plugin --profile web add dsh-toolbox-ui@1.11.2
  Floating panel for the DSH web UI managing MCP servers and skills: per-server deferred tool loading (ToolSearch, off by default) keeps a server's tools out of every turn's context — the prompt lists tool names only, and a tool's full schema enters the list on...
- **2026heshao/dsh-armory** (dsh-armory@2.5.5) — Unified MCP/skill/expert board with scopes, schemas, and connection state. Install: dsh plugin --profile web add dsh-armory@2.5.5
  Unified MCP, skill and expert management board for DeepSeek Harness: connection status, tool schemas, enable/disable and reconnect for MCP servers across global and per-project scopes, enable/disable of SKILL.md skills, attach/switch/detach WorkBuddy expert p...

### Vet before adopting

- What can this tool do that the model should not?
- Is the output bounded, and does it respect abort?
- Is the schema worth its per-request token cost?

**Pitfall:** A do-anything tool with an unvalidated string and no policy layer.

Query this category: node scripts/query.mjs category tools --limit 20

---

<a id="wsl"></a>
## WSL & Windows Interop

**88 entries · 12 npm-indexed · primary layer L3 (Native platform bridging without breaking sandbox or write-root semantics.)**

### SOTA looks like

- Native path, PTY, and executor semantics.
- An explicit choice between one-off command and persistent terminal.
- Awareness of workspace, write roots, and sandbox boundaries.

### Exemplars

- **stallenlu/dsh-wsl-suite** (dsh-wsl-suite@0.1.10) — WSL distro discovery, UNC workspaces, and a real Linux PTY in the sidebar. Install: dsh plugin --profile web add dsh-wsl-suite@0.1.10
  WSL workspaces for DeepSeek Harness. A sidebar W button lists installed distros and registers a Linux folder as a host workspace addressed by a UNC path, and the sidebar terminal opens a real Linux pty inside the distribution for WSL sessions. A persistent ze...
- **Wang1462604987/dsh-wsl-sidebar** (dsh-wsl-sidebar@1.7.2) — Typed .wslconfig/wsl.conf editing plus long-running processes in any distro. Install: dsh plugin --profile web add dsh-wsl-sidebar@1.7.2
  WSL console for the harness — manage distributions, edit .wslconfig and wsl.conf in a typed form, and run commands, file edits and long-running processes inside any distribution with its own wslx-* tools.
- **XINY11451/dsh-wsl** (dsh-wsl-tool@2.2.6) — WSL file tools plus an explicit one-off-command vs persistent-terminal choice. Install: dsh plugin --profile web add dsh-wsl-tool@2.2.6
  Extends the working range of DSH into WSL. Files in the distribution can be read, written, edited and searched by DSH directly. Depending on the task, the AI chooses for itself: run a one-off command, or open its own terminal and run several commands there to...

### Vet before adopting

- Does it preserve the workspace and write-root contract?
- Does it leak host paths into the Linux side?
- What happens when the distro or command is missing?

**Pitfall:** Bridging by copying files or escaping the sandbox instead of using the executor seam.

Query this category: node scripts/query.mjs category wsl --limit 20

---

<a id="browser"></a>
## Browser & Web

**219 entries · 134 npm-indexed · primary layer L3 (Reusable browser providers with authenticated, loopback-only control.)**

### SOTA looks like

- A reusable provider behind the browser seam.
- Authenticated, loopback-only control with per-origin scope.
- Evidence capture and a clear user-consent boundary.

### Exemplars

- **lyp88997/dsh-browser-service** (dsh-browser-service@0.8.3) — ctx.browser seam to a loopback CDP daemon with bearer auth and a path allowlist. Install: dsh plugin --profile web add dsh-browser-service@0.8.3
  Gives DSH the full 33-tool browser surface (ctx.browser seam -> a self-hosted headless Chromium over CDP: one 127.0.0.1 daemon with Bearer-token auth, request-path whitelist and WebSocket rewriting, no root/GUI/Electron needed), plus a web panel — a real page...
- **OrderG-X/dsh-chrome-bridge#plugin** (dsh-chrome-bridge@1.16.4) — Drives the user's real Chrome, including same-origin iframes, over CDP. Install: dsh plugin --profile web add dsh-chrome-bridge@1.16.4
  Controls the Chrome you are already logged into: the model clicks, types, fills in forms, reads pages, takes screenshots and downloads files in your real tabs, including inside same-origin iframes. Runs on macOS, Windows and Linux; needs Chrome 116+ and Node ...
- **drscrewdriver/dsh-union-search** (dsh-union-search@0.10.22) — Tiered 28-engine union with keyless fallbacks and upstream consolidation. Install: dsh plugin --profile web add dsh-union-search@0.10.22
  Union web search for DSH (consolidated successor of DDDMUC/dsh-free-search, which it credits): 28 engines across three tiers — keyless free (Bing/DuckDuckGo/AnySearch/SearXNG multi-instance union, plus Exa/Tavily/Keenable/Firecrawl/Parallel keyless modes), pa...

### Vet before adopting

- Does it control a browser the user owns or a disposable one?
- Is the control endpoint authenticated and bound to loopback?
- Can it read cookies, credentials, or other origins?

**Pitfall:** Exposing a CDP port to the LAN or reusing a logged-in session without consent.

Query this category: node scripts/query.mjs category browser --limit 20

---

<a id="vision"></a>
## Vision & Multimodal

**200 entries · 100 npm-indexed · primary layer L3 (Modality adapters that keep evidence and degrade gracefully.)**

### SOTA looks like

- A modality adapter with a clear model and cost path.
- Evidence and grounding retained alongside the answer.
- Graceful degradation when the provider fails.

### Exemplars

- **Anionex/dsh-vision-toolkit** (@anionex/dsh-vision-toolkit@0.1.51) — Text-only-model vision path with OCR, UI reproduction, grounding, and pixel diff. Install: dsh plugin --profile web add @anionex/dsh-vision-toolkit@0.1.51
  Vision for text-only models: paste an image and the model switches to a Vision Toolkit variant for image Q&A, multi-image comparison, long-screenshot OCR, screenshot-to-UI reproduction, element grounding, and pixel diff. No API key by default — images are pro...
- **cctv2333/dsh-vidlens** (dsh-vidlens@1.4.4) — Subtitle-first video sampling with chapters, frames, and AudioSet sound tagging. Install: dsh plugin --profile web add dsh-vidlens@1.4.4
  Samples a video the way a person does instead of downloading it: metadata and chapters first, then timestamped frames as images, subtitle-first transcripts (local ASR only when the platform carries no subtitles), AudioSet 527-class sound tags and top comments...
- **q253595422/dsh-imagegen-video** (@q253595422/dsh-imagegen-video@1.30.4) — Per-channel model catalogs and per-family request shaping across providers. Install: dsh plugin --profile web add @q253595422/dsh-imagegen-video@1.30.4
  AI image and video generation for the DSH Web GUI: text-to-image and image-to-image over per-channel model catalogs with per-family request shaping (gpt-image, Grok Imagine, Nano Banana, Seedream, GLM-Image, Qwen-Image, MiniMax image-01, DALL-E 3), a sidebar ...

### Vet before adopting

- Which model actually sees the image?
- Is the image sent off-machine, and is that disclosed?
- What is retained, and what happens on failure?

**Pitfall:** Silently uploading private images to a third-party endpoint.

Query this category: node scripts/query.mjs category vision --limit 20

---

<a id="voice"></a>
## Voice & Audio

**148 entries · 81 npm-indexed · primary layer L3 (Local-first audio pipelines with explicit device and permission handling.)**

### SOTA looks like

- Local-first processing where possible.
- Explicit device, microphone, and storage permissions.
- Event-driven playback with a mute and an interrupt path.

### Exemplars

- **kekydream/dsh-meeting-room** (dsh-meeting-room@0.1.0-preview.7) — Local transcription/diarization, notes, actions, exports, and review scoring. Install: dsh plugin --profile web add dsh-meeting-room@0.1.0-preview.7
  Meeting notes for dsh: one meeting per conversation, transcribed and speaker-separated on the machine itself, with points, assignments, handwritten notes, reviews and monthly scores in the same panel. Exports SRT/Markdown/Word and packs a meeting into a porta...
- **Alan2Z/dsh-speak** (dsh-speak@1.8.4) — Zero-dependency, event-driven system TTS with no model or token cost. Install: dsh plugin --profile web add dsh-speak@1.8.4
  Zero-dependency, event-driven voice announcement plugin: no extra model, no token cost. Speaks with the system's built-in natural voice, supporting both Windows and macOS; final-reply announcements, approval & question alerts, optional event announcements (tu...
- **biliye/dsh-voice-call** (@biliye/dsh-voice-call@0.4.0) — Browser VAD, local ASR, and a floating call control surface. Install: dsh plugin --profile web add @biliye/dsh-voice-call@0.4.0
  Voice call assistant for the DSH desktop app and the Web GUI (the same plugin, only the profile name differs): a draggable floating call ball, browser-side VAD that sends each utterance after a pause, speech recognition through the local SenseVoice model alre...

### Vet before adopting

- Where is audio processed and stored?
- What permission does it request, and when?
- Can the user mute, interrupt, or delete a recording?

**Pitfall:** Always-on recording or cloud transcription without disclosure.

Query this category: node scripts/query.mjs category voice --limit 20

---

<a id="docs"></a>
## Docs & Rendering

**208 entries · 113 npm-indexed · primary layer L6 (Source-grounded rendering with stable anchors and offline artifacts.)**

### SOTA looks like

- Source-grounded rendering with stable anchors.
- Citations that resolve to a file, line, page, or passage.
- Offline artifacts and deterministic re-render.

### Exemplars

- **PolinniZhong/dsh-knit** (dsh-knit@0.25.0) — Workspace document index ranked by conversation relevance, lexical-first. Install: dsh plugin --profile web add dsh-knit@0.25.0
  Puts the Markdown documents, source files, images and video that already exist anywhere in the session workspace into the DSH sidebar, ranked by relevance to the current conversation. The default lexical mode matches your recent messages against title, summar...
- **GGboya/dsh-paper-reader** (@ggboy123/dsh-paper-reader@1.12.1) — PDF library with page-anchored citations, select-to-ask, and a tutor preset. Install: dsh plugin --profile web add @ggboy123/dsh-paper-reader@1.12.1
  Paper reading workbench: library + PDF reader + tutor-style companion. Answers cite clickable page numbers that jump back and flash the exact passage; select-to-ask without leaving the paper; bundled strict-tutor preset (reading plan, section coaching, graded...
- **NoneFire/drender#dsh-drender-plugin** (@tita-agent/dsh-drender-plugin@0.2.1) — Validates md-report/1 and renders offline interactive HTML with SQLite/CSV data. Install: dsh plugin --profile web add @tita-agent/dsh-drender-plugin@0.2.1
  DeepSeek Harness tools and a Skill for md-report/1: validate and render Markdown plus declared SQLite/CSV datasets into one offline interactive HTML report or dashboard, with AntV G2 charts (ECharts fallback) and chart/table data and source-SQL views.

### Vet before adopting

- Can a claim be traced to a source location?
- Do anchors survive an edit or a re-render?
- Does it work offline and without a remote service?

**Pitfall:** Rendering model output as authoritative without source anchors.

Query this category: node scripts/query.mjs category docs --limit 20

---

<a id="skill"></a>
## Skills

**397 entries · 167 npm-indexed · primary layer L4 (Progressive-disclosure skills with discovery, provenance, and evaluation.)**

### SOTA looks like

- Progressive disclosure with a discriminating description.
- Discovery, provenance, invocation policy, and evaluation.
- Resources and scripts that resolve and self-check.

### Exemplars

- **xuzhecomeon/dsh-research-suite** (dsh-research-suite@3.2.0) — Ten domain skills + fifteen tools; 450 skills curated into 103 cards with a ledger. Install: dsh plugin --profile web add dsh-research-suite@3.2.0
  Research workflow suite that registers 10 domain skills and 15 tools, curates 450 bundled research skills into 103 capability cards with an auditable per-skill ledger, and takes over research requests automatically through a system-prompt section. Tools cover...
- **PolinniZhong/dsh-skill-intelligence** (dsh-skill-trace@1.4.0) — Read-only inspector of observed skill loads and discoverability. Install: dsh plugin --profile web add dsh-skill-trace@1.4.0
  Read-only Skill inspector for DeepSeek Harness. It shows which Skills a conversation actually loaded — from observed loading evidence only — and which Skills the current environment can discover, and gives each Skill a detail page whose left column switches b...
- **LittleBlackTong/dsh-plugin-superpowers** (dsh-plugin-superpowers@0.1.2) — Ports fourteen composable engineering skills as native DSH skills. Install: dsh plugin --profile web add dsh-plugin-superpowers@0.1.2
  Ports the obra/superpowers methodology as 14 native DSH skills — brainstorming, writing-plans, executing-plans, subagent-driven development, test-driven development, systematic debugging, parallel agent dispatch, git worktrees, code review, verification befor...

### Vet before adopting

- When does it load, and what is the near-miss that should not?
- Are references and resources reachable from the trigger?
- Has the trigger behavior been evaluated?

**Pitfall:** A megaskill that loads everywhere and gives no specific decision.

Query this category: node scripts/query.mjs category skill --limit 20

---

<a id="workflow"></a>
## Workflow & Automation

**667 entries · 368 npm-indexed · primary layer L5 (Durable orchestration with budgets, stop conditions, and verification gates.)**

### SOTA looks like

- Durable orchestration state and explicit ownership.
- Budgets, deadlines, stop conditions, and cancellation.
- Verification gates and observable progress.

### Exemplars

- **mrzturn/dsh-switchman** (dsh-switchman@1.11.5) — Task dispatch, optional Agent Teams, tiered verification, and context folding. Install: dsh plugin --profile web add dsh-switchman@1.11.5
  Workflow and automation (`workflow`): task dispatch, optional Agent Teams, and tiered verification; usage and billing (`usage`): session token tracking and automatic context folding (no bill calculation); sessions and messages (`session`): persistent fold sta...
- **ECCVIK/lmtagent** (no npm version) — Eight role presets, four-wave DAG scheduling, concurrency slots, and PostgreSQL state. GitHub-only: https://github.com/ECCVIK/lmtagent
  Multi-agent software engineering and security audit workflow with 8 role presets (Captain, CEO, Designer, Eng Manager, Reviewer/CSO, Builder, QA Lead, Release), 4-Wave DAG scheduling across 6 default concurrency slots (1-12), PostgreSQL Wire Protocol v3 + SQL...
- **Leo-sail/dsh-plugin-agent-collaboration#agent-collaboration** (dsh-plugin-agent-collaboration@0.5.0) — Persistent bots/rooms with per-bot model, permissions, workspace, and session. Install: dsh plugin --profile web add dsh-plugin-agent-collaboration@0.5.0
  Persistent Bots and group rooms inside DSH. Each Bot keeps its own model, permission preset, workspace and session across restarts; a Bot can also be backed by an installed local agent CLI (Codex CLI, Claude Code, ACP agents) using that CLI's own login and mo...

### Vet before adopting

- Where is the workflow state, and what happens on restart?
- What stops it, and who can cancel it?
- How is completion verified rather than asserted?

**Pitfall:** A multi-agent loop with no budget, no owner, and no stop condition.

Query this category: node scripts/query.mjs category workflow --limit 20

---

<a id="git"></a>
## Git & Code Review

**195 entries · 104 npm-indexed · primary layer L3 (Review surfaces that make diffs, lineage, and approval auditable.)**

### SOTA looks like

- A reviewable net diff with stable line references.
- Block-level keep/revert and an explicit approval boundary.
- Lineage from turn to file change.

### Exemplars

- **Binaryinject/dsh-review-checkout** (dsh-review-checkout@1.0.3) — Per-turn net-diff cards and a syntax-highlighted review tab with open-at-line. Install: dsh plugin --profile web add dsh-review-checkout@1.0.3
  Codex-style review of session file changes: per-turn cards (optionally taking over the shell edited cards) whose totals are the turn net diff, a review tab with syntax-highlighted diffs that never wrap, real line numbers, open-at-line and a draggable split, a...
- **9087/dsh-diff-approval** (dsh-diff-approval@0.37.5) — Collects edit/write changes and supports block/file keep-or-revert review. Install: dsh plugin --profile web add dsh-diff-approval@0.37.5
  Pending-change review for DeepSeek Harness: every `edit`, `write` and `str_replace_editor` change is collected automatically into the file list, where a single change block, the blocks within a selection, or the whole file can be kept or reverted, and undo/re...
- **zjj1769404838/dsh-git-panel** (no npm version) — Git workbench with OAuth/PAT and per-repository permissions. GitHub-only: https://github.com/zjj1769404838/dsh-git-panel
  Adds a Git chip beside the composer that opens a centered workbench (changes, history, files, tags, stash) plus a Git section in settings. Supports multi-account OAuth device flow and PAT with per-repository permissions (full, read, none), gates writes behind...

### Vet before adopting

- Does it show the net diff or a noisy intermediate?
- Can a user keep or revert one block?
- Does it commit or push without an explicit approval?

**Pitfall:** Auto-commit or auto-push with a model-generated message and no review.

Query this category: node scripts/query.mjs category git --limit 20

---

<a id="notify"></a>
## Notifications & Integrations

**369 entries · 185 npm-indexed · primary layer L5 (Event-driven outbound channels with resumable sessions and consent.)**

### SOTA looks like

- Event-driven delivery with a resumable session binding.
- Consent, quiet hours, and per-channel scoping.
- Delivery metrics and a reply path back to the right session.

### Exemplars

- **Leo-Cjw/dsh-pharos** (dsh-pharos@0.6.4) — System toast, per-kind chime, and tab marker for approval/question/background events. Install: dsh plugin --profile web add dsh-pharos@0.6.4
  Desktop notifications for DSH: a system toast, a per-kind chime and a tab-title marker when the agent needs you (approval, plan review, question) or a reply finishes in the background; errors, interrupts, usage limits and multi-agent workflow progress alert t...
- **IvanWu2015/dsh-connect#connect** (dsh-connect@1.0.21) — Bridges sessions to Feishu/Telegram/DingTalk with streaming cards and task metrics. Install: dsh plugin --profile web add dsh-connect@1.0.21
  Bridges DeepSeek Harness sessions to Feishu/Lark, Telegram and DingTalk: each chat is bound to a resumable DSH session, replies stream back as cards, and a task-end card reports the model, token usage, step count and duration. Question and permission-approval...
- **HughPython/dsh-tc-mail** (dsh-tc-mail@0.1.0) — Mail client with sandboxed HTML and remote images blocked by default. Install: dsh plugin --profile web add dsh-tc-mail@0.1.0
  Tencent Agent Mail client: a sidebar panel for inbox and sent browsing, HTML reading in a sandboxed frame with remote images blocked by default, compose/reply/forward with attachments, search and permanent delete, adjustable font and surface opacity, plus fiv...

### Vet before adopting

- Which events trigger a notification?
- Can the user mute it, and does a reply route correctly?
- What content leaves the machine, and to whom?

**Pitfall:** Notification spam or a bridge that leaks session content to a third party.

Query this category: node scripts/query.mjs category notify --limit 20

---

<a id="dev"></a>
## Development & Runtime

**632 entries · 337 npm-indexed · primary layer L1 (Install-time diagnostics, drift detection, and reversible operations.)**

### SOTA looks like

- Read-only diagnostics before any mutation.
- Drift detection between running and on-disk state.
- Reversible backup, restore, and compatibility checks.

### Exemplars

- **xiaoyuyu6420/dsh-backup** (@xiaoyuyu6420/dsh-backup@0.14.4) — Backup/restore/migration with sha256 verification, retention, and auto-rollback. Install: dsh plugin --profile web add @xiaoyuyu6420/dsh-backup@0.14.4
  One-command backup, restore & migration for all DSH user data (~/.dsh) with a visual Settings panel: scheduled auto-backup with tiered retention, sha256 verification, hardened restore with auto-rollback and a result receipt, typed sub-backups (--types), crede...
- **stallenlu/dsh-steward** (@sidady/dsh-steward@0.9.16) — Read-only install diagnostics: boot crash, config drift, backup freshness, compatibility. Install: dsh plugin --profile web add @sidady/dsh-steward@0.9.16
  Read-only diagnostics for a DSH install — boot-crash logs and the cause named in them, config drift against a recorded fingerprint, backup freshness, workspace growth, plugin updates, host-version compatibility, duplicate client ids, and model availability — ...
- **ven314/dsh-conflict-doctor** (dsh-conflict-doctor@0.2.0) — Capability graph comparing the running Loader with on-disk patch layers. Install: dsh plugin --profile web add dsh-conflict-doctor@0.2.0
  Conflict diagnosis and repair for DeepSeek Harness plugins. Builds a capability graph of the running Loader profile and of the on-disk cordis.patch.yml layers, comparing imports, peer ranges and config against the host that is ACTUALLY running rather than the...

### Vet before adopting

- Does it modify the profile or config?
- Can it restore the prior state?
- What does it read, and does it work offline?

**Pitfall:** A doctor that rewrites config without a backup or a dry-run.

Query this category: node scripts/query.mjs category dev --limit 20

---

<a id="security"></a>
## Security & Permissions

**286 entries · 155 npm-indexed · primary layer L8 (Fail-closed policy, least privilege, and disclosure of plugin capability.)**

### SOTA looks like

- Fail-closed enforcement at a documented seam.
- Route and WebSocket authentication, not just a login page.
- Least privilege, audit, and capability disclosure.

### Exemplars

- **0QwQ0/dsh-ui-auth** (dsh-ui-auth@0.7.1) — Covers pages, /api, /plugins, and WebSocket upgrades with PBKDF2 and HttpOnly cookies. Install: dsh plugin --profile web add dsh-ui-auth@0.7.1
  Authentication gateway for the DeepSeek Harness Web UI: the login gate covers pages, /api, /plugins and WebSocket upgrades; PBKDF2 password hashing with per-user salts, HttpOnly SameSite session cookies named per DSH_HOME and IP-based login lockout; invite-co...
- **AskTheWay/dsh-jev-interceptor** (dsh-jev-interceptor@0.8.0) — Policy at tools/pre-execute: deny high-risk, escalate ambiguous, auto-approve reversible. Install: dsh plugin --profile web add dsh-jev-interceptor@0.8.0
  Classifies pending tool calls with Jev (TypeSafe AI's non-generative decision model) on tools/pre-execute — confident high-risk calls are denied, ambiguous ones escalated to approval — and auto-approves clearly-granted reversible calls on approval/request beh...
- **liuwenji007/dsh-trust-check** (dsh-trust-check@0.2.6) — Static disclosure of capabilities, destinations, install scripts, and injection shapes. Install: dsh plugin --profile web add dsh-trust-check@0.2.6
  Static capability disclosure for DeepSeek Harness plugins: a Settings page and CLI that list installed plugins' capabilities, literal destinations, install scripts, and injection shapes (prompt registrations, shipped skill text, bundle patch), each with file:...

### Vet before adopting

- What is the trust boundary, and what is outside it?
- Is every route and upgrade authenticated?
- Can a child agent or a retry bypass the policy?

**Pitfall:** Security theater: a prompt-only guard with no enforcement at the execution boundary.

Query this category: node scripts/query.mjs category security --limit 20

---

<a id="remote"></a>
## Remote & Mobile

**322 entries · 179 npm-indexed · primary layer L6 (Authenticated narrow surfaces, not broad exposure of the local GUI.)**

### SOTA looks like

- A narrow, authenticated surface rather than the full GUI.
- Pairing, per-device scope, and revocation.
- Stop control and a clear blast radius.

### Exemplars

- **drscrewdriver/dsh-im-union** (dsh-im-union@0.5.4) — Fifteen channel adapters across twelve platforms behind one bridge. Install: dsh plugin --profile web add dsh-im-union@0.5.4
  Union IM bridge for DSH — an independent implementation uniting the capability sets of community peer plugins (xmanrui/dsh-im, MichengAI/dsh-im-connect). Drive your agent session from 15 channel adapters across 12 platforms (including email; WeCom/DingTalk/QQ...
- **dingchenhui0618-arch/dsh-in-hand** (dsh-in-hand@1.8.28) — PWA for sessions, jobs, subagents, goals, workflows, and approvals with stop control. Install: dsh plugin --profile web add dsh-in-hand@1.8.28
  Phone client for DeepSeek Harness — no app to install (PWA). Read sessions, background jobs, subagents, goal rounds, workflows and pending approvals, and talk to any session from it: streamed replies, tool-call progress, stop at any time, switch sessions and ...
- **toddpan/dsh-webapi** (dsh-web-service@0.6.2) — 47 REST+SSE routes for workspaces, sessions, models, presets, and settings. Install: dsh plugin --profile web add dsh-web-service@0.6.2
  Drive DSH from anything that speaks HTTP: 47 routes (REST + SSE) for workspaces, sessions (create/prompt, live SSE generation, history, stats, todos, cancel, ask-user Q&A), models and the global default model, providers, agent presets, settings namespaces, sk...

### Vet before adopting

- What exactly is exposed to the network?
- Is it authenticated, encrypted, and revocable?
- What can a stolen token do?

**Pitfall:** Binding the full local GUI to 0.0.0.0 with no auth.

Query this category: node scripts/query.mjs category remote --limit 20

---

<a id="market"></a>
## Plugin Markets & Managers

**145 entries · 75 npm-indexed · primary layer L9 (Index-driven discovery with verification, provenance, and safe install.)**

### SOTA looks like

- A known index with provenance and refresh semantics.
- Install verification, compatibility checks, and safe defaults.
- Snapshot and rollback for updates.

### Exemplars

- **moldkey/dsh-deepseekbase** (@liangjiehappy/dsh-deepseekbase@0.4.4) — Third-party index integration with sandbox install verdicts and risk levels. Install: dsh plugin --profile web add @liangjiehappy/dsh-deepseekbase@0.4.4
  Brings the third-party deepseekbase.com index into DSH: eight tools and five DSHIO standard skills (from the @liangjiehappy/dsh-dshio dependency). Search 8,400 plugins with real sandbox install verdicts and risk levels (including red-line warnings where crede...
- **hoyyang/dsh-mall** (dsh-mall@1.8.6) — Refreshed GitHub topic catalog with pre-install review and five-dimension scoring. Install: dsh plugin --profile web add dsh-mall@1.8.6
  The complete #dsh-plugin mall inside DeepSeek Harness: browse, search and score the full GitHub dsh-plugin topic catalog refreshed every 2 hours, AI pre-install review with install/caution/avoid verdicts, five-dimension scores with radar charts, nine-language...
- **tangyixiao/dsh-version-manager** (dsh-version-manager@0.1.4) — Profile/skill snapshot and replay-evidence-gated recovery. Install: dsh plugin --profile web add dsh-version-manager@0.1.4
  Inspect plugins and Skills in the running DSH profile, preview updates, record verifiable snapshots and offer recovery only when replay evidence is available. Requires Node 22+ and DSH 0.2.2-rc.1 or a later declared-compatible host. Restoring a plugin version...

### Vet before adopting

- Where does the index come from, and how fresh is it?
- Does it verify the package and the running host?
- Can it roll back a bad update?

**Pitfall:** A marketplace that installs unverified code or silently auto-updates.

Query this category: node scripts/query.mjs category market --limit 20

---

<a id="fun"></a>
## Just for Fun

**363 entries · 162 npm-indexed · primary layer L6 (Event-derived state machines that stay decoupled from rendering.)**

### SOTA looks like

- State derived from real session events.
- Rendering decoupled from the event connector.
- Bounded polling, no context injection, and an off switch.

### Exemplars

- **xkk6663/dsh-live2d-mao#dsh-live2d-mao** (no npm version) — Connector-only event fold into twelve work phases; rendering stays separate. GitHub-only: https://github.com/xkk6663/dsh-live2d-mao/tree/main/packages/dsh-live2d-mao
  Connector only, it renders nothing itself: subscribes to DeepSeek Harness session events and folds them into a 12-phase work state (planning / thinking / executing-tool / streaming / waiting-input / voice / awaiting-approval / complete / error / paused / idle...
- **dingchenhui0618-arch/dsh-pet-ledger** (no npm version) — Achievements derived only from real session events, expandable to evidence. GitHub-only: https://github.com/dingchenhui0618-arch/dsh-pet-ledger
  A pet ledger whose achievements come only from real DeepSeek Harness session events: tool-failure streaks, long completed turns, red-to-green test runs, and commit+push success. Every achievement expands into the session id and the actual tool-call evidence (...
- **zyfgood/dsh-whale-girl** (@zyfgood/dsh-whale-girl@0.3.0) — Hand-written SVG/CSS with zero runtime deps and state-driven animation. Install: dsh plugin --profile web add @zyfgood/dsh-whale-girl@0.3.0
  Whale-girl desktop pet for the DSH Web UI, drawn with hand-written SVG + CSS (no image or audio assets, zero runtime dependencies): swims while a turn runs, blows labeled bubbles on tool calls, taps the glass with an amber pulse when an approval is waiting, j...

### Vet before adopting

- Which events drive the behavior?
- Does it block or slow the UI?
- Does it store data or inject context into every turn?

**Pitfall:** A pet that polls aggressively or adds tokens to every request.

Query this category: node scripts/query.mjs category fun --limit 20

---

## Coverage notes and limits

- The README is the broad list; the npm index carries a version for roughly half of it. GitHub-only entries have no verified install spec here.
- Category assignment comes from the upstream list. Layer and tag assignment is a keyword heuristic over the description, not source inspection.
- The exemplars are selected for explicit mechanisms and category fit; they are not security-reviewed or benchmarked.
- Every claim about a plugin in this file comes from its curated one-line description unless the plugin is also inspected locally.
- Use the live repository, package manifest, and running-host checks before install. This file is a map, not a permission slip.

## Refresh

1. node scripts/refresh-catalog.mjs
2. node scripts/build-landscape.mjs
3. node scripts/refresh-catalog.mjs --check
4. review the diff, especially category counts and exemplar resolution

## Source links

- Awesome list: https://github.com/awesome-dsh-plugin/awesome-dsh-plugin
- Plugin index: https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json
- DSH architecture: https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md
- DSH extension cookbook: https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cookbook/extension-cookbook.md
- DSH skills subsystem: https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/skills.md
