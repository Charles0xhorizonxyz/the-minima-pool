# Long-Term Vision

## Purpose

This document describes the long-term product and protocol direction for The Pool.

It is not an implementation commitment. Each step requires separate specification, testing, Minima-specific review, and risk analysis before it can be built or launched.

## North Star

The Pool should become a suite of local Minima MiniDAPP liquidity tools that remain non-custodial, transparent, and script-enforced.

The first product is a simple MINIMA / USDT AMM. Later products can build toward multi-asset liquidity, cross-pool routing, advanced LP positions, and eventually lending beside the pools.

Safety remains the priority:

- No admin key over pool reserves
- No hidden fee receiver
- No custody
- No backend dependency for core pool operation
- Script-enforced token handling, swap math, LP accounting, and withdrawals
- Clear public limits and review status

## V1: Full-Range MINIMA / USDT AMM

V1 is the safest first useful pool.

Target:

- One MINIMA / USDT pool
- Constant-product AMM
- Full-range fungible LP tokens
- One canonical pool state
- 1% fee retained in pool reserves
- Minimum-output enforcement
- Verified USDT token ID rejection
- Add liquidity
- Remove liquidity
- Swap both directions
- Stale-state retry UX
- Basic event indexing

V1 can reserve fee-governance fields and, if script limits allow, include fee-only LP governance from the first script.

V1 should not include concentrated liquidity, routing, lending, public market-maker deposits, or sharding.

V1 Maximize integration should remain out of scope. The V1 LP token should first prove reliable for add/remove liquidity and fee ownership before it is used in any managed strategy.

## V2: Multi-Pair And Operational Maturity

V2 can expand from one pool to multiple simple full-range pools.

Possible additions:

- Additional pairs beyond MINIMA / USDT
- Separate pool script/address per pair
- Separate LP token per pool
- LP token value display and circulating-supply analytics
- Event indexer implementation
- Portfolio and LP analytics
- Keeper bot specification
- UTXO maintenance tooling for users and keepers
- Better stale-state and retry flows
- Cross-pool quote comparison

Design rule:

Each pool should remain independently safe. A router or indexer must not become trusted custody infrastructure.

## V3: Liquidity Bins And Cross-Pool Routing

V3 can explore a more advanced liquidity system.

Possible additions:

- Liquidity bins
- User-selected liquidity shapes
- Individually addressable LP positions
- Range-specific accounting
- More capital-efficient liquidity
- Multi-pool routing
- Multi-hop swaps across pools
- More advanced transaction queue or intent UX

This likely requires new scripts and new pool addresses.

Reason:

Full-range fungible LP accounting is much simpler than bin/range-specific LP accounting. Once LP positions have different ranges or shapes, LP positions likely need position records or non-fungible representations.

## Lending Beside The Pools

A lending protocol can be considered later, but it should be separate from the first AMM.

Lending introduces different risk:

- Collateral valuation
- Liquidation rules
- Interest-rate model
- Bad debt
- Oracle or reference-price assumptions
- Cross-protocol contagion
- More complex user disclosures

If lending is built, it should have its own:

- Specification
- Scripts
- State model
- Tests
- Risk review
- Deployment plan

It can integrate with pool prices or LP assets only after the AMM has proven stable.

## Maximize Managed Strategy

A Maximize integration can be considered after the base AMM is stable, but it is not a simple extension of the pool.

A managed strategy creates new questions:

- who or what holds the LP tokens or underlying assets
- whether strategy positions can still vote
- how users exit during volatile markets
- whether an external protocol adds custody, oracle, strategy, or liquidation risk
- how rewards are funded
- how the UI separates pool fees from external strategy yield

Any Maximize integration should be opt-in and separately reviewed. The base AMM should not depend on it and should not route LP tokens or reserves into external yield by default.

## What Can Stay On The Same Pool

Likely same-pool compatible if included in the V1 script:

- Fee-only LP governance
- Fee bounds
- Quarterly fee cadence
- Fee activation delay
- Better stale-state UX
- Event indexing and analytics
- Private keeper trading with its own funds
- User or keeper UTXO maintenance

Likely new script/address:

- Liquidity bins
- Concentrated liquidity
- User-selected liquidity shapes
- Individually addressable LP positions
- Non-fungible LP positions
- Multiple fee tiers
- Sharded pool state
- Multi-pool routing
- Batch/intents settlement
- Lending protocol
- Maximize managed-strategy integration
- L2 or managed-vault design

## Review Gates

Before any major step, The Pool should publish:

- Current version
- Supported token IDs
- Current pool caps
- Review status
- Test status
- Known limitations
- Risk disclosures
- Migration plan if a new pool address is required

## Reference Documents

- `docs/technical-review-brief.md`
- `docs/architecture.md`
- `docs/implementation-plan.md`
- `docs/utxo-management.md`
- `docs/throughput-scaling.md`
- `docs/liquidity-model.md`
- `docs/risk-disclosures.md`
