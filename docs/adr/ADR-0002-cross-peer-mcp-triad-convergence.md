# ADR-0002: Cross-Peer MCP Triad & Skill Mount Convergence

- **Status:** Accepted
- **Date:** 2026-11-17
- **Organization:** `https://github.com/native-agent-stack`
- **Evidence:** `presets/sota-converged-mcp.json`, `.agents/skills.json`, `harness/run.mjs` (`10/10 PASS`)

## Context

`dsh-sota-harness` validates the 10-layer (`L0–L9`) DeepSeek Harness (`dsh`) plugin and orchestration contracts, while sibling repositories in `https://github.com/native-agent-stack` validate Antigravity (`agy-sota-harness`) and Claude Code / Codex (`cc-sota-harness` / `sota-harness-foundation`). Without a shared MCP and skill preset, peer sessions drift in tool schemas, lease awareness, and handovers.

## Decision

1. Ship `presets/sota-converged-mcp.json` (`presetVersion: "2.2.0"`) using portable `~/` home-relative paths so `dsh` sessions connect to the same three local stdio MCP servers (`sota-peer-bus`, `agy-sota-core`, `sota-mover-ranker`) as AGY, Claude Code, and Codex.
2. Mount the shared cross-peer skill library (`~/.agents/skills`) via `.agents/skills.json` while keeping CI (`node harness/run.mjs`) 100% offline and deterministic without installing third-party plugins.

## Consequences

- `dsh` participates natively in atomic SQLite WAL work leases, cross-session inbox push, `HYPOTHESIS_LEDGER.md` pre-registration, and `LESSONS.md` compilation.
- Offline CI in `https://github.com/native-agent-stack/dsh-sota-harness` remains zero-network and executes on free public GitHub Actions runners.
