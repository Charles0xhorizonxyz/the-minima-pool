# Pool State Transaction Model

## Purpose

This document defines the first working transaction model for The Pool before contract-backed implementation begins.

It is intentionally a design document, not production contract code.

The goal is to make the V1 MINIMA / USDT AMM transaction shape explicit enough for Minima developer review and local-node testing.

## Current Review Status

Status: draft.

This model is based on current project requirements, official Minima scripting documentation, and local Minima node experiments. It still needs a full AMM script prototype before test-token implementation.

Official Minima references used:

- Scripting basics: `https://docs.minima.global/docs/development/contracts-basics`
- KISS VM functions: `https://docs.minima.global/docs/development/contracts-kissvm`
- Coin Flip state example: `https://docs.minima.global/docs/development/layer1/coinflip`
- MiniDAPP structure: `https://docs.minima.global/docs/development/minidapp-structure`

## Confirmed Minima Mechanics From Docs

Minima uses a UTXO model.

Every coin is associated with a script. When the coin is used as a transaction input, its script must explicitly return `TRUE` or the transaction is invalid.

The default owner script is signature-based, but custom pool coins can be controlled by custom scripts instead of by one private key.

Minima scripts can read transaction context and state through values and functions such as:

- `@INPUT`
- `@AMOUNT`
- `@ADDRESS`
- `@TOKENID`
- `@TOTIN`
- `@TOTOUT`
- `STATE(n)`
- `PREVSTATE(n)`
- `SAMESTATE(start end)`
- `GETOUTADDR(n)`
- `GETOUTAMT(n)`
- `GETOUTTOK(n)`
- `GETOUTKEEPSTATE(n)`
- `VERIFYOUT(n address amount tokenid keepstate)`
- `GETINADDR(n)`
- `GETINAMT(n)`
- `GETINTOK(n)`
- `VERIFYIN(n address amount tokenid)`
- `SUMINPUTS(tokenid)`
- `SUMOUTPUTS(tokenid)`

Official docs also state current script constraints that matter for The Pool:

- 1024 instruction limit
- maximum stack depth 64
- maximum function parameters 32
- maximum string or HEX value size 64kb
- maximum HEX bit shift 256

These limits must be audited before including fee governance or any future concentrated-liquidity logic in the same script.

## V1 Scope

The first real pool should be:

- one MINIMA / USDT pair
- one canonical pool state
- full-range constant-product AMM
- fungible LP tokens
- 1% initial fee
- no admin key
- no fee receiver
- no treasury
- no upgrade key
- no oracle
- no keeper dependency
- no sharding
- no batching

The verified USDT token ID is:

```text
0x7D39745FBD29049BE29850B55A18BF550E4D442F930F86266E34193D89042A90
```

## Core Design Principle

Pool funds must move because the transaction satisfies the pool script, not because one operator signs with a pool private key.

Users sign only for their own wallet coins and LP tokens.

The pool script enforces whether the pool state transition is valid.

## Conceptual Pool State

The pool state should contain at least:

```text
pool_version
pool_nonce_or_sequence
minima_reserve
usdt_reserve
verified_usdt_token_id
lp_token_id
lp_total_supply
fee_bps
fee_min_bps
fee_max_bps
pending_fee_bps
pending_fee_activation_block
last_fee_vote_block
```

Only some of these may be practical in V1 depending on script size and state encoding limits.

The minimum V1 state is:

```text
pool_version
pool_nonce_or_sequence
minima_reserve
usdt_reserve
verified_usdt_token_id
lp_token_id
lp_total_supply
fee_bps
```

## V1 Working Structural Direction

The current V1 working direction is Option A: one canonical pool state coin plus separate reserve coins.

This is now the preferred model for local-node experiments and first contract design because it keeps the state authority explicit while keeping MINIMA and USDT reserves separated by token.

The remaining question is not whether Option A is preferred; it is whether local Minima tests show that Option A can be implemented within script, proof, input, and output limits without weakening reserve safety.

If Option A proves too heavy or awkward, the fallback is a combined state/reserve design. That fallback should only happen after concrete local-node evidence.

### Option A: One State Coin Plus Separate Reserve Coins

Concept:

```text
Pool state coin:
  token: MINIMA or dedicated marker token
  amount: minimal value
  script: pool script
  state: reserves, LP supply, fee, token IDs

Reserve coins:
  MINIMA reserve coin(s)
  USDT reserve coin(s)
  controlled by pool script or locked to pool address
```

Potential benefits:

- state coin can be small and explicit
- reserve movement may be easier to reason about by token
- reserve UTXOs can be separated by token

