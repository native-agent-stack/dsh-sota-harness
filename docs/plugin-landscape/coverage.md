# Catalog coverage report

Generated: 2026-11-14T20:37:26.554Z

## Sources

- README: https://raw.githubusercontent.com/awesome-dsh-plugin/awesome-dsh-plugin/main/README.md
- Plugin index: https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json

## Totals

| Metric | Value |
|---|---:|
| Listed entries | 11,111 |
| npm-indexed | 5,635 |
| unique npm packages | 5,635 |
| GitHub-only | 5,476 |
| npm match rate | 50.7% |
| Categories | 23 |
| Layers | 10 |
| Entries with an install command | 5,635 |
| Unique titles | 11,111 |
| Index-only plugins (outside the listed count) | 8 |
| Known universe (listed + index-only) | 11,119 |

## Category coverage

| Key | Category | Entries | npm | GitHub-only | Primary layer |
|---|---|---:|---:|---:|---|
| agi | AGI Architecture Exploration | 82 | 45 | 37 | L5 |
| ui | UI Enhancements | 2,232 | 1,078 | 1,154 | L6 |
| usage | Usage & Billing | 598 | 285 | 313 | L6 |
| theme | Themes & Appearance | 405 | 181 | 224 | L6 |
| model | Models & Providers | 562 | 299 | 263 | L2 |
| identity | Identity & Communication | 132 | 71 | 61 | L5 |
| session | Sessions & Messages | 855 | 435 | 420 | L7 |
| memory | Memory | 478 | 244 | 234 | L7 |
| tools | Tools & Capabilities | 1,528 | 825 | 703 | L3 |
| wsl | WSL & Windows Interop | 88 | 12 | 76 | L3 |
| browser | Browser & Web | 219 | 134 | 85 | L3 |
| vision | Vision & Multimodal | 200 | 100 | 100 | L3 |
| voice | Voice & Audio | 148 | 81 | 67 | L3 |
| docs | Docs & Rendering | 208 | 113 | 95 | L6 |
| skill | Skills | 397 | 167 | 230 | L4 |
| workflow | Workflow & Automation | 667 | 368 | 299 | L5 |
| git | Git & Code Review | 195 | 104 | 91 | L3 |
| notify | Notifications & Integrations | 369 | 185 | 184 | L5 |
| dev | Development & Runtime | 632 | 337 | 295 | L1 |
| security | Security & Permissions | 286 | 155 | 131 | L8 |
| remote | Remote & Mobile | 322 | 179 | 143 | L6 |
| market | Plugin Markets & Managers | 145 | 75 | 70 | L9 |
| fun | Just for Fun | 363 | 162 | 201 | L6 |

## Layer distribution

| Layer | Name | Primary categories | Entries mentioning |
|---|---|---:|---:|
| L0 | Distribution & Composition | 0 | 2,304 |
| L1 | Host Runtime & Lifecycle | 632 | 2,797 |
| L2 | Capability Seams & Services | 562 | 2,650 |
| L3 | Tools & Model-Facing Context | 2,378 | 6,959 |
| L4 | Skills & Agent Instructions | 397 | 891 |
| L5 | Agent Composition & Orchestration | 1,250 | 3,297 |
| L6 | Client UI & Experience | 4,128 | 7,586 |
| L7 | Data, Sessions & Persistence | 1,333 | 4,378 |
| L8 | Security, Privacy & Supply Chain | 286 | 2,426 |
| L9 | Operations, Market & Ecosystem | 145 | 145 |

L0 has no category of its own because it is a cross-cutting distribution layer. L9 owns the market/manager category. A mention count is not a quality count.

## Signals

Top curated terms:

- deepseek: 2894
- plugin: 1716
- tool: 1572
- memory: 934
- token: 780
- skill: 766
- context: 736
- image: 719
- browser: 695
- mcp: 680
- markdown: 512
- server: 499
- git: 453
- approval: 427
- client: 338
- preset: 330
- theme: 323
- cache: 299
- subagent: 285
- voice: 252

Top heuristic tags:

- models: 4815
- client-ui: 4789
- sessions: 3893
- tools: 3387
- platform: 1912
- media: 1690
- security: 1292
- distribution: 1277
- service-seam: 1260
- persistence: 1103
- format: 1036
- orchestration: 975
- observability: 935
- skills: 884
- memory: 827

## Match quality

| Check | Value |
|---|---:|
| Index plugins | 5,643 |
| Matched README entries | 5,635 |
| Index-only entries | 8 |
| README entries | 11,111 |
| README entries skipped | 0 |
| Duplicate ids | 0 |

## Index-only plugins

These are present in the npm index but absent from the awesome-list README. They are recorded outside the 11,111 listed-entry count.

- Minus77/dsh-prompt-polish (@minus77/dsh-prompt-polish) — category ui
- hhse/dsh-usage-peak (dsh-usage-peak) — category usage
- hualuo520-h/dsh-connect-scnet (dsh-connect-scnet) — category model
- hualuo520-h/dsh-proteus-bridge (dsh-proteus-bridge) — category tools
- nanaaya98/dsh-scope-manager (dsh-scope-manager) — category ui
- pokereva/dsh-no-enter-sand (dsh-no-enter-sand) — category ui
- taoziliyouchong/dsh-evolve-preset#dsh-evolve-preset (dsh-evolve-preset) — category workflow
- winlin926/dsh-roam (dsh-roam) — category remote

## Limits

- Awesome-list inclusion is not a security review or a quality ranking.
- npm-indexed means the index carried a known npm version; GitHub-only entries have no verified install spec here.
- Layer and tag assignments are keyword heuristics over the curated one-line description, not source inspection.
- One-line descriptions are author/community claims; verify the repository and running host before installing or recommending.

## Validate

~~~sh
cd .dsh/skills/dsh-plugin-sota
node scripts/refresh-catalog.mjs --check
node scripts/query.mjs stats
~~~
