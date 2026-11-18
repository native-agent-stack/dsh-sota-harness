# ADR-0006: `cc-lead` Channel-5 Runtime Worker Hub, Cross-OS `15/15` Parity & `H088`/`H089` Pre-Wall Convergence

- **Status:** Accepted
- **Date:** 2026-11-18
- **Organization:** `https://github.com/native-agent-stack`
- **Evidence:** `https://github.com/native-agent-stack/dsh-sota-harness`, `https://github.com/native-agent-stack/sota-multi-model-workflows` (`v3.5.0+`), `https://github.com/native-agent-stack/sota-harness-foundation` (`ADR-0026`), `https://github.com/native-agent-stack/agy-sota-harness` (`ADR-0017`/`ADR-0018`)

## Context

Following `ADR-0005` (`sota-converged-mcp.json` `v2.4.0`), the `native-agent-stack` organization converged on Claude Code (`cc-lead`, `claude-fable-5-2` `xhigh` + `oh-my-claudecode` `OMC` Runtime v2, `oneModelPerConversation = true`) as central multi-session orchestrator (`sota-cc-hub` & Workflow `#14` `cc_lead_multi_runtime_workers_workflow.py`), alongside `Trials #88/#89` (`H088`/`H089` Two-Stage Hybrid Entry × `50/50` Core-Harvest + Runner Convexity across `587` dates `<= 2026-10-15`, `N = 89 -> t*(90) = 4.1735`, `52` compiled `E1–E4` lessons). DeepSeek Harness (`dsh`, `deepseek-v4-pro`) serves as the high-efficiency open-weights Channel-5 pre-wall batch worker and `OMC`/`OMO` Sisyphus/Aletheia challenger across both `portable_mac_m5_max` and `stationary_noesis_win32_wsl`.

## Decision

1. **Bind `dsh` into `cc-lead` Channel-5 Runtime Worker Hub (`presets/sota-converged-mcp.json`):**
   - Declare `ccLeadHub` inside `presets/sota-converged-mcp.json` (`hubCli = "sota-cc-hub"`, `workflow = "cc_lead_multi_runtime_workers_workflow.py"`, `channel = "5_dsh_prewall_omo_kimi_hcom_and_sota_bus"`, `dshDefaultModel = "deepseek-v4-pro"`, `oneModelPerConversation = true`, `crossOs15of15BinaryParity = true`) while preserving `presetVersion = "2.4.0"` compatibility for `harness/run.mjs`.
2. **Enforce Isolated Worktrees, Disjoint `sota-bus` Leases & `N = 89` HLZ Multiplicity:**
   - Every mutating `dsh` worker invoked by `sota-cc-hub` executes inside an isolated git worktree under a disjoint `sota-bus` path-glob lease, keeps historical alpha sweeps strictly `<= 2026-10-15` under dynamic Harvey–Liu–Zhu `t*(N)` accounting, and hard-refuses live broker endpoints (`4001`, `7496`, unprefixed `api.alpaca.markets`).

## Consequences

- Verified fail-closed in unlimited public GitHub Actions CI via `node harness/run.mjs` and `node harness/scripts/check-adr-catalog.mjs` (`6/6` ADRs, `0` leaks).