Risks / questions:

- can the script reliably verify all reserve inputs and outputs?
- can the state coin enforce that reserve coins are recreated correctly?
- can reserve coins be consumed without the state coin, or must scripts prevent that?
- how many inputs/outputs are needed per operation?

### Option B: Reserve Coins Also Carry State

Concept:

```text
MINIMA reserve coin:
  script: pool script
  state: pool state

USDT reserve coin:
  script: pool script
  state: pool state
```

Potential benefits:

- reserves are directly script-locked
- state travels with reserve coins

Risks / questions:

- duplicated state can diverge unless tightly enforced
- every operation may need to verify same-state behavior across multiple coins
- input/output count may grow quickly

### Option C: One Canonical Pool Coin Per Token, One Is State Authority

Concept:

```text
MINIMA reserve coin:
  script: pool script
  state authority

USDT reserve coin:
  script: pool script
  verified against state authority
```

Potential benefits:

- fewer state authorities
- reserves remain script controlled

Risks / questions:

- asymmetric design may be harder to audit
- still needs strict verification of both reserve outputs

## Current Recommendation

Use Option A as the working V1 model:

- one canonical state coin
- separate script-controlled reserve coin(s)
- reserve inputs and outputs verified explicitly
- no state transition is valid unless the state coin is consumed and recreated
- no reserve coin can move unless its script also validates the same pool transition

Before production scripts, local tests must prove:

- the state coin can force exact next-state output creation
- reserve coins can only be spent as part of a valid pool transition
- MINIMA and verified-USDT reserve conservation is enforced by script logic
- fake USDT cannot enter the reserve path
- no output can redirect reserves, fees, or LP value to an operator
- input/output count and proof size remain practical

## Pool Address Derivation

Open item.

We need to confirm the exact Minima command/API path for deriving a pool address from a script.

Expected concept:

```text
pool_script -> pool_address
```

The pool address must be deterministic from the script. Users should be able to verify that the address corresponds to the published script.

Implementation questions:

- which command derives the address from script?
- does the MiniDAPP need to generate it or read a deployed pool address?
- how should the address be displayed for review?
- can address derivation differ depending on MAST/script form?

## Swap Transaction Model

### User Goal

Swap one token into the pool and receive the other token out.

The user provides:

```text
input_token
input_amount
minimum_output
recipient_address
accepted_pool_state_reference
```

### Inputs

Conceptual inputs:

```text
1. Current pool state coin
2. Current pool reserve coin(s)
3. User input coin(s)
```

The user signs only the user input coin(s).

The pool script authorizes the pool state/reserve transition.

### Outputs

Conceptual outputs:

```text
1. Next pool state coin
2. Updated MINIMA reserve coin(s)
3. Updated USDT reserve coin(s)
4. User output coin
5. User change coin(s), if needed
```

### Required Script Checks

For a MINIMA to USDT swap, the script must verify:

- input token is MINIMA
- output token to user is verified USDT token ID
- user input increases MINIMA reserves by full input amount
- USDT reserves decrease only by calculated output
- output is at least `minimum_output`
- fee is retained in reserves
- next state has incremented sequence/nonce
- verified USDT token ID is unchanged
- LP token ID is unchanged
- LP total supply is unchanged
- fee is unchanged unless a valid fee-governance transition is active
- no output pays a fee receiver, treasury, admin, or operator
- no reserve is sent to an arbitrary address

For a USDT to MINIMA swap, mirror the token checks:

- input token must exactly match the verified USDT token ID
- output token to user is MINIMA
- fake USDT is rejected
- MINIMA reserve decreases only by calculated output
- USDT reserve increases by full input amount

### AMM Math

For input amount `amount_in`:

```text
amount_in_with_fee = amount_in * (10000 - fee_bps) / 10000
amount_out = amount_in_with_fee * output_reserve / (input_reserve + amount_in_with_fee)
```

The actual script may need integer-safe scaled math. Decimal and rounding policy must be defined before implementation.

Required rounding direction:

- output should round down in favor of the pool
- minimum-output check must use the rounded actual output
- fee retention must not accidentally leak value from reserves

## Add Liquidity Transaction Model

### User Goal

Deposit MINIMA and USDT and receive LP tokens.

### First Liquidity

The first liquidity provider sets the initial price.

V1 initial LP issuance target:

Set the initial circulating LP token amount as close as practical to the initial total pool value expressed in USDT, so the starting display value is close to `1 USDT` per LP token.

Because the first LP sets the pool price, the initial MINIMA side value equals the initial USDT side value:

