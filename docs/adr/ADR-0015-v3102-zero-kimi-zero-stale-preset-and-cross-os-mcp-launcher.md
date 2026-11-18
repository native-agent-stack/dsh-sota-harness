# ADR-0015: `v3.10.2` Zero-Kimi / Zero-Stale Preset Hygiene & Cross-OS `sota-mcp-launcher.py` Bindings

- **Status:** Accepted
- **Date:** 2026-11-18
- **Organization:** `https://github.com/native-agent-stack`
- **Evidence:** `presets/sota-converged-mcp.json`, `UPSTREAM.md`, `harness/run.mjs`, `harness/scripts/check-adr-catalog.mjs`

## Context

1. Per Owner Directives #1 & #2, `dsh-sota-harness` must carry zero `kimi`/`moonshot` or `deepseek-v4-pro` strings in active presets and `UPSTREAM.md`, and `mcpServers` in `presets/sota-converged-mcp.json` must resolve cleanly on Windows (`python` + `~/.agents/bin/sota-mcp-launcher.py`) as well as macOS and Linux.

## Decision

1. Update `ccLeadHub.channel` to `5_dsh_prewall_omo_hephaestus_hcom_and_sota_bus`, point `mcpServers` to `~/.agents/bin/sota-mcp-launcher.py`, clean `UPSTREAM.md`, and enforce a zero-`kimi` / zero-`deepseek-v4-pro` check in `harness/run.mjs`.
