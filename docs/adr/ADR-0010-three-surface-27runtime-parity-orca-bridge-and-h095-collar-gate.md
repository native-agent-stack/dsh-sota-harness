# ADR-0010: Three-Surface `27/27` Runtime Parity, Cross-Session Orca Lead/Lanes Bridge & 2-Stage `H095` Collar Gate

- **Status:** Accepted
- **Date:** 2026-11-18
- **Organization:** `https://github.com/native-agent-stack`
- **Evidence:** `harness/scripts/check-adr-catalog.mjs`, `orca.yaml`, `sota-workstation` `v2.2.0` (`100.110.115.22` Win32 + `* Noesis-Carbon` `ext4` `27/27` runtime fleet), `Trial #94` (`H094`) -> `Trial #95` (`H095`)

## Context

Following `ADR-0009`, stationary workstation `Noesis` (`100.110.115.22` Win32 + `* Noesis-Carbon` Ubuntu 26.04.1 `ext4`) converged all `27/27` runtime binaries (`muse@1.4.23`, `code-review-graph`, `markitdown`, `46` canonical skills / `57` total) and symmetric Orca E2EE `cc-lead` (`:6768` <-> `:6770`) while pre-registered Trial `#95` (`H095`, `t*(95) = 4.1858`) extended `H094`'s lit-queue law to 2-stage `15s` lit-bid -> `<= 10.0 bps` marketable collar escalation.

## Decision

1. Bind `dsh-sota-harness` (`H2` / `H6`, `10` ADRs) to the `27/27`-runtime 3-surface fleet (`Mac M5 Max`, `Noesis Win32`, `* Noesis-Carbon ext4`) and cross-session Orca Lead/Lanes messaging bridge (`:6768` <-> `:6770`).
2. Enforce 2-stage `15s` lit passive -> `<= 10.0 bps` collar escalation and `2026-12-06` `20:00–21:00 ET` `23/5` `SIP` daily-pause protection across downstream execution adapters (`astrolabe` `ADR-0011`, `sota-dynamic-trail-c` `ADR-0018`).
