# Architecture

## Overview

The Pool is intended to be a local Minima MiniDAPP for a decentralized MINIMA / USDT liquidity pool.

The Pool is a 0xHorizon open-source project using dedicated repositories, branding, wallets, contracts, liquidity, deployment accounts, and operational processes.

## System Boundaries

The intended architecture has three parts:

- Local MiniDAPP interface
- Local Minima node interaction through the MiniDAPP system
- On-chain pool logic that enforces the AMM rules

The implementation should keep three data layers separate:

- On-chain contract state: pool reserves, LP supply, token IDs, fee parameters, and active state references
- Event/history state: indexed swaps, adds, removes, timestamps, prices, and transaction outcomes
- UI state: form inputs, selected slippage tolerance, modal state, pending transaction status, and local warnings

The event/history layer should begin as a simple append-only interface. It should be designed early because trade history, analytics, portfolio tracking, and LP performance all depend on consistent event fields.

The MiniDAPP must not depend on:

- Hosted websites
- Hosted backend servers
- Centralized databases
- Centralized matching engines
- Centralized liquidity managers
- Custodians
- Admin wallets

## MiniDAPP Responsibilities

The local MiniDAPP should:

- Display pool reserves
- Display implied price
- Display LP ownership share
- Display the verified USDT token ID
- Help users prepare add-liquidity transactions
- Help users prepare remove-liquidity transactions
- Help users prepare swaps
- Require user-selected or accepted minimum output amounts
- Let users choose slippage tolerance and derive minimum received from that tolerance
- Show pending, confirmed, failed, expired, and retry states for transactions
- Show wallet and local-node connection status before real transaction submission
- Show risk warnings before users confirm actions

The MiniDAPP must not be the trusted enforcement layer.

## Contract Responsibilities

The on-chain pool logic must enforce:

- Verified USDT token handling
- Constant-product AMM behavior
- 1% swap fee retained in reserves
- LP token minting and burning rules
- Proportional liquidity deposits after initialization
- Minimum output checks
- Rejection of invalid swaps
- Rejection of fake USDT tokens

Production contract code is not part of Phase 0.

## Trust Model

Users should trust only the rules enforced on-chain.

The UI can be wrong, outdated, or manipulated. Therefore, the contract design must reject invalid transactions even if the MiniDAPP attempts to construct them.

## Throughput Model

The v0.0.1 beta architecture should assume a single canonical pool state.

In a UTXO-style model, each pool-state-changing trade consumes the current pool state and creates the next state. This means trades are effectively sequential at first, and stale quotes must be protected by minimum-output checks.

The wallet side also needs UTXO-aware coin selection. Pending user coins must be treated as unavailable until their transaction confirms or fails, because a second transaction that references the same coin can become invalid.

The architecture should leave room for future throughput paths such as sharded pool state, batching, and a separate L2 or vault design, but those should not be implemented before the single-state AMM is correct.

Detailed UTXO reference:

```text
docs/utxo-management.md
```

## Fee Governance Economics

The purpose of fee governance is to help LPs maximize sustainable net fee income. A higher fee can produce more fee income per traded unit, but it can also reduce trading volume if users route elsewhere or avoid trading. A lower fee can increase volume, but each trade contributes less to reserves. The UI should describe fee changes as an LP tradeoff between fee rate, volume, liquidity depth, volatility, and impermanent loss rather than presenting higher fees as automatically better.

## Fee Governance Safety

The first contract design should reserve fee-governance fields and, if Minima script limits allow, include fee-only LP governance from v1 so the pool can remain at the same script address.

Governance must be limited to `fee_bps`.

Governance must not be able to:

- Move reserves
- Change the verified USDT token ID
- Change withdrawal rules
- Disable swaps
- Disable liquidity removal
- Assign a fee receiver
- Create a treasury
- Upgrade or replace the pool script
- Mint LP tokens without deposits
- Bypass AMM, slippage, or LP accounting rules

Fee changes should be bounded by script-enforced constants:

- Initial fee: `100 bps`
- Maximum change per vote: `25 bps`
- Vote cadence: once every 3 months
- Activation delay: required before a passed fee change becomes active
- Minimum and maximum fee bounds: hardcoded in the script

If fee governance is tricked or behaves unexpectedly, the intended worst case should be limited to an allowed fee change. It must not compromise reserve custody or user withdrawal rights.

## Pool State Compatibility

The v1 pool state should leave room for future fee governance without allowing broad upgrades.

Conceptual state fields:

```text
pool_version
pool_mode
minima_reserve
usdt_reserve
verified_usdt_token_id
lp_token_id
lp_total_supply
fee_bps
fee_min_bps
fee_max_bps
fee_change_limit_bps
fee_epoch
fee_epoch_length_blocks
fee_activation_delay_blocks
pending_fee_bps
pending_fee_activation_block
governance_mode
```

