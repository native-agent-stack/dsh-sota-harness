# ADR-0004: Research-Converged 7-Feed PIT, MinTRL/RiskAdverseQueue Gates & Dual-Workstation Orca Co-op Parity

- **Status:** Accepted
- **Date:** 2026-11-18
- **Organization:** `https://github.com/native-agent-stack`
- **Evidence:** `https://github.com/native-agent-stack/canon` (`0169..0176`), `https://github.com/native-agent-stack/sota-upstream-shelf-lock` (`ADR-0004`), `https://github.com/native-agent-stack/sota-compounding-lab` (`ADR-0006`), `https://github.com/nkaz001/hftbacktest` (`5f3ec40b`), `https://github.com/QuantConnect/Lean` (`e28820c9c846`), `https://github.com/stablyai/orca`

## Context

`dsh-sota-harness` (`L6` DeepSeek Harness `10`-layer probe suite) participates in heterogeneous `AO` cross-vendor orchestration alongside Antigravity (`agy`), Claude Code, and Codex across both the portable Apple M5 Max (`64 GB`) and stationary `Noesis` (`64c` / `128 GB` / RTX 4090) Orca workstations.

## Decision

1. **Research-Converged Upstream Contract Alignment:** Align `dsh-sota-harness` factor-discovery and review prompts with `Canon` `0169..0176` (`RFC-8493` + `golang/mod` `dirhash` `h1` snapshot digests, `QuantConnect/Lean` `RelativeDailyVolume` same-time-of-day `RVOL`, `massive-com/client-python` PIT delisted-ticker verification, `<= 8`-symbol/`<= 8h` isolated `BOATS` history bounds), `sota-upstream-shelf-lock` `ADR-0004` (`ml4t/diagnostic` ADIA Lab `#19` `MinTRL`/`MDE` power gate + `hftbacktest` `RiskAdverseQueueModel` passive queue simulation), and `sota-compounding-lab` `ADR-0006` (`7`-feed PIT gate + non-repainting Pine v6).
2. **Dual-Workstation Orca Co-op & Shared-VM Firewall (`ADR-0020`–`0022`):** Operate seamlessly across Mac M5 Max (`--host local`) and `Noesis` (`--environment 100.110.115.22`), enforcing `singleActiveBrokerHostOnly = true`, zero `wsl --shutdown` / `sextant` mutations, and `100%` paper-only execution (`PA...` / `DU... :4002`, `ADR-0022 <= 2.00%` stops).

## Consequences

- Verified fail-closed in unlimited public GitHub Actions CI via `node harness/run.mjs` (`10/10` layers) and `node harness/scripts/check-adr-catalog.mjs` (`4/4` ADRs).
