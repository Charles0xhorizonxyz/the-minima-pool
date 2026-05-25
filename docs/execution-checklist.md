# Execution Checklist

## Purpose

This checklist tracks everything needed to execute The Pool plan.

Priority order:

1. Frontend and socials
2. Repository and backup process
3. Pure AMM simulation
4. Minima transaction model
5. Test-token backend
6. Review and hardening

## 1. Frontend

### Current Status

- [x] Local static MiniDAPP prototype exists
- [x] Served locally at `http://127.0.0.1:8096/`
- [x] Two-tab UI: Swap and Add liquidity
- [x] Swap direction button exists
- [x] Token icons are local assets
- [x] Pool stats appear under the swap button
- [x] Historical trades appear only on the swap tab
- [x] Liquidity analytics appear on the add-liquidity tab
- [x] Visible version is `v0.0.1 beta`
- [x] Visible project links exist for GitHub, X, and Telegram
- [x] USDT bridge link uses distinct orange styling and hover copy
- [x] Swap slippage tolerance setting exists
- [x] Clicking outside the slippage tolerance settings closes it
- [x] Minimum received is derived from selected slippage tolerance
- [x] Swap validation accepts auto-calculated output
- [x] Swap balance validation blocks over-balance input
- [x] Trade history uses non-ambiguous timestamps
- [x] Prototype pending/success feedback exists after confirming a swap
- [x] Clicking outside modal overlays closes them
- [x] Latest release folder exists at `2_development/releases/latest/`

### Frontend To Do

- [x] Finalize exact Minima official icon asset
- [x] Confirm USDT icon licensing/source
- [x] Add mobile QA pass before public review package
- [x] Add desktop QA pass before public review package
- [x] Verify no text overlap at narrow widths
- [x] Confirm header links fit on supported desktop sizes
- [x] Confirm social links are hidden or usable on mobile
- [ ] Replace prototype trade data with local mock-state module
- [ ] Replace prototype liquidity analytics with local mock-state module
- [ ] Keep mock data isolated from real pool state and wallet state
- [ ] Add compact staged-development note in a minimal UI location
- [ ] Add wallet connection/local-node status indicator
- [ ] Verify transaction pending / success / failure states against real MDS behavior
- [ ] Verify required Minima confirmation depth for final trade status
- [x] Add MiniDAPP packaging validation for `dapp.conf`
- [x] Package current MiniDAPP into `2_development/releases/latest/`
- [x] Confirm Minima MiniDAPP required files and permissions against official docs
- [ ] Re-check official MiniDAPP package requirements before contract-backed beta

### Frontend Later

- [x] Connect prototype to local Minima MDS for real MINIMA and verified USDT balances
- [x] Read wallet balances for MINIMA and verified USDT
- [ ] Read pool reserves
- [ ] Quote swap from live reserves
- [ ] Preview transaction details
- [ ] Submit transaction
- [ ] Display pending state
- [ ] Display success state
- [ ] Display stale quote / failed transaction state
- [ ] Add remove liquidity UI once protocol prototype exists

## 2. Socials

### Targets

- [x] Public repo exists: `Charles0xhorizonxyz/the-minima-pool`
- [ ] Optional future GitHub organization/account exists: `0xhorizonxzy`
- [x] X handle exists: `theminimapool`
- [x] Telegram handle/channel/group exists: `theminimapool`

### Link Targets

```text
https://github.com/Charles0xhorizonxyz/the-minima-pool
https://x.com/theminimapool
https://t.me/theminimapool
```

### Social Setup To Do

- [ ] Optional: create GitHub org/account while logged in as `Charles0xhorizonxyz`
- [x] Create public project repository
- [ ] Add repository description
- [ ] Add repository topics
- [x] Add README status showing staged development and current limits
- [x] Add README document guide
- [x] Add technical review brief for Minima developer review
- [x] Add long-term V1 to V3+ vision document
- [x] Create X profile or handle
- [x] Prepare X profile setup copy and settings
- [x] Create Telegram channel or group
- [x] Prepare Telegram setup copy and settings
- [x] Add matching branding and icon
- [ ] Confirm public materials describe what The Pool is
- [ ] Confirm links from dapp open correctly
- [ ] Publish security review / white-hat review scope before real-fund launch

## 3. Repository Hygiene

### Current Status

- [x] Local folder is a git repository
- [x] Public project repo is created
- [x] Public README explains staged development and review status
- [x] Public/private local folder boundary has been defined

### Public Repository

Public project repo:

```text
https://github.com/Charles0xhorizonxyz/the-minima-pool
```

### Public Sharing Requirements

- [ ] Public repo must use `2_development/` as its source tree
- [ ] Public repo must not include `0_handshake/`, `1_working_files/`, or `3_archive/`
- [ ] Public repo must not include private backup operations
- [ ] Public repo must not include local machine paths, personal credentials, wallet files, seed phrases, private keys, or node secrets
- [ ] Public repo must include docs, MiniDAPP prototype, contract placeholder, simulation, tests, and release notes after sanitization

## 4. Backend Preparation

### Pure AMM Simulation

