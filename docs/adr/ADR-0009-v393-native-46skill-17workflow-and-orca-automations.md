# ADR-0009: v3.9.3 Unified 46-Skill Cross-Harness Enactment, `sota-workflow` CLI (`17` Workflows) & Dual-Machine Orca Automations

- **Status:** Accepted
- **Date:** 2026-11-18
- **Organization:** `https://github.com/native-agent-stack`
- **Evidence:** `presets/sota-converged-mcp.json`, `orca.yaml`, `harness/scripts/check-adr-catalog.mjs`, `sota-multi-model-workflows` (`ADR-0018`)

## Context

Enacting all `46` canonical SOTA skills (`18` Core/Orchestration + `20` Quant/Early-Mover + `8` Scientific/Security), `9`-Feed `sota-ranking-datafeeds.v3.8` (`DF1–DF9`), and `18`-repo MADR 4.0 ADR catalogs as a native workflow across DeepSeek (`deepseek-dsh`), Antigravity, Claude Code (`cc-lead`), Codex (`OMX`), and Dual-Machine Orca (`Mac M5 Max <-> Stationary Noesis 100.110.115.22`) required binding `dsh-sota-harness` (`H2` / `H6`) to `sota-native-workflow-enactor.v3.10` (`~/.agents/bin/sota-workflow`, `17` workflows).

## Decision

1. Bind `deepseek-dsh` (`quant-prewall` profile) to `~/.agents/bin/sota-workflow` (`17` canonical workflows, `46` converged `~/.agents/skills`, `14` layers `L0–L13`, and `480+` indexed MADR 4.0 ADRs).
2. Enforce native `Noesis-Carbon` `ext4` (`~/sota-data/prewall-lake`) execution and `SINGLE_BROKER_HOST_FIREWALL` (`:8787`/`:8799`/`:4002` paper-only on `portable_mac_m5_max`).
