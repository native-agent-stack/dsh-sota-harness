# Architecture Decision Record Catalog (`dsh-sota-harness`)

Canonical MADR 4.0 decision index for `https://github.com/native-agent-stack/dsh-sota-harness`. Verified fail-closed in CI by `node harness/scripts/check-adr-catalog.mjs`.

| ADR | Title | Status | Date | Evidence / Enforced By |
| :--- | :--- | :--- | :--- | :--- |
| [ADR-0001](ADR-0001-harness-boundary.md) | Practice harness boundary (`L0–L9` offline probes vs. 11,111-entry catalog) | Accepted | 2026-11-14 | `harness/run.mjs`, `harness/scenarios/*.json` |
| [ADR-0002](ADR-0002-cross-peer-mcp-triad-convergence.md) | Cross-peer MCP triad & skill mount convergence (`DSH` + `AGY` + `CC/Codex`) | Accepted | 2026-11-17 | `presets/sota-converged-mcp.json` |
| [ADR-0003](ADR-0003-prewall-and-public-private-org-firewall.md) | Pre-wall statistical gate (`<= 2026-10-15`) & Public/Private Org firewall | Accepted | 2026-11-17 | `profiles/quant-prewall-charter.md`, `harness/scripts/check-adr-catalog.mjs` |