- [x] Create simulation module
- [x] Keep simulation state separate from UI state and event/history state
- [x] Define token constants
- [x] Define pool state model
- [x] Implement initialize pool
- [x] Implement add liquidity
- [x] Implement remove liquidity
- [x] Implement swap MINIMA to USDT
- [x] Implement swap USDT to MINIMA
- [x] Implement 1% fee retention
- [ ] Design configurable fee bounds
- [ ] Design LP-holder DAO voting for fee changes
- [x] Implement LP share accounting
- [x] Implement minimum-output checks
- [x] Implement fake USDT rejection
- [x] Test wrong USDT token rejection
- [x] Test LP token accounting
- [x] Test over-balance / invalid input behavior in UI prototype
- [x] Add unit tests

### Minima Transaction Model

- [ ] Verify current official Minima docs
- [x] Verify local Minima node behavior
- [x] Consolidate UTXO management reference document
- [x] Create `contracts/design/pool-state-transaction-model.md`
- [x] Create `contracts/design/minima-command-research.md`
- [x] Confirm how a pool address is derived from a script
- [x] Confirm how reserve/state values can be stored in coin state
- [x] Confirm how scripts verify required outputs and output values
- [x] Confirm exact Minima script functions available for output checks
- [x] Confirm wrong output amount fails at script level even when transaction amounts balance
- [x] Confirm wrong output token ID fails at script level
- [x] Confirm wrong output index fails at script level
- [x] Confirm `storestate:false` fails when `VERIFYOUT(... TRUE)` is required
- [x] Confirm `SUMINPUTS(tokenid)` / `SUMOUTPUTS(tokenid)` can enforce token conservation
- [x] Choose V1 working structure: one state coin plus separate reserve coins
- [x] Validate that one state coin plus separate reserve coins is practical on Minima for a tiny MINIMA-only prototype
- [x] Prove reserve coins cannot move without a valid state transition
- [x] Prove state transition cannot pass without exact reserve outputs
- [ ] Keep combined state/reserve coin design as fallback only if tests require it
- [x] Repeat state-plus-reserve test with a non-MINIMA test token reserve
- [x] Confirm token amount semantics for `VERIFYOUT`, `SUMINPUTS`, and `SUMOUTPUTS`
- [x] Confirm short non-MINIMA token outputs can show `validamounts:true` while failing script checks
- [x] Confirm `tokencreate` command surface for initial LP-token minting research
- [x] Choose V1 LP accounting model: pre-minted script-locked fungible LP token supply
- [ ] Confirm LP token mint or allocation mechanics
- [ ] Confirm LP token burn or withdrawal mechanics
- [ ] Store circulating LP supply as canonical pool state
- [ ] Cross-check circulating LP supply against script-locked unallocated LP reserve
- [x] Choose LP token decimals and `lp_display_scale`: 8 decimals, scale 1
- [ ] Confirm first-liquidity LP release formula targets about 1 USDT per LP token
- [ ] Design LP token metadata and image asset
- [ ] Display estimated value per LP token in the MiniDAPP
- [ ] Display redeemable MINIMA and USDT per LP token in the MiniDAPP
- [x] Run first script-size check for representative V1 skeletons
- [ ] Confirm script size, instruction, and proof-size limits for V1 transactions
- [ ] Identify state UTXO design
- [ ] Identify reserve coin control design
- [ ] Identify user coin-selection rules for pending UTXOs and change outputs
- [ ] Identify LP token model
- [ ] Identify transaction construction flow
- [ ] Test same-state double-spend/stale-trade behavior
- [ ] Test transaction expiry when pool state moves before confirmation
- [ ] Determine how many blocks or confirmations are required before a trade is final
- [ ] Document failure and retry path

### Test-Token Prototype

- [ ] Create fake test-USDT
- [ ] Use fake/token-safe MINIMA handling
- [ ] Implement add liquidity with fake tokens
- [ ] Implement remove liquidity with fake tokens
- [ ] Implement swaps with fake tokens
- [ ] Reject wrong token IDs
- [ ] Reject wrong USDT token ID in script, not only UI
- [ ] Enforce minimum output
- [ ] Reject over-balance, zero, negative, and malformed inputs before transaction construction
- [ ] Verify fee accounting
- [ ] Verify fee changes cannot bypass bounds
- [ ] Verify LP-holder governance cannot move funds or bypass AMM rules
- [ ] Verify LP accounting

## 5. Architecture Decisions To Preserve

- [x] Decide whether v0.0.1 stays with fungible LP tokens only
- [x] Document that individually addressable LP positions are a later requirement if concentrated liquidity is pursued
- [x] Define a simple append-only event schema for swaps, adds, removes, timestamps, prices, and transaction status
- [x] Decide initial pool UTXO sequencing UX: first-come-first-served with stale-state retry, queued UI, or batching research
- [ ] Keep fee-vote copy focused on LP net fee income, not simply higher fee percentage
- [ ] Audit Minima proof size and script limits before concentrated liquidity, routing, batching, or governance vote counting

## 6. Future Scaling Tracks

- [ ] Concentrated liquidity research
- [ ] Liquidity bins / user-selected liquidity-shape research
- [ ] Multi-pool routing research
- [ ] Real governance execution design
- [ ] Private keeper bot specification
- [ ] MEXC reference-price watcher
- [ ] Keeper trade policy
- [ ] Indexer implementation
- [ ] Complex transaction queue UI research
- [ ] Sharded pool-state research
- [ ] Batch/intents research
- [ ] Public market-maker vault logic specification
- [ ] Maximize managed-strategy research
- [ ] L2/vault research

None of these should block the first single-state AMM prototype.
