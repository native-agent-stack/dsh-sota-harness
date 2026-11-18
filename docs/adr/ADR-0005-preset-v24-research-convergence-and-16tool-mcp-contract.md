# ADR-0005: Preset v2.4.0 Research-Convergence (`sota-research-feeds.v2`), 4 Strategy Archetypes & 16-Tool MCP Contract

- **Status:** Accepted
- **Date:** 2026-11-18
- **Organization:** `https://github.com/native-agent-stack`
- **Evidence:** `https://github.com/native-agent-stack/dsh-sota-harness`, `https://github.com/native-agent-stack/sota-multi-model-workflows` (`v3.4.0`), `https://github.com/native-agent-stack/sota-upstream-shelf-lock`, `https://github.com/native-agent-stack/sota-compounding-lab`

## Context

To guarantee zero drift when DeepSeek Harness (`dsh`) workers execute quantitative factor discovery, adversarial review, or cross-workstation Orca tasks alongside Antigravity (`agy`), Claude Code, and Codex across `portable_mac_m5_max` and `stationary_noesis_win32_wsl`, `presets/sota-converged-mcp.json` must declaratively pin the exact `sota-research-feeds.v2` schema, `ADR-0004` provenance rule (`philosophy-only` sibling-repo authority), `7` canonical PIT DataFeeds, `4` strategy archetypes, and `16`-tool `sota-mover-ranker` MCP contract.

## Decision

1. **Declarative `researchConvergence` Block (`presets/sota-converged-mcp.json` `v2.4.0`):**
   - Sets `schema = "sota-research-feeds.v2"`, `provenanceRule = "ADR-0004"`, `otherReposAuthority = "philosophy-only"`, `canonicalFeeds = 7`, `strategyArchetypes = ["PRE_TRAVEL_EARLY_IGNITION", "FIRST_HAND_SEC_EPISODIC_PIVOT", "MEGA_CAP_NEAR_LOSSLESS_ORB", "CLIMAX_VWAP_MEAN_REVERSION"]`, `moverRankerMcpTools = 16`, and `dualWorkstationHosts = ["portable_mac_m5_max", "stationary_noesis_win32_wsl"]`.
2. **Fail-Closed Probe Verification (`harness/run.mjs` & `harness/scripts/check-adr-catalog.mjs`):**
   - `harness/run.mjs` deterministically validates `presets/sota-converged-mcp.json` on every CI run alongside the `10` offline `L0–L9` scenario probes and the zero-leak `5/5` ADR catalog gate.

## Consequences

- Verified fail-closed in unlimited public GitHub Actions CI via `node harness/run.mjs` and `node harness/scripts/check-adr-catalog.mjs` (`5/5` ADRs).
