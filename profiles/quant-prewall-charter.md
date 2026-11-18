# SOTA Cross-Peer Quant, 7-Feed PIT & Pre-Wall Profile (`dsh-sota-harness` `v2.4.0`)

Aligns `dsh` (`0.2.2-rc.2`) with `agy-sota-harness` (`AGY 2.0` / `agy 1.5.10`), `sota-multi-model-workflows` (`v3.4.0`), and `cc-sota-harness` (`Claude Code` + `Codex`) across `portable_mac_m5_max` and `stationary_noesis_win32_wsl`:

1. **Shared Peer Bus, 16-Tool Mover-Ranker MCP & Skills (`~/.agents/`):**
   - Check active peer leases (`~/.agents/bin/sota-bus status`) before modifying shared repositories.
   - Mount canonical skills from `~/.agents/skills/` and verify cross-harness health via `~/.agents/bin/sota-doctor` (`11/11` checks, `13` workflows).
2. **Research-Convergence & Pre-Wall Statistical Gate (`sota-research-feeds.v2`, `<= 2026-10-15`):**
   - Enforce `ADR-0004` 3-tier SHA provenance (`64`-hex input SHA-256 + `18` `40`-hex upstream pins + `philosophy-only` authority on sibling repos), all `7` canonical PIT feeds (`SIP`, `BOATS` + `2026-12-06` `23/5` flag, `RAW`-vs-`ALL`, SEC `acceptanceDateTime` `15m` half-life + `424B*`/`S-3` block, FINRA `CNMSshvol` `T-1`, corporate-actions split guard, `IBKR` `:4002` `L1`), and the `4` canonical strategy archetypes (`PRE_TRAVEL_EARLY_IGNITION`, `FIRST_HAND_SEC_EPISODIC_PIVOT`, `MEGA_CAP_NEAR_LOSSLESS_ORB`, `CLIMAX_VWAP_MEAN_REVERSION`).
   - Pre-register hypotheses via `~/.agents/bin/sota-bus preregister` (`MinTRL`/`MDE` power gate first) and evaluate against cumulative HLZ `t*(N)`, `skfolio` `CombinatorialPurgedCV`, `ml4t-diagnostic` `DSR >= 0.95`, and `hftbacktest` `RiskAdverseQueueModel`.
3. **Hard Live-Capital & Privacy Firewall:**
   - Real-money live accounts, `.claude/bin/live`, `api.alpaca.markets`, and live IBKR ports (`4001`, `7496`) are 100% forbidden; paper lanes enforce atomic `ADR-0022 <= 2.00%` protective stops.
   - Never print, log, or commit keys, `PA...`/`DU...` account IDs, raw balances, or hardcoded local `/Users/<user>/` paths.
