# Throughput And Scaling

## Baseline Model

The first AMM should use one canonical pool state.

In a UTXO-style design, a pool-state-changing trade consumes the current pool state and creates the next pool state. Any other transaction built against the same old state conflicts or becomes stale.

Practical consequence:

- Trades are sequential
- Quotes can become stale
- Users need minimum-output protection
- Users need explicit slippage tolerance settings
- Pending pool-state transactions need clear status
- Failed stale trades should be easy to re-quote and retry

This is acceptable for v0.0.1 beta because safety is more important than throughput.

## What Minimum Received Does

Minimum received does not increase capacity.

It protects the user from bad execution if another transaction changes the pool reserves before their transaction settles.

The contract must enforce:

```text
actual_output >= user_minimum_output
```

If not, the transaction fails.

The MiniDAPP should calculate minimum received from the user's selected slippage tolerance:

```text
minimum_received = quoted_output * (1 - slippage_tolerance)
```

The slippage tolerance must be visible before confirmation.

## UTXO-Specific Risks

In Minima's UTXO model, both user funds and pool state are represented by spendable coins. A transaction can become invalid if any referenced coin has already been spent.

Canonical UTXO management reference:

```text
docs/utxo-management.md
```

Specific design requirements:

- Coin selection must exclude user UTXOs that are already pending in another transaction
- Change outputs from pending transactions should not be treated as confirmed spendable funds
- The pool-state UTXO should be treated as a sequencing point for the first AMM
- A transaction built against an old pool state should expire or fail cleanly if the pool state moves first
- The UI should offer a fresh quote and retry path after stale-state failure
- Confirmation depth must be verified against official Minima docs and local-node behavior before real trading

## UI Requirements For Sequential Trading

The MiniDAPP should eventually show:

- Current reserves
- Quote timestamp or state reference
- Expected output
- Minimum received
- Selected slippage tolerance
- Price impact
- Pool fee
- Pending, confirmed, failed, and expired transaction states
- Warning that pool state may change before confirmation
- Clear retry path after stale-state failure

## Scaling Path 1: Better Client Flow

Before changing the contract model, improve client behavior:

- Refresh reserves before preview
- Refresh reserves before submit
- Warn if quote is old
- Let users quickly re-quote failed trades
- Keep slippage settings explicit
- Track pending user coins locally until confirmation or failure
- Avoid building a second transaction from the same pending UTXO

This should be the first throughput-adjacent improvement.

## Scaling Path 2: Private Keeper

A private keeper can monitor external venues and trade against the pool when the pool price diverges.

The keeper is not a protocol dependency.

The keeper can help price alignment, but it does not remove AMM state contention.

## Scaling Path 3: Sharded Pool State

The pool can be split into multiple independent shards:

```text
Shard A: MINIMA / USDT reserves
Shard B: MINIMA / USDT reserves
Shard C: MINIMA / USDT reserves
```

Trades touching different shards can potentially execute in parallel.

Benefits:

- Higher possible throughput
- Less contention per shard

Costs:

- Fragmented liquidity
- More complex pricing
- Need route selection
- Need LP accounting per shard or pooled accounting over shards
- Need arbitrage between shards
- More contract and UI complexity

Do not implement this in v0.0.1 beta.

## Scaling Path 3B: Liquidity Bins Or Concentrated Liquidity

Liquidity can later be split into bins or ranges so LPs choose the shape of their liquidity instead of providing full-range liquidity.

Benefits:

- Better capital efficiency
- LPs can express price-range views
- More competitive execution near active price ranges

Costs:

- LP positions are no longer simple fungible full-range shares
- Position accounting becomes individually addressable
- Fee accounting becomes range-specific
- UI and risk disclosure complexity increases significantly
- The pool script and address likely need to change

This is a new-script/new-pool-address evolution unless the v1 script deliberately includes the full position model from the beginning, which is not recommended for the first AMM.

## Scaling Path 4: Batch / Intent Layer

Users can submit intents:

```text
Swap X for at least Y before expiry Z
```

A batch executor then processes many intents into one pool update.

Benefits:

- More user orders can be represented in one settlement
- Potentially better UX under contention

Costs:

- Ordering rules
- Expiry handling
- Cancellation handling
- Keeper/executor availability
- Possible trust assumptions
- Complex testing

Do not implement this in v0.0.1 beta.

## Scaling Path 5: L2 Or Managed Vault

A higher-throughput off-chain or semi-off-chain layer is a separate product.

It requires:

- Deposit mechanism
- Off-chain accounting
- Withdrawal mechanism
- Operator/sequencer rules
- Data availability model
- Emergency exit path
- Fraud-proof, validity-proof, multisig, or trust model
- Legal and security review

This should not be part of the first AMM.

## Scaling Path 6: Multi-Pair Router

Future pools can support pairs beyond MINIMA / USDT.

Each pair should be its own pool with its own:

- Pool script address
- Reserve state
- LP token
- Fee state
- Risk profile

A router can later find a swap path across multiple pools. This improves available liquidity but increases complexity:

- More stale-state failure points
- Slippage across several pools
- More transaction inputs and outputs
- More UTXO selection pressure
- Need pathfinding and quote comparison

Do not implement routing before the first single-pair pool is correct.

## Scaling Path 7: Lending Beside Pools

A lending protocol can be considered later as a separate product layer.

It should not share the first AMM script because lending requires different rules for collateral, liquidation, interest rates, bad debt, and price references. Any lending integration should have its own specification, scripts, tests, and risk review.

## Current Recommendation

Build in this order:

1. Single-state AMM simulation
2. Test-token Minima prototype
3. Quote refresh and stale-state UX
4. Private keeper bot
5. Additional pair research
6. Cross-pool router research
7. Sharding research
8. Batch/intents research
9. Lending protocol research
10. L2/vault research

The first implementation should leave architectural room for growth but avoid implementing scaling mechanisms before the core AMM is correct.
