# ADR-0003: Pre-Wall Statistical Gate & Public/Private Org Firewall

- **Status:** Accepted
- **Date:** 2026-11-17
- **Organization:** `https://github.com/native-agent-stack`
- **Evidence:** `profiles/quant-prewall-charter.md`, `harness/scripts/check-adr-catalog.mjs`, `.github/workflows/validate.yml`

## Context

Within `https://github.com/native-agent-stack`, public repositories benefit from unlimited GitHub Actions CI minutes, whereas proprietary trading strategies, broker order routers, and empirical paper ledgers require strict private repository isolation.

## Decision

1. **Public Open-Core Harness Tier (`dsh-sota-harness`):** Keep this repository `PUBLIC` so all 10 layer probes (`L0–L9`), catalog validators, and MADR 4.0 ADR zero-drift checks execute continuously under unlimited GitHub Actions CI.
2. **Zero-Leak & Pre-Wall Charter (`profiles/quant-prewall-charter.md`):**
   - Enforce `studyWallDate: "2026-10-15"` for all historical factor discovery and `CombinatorialPurgedCV` / `DSR` / Harvey-Liu-Zhu `t*(N)` evaluations.
   - Hard-refuse live real-money accounts, `api.alpaca.markets`, and live IBKR ports (`4001`, `7496`); paper execution lanes in private sibling repositories enforce atomic `ADR-0022 <= 2.00%` protective stops.
   - Block any commit introducing credentials, broker account identifiers, or hardcoded host home paths via `harness/scripts/check-adr-catalog.mjs` in CI.

## Consequences

- Every pull request and push to `main` verifies both the 10-layer DSH harness contracts and the zero-drift MADR 4.0 catalog / privacy invariant.
