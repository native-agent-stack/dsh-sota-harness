# ADR-0007: 9-Feed Ranking System DataFeeds (`DF1–DF9`), H2 Orca Lane & `v3.8.0` Two-Track Compounding Versioning

- **Status:** Accepted
- **Date:** 2026-11-18
- **Organization:** `https://github.com/native-agent-stack`
- **Evidence:** `https://github.com/native-agent-stack/dsh-sota-harness` (`v2.5.0`), `https://github.com/native-agent-stack/sota-multi-model-workflows` (`v3.8.0`, `ADR-0014`/`ADR-0015`), `https://github.com/native-agent-stack/sota-harness-foundation` (`ADR-0029`)

## Context

Following `ADR-0006` and cross-machine Orca lane provisioning (`orca.yaml` across `portable_mac_m5_max` and `stationary_noesis_carbon_wsl2` in Harness Lane `H2`), the `native-agent-stack` ecosystem finalized `v3.8.0` governance: expanding the `7`-feed `sota-research-feeds.v2` baseline into `9` first-hand PIT Ranking System DataFeeds (`DF1–DF9` under `sota-ranking-datafeeds.v3.8`), advancing the Harvey–Liu–Zhu pre-registered hypothesis floor to `N >= 90` (`t*(91) >= 4.1760`, `60` compiled `E1–E4` lessons), exposing `17` `sota-mover-ranker` MCP tools, and enforcing **Two-Track Promotion** (`ALPHA_STRATEGY_MINOR` vs. `PROTECTIVE_FILTER_OR_GOVERNANCE` as demonstrated on `Trial #90` `H090`).

## Decision

1. **Upgrade `presets/sota-converged-mcp.json` to `presetVersion = "2.5.0"` with `compoundingVersioning`:**
   - Retain backward-compatible `researchConvergence` (`sota-research-feeds.v2`) while binding `compoundingVersioning` (`ecosystemVersion = "3.8.0"`, `rankingDataFeedsSchema = "sota-ranking-datafeeds.v3.8"`, `canonicalRankingFeeds = 9`, `moverRankerMcpTools = 17`, `hlzTrialsFloor = 90`, `twoTrackPromotionRule = true`).
2. **Fail-Closed Validation in `harness/run.mjs` & `H2` Dual-Machine Orca Lane:**
   - Assert every `compoundingVersioning` field in `node harness/run.mjs` alongside the `10/10` offline `L0–L9` probes, keeping active paper-broker sockets strictly pinned to `portable_mac_m5_max` (`ADR-0020`) and pre-wall `dsh` batch sweeps strictly `<= 2026-10-15`.

## Consequences

- Verified fail-closed in public GitHub Actions CI via `node harness/run.mjs` and `node harness/scripts/check-adr-catalog.mjs` (`7/7` ADRs, `0` leaks).