Same-script evolutions are only possible when the v1 script already contains the relevant rule path. If a future feature requires changing core reserve accounting, LP position semantics, or throughput structure, it should use a new script address and a deliberate migration path.

## Evolution Compatibility

Likely same-pool compatible if included in the v1 script:

- Fee-only LP governance
- Fee bounds and quarterly fee cadence
- Fee activation delay
- Better quote freshness and stale-state retry UX
- Event indexing and analytics
- Private keeper trading with the keeper's own funds
- UTXO maintenance for user or keeper wallets

Likely new script or new pool address:

- Additional token pairs beyond MINIMA / USDT
- Cross-pool router for swaps that take liquidity across multiple pools
- Concentrated liquidity
- Liquidity bins or user-selected liquidity shapes
- Individually addressable LP positions
- Non-fungible LP positions
- Multiple fee tiers
- Sharded pool state
- Batch/intents settlement
- Multi-hop routing
- L2 or managed-vault design
- Lending protocol built beside the pools
- Any change that alters reserve custody, LP withdrawal math, token identity, or core AMM invariant

Users should not be promised that all future features will attach to the same pool. The v1 goal is to keep the safest full-range AMM stable while reserving narrow same-pool room for fee governance only.

## Same-Pool Compatible Support Layers

Event indexing and analytics means a watcher records public pool activity such as swaps, adds, removes, prices, volumes, fees, LP positions, and timestamps. This powers history, charts, portfolio views, and public dashboards. It should not be trusted custody infrastructure. If the indexer is offline or wrong, the pool script should still work.

Better stale-state UX means the MiniDAPP handles UTXO contention clearly. If a user builds a transaction against an old pool state and another transaction updates the pool first, the app should show the failure, refresh reserves, rebuild the quote, and let the user retry with a new minimum received.

Private keeper trading with own funds means an independent wallet can watch external markets and trade against The Pool when prices diverge. The keeper is just another trader. It has no privileged access, no right to move pool reserves, and no control over user funds.

User or keeper UTXO maintenance means wallets can split, merge, and reserve their own coins so transactions are easier to build. This can use practical denominations and pending-coin tracking. It must not manage or custody pool reserves.

## Multi-Pair And Routing Direction

The first pool is MINIMA / USDT. Later versions can add other pairs as separate pools, each with its own script address, reserves, LP token, and risk profile.

A router can later search across multiple pools to execute a swap path, for example:

```text
TOKEN_A -> MINIMA -> USDT
```

or:

```text
TOKEN_A -> USDT -> TOKEN_B
```

The router should not custody funds. It should construct a transaction or transaction sequence that satisfies each pool script independently. Multi-pool routing should be treated as a separate protocol layer because it increases quote, slippage, stale-state, and transaction-construction complexity.

## Lending Protocol Direction

A lending protocol can be built beside The Pool in the long term, but it should not be part of the first AMM script.

Lending introduces separate risks:

- Collateral valuation
- Liquidation rules
- Interest-rate model
- Bad debt
- Oracle or reference-price assumptions
- Cross-protocol contagion
- More complex user disclosures

If lending is added later, it should use its own specification, scripts, state model, and risk review. It can integrate with pool prices or LP assets only after the AMM is stable and reviewed.

## Future LP Position Model

The v0.0.1 beta can use simple fungible LP tokens for a single full-range pool.

If The Pool later targets concentrated liquidity, boosted positions, fee tiers, or time-weighted rewards, LP positions may need to become individually addressable. That likely means a position-record or non-fungible position model rather than only one fungible LP token supply. This should remain a later design track and should not complicate the first AMM.

The architecture decision for v0.0.1 is fungible full-range LP tokens first. Individually addressable positions are a new-script/new-pool-address direction unless the first script deliberately includes the full position model, which is not recommended for the first AMM.

## Confirmation And Expiry

The MiniDAPP should not mark a trade final until the required Minima confirmation depth is verified against official docs and local-node behavior.

Transactions can become stale if another transaction consumes the pool-state UTXO first, or if selected user UTXOs are already pending in another transaction. The UI should handle this explicitly:

1. Pending while submitted
2. Confirmed when enough blocks or confirmations have passed
3. Failed if validation fails
4. Expired or stale if referenced state has moved
5. Retry with a refreshed quote and updated minimum received

## No Admin Control

The Pool must not include:

- Admin wallet
- Upgrade key
- Hidden fee receiver
- Treasury
- Manual fee claim path
- Centralized pool manager

## Data Flow

Expected high-level flow:

1. User opens the local MiniDAPP.
2. MiniDAPP reads local pool state.
3. MiniDAPP displays reserves, price, LP position, verified token ID, and warnings.
4. User prepares an action.
5. MiniDAPP calculates expected values and constructs a transaction.
6. User reviews risks and confirms.
7. On-chain logic validates and executes or rejects the transaction.
