# Technical Review Brief

## Purpose

This document is the first entry point for Minima developers and technical reviewers.

The Pool is a 0xHorizon open-source project to build a local Minima MiniDAPP for a decentralized MINIMA / USDT liquidity pool. The priority is safety: a simple, reviewable first AMM before any real-fund launch.

We would appreciate review from Minima developers before moving from prototype and simulation work into contract-backed test-token implementation.

## Current Status

Current visible version:

```text
v0.0.1 beta
```

Current state:

- Static local MiniDAPP prototype exists
- Packaged prototype release exists in `releases/latest/`
- Pure AMM simulation exists
- AMM simulation tests pass
- Production smart contract code has not been written
- No real-fund pool has been launched

Current test command:

```text
node --test tests/amm-simulation.test.js
```

Current test result:

```text
7 tests passed
```

## V1 Objective

The first real protocol objective is a simple full-range constant-product MINIMA / USDT AMM on Minima.

V1 target behavior:

- Add liquidity
- Remove liquidity
- Swap MINIMA to USDT
- Swap USDT to MINIMA
- Verified USDT token ID enforcement
- Fake USDT rejection
- Minimum-output enforcement on every swap
- 1% fee retained inside pool reserves
- Fungible full-range LP token accounting
- Single canonical pool state
- No oracle dependency
- No backend server
- No admin wallet
- No hidden fee receiver
- No custody outside the pool script

Initial verified USDT token ID:

```text
0x7D39745FBD29049BE29850B55A18BF550E4D442F930F86266E34193D89042A90
```

## Safety Principles

The intended pool design is script-controlled, not admin-controlled.

Core safety requirements:

- Pool funds move only when a transaction satisfies the pool script
- Users sign only for their own wallet coins and LP tokens
- No private key should control pool reserves
- The MiniDAPP must not be trusted enforcement
- The contract must enforce token ID, AMM math, LP accounting, and minimum output
- If the UI is wrong, the script should still reject invalid transactions

The pool should not include:

- Admin wallet
- Upgrade key
- Treasury
- Fee receiver
- Manual fee claim path
- Operator withdrawal path
- Emergency drain
- Ability to change the verified USDT token ID inside the same pool

## Fee Model

The starting fee is:

```text
100 bps = 1%
```

The fee remains inside pool reserves.

There is no fee receiver, treasury, collector wallet, or manual claim. LPs are compensated because retained fees increase the reserves behind LP tokens.

## Fee Governance Direction

We want V1 to reserve room for fee-only LP governance if Minima script limits and review allow it.

Governance should be limited to:

```text
fee_bps
```

Governance must not be able to:

- Move reserves
- Change token IDs
- Change withdrawal rules
- Disable swaps
- Disable liquidity removal
- Assign a fee receiver
- Create a treasury
- Upgrade or replace the script
- Mint LP tokens without deposits
- Bypass AMM, slippage, or LP accounting rules

Proposed fee-governance constraints:

- Initial fee: `100 bps`
- Maximum change per vote: `25 bps`
- Vote cadence: once every 3 months
- Activation delay after a passed vote
- Minimum and maximum fee bounds hardcoded in script

If fee governance is tricked or fails, the intended worst case should be only a bounded fee change. It must not compromise funds or withdrawal rights.

Open review question:

Can fee-only LP governance be included safely in the first pool script without exceeding script/proof limits or creating unacceptable complexity?

## UTXO Model And Throughput

The first design assumes one canonical pool-state UTXO.

This means:

- Pool updates are sequential
- Concurrent swaps can conflict
- Stale quotes are expected under contention
- Failed stale transactions need clean retry UX

V1 should:

- Track pending user UTXOs
- Avoid reusing pending coins
- Treat pending change as unavailable until confirmed
- Refresh reserves before preview and submit
- Enforce minimum output
- Re-quote and retry if the pool state moved first

We are not trying to solve high throughput in V1. The first priority is correctness.

Future throughput paths:

- Sharded pool-state UTXOs
- Batch / intent settlement
- Keeper-assisted routing and re-quoting
- Higher-layer or vault design

See:

- `docs/utxo-management.md`
- `docs/throughput-scaling.md`

## Data Layer Separation

The design separates:

- On-chain contract state
- Event/history/indexer state
- UI state

The indexer should be an append-only watcher for events such as:

- pool initialization
- add liquidity
- remove liquidity
- swaps
- fee votes
- fee changes
- failed transactions
- expired transactions

The indexer powers analytics and history. It must not enforce pool rules or custody funds.

See:

- `docs/architecture.md`
- `docs/utxo-management.md`

## LP Token Model

V1 should use fungible full-range LP tokens.

This keeps the first AMM simpler:

- One LP token supply
- Proportional claim on reserves
- Proportional remove-liquidity math
- Easier review and testing

Future features such as concentrated liquidity, liquidity bins, boosted positions, multiple fee tiers, or time-weighted rewards likely require individually addressable positions and probably a new pool script/address.

## Future Versions

Future-version ideas are intentionally out of scope for V1:

- Additional token pairs beyond MINIMA / USDT
- Multi-pool routing
- Concentrated liquidity
- Liquidity bins or user-selected liquidity shapes
- Individually addressable LP positions
- Real governance execution beyond fee-only rules
- Keeper bot
- Indexer implementation
- Complex transaction queue UI
- Public market-maker vault logic
- Lending protocol beside the pools
- L2 or managed-vault design

These should each get their own specification and threat model before implementation.

## Review Areas Requested

We especially need Minima expert review on:

- Pool-state UTXO design
- Reserve coin control design
- How to represent pool state safely
- LP token mint/burn mechanics
- Verified USDT token ID enforcement
- Minimum-output enforcement
- Same-state double-spend / stale trade behavior
- Transaction expiry behavior
- Confirmation depth for final trade status
- User coin selection and pending UTXO handling
- Proof size and script limits
- Whether fee-only governance can safely live in V1
- Whether any hidden custody/admin assumption has slipped into the design

## Reference Documents

Start here:

- `README.md`
- `docs/technical-review-brief.md`

Core design:

- `SPEC.md`
- `SECURITY.md`
- `TESTPLAN.md`
- `docs/architecture.md`
- `docs/implementation-plan.md`
- `docs/liquidity-model.md`
- `docs/risk-disclosures.md`
- `docs/utxo-management.md`
- `docs/throughput-scaling.md`
- `docs/deployment-plan.md`

Current implementation:

- `dapp/`
- `simulation/amm.js`
- `tests/amm-simulation.test.js`
- `releases/latest/`

## Suggested Discord Message

```text
Hi Minima devs, I am building The Pool, an open-source local MiniDAPP for a MINIMA / USDT AMM.

Before moving toward contract-backed test-token implementation, I would really appreciate technical review from anyone familiar with Minima scripting, UTXO design, token handling, and MiniDAPP transaction construction.

The goal is safety first: no admin key, no custody, no treasury, verified USDT token ID enforcement, slippage/minimum-output enforcement, and a simple single-state AMM before any real funds.

Technical review entry point:
https://github.com/Charles0xhorizonxyz/the-minima-pool/blob/main/docs/technical-review-brief.md

I would be very grateful if someone interested could have a look and discuss the design on a call, especially the pool-state UTXO model, LP token mechanics, stale transaction behavior, script/proof limits, and whether fee-only LP governance can safely be reserved in V1.
```
