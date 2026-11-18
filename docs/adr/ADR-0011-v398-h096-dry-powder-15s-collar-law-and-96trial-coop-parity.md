# ADR-0011: `v3.9.8` `H096` Dry-Powder `15s` Bid-Survival Collar Law, `96`-Trial Ledger & Full-Landscape Co-op Parity

- **Status:** Accepted
- **Date:** 2026-11-18
- **Organization:** `https://github.com/native-agent-stack`
- **Evidence:** `harness/scripts/check-adr-catalog.mjs`, `orca.yaml`, `Trial #96` (`H096`, `spec_sha256 = 588d27755bad...`), `Meridian ADR 0063`

## Context

Following `ADR-0010`, pre-registered Trial `#96` (`H096_DRY_POWDER_15S_BID_SURVIVAL_10BPS_MARKETABLE_COLLAR_ORB_CPCV` / `H096_DRY_POWDER_15S_BID_SURVIVAL_10BPS_COLLAR_ORB_CPCV`, `t*(96) = 4.1881`, `<= 2026-10-15`) proved across `700` `XNYS` sessions that pairing strict `OFI >= 0.25 & (ISO_F >= 0.15 | BJZZ >= 0.12)` with `15s` dry-powder bid survival + `<= 10.0 bps` marketable ask collars flips adverse selection positive (`+2.947 bps` vs `-97.274 bps` in `H094`), clears `11/15` (`73.33%`) disjoint CPCV splits, and earns `+16.835 bps` net `1x` / `+11.366 bps` net `2x` (`3/3` years positive at `2x`), while relaxed `OFI > 0` (`-12.729 bps` `1x`, `t = -0.7781`) fails and advances the cumulative HLZ hurdle to `t*(97) = 4.1905`.

## Decision

1. Bind `dsh-sota-harness` (`H2` / `H6`, `11` ADRs) `quant-prewall` worker dispatches to the `96`-trial HLZ ledger (`t*(97) = 4.1905`) and `H096` joint `OFI >= 0.25 + ISO/BJZZ` + `15s` dry-powder collar filter (`v3.9.8` `PROTECTIVE_FILTER_OR_GOVERNANCE`).
2. Maintain `10/10` DSH harness probe parity across `Mac M5 Max`, `Noesis Win32`, and `* Noesis-Carbon` `ext4`.