```text
initial_total_pool_value_usdt = initial_usdt_deposit * 2
initial_lp_released = initial_total_pool_value_usdt * lp_display_scale
```

If LP token decimals allow whole-token readability and `lp_display_scale = 1`, then:

```text
initial_lp_released = initial_usdt_deposit * 2
```

Example:

```text
first deposit: 10,000 MINIMA + 90 USDT
initial price: 0.009 USDT per MINIMA
initial pool value: 180 USDT
initial LP released: 180 LP
initial display value: about 1 USDT per LP
```

The exact decimal scale must be chosen before token creation. It should make wallet display readable while preserving enough precision for small deposits and withdrawals.

V1 decision:

```text
LP token decimals = 8
lp_display_scale = 1
```

This means the first deposit example releases:

```text
180.00000000 LP
```

Remaining initialization questions:

- who creates the initial pool state coin?
- what maximum fixed LP token supply should be created?
- what minimum initial liquidity should be required to avoid dust pools?
- should a small minimum LP amount be locked forever, or is that unnecessary on Minima?

### Later Liquidity

Later liquidity must be proportional to current reserves.

Required checks:

- MINIMA input amount and USDT input amount match the current reserve ratio within exact integer rules
- non-proportional deposits are rejected
- LP tokens released are proportional to existing circulating LP supply
- verified USDT token ID is exact
- next reserves equal previous reserves plus deposits
- next circulating LP supply equals previous circulating supply plus released LP tokens
- no unrelated token is accepted

Conceptual formula:

```text
lp_released_by_minima = minima_deposit * circulating_lp_supply / minima_reserve
lp_released_by_usdt = usdt_deposit * circulating_lp_supply / usdt_reserve
lp_released = min(lp_released_by_minima, lp_released_by_usdt)
```

V1 should avoid accepting one-sided leftovers. If the deposit is not proportional, reject rather than refunding a partial deposit.

## Remove Liquidity Transaction Model

### User Goal

Return LP tokens to the pool-controlled unallocated LP reserve and receive proportional MINIMA and USDT.

Inputs:

```text
1. Current pool state coin
2. Current reserve coin(s)
3. User LP token coin(s)
```

Outputs:

```text
1. Next pool state coin
2. Updated reserve coin(s)
3. MINIMA output to user
4. USDT output to user
5. LP change coin, if user spent more LP than returned
```

Required checks:

- LP token ID matches pool state
- LP return amount is greater than zero
- user receives proportional reserve outputs
- reserves decrease by exactly the withdrawn amounts
- circulating LP supply decreases by exactly returned amount
- verified USDT token ID is unchanged
- no admin or operator path can withdraw reserves

Conceptual formula:

```text
minima_out = minima_reserve * lp_returned / circulating_lp_supply
usdt_out = usdt_reserve * lp_returned / circulating_lp_supply
```

Rounding must be deterministic and should not overpay the withdrawing LP.

## LP Token Model

V1 decision:

Use pre-minted fungible LP tokens locked by the pool script.

Local command research confirmed that `tokencreate` creates a token with a total supply at creation time. The command surface does not show an obvious later "mint more of the same token ID" function. Therefore V1 should avoid depending on dynamic additional minting of the same LP token ID.

Concept:

```text
LP token:
  token: The Pool MINIMA/USDT LP
  decimals: 8
  supply: fixed maximum supply created at initialization
  image/metadata: branded Pool LP token icon and description

LP reserve coin:
  token: LP token
  amount: unallocated LP token supply
  script: pool script

Circulating LP supply:
  tracked in pool state as allocated/released LP supply
```

The unallocated LP supply must never be held by an admin wallet. It must be controlled by the same non-custodial pool script logic that controls reserves.

The circulating LP supply should be treated as a canonical state variable, not as something the MiniDAPP computes by scanning wallets.

Equivalent accounting identity:

```text
circulating_lp_supply = max_lp_supply - script_locked_unallocated_lp_supply
```

For safety, the pool state should store the circulating value and the script should also verify that the unallocated LP reserve output changes by the exact opposite amount during add/remove liquidity. That gives two checks:

- pool state says how many LP tokens are currently active
- LP reserve output proves the unused supply was reduced or increased correctly

The MiniDAPP can display circulating supply from pool state and may cross-check it against the script-locked unallocated LP coin. It should not use third-party token circulation estimates for protocol logic.

### LP Token Value

The value of one LP token is derived from the pool, not fixed by the token itself.

Conceptual display formula:

