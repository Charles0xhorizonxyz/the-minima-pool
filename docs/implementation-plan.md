# Implementation Plan

## Objective

Build The Pool as a local Minima MiniDAPP for a MINIMA / USDT liquidity pool.

The first goal is an understandable test-token prototype that can graduate into a small capped real-fund trial. Throughput scaling, private keeper automation, public market-maker vaults, and L2 designs are future tracks.

## Current Status

Current visible version:

```text
v0.0.1 beta
```

Current working UI:

```text
2_development/dapp/
```

The current UI is a local static prototype served from:

```text
http://127.0.0.1:8096/
```

For phone testing on the same Wi-Fi network, serve the same folder on the LAN:

```text
.\scripts\serve-dapp-lan.ps1
```

Then open the printed `http://<LAN-IP>:8096/` URL from the phone. `127.0.0.1` only works on the computer running the server.

The latest release folder is reserved at:

```text
2_development/releases/latest/
```

This folder should contain only the current packaged MiniDAPP release once a release is intentionally cut.

It includes:

- Swap tab
- Add liquidity tab
- Pool stats under the swap button
- Historical trades only on the swap tab
- Liquidity analytics on the add-liquidity tab
- Project links for GitHub, X, and Telegram
- Adjustable swap slippage tolerance in the swap settings
- Prototype pending and success feedback after confirmation

It does not create or submit real Minima transactions yet.

## Phase 0: Foundation

Status: in progress.

Deliverables:

- Project identity and resource boundaries
- Specification
- Security notes
- Test plan
- Architecture notes
- Liquidity model
- Deployment plan
- UI prototype
- Throughput scaling notes
- Execution checklist
- Private backup process

Exit criteria:

- The project clearly states its own identity and dedicated resources
- The verified USDT token ID is documented
- The AMM model is documented
- The fee model is documented
- The fee model allows future LP-holder governance to change the fee within explicit bounds
- The expected economic impact of fee changes is documented for LPs
- Slippage enforcement is specified
- Throughput limitations are acknowledged
- No production smart contract code exists

## Phase 1: Pure AMM Simulation

Build a local deterministic simulation before Minima contract work.

Required functions:

- Initialize pool
- Add liquidity
- Remove liquidity
- Swap MINIMA to USDT
- Swap USDT to MINIMA
- Calculate expected output
- Enforce minimum output
- Retain the configured swap fee in reserves
- Keep the initial fee at 1%
- Calculate LP token supply
- Calculate LP ownership share
- Reject wrong token IDs

Required tests:

- First liquidity sets price
- Later liquidity must be proportional
- Wrong USDT token is rejected
- Missing minimum output is rejected
- Minimum output above actual output fails
- Fees increase pool reserves
- Fee changes are bounded and versioned
- LP share accounting remains correct

This phase should not require a live Minima node.

Data boundary:

- Keep deterministic AMM state separate from UI state
- Keep trade history and analytics behind an explicit event/history interface
- Treat the current prototype history and analytics as mock data only
- Use a simple append-only event schema for swaps, adds, removes, transaction status, timestamps, prices, and LP token changes

## Phase 2: Minima Transaction Model Prototype

Use test tokens first.

Goal:

Map the AMM simulation to Minima's UTXO and script model.

Questions to answer with local-node behavior:

- How pool state is represented
- How reserve coins are controlled
- How LP tokens are minted or represented
- How a swap consumes old state and creates new state
- How token IDs are validated
- How minimum output is enforced
- What happens when two transactions spend the same pool state
- How many blocks or confirmations are required before a trade should be shown as final
- How transaction expiry behaves when referenced UTXOs are already spent
- How coin selection should exclude pending or already-committed user UTXOs
- How failed stale-state trades appear to the user
- What proof size and script limits apply to the most complex planned transaction types

Deliverables:

- Transaction shape docs
- Fake-token scripts or notes
- Local-node test scenarios
- Failure-mode notes
- Confirmation-depth recommendation for the MiniDAPP
- Pending, confirmed, failed, expired, and retry UX notes
- Proof-size and script-limit notes for future concentrated liquidity, routing, batching, and governance vote counting

## Phase 3: Single-State Test-Token Pool

Build the first real Minima test-token prototype.

Design target:

- One canonical pool state
- Sequential state updates
- No sharding
- No batching
- No oracle
- No keeper dependency
- No governance dependency for normal swaps

Required protocol functions:

- Add liquidity
- Remove liquidity
- Swap both directions
- LP token accounting
- Wrong-token rejection
- Minimum-output enforcement
- Fee retention in reserves
- Configurable fee parameter with safe bounds
- LP-holder governance path for fee updates

Governance design target:

- LP holders can vote on protocol parameters
- The first governed parameter is the swap fee
- The first contract design should reserve fee-governance fields and, if script limits allow, include fee-only LP governance from v1 so the pool can remain at the same script address
- Fee changes must be bounded, transparent, delayed, and visible in the MiniDAPP before they become active
- Governance must not be able to move user funds, bypass AMM rules, disable withdrawals, or assign a hidden fee receiver
- Governance must not be able to change token IDs, upgrade the script, create a treasury, assign a fee receiver, or alter LP withdrawal math
- The initial prototype may hard-code 1%; the contract design must not block a later governed fee schedule

UI updates:

- Replace prototype data with local pool state
- Replace prototype trade history with a local event/history data module
- Add real quote refresh
- Add stale-quote warnings
- Add transaction preview
- Add success/failure state
- Add pending transaction state and confirmation progress
- Add transaction expiry and retry flow after stale pool-state failures
- Add wallet connection and local-node status indicators
- Show current fee and any pending fee change once governance exists

Fee-change economics:

LPs vote on fees to maximize net fee income over time, not simply to maximize the fee percentage. Raising the fee increases income per unit traded but may reduce trading volume. Lowering the fee reduces income per unit traded but may attract more volume. The MiniDAPP should explain that the best fee is the one that produces the strongest sustainable fee income after accounting for volume, liquidity depth, volatility, and impermanent loss.

## Phase 4: Review And Hardening

Before any capped real-fund trial:

- Review contract logic
- Review configurable-fee bounds
- Review LP-holder governance voting rules
- Review token ID validation
- Review LP accounting
- Review swap output math
- Review stale-state behavior
- Review transaction queue, expiry, confirmation, and retry behavior
- Review MiniDAPP transaction construction
- Review risk warnings

Real USDT should begin only as a small capped trial after this phase is complete.

## Phase 5: Private Keeper Bot

After the AMM works with test tokens, design a private keeper.

The keeper may:

- Watch The Pool local state
- Watch external market data such as MEXC
- Detect price discrepancies
- Submit arbitrage trades
- Rebalance only with its own capital

The keeper must not be required for normal pool operation.

The keeper must not have privileged control over the AMM.

## Phase 6: Throughput Experiments

Only after the single-state pool is correct, explore:

- Additional token pairs beyond MINIMA / USDT
- Cross-pool swap router
- Sharded pool state
- Liquidity bins or user-selected liquidity shapes
- Individually addressable LP positions
- Non-fungible position model if concentrated liquidity becomes a target
- Multiple fee tiers
- Multi-route swaps
- Batch/intents processing
- Private aggregator
- Lending protocol beside the pools
- L2 or managed-vault design

Each path needs its own specification and threat model.
