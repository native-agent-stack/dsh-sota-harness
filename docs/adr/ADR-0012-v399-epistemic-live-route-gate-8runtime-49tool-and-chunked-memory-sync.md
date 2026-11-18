# ADR-0012: `v3.9.9` Epistemic `binary_present` vs `live_auth_verified` Route Gate, `8`-Runtime `49`-Tool Workstation Parity & Chunked Memory Sync

- **Status:** Accepted
- **Date:** 2026-11-18
- **Organization:** `https://github.com/native-agent-stack`
- **Evidence:** `harness/scripts/check-adr-catalog.mjs`, `orca.yaml`, `Lesson 0538a522fe39b30b`, `cc-lead` Live Route Audit (`#180`), `Noesis` `8`-Runtime `49`-Tool Verification (`#174`)

## Context

Post-restart cross-model empirical verification (`cc-lead` `#173`/`#180` + `noesis-agy` `#174` + `Lesson 0538a522fe39b30b`) established three critical operational invariants:
1. Binary presence (`runtime_fleet` `27/27`) must never be conflated with live provider authentication (`live_auth_verified`): on `Mac M5 Max`, `cc-lead` (`claude` + `OMC` v2), `omc ask codex` / `omx exec`, `omc ask antigravity`, `opencode run`, and `dsh` headless pass live prompt execution, whereas unauthenticated or unconfigured routes (`gemini` standalone, `muse` `402`, `grok`, `goose`, `pi`, `omp` embed-default, `ccr`) must be labeled credential-gated (`omc team` routes Google tasks to `antigravity`).
2. Compiling `dist/` inside the `oh-my-claudecode` `5.8.6` plugin cache activates `scripts/session-end.mjs` (`[OMC Stop Callback]` verified live), and chunking `> 22 KB` Base64 memory payloads (`default --since-hours <= 2.0`) prevents Windows `CreateProcessW` `32,767`-character command-line truncation during 3-surface E2EE Orca memory sync.
3. On `Stationary Noesis` (`Win32` + `* Noesis-Carbon` `ext4`), all `8` runtimes carry `4/4` live MCP servers (`49` verified tools incl. `sota_bus_assign_worker`).

## Decision

1. Bind `dsh-sota-harness` (`H2` / `H6`, `12` ADRs) to explicit `binary_present` vs `live_auth_verified` epistemic labeling (`dsh` headless verified live) and `v3.9.9` 3-surface chunked memory sync parity.
2. Maintain `10/10` offline baseline probes and zero third-party plugin execution in CI (`node harness/run.mjs` & `node harness/scripts/check-adr-catalog.mjs`).