```text
total_pool_value = minima_reserve * external_or_display_price + usdt_reserve
lp_token_value = total_pool_value / circulating_lp_supply
```

For protocol withdrawal math, the external price is not needed. The redeemable claim is:

```text
minima_claim_per_lp = minima_reserve / circulating_lp_supply
usdt_claim_per_lp = usdt_reserve / circulating_lp_supply
```

The MiniDAPP can display an estimated USDT value per LP token for user understanding, but the contract should redeem against actual pool reserves, not against an external price feed.

The initial LP token value may be intentionally scaled to start near `1 USDT` for readability, but this must not be presented as a peg or guarantee. The value can rise as swap fees remain in reserves and can fall versus holding the two assets when price movement and impermanent loss dominate.

### Liquidity And Transferability

Because the LP token is a real fungible token, users may be able to send it to another wallet or trade it elsewhere.

That is acceptable if the contract treats the token holder as the owner of the liquidity claim. The UI must explain that sending LP tokens transfers the right to redeem the corresponding share of pool reserves.

The pool contract must care only that the correct LP token ID is returned or burned during remove-liquidity. It should not depend on the original liquidity provider being online.

### Add Liquidity With Pre-Minted LP Supply

Add liquidity consumes:

```text
current pool state coin
current reserve coins
pool-controlled unallocated LP token coin
user MINIMA deposit
user USDT deposit
```

It creates:

```text
next pool state coin
updated reserve coins
updated unallocated LP token coin
LP token output to user
user change outputs, if needed
```

Required checks:

- deposit is proportional to current reserves
- released LP amount matches the deposit formula
- circulating LP supply increases by released LP amount
- unallocated LP supply decreases by released LP amount
- new circulating LP supply equals previous circulating LP supply plus released LP amount
- new unallocated LP supply equals previous unallocated LP supply minus released LP amount
- LP token ID is unchanged
- no operator/admin output receives LP tokens

### Remove Liquidity With Pre-Minted LP Supply

Remove liquidity consumes:

```text
current pool state coin
current reserve coins
user LP token coin
possibly pool-controlled unallocated LP token coin
```

It creates:

```text
next pool state coin
updated reserve coins
MINIMA output to user
USDT output to user
either burned LP amount or increased unallocated LP reserve
LP change output, if user spent more than redeemed
```

For V1, the preferred accounting is to return redeemed LP tokens to the pool-controlled unallocated LP reserve rather than permanently burn them. This avoids exhausting a fixed maximum supply over time and keeps the circulating LP supply equal to the currently allocated LP supply.

Required checks:

- returned LP token ID matches pool state
- redeemed LP amount is greater than zero
- user receives exactly the proportional reserve withdrawal after deterministic rounding
- circulating LP supply decreases by redeemed LP amount
- unallocated LP supply increases by redeemed LP amount, or the script explicitly validates a burn path
- new circulating LP supply equals previous circulating LP supply minus redeemed LP amount
- new unallocated LP supply equals previous unallocated LP supply plus redeemed LP amount
- no reserve withdrawal is possible without the LP return/burn check

Safety requirement:

No one may mint LP tokens without depositing proportional reserves.

No one may withdraw reserves without burning valid LP tokens.

In the pre-minted model, "mint" means "release from the script-locked unallocated LP supply."

### Branding And Metadata

The LP token should have clear metadata and a branded image so it is recognizable in the wallet.

Name direction:

```text
The Pool MINIMA/USDT LP
```

Display copy:

```text
Represents a proportional claim on The Pool MINIMA/USDT reserves. Its value changes with pool reserves, fees, and market prices.
```

The token image should be generated as a separate asset and reviewed before test-token launch.

### Future Migration To Liquidity Bins

This V1 model does not block a later liquidity-bin system, but bins will likely require a new script/address and a new position model.

V1 LP tokens should represent only the full-range MINIMA/USDT pool. A future bin-based pool should not pretend to be the same position. Migration can be offered as a user action:

```text
withdraw V1 full-range liquidity
deposit into V2/V3 bin position
receive new bin-specific position token/coin
```

This is acceptable because concentrated liquidity changes the economic meaning of the position.

### Managed Strategy / Maximize Research

Maximize integration should remain a separate managed-strategy research topic.

The project should not plan a simple LP time-lock reward module for now.

The V1 pool should not require staking and should not send LP funds into an external yield protocol by default.

If a managed strategy is researched later:

