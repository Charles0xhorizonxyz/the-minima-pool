# UTXO Management

## Purpose

This document is the reference for The Pool's UTXO management and throughput assumptions.

The Pool is being designed for Minima, where coins are UTXOs. A transaction can become invalid if it tries to spend a coin that has already been spent or is already committed to a pending transaction.

The UTXO topic has two separate parts:

- User and keeper coin management
- Pool-state throughput management

Good coin management helps wallets build reliable transactions. It does not by itself remove the throughput limit of a single pool-state UTXO.

## Baseline v0.0.1 Direction

The v0.0.1 contract design should use one canonical pool state.

This is the safest first design because every pool-state-changing transaction consumes the current pool state and creates the next pool state. The tradeoff is that swaps are sequential at first.

Required v0.0.1 behavior:

- Use one canonical pool state
- Build robust stale-state handling
- Track pending user UTXOs
- Do not reuse pending coins
- Detect fragmented or dust-like balances where practical
- Make failed or stale trades easy to re-quote and retry
- Enforce minimum output on every swap

## User And Keeper Coin Management

Users and keepers need coin selection that understands pending state.

Coin states to track conceptually:

```text
confirmed_available
reserved_for_transaction
pending_spent
pending_change
confirmed_spent
dust
```

Rules:

- Use confirmed available coins for new transactions
- Mark selected coins as reserved while building a transaction
- Mark submitted input coins as pending spent
- Do not spend pending change until it confirms
- Release reserved coins if transaction construction is cancelled
- Re-scan wallet state after confirmation or failure

The worst coin-selection bug is spending the same UTXO twice while the first transaction is still pending.

## Denomination Strategy

Later, a wallet or keeper tool can split and merge operational coins.

Use a 1-2-5 denomination ladder per order of magnitude:

```text
0.1, 0.2, 0.5
1, 2, 5
10, 20, 50
100, 200, 500
1000, 2000, 5000
```

Guidelines:

- Keep denominations per token
- Maintain separate MINIMA denominations and USDT denominations
- Pick sizes based on observed swap, add, and remove amounts
- Consolidate dust below a minimum useful threshold
- Avoid creating too many outputs in one transaction
- Avoid unnecessary splitting before real usage data exists

This tool must never custody user funds or manage pool reserves with privileged control. It can only help a wallet or keeper manage its own coins.

## Pool-State UTXO Bottleneck

If the AMM has one pool-state UTXO, the pool still processes swaps sequentially.

Splitting user or keeper coins into useful denominations helps transaction construction, but it does not let two swaps spend the same pool state at the same time.

For v0.0.1, accept this bottleneck and make the UX clear:

- Refresh reserves before preview
- Refresh reserves before submit
- Warn when quotes are old
- Fail safely when the pool state has moved
- Re-quote and retry after stale-state failure

## Transaction Queue And Expiry

The first pool can use a first-come-first-served sequencing model.

If two transactions try to consume the same pool-state UTXO, only one can succeed. The other becomes stale or invalid because its referenced input was already spent.

The MiniDAPP should make this explicit:

- Show pending while a transaction is submitted
- Treat referenced user UTXOs as unavailable while pending
- Treat the referenced pool state as stale if another transaction updates it first
- Show expired or stale status when the transaction can no longer execute
- Offer a retry with refreshed reserves, refreshed quote, and refreshed minimum received

Future versions may add a queue, batch executor, or intent layer. Those are separate throughput designs and should not be hidden inside the v0.0.1 UX.

## Event Indexing Interface

Trade history, analytics, portfolio tracking, and LP performance should use an event/history layer separate from contract state and UI state.

The first indexer can be a simple append-only watcher.

Minimum event fields:

```text
event_id
event_type
pool_id
pool_state_before
pool_state_after
transaction_id
block_height
timestamp
actor_address
token_in
amount_in
token_out
amount_out
fee_bps
fee_amount
price_before
price_after
lp_tokens_minted
lp_tokens_burned
status
```

