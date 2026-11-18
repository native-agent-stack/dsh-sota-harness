# ADR-0014: `v3.10.0` 8-Stage SOTA Research Convergence, Finalized 12-Feed (`DF1..DF12`) Symbol Ranking & Cross-Runtime `sota-workflow run` Parity

- **Status:** Accepted
- **Date:** 2026-11-18
- **Organization:** `https://github.com/native-agent-stack`
- **Evidence:** `sota-multi-model-workflows ADR-0024`, `presets/sota-converged-mcp.json`, `harness/scripts/check-adr-catalog.mjs`, `harness/run.mjs`

## Context

Following `ADR-0013` (`deepseek-v4.1-flash` / `deepseek-flash`), the `v3.10.0` ecosystem converges all auto-trading strategy routes onto finalized `DF1..DF12` bitemporal PIT Symbol Ranking DataFeeds (`sota-symbol-ranking-datafeeds.v3.10`) alongside `8`-stage SOTA convergence (`413` owner stars plus `microsoft/RD-Agent`, `databento/databento-python`, `unit8co/darts`, `Nixtla/statsforecast`, `stanfordnlp/dspy`, `ADIA-Lab/MinTRL-MDE-PowerGate`) and universal CLI `sota-workflow run` execution (`Workflow #19` `orca-lead-e2e-research-convergence`).

## Decision

1. Add `v310ResearchConvergence` metadata in `presets/sota-converged-mcp.json` (`symbolRankingFeedsCount = 12`, `autoStrategyRoutesCount = 6`, `advancedStagesCount = 8`, `dshModel = "deepseek-flash"`, `sotaWorkflowRunCliParity = true`).
2. Preserve `presetVersion = "2.5.0"` backward compatibility and `10/10` offline `L0–L9` scenario probes (`node harness/run.mjs` & `node harness/scripts/check-adr-catalog.mjs`).