- the user must explicitly opt in
- the strategy must have separate accounting from the AMM
- external protocol risk must be disclosed separately
- the strategy must not gain privileged control over pool reserves
- strategy rewards must not change base AMM reserve accounting
- Does Maximize introduce custody, strategy, smart-contract, liquidation, or oracle risk?
- How are staking rewards funded without creating a hidden fee receiver or reserve drain?
- How does the UI prevent users from confusing AMM LP fee income with external strategy yield?

Until these are answered, Maximize integration should remain planning-only.

Maximize-specific understanding:

If only MINIMA can be deposited into Maximize, then locking an LP token cannot directly generate a Maximize MINIMA deposit while keeping the same liquidity active in The Pool. The LP token represents a claim on both MINIMA and USDT reserves; the underlying MINIMA is not individually available unless the LP position is removed or a separate strategy supplies its own MINIMA.

Possible future structures:

1. Strategy vault:
   - user deposits LP token
   - vault removes liquidity
   - vault deposits received MINIMA into Maximize
   - vault holds, swaps, or manages the USDT side
   - user no longer has the same direct AMM LP exposure during the lock

The strategy-vault path is materially different from simple LP staking and needs its own specification, risk disclosure, accounting model, and review.

## Fee-Only Governance Hook

V1 may reserve fields for fee governance:

```text
fee_bps
pending_fee_bps
pending_fee_activation_block
last_fee_vote_block
```

But normal swap/add/remove paths must not depend on governance.

Governance must never control:

- reserve movement
- token IDs
- LP withdrawal math
- script upgrades
- treasury assignment
- fee receiver assignment

Open question:

Can fee-only governance be included in the first script without exceeding instruction/proof limits or making the AMM harder to review?

If not, V1 should hardcode the fee and reserve state fields for a later new-script migration.

## Stale State And Sequencing

Because V1 uses one canonical pool state, every swap/add/remove must reference the current pool state.

If another transaction spends that state first, the user's transaction becomes stale.

MiniDAPP behavior:

- refresh pool state before preview
- include the accepted state reference in the transaction build
- submit transaction
- if stale/fails, show "pool updated before your transaction confirmed"
- offer re-quote at the new price
- do not silently resubmit with a new price

## Pending User UTXOs

The MiniDAPP must track user coins selected for pending transactions.

Rules:

- do not reuse pending user coins
- do not treat pending change as spendable
- refresh balances after confirmation or failure
- show insufficient spendable balance if confirmed balance exists but spendable coin selection fails

This belongs in the MiniDAPP transaction builder, but the contract design must assume malformed or duplicate attempts can happen and reject invalid transactions.

## Output Verification Requirements

Before implementation, confirm exact script usage for:

- `VERIFYOUT`
- `GETOUTAMT`
- `GETOUTTOK`
- `GETOUTADDR`
- `GETOUTKEEPSTATE`
- `SUMINPUTS`
- `SUMOUTPUTS`
- `SAMESTATE`
- `STATE`
- `PREVSTATE`

The first local-node experiments should prove the pool script can verify:

- exact reserve outputs
- exact token IDs
- exact user output amount
- exact recreated pool state
- no unexpected extra outputs for reserve tokens
- no hidden fee receiver output

## Invalid Transaction Rejection Matrix

The contract-backed prototype must reject:

- wrong USDT token ID
- missing minimum output
- output below minimum
- non-proportional liquidity add
- remove without valid LP token
- remove more LP than owned
- zero amount
- negative or malformed amount before transaction construction
- stale pool state
- unexpected token IDs
- unexpected reserve output address
- unexpected LP mint
- unexpected fee receiver
- changed verified USDT token ID
- changed LP token ID

Some of these are UI/builder validation; the critical fund-safety rules must be script enforced.

## Local-Node Experiment Plan

Create a companion research log:

```text
contracts/design/minima-command-research.md
```

First experiments:

1. Derive an address from a simple script.
2. Create a coin with state values.
3. Spend a state coin and verify `STATE`, `PREVSTATE`, and `SAMESTATE`.
4. Verify one output using `VERIFYOUT`.
5. Verify token-specific totals using `SUMINPUTS` and `SUMOUTPUTS`.
6. Create a test token.
7. Send and reject wrong-token test cases.
8. Test a simple one-step state transition.
9. Measure script instruction/proof behavior for a draft swap script.

## Current Recommendation Before Coding

Do not write production pool scripts yet.

Next work:

1. Decide the V1 LP accounting model.
2. Write a minimal swap-state script using test tokens.
3. Measure script size, instruction, input/output, and proof pressure.
4. Test stale-state and retry behavior with the minimal swap script.
5. Only then map add/remove liquidity and LP accounting to Minima transactions.
