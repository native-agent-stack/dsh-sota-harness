# Architecture Decision Record Catalog (`dsh-sota-harness`)

Canonical MADR 4.0 decision index for `https://github.com/native-agent-stack/dsh-sota-harness`. Verified fail-closed in CI by `node harness/scripts/check-adr-catalog.mjs`.

| ADR | Title | Status | Date | Evidence / Enforced By |
| :--- | :--- | :--- | :--- | :--- |
| [ADR-0001](ADR-0001-harness-boundary.md) | Practice harness boundary (`L0–L9` offline probes vs. 11,111-entry catalog) | Accepted | 2026-11-14 | `harness/run.mjs`, `harness/scenarios/*.json` |
| [ADR-0002](ADR-0002-cross-peer-mcp-triad-convergence.md) | Cross-peer MCP triad & skill mount convergence (`DSH` + `AGY` + `CC/Codex`) | Accepted | 2026-11-17 | `presets/sota-converged-mcp.json` |
| [ADR-0003](ADR-0003-prewall-and-public-private-org-firewall.md) | Pre-wall statistical gate (`<= 2026-10-15`) & Public/Private Org firewall | Accepted | 2026-11-17 | `profiles/quant-prewall-charter.md`, `harness/scripts/check-adr-catalog.mjs` |
| [ADR-0004](ADR-0004-research-converged-pit-mintrl-and-dual-workstation-coop.md) | Research-converged 7-feed PIT, `MinTRL`/`RiskAdverseQueueModel` gates & Dual-Workstation Orca co-op parity | Accepted | 2026-11-18 | `harness/run.mjs`, `harness/scripts/check-adr-catalog.mjs` |
| [ADR-0005](ADR-0005-preset-v24-research-convergence-and-16tool-mcp-contract.md) | Preset `v2.4.0` `sota-research-feeds.v2` Research-Convergence, 4 strategy archetypes & 16-tool MCP contract | Accepted | 2026-11-18 | `presets/sota-converged-mcp.json`, `harness/run.mjs` |
| [ADR-0006](ADR-0006-cc-lead-channel5-worker-hub-and-h089-prewall-convergence.md) | `cc-lead` Channel-5 runtime worker hub, cross-OS `15/15` parity & `H088`/`H089` pre-wall convergence | Accepted | 2026-11-18 | `presets/sota-converged-mcp.json`, `harness/scripts/check-adr-catalog.mjs` |
| [ADR-0007](ADR-0007-ranking-datafeeds-orca-lane-and-v380-compounding-versioning.md) | 9-feed Ranking System DataFeeds (`DF1–DF9`), H2 Orca lane & `v3.8.0` two-track compounding versioning | Accepted | 2026-11-18 | `presets/sota-converged-mcp.json` (`v2.5.0`), `harness/run.mjs`, `orca.yaml` |
| [ADR-0008](ADR-0008-v390-upstream-lineage-orca-lane-hubs-v2-and-prewall-lake-convergence.md) | `v3.9.0` `UPSTREAM.md` SOTA framework lineage, `H2`/`H6` Orca Lane Hubs v2 & pre-wall lake SHA-256 convergence | Accepted | 2026-11-18 | `UPSTREAM.md`, `orca.yaml`, `harness/scripts/check-adr-catalog.mjs` |
| [ADR-0009](ADR-0009-v393-native-46skill-17workflow-and-orca-automations.md) | `v3.9.3` unified 46-skill cross-harness enactment, `sota-workflow` CLI (`17` workflows) & Dual-Machine Orca automations | Accepted | 2026-11-18 | `presets/sota-converged-mcp.json`, `orca.yaml`, `harness/scripts/check-adr-catalog.mjs` |
| [ADR-0010](ADR-0010-three-surface-27runtime-parity-orca-bridge-and-h095-collar-gate.md) | Three-surface `27/27` runtime parity, cross-session Orca Lead/Lanes bridge & 2-stage `H095` collar gate | Accepted | 2026-11-18 | `orca.yaml`, `harness/scripts/check-adr-catalog.mjs` |
