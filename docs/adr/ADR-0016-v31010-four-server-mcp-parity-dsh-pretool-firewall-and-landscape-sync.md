# ADR-0016: `v3.10.10` 4-Server MCP Parity (`codebase-memory`), DSH `PreToolUse` Safety Firewall & 3-OS Privacy Gate

- **Status:** Accepted
- **Date:** 2026-11-19
- **Organization:** `https://github.com/native-agent-stack`
- **GitHub Evidence:** https://github.com/native-agent-stack/dsh-sota-harness, https://github.com/deepseek-ai/deepseek-harness, https://github.com/DeusData/codebase-memory-mcp, https://github.com/native-agent-stack/dsh-plugin-landscape
- **Evidence:** `presets/sota-converged-mcp.json`, `UPSTREAM.md`, `harness/scripts/check-adr-catalog.mjs`, `harness/run.mjs`

## Context

1. Following the `v3.10.10` cross-vendor full-landscape audit across Win32, `* Noesis-Carbon` WSL2, and Mac M5 Max:
   - `presets/sota-converged-mcp.json` was missing `codebase-memory` (`DeusData/codebase-memory-mcp`), leaving DSH at `3` MCP servers while Claude Code, Codex, and Antigravity ran the canonical `4`-server / `50`-tool MCP mesh.
   - DeepSeek Harness (`dsh 0.2.2-rc.2`) lacked a live `PreToolUse` safety firewall (`@deepseek-ai/dsh-hooks-claude-code`) enforcing fail-closed live-capital, secret, `risk/`, `*.contract.json`, and `~/Documents/upstream/` boundaries without colliding with Orca's `# >>> orca-managed-dsh-hooks >>>` section in `~/.dsh/cordis.patch.yml`.
   - `UPSTREAM.md` still referenced retired `block/goose`, and `harness/scripts/check-adr-catalog.mjs` lacked Windows/Linux concrete home-path checks and digit-required Alpaca paper-account matching.

## Decision

1. Include all `4` canonical MCP servers (`sota-mover-ranker`, `sota-peer-bus`, `agy-sota-core`, `codebase-memory`) via cross-OS `~/.agents/bin/sota-mcp-launcher.py` in `presets/sota-converged-mcp.json`.
2. Wire an isolated `# >>> sota-safety-firewall >>>` fenced hook block in `~/.dsh/cordis.patch.yml` pointing to `~/.dsh/sota-hooks.json` -> `peer_hook_adapter.py --agent dsh --event PreToolUse` (managed by `sync-all-8-runtimes.py` and audited by `sota-doctor.py` Check #9 across Win32, WSL2, and Mac).
3. Remove retired `block/goose` from `UPSTREAM.md`, align live verified pins (`orca v1.4.264`, `agy v1.5.13`, `oh-my-openagent v5.1.79`), and upgrade `harness/scripts/check-adr-catalog.mjs` with 3-OS home-path leak detection and digit-required `PA` matching.
