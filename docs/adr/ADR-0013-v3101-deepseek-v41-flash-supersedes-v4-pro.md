# ADR-0013: `v3.10.1` Supersede `deepseek-v4-pro` with `deepseek-v4.1-flash` (`deepseek-flash` in `@deepseek-ai/dsh-agent-default-model`)

- **Status:** Accepted
- **Date:** 2026-11-18
- **Organization:** `https://github.com/native-agent-stack`
- **Evidence:** `https://artificialanalysis.ai/models`, `dsh --profile headless --dump-default-config` (`@deepseek-ai/dsh-agent-default-model` -> `model: deepseek-flash`), `presets/sota-converged-mcp.json`, `harness/run.mjs`

## Context

Primary-source verification against [Artificial Analysis](https://artificialanalysis.ai/models) and `dsh --profile headless --dump-default-config` (`@deepseek-ai/dsh-agent-default-model`) confirmed:
1. **`deepseek-v4-pro` is superseded by DeepSeek V4.1 Flash (`deepseek-v4.1-flash`):** 552B MoE architecture activating ~8B/16B parameters per token with `1M` context window and high-throughput FP4/CSA2 KV caching.
2. **Official `@deepseek-ai/dsh` Default Alignment:** `@deepseek-ai/dsh` (`0.2.2-rc.2`) ships `provider: deepseek-official`, `model: deepseek-flash` (the official DeepSeek API slug for `deepseek-v4.1-flash`).

## Decision

1. Update `presets/sota-converged-mcp.json` (`ccLeadHub.dshDefaultModel = "deepseek-v4.1-flash"`, `dshOfficialApiSlug = "deepseek-flash"`) and `UPSTREAM.md`, retiring `deepseek-v4-pro` across active routing.
2. Preserve `presetVersion = "2.5.0"` backward compatibility and `10/10` offline `L0–L9` scenario probes (`node harness/run.mjs` & `node harness/scripts/check-adr-catalog.mjs`).
