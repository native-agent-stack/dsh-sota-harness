# SOTA Cross-Peer Quant & Pre-Wall Profile (`dsh-sota-harness` `v2.2.0`)

Aligns `dsh` (`0.2.2-rc.2`) with `agy-sota-harness` (`AGY 2.0` / `agy 1.5.3`) and `cc-sota-harness` (`Claude Code` + `Codex`):

1. **Shared Peer Bus & Skills (`~/.agents/`):**
   - Check active peer leases (`~/.agents/bin/sota-bus status`) before modifying shared repositories.
   - Mount canonical skills from `~/.agents/skills/` (`16` cross-peer skills) via `.agents/skills.json`.
   - Run `~/.agents/bin/sota-doctor` (`9/9` checks) to verify cross-harness health.
2. **Pre-Wall Statistical Gate (`<= 2026-10-15`):**
   - Historical factor discovery and walk-forward validation must filter strictly `<= 2026-10-15` before computing forward shifts (`~/Documents/market-data/` post-wall partitions reserved for frozen OOS).
   - Pre-register hypotheses via `~/.agents/bin/sota-bus preregister` and evaluate against cumulative Harvey–Liu–Zhu `t*(N)`, `skfolio` `CombinatorialPurgedCV`, and native-frequency `ml4t-diagnostic` `DSR`.
3. **Hard Live-Capital & Privacy Firewall:**
   - Real-money live accounts, `.claude/bin/live`, `api.alpaca.markets`, and live IBKR ports (`4001`, `7496`) are 100% forbidden; paper lanes enforce atomic `ADR-0022 <= 2.00%` protective stops.
   - Never print, log, or commit keys, `PA...`/`DU...` account IDs, raw balances, or hardcoded local `/Users/<user>/` paths.