Event types:

```text
pool_initialized
liquidity_added
liquidity_removed
swap
fee_vote_started
fee_vote_cast
fee_change_queued
fee_change_activated
transaction_failed
transaction_expired
```

The indexer must not be trusted to enforce pool rules. It can be wrong or offline without compromising the pool.

## LP Position Model Decision

The first AMM should use fungible full-range LP tokens.

This keeps v0.0.1 simpler:

- One LP token supply
- Proportional share of reserves
- Proportional remove-liquidity math
- Easier test-token prototype

Future features such as concentrated liquidity, boosted positions, multiple fee tiers, or time-weighted rewards likely require individually addressable LP positions.

That may mean:

- Position records
- Non-fungible LP positions
- Range-specific accounting
- Position-specific fee accounting
- New pool script and address

Do not force this complexity into the first AMM unless script limits and review show it is safe.

## Proof Size And Script Limits

Minima script and transaction proof size limits must be audited before implementing advanced features.

The likely worst future cases are:

- Concentrated-liquidity add with range parameters
- Multi-hop routing across several pools
- Batch settlement with many intents
- Governance vote counting with many LP participants
- Sharded pool rebalance

If a transaction type becomes too large or complex, split it into multiple transactions or move the feature to a separate script/design.

This audit is required before level 3-4 features.

## Future Capacity Paths

To increase pool transaction capacity, The Pool eventually needs one of these paths.

## Path 1: Single Pool State, Better UX

This is the v0.0.1 path.

Benefits:

- Safest first implementation
- Smallest contract surface
- Easier review
- Clear accounting

Costs:

- Sequential swaps
- Stale quote failures under contention
- Lower maximum throughput

## Path 2: Sharded Pool State

Several pool UTXOs each hold their own reserves.

Trades can hit different shards in parallel.

Benefits:

- Higher possible throughput
- Less contention per shard

Costs:

- Fragmented liquidity
- More complex pricing
- Route selection required
- LP accounting per shard or pooled accounting across shards
- Arbitrage needed between shards
- More contract and UI complexity

This is a V2+ research path.

## Path 3: Batch Or Intent System

Users submit intents:

```text
Swap X for at least Y before expiry Z
```

A batch executor settles many intents into fewer pool updates.

Benefits:

- More orders represented in fewer state updates
- Potentially cleaner than random sharding
- Better UX under contention if designed well

Costs:

- Ordering rules
- Expiry handling
- Cancellation handling
- Executor availability
- More complex testing
- Possible trust assumptions if not carefully designed

This is a V2+ research path.

## Path 4: Keeper-Assisted Routing

A keeper can help route, rebalance shards, or retry stale quotes.

The keeper must not be trusted protocol infrastructure.

Allowed:

- Trade with its own funds
- Submit arbitrage trades
- Rebalance its own positions
- Help observe stale-state opportunities

Not allowed:

- Move pool reserves with privilege
- Custody user funds
- Override AMM rules
- Bypass slippage checks
- Control withdrawals

## Path 5: Higher-Layer Design

Longer-term capacity could come from an L2, managed vault, or other higher-layer design.

This would be a separate product with its own:

- Deposit mechanism
- Withdrawal mechanism
- Accounting model
- Operator or sequencer rules
- Data availability model
- Emergency exit path
- Legal and security review

Do not include this in the first AMM.

## Current Recommendation

For v0.0.1:

- Use one canonical pool state
- Build robust stale-state handling
- Track pending user UTXOs
- Do not reuse pending coins
- Detect fragmented or dust-like balances where practical
- Make failed or stale trades easy to re-quote and retry

For V2 capacity:

- Research sharded pool UTXOs
- Research batch or intent settlement
- Use denomination-style UTXO management for user and keeper coins
- Measure actual average trade size before choosing denomination sizes
- Avoid any central manager with custody or privileged control
