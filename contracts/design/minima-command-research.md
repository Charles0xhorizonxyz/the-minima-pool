# Minima Command Research

## Purpose

This document tracks Minima commands, MiniDAPP/MDS calls, and local-node experiments needed before implementing The Pool contracts.

It separates confirmed official-documentation behavior from open questions that must be tested locally.

## Status

Status: draft.

This is not an implementation guide yet. It is the working research log for turning the AMM simulation into Minima transactions.

## Official References

Official Minima docs used so far:

- Simple transaction tutorial: `https://docs.minima.global/docs/development/simple-txn`
- Token tutorial: `https://docs.minima.global/docs/development/tokens`
- Scripting basics: `https://docs.minima.global/docs/development/contracts-basics`
- KISS VM functions: `https://docs.minima.global/docs/development/contracts-kissvm`
- MiniDAPP MDS JS: `https://docs.minima.global/docs/development/minidapp-mdsjs`
- MiniDAPP events: `https://docs.minima.global/docs/development/minidapp-events`
- MiniDAPP structure: `https://docs.minima.global/docs/development/minidapp-structure`

## Confirmed Transaction Commands

The official simple transaction tutorial confirms this manual transaction flow:

```text
txncreate
coins
txninput
txnoutput
txncheck
txnsign
scripts
txnbasics
txnpost
```

### `txncreate`

Creates an empty transaction shell.

Example from official docs:

```text
txncreate id:simpletxn
```

For The Pool, this is the likely starting point for building swap/add/remove transactions.

### `coins`

Lists available coins.

Official docs show each coin containing fields such as:

```text
coinid
amount
address
miniaddress
tokenid
token
storestate
state
spent
mmrentry
created
```

For The Pool, coin selection must filter by:

- token ID
- spendable/unspent status
- pending local transaction usage
- sufficient amount
- pool-state coin reference

### `txninput`

Adds an input coin by coin ID.

Example:

```text
txninput id:simpletxn coinid:<coinid>
```

Official docs also note that input proof/script data can be added with:

```text
txninput id:<id> coinid:<coinid> scriptmmr:true
```

For The Pool, inputs will include some combination of:

- pool state coin
- reserve coin(s)
- user input coin(s)
- user LP token coin(s)

### `txnoutput`

Adds an output.

Example:

```text
txnoutput id:simpletxn amount:10 address:<address>
```

The simple transaction tutorial shows that missing change outputs are treated as burn.

For The Pool, this is critical:

- every transaction must account for all token input/output balances
- accidental burns must be prevented
- change outputs must be explicit
- reserve outputs must be exact
- user outputs must satisfy minimum-output rules

Open item:

Confirm exact syntax for token-specific outputs and state-carrying outputs in current Minima.

### `txncheck`

Checks transaction validity and amounts.

Official docs show `txncheck` returning token input/output difference and validity sections:

```text
validamounts
signatures
valid.basic
valid.signatures
valid.mmrproofs
valid.scripts
```

For The Pool, this should be used before any test transaction is posted.

### `txnsign`

Signs a transaction.

Example:

```text
txnsign id:simpletxn publickey:auto
```

For The Pool:

- users sign their own wallet inputs
- pool state/reserve inputs are validated by script, not by an admin private key
- no pool admin signature should be required for normal swap/add/remove paths

Open item:

Confirm how the MiniDAPP triggers signing for user-owned inputs in a contract-backed transaction.

### `scripts`

Shows the script for an address.

Example:

```text
scripts address:<address>
```

For The Pool, this helps verify that a pool address maps to the expected pool script.

### `txnbasics`

Adds MMR proofs and scripts for a transaction.

Example:

```text
txnbasics id:simpletxn
```

Official docs also note `txnpost id:<id> auto:true` can do this in one step.

For The Pool:

- local tests should first use explicit `txnbasics`
- automation can be considered after the transaction structure is understood

### `txnpost`

Posts the transaction.

Examples:

```text
txnpost id:simpletxn
txnpost id:simpletxn auto:true
```

For The Pool:

- posted transactions may fail if the pool state was already spent
- the MiniDAPP must detect stale/failure and offer re-quote/retry
- confirmation depth must be confirmed before marking a trade final

## Confirmed Token Commands

### `tokencreate`

Official docs confirm Minima tokens are created as coloured coins.

Examples:

```text
tokencreate name:mycoin amount:1000
tokencreate amount:10 name:{"name":"newcoin","link":"http:mysite.com","description":"A very cool token"}
tokencreate name:mynft amount:10 decimals:0
```

Token details include:

```text
tokenid
confirmed
unconfirmed
sendable
total
decimals
script
```

Important confirmed behavior:

- token IDs are globally unique
- token scripts exist
- default token script is `RETURN TRUE`
- address script and token script both need to return `TRUE` when spending a token
- decimals can be set, including `decimals:0`

For The Pool:

- fake test-USDT can be created for local tests
- LP token creation mechanics must be tested
- LP token decimals should be chosen deliberately
- LP token script policy must be reviewed

Open item:

Confirm whether LP supply can be expanded after initial token creation, or whether the LP token model needs a different representation.

## Confirmed Balance / MDS Behavior

The official React MiniDAPP tutorial confirms the MDS package supports:

```text
MDS.cmd.balance()
```

The official MiniDAPP events doc confirms:

```text
MDS.cmd('balance', callback)
```

and the `NEWBALANCE` event can be used to refresh balance data.

The example balance response includes:

```text
coins
confirmed
sendable
token
tokenid
total
unconfirmed
```

The Pool prototype currently uses `MDS.cmd("balance")` and reads `sendable` balances for:

- MINIMA token ID `0x00`
- verified USDT token ID `0x7D39745FBD29049BE29850B55A18BF550E4D442F930F86266E34193D89042A90`

## Confirmed Script Functions Relevant To The Pool

The KISS VM docs list functions relevant to transaction verification:

```text
STATE(n)
PREVSTATE(n)
SAMESTATE(start end)
GETOUTADDR(n)
GETOUTAMT(n)
GETOUTTOK(n)
GETOUTKEEPSTATE(n)
VERIFYOUT(n address amount tokenid keepstate)
GETINADDR(n)
GETINAMT(n)
GETINTOK(n)
VERIFYIN(n address amount tokenid)
SUMINPUTS(tokenid)
SUMOUTPUTS(tokenid)
```

The token tutorial also shows token scripts using:

```text
ASSERT VERIFYOUT(@TOTOUT-1 0xMyAddress 1 0x00 TRUE)
```

For The Pool, the first script experiments should prove these functions can enforce:

- exact recreated pool output
- exact reserve token IDs
- exact output amounts
- no hidden fee receiver
- no unexpected reserve-token leakage
- same-state or controlled next-state rules

## Confirmed Script Limits

The KISS VM docs state:

```text
1024 instruction limit
maximum stack depth 64
maximum function parameters 32
maximum string or HEX value size 64kb
maximum HEX bit shift 256
```

For The Pool:

- V1 swap/add/remove scripts must be measured against these limits
- fee governance may need to be excluded from V1 if it pushes the script too close to limits
- concentrated liquidity, routing, and batching should not be included in the first script

## Commands To Confirm Locally

The following commands or command forms need local validation before coding the MiniDAPP transaction builder.

### Address / Script

Open questions:

- exact command to create or register a pool script address
- exact command to derive address from script
- whether `newscript` is the correct path for tracked scripts
- how `trackall:true` changes wallet tracking behavior
- how script addresses appear through `scripts`

Known command from official docs:

```text
newscript trackall:true script:"RETURN SIGNEDBY(...)"
```

Required experiment:

```text
newscript trackall:true script:"RETURN TRUE"
scripts address:<derived-address>
```

Expected outcome:

- record script
- record address
- record miniaddress
- confirm whether the address is deterministic from the script

### State Values

Open questions:

- exact command syntax for adding state to an output
- exact command syntax for preserving state
- how `storestate` behaves on outputs
- how `STATE`, `PREVSTATE`, and `SAMESTATE` behave in a simple local test

Required experiment:

1. Create a script that checks a state value.
2. Send a coin to that script with state.
3. Spend it into a new coin with changed state.
4. Verify the script can enforce allowed transition.

### Token Outputs

Open questions:

- exact `txnoutput` syntax for non-MINIMA token IDs
- exact behavior when token inputs and outputs do not balance
- whether token burns are possible accidentally in custom transactions

Required experiment:

1. Create fake USDT.
2. Build transaction sending fake USDT.
3. Build transaction that deliberately omits token change.
4. Confirm `txncheck` behavior.

### LP Token

Open questions:

- can LP token supply be minted incrementally?
- if not, should LP ownership use a different token/coin model?
- can LP token burning be verified cleanly in scripts?
- should LP tokens have decimals?
- should LP token script be restrictive or `RETURN TRUE`?

Required experiment:

1. Create a test LP token.
2. Send LP token to a user.
3. Spend/burn LP token in a controlled transaction.
4. Verify supply/accounting model.

### Pool State And Reserve Structure

Open questions:

- one pool state coin plus separate reserve coins?
- reserve coins carrying state?
- one canonical reserve coin per token?
- how many inputs/outputs are needed for a minimal swap?

Required experiments:

1. State coin only.
2. State coin plus one MINIMA reserve coin.
3. State coin plus one fake-USDT reserve coin.
4. Full fake swap with two reserves.

### Failure / Stale State

Open questions:

- exact error returned when a referenced pool state coin is already spent
- how MiniDAPP receives that failure through MDS
- whether failed transactions remain in a local pending list
- how to cleanly rebuild and retry

Required experiment:

1. Build two transactions spending the same test state coin.
2. Post the first.
3. Try to post the second.
4. Record exact response.

## First Local Experiment Sequence

Run these in order before attempting AMM logic:

1. `status`
2. `balance`
3. `coins`
4. `getaddress`
5. `newscript` with a simple script
6. Send a coin to the script address
7. Spend the script coin with `txncreate`, `txninput`, `txnoutput`, `txncheck`, `txnbasics`, `txnpost`
8. Create fake test-USDT with `tokencreate`
9. Send fake test-USDT to another address
10. Build a token-specific custom transaction
11. Add state to an output
12. Spend state coin and verify state transition
13. Test duplicate spend / stale state

## Data To Record For Each Experiment

For each command test, record:

```text
date
Minima version
network/test node setup
command
raw response
interpretation
open follow-up
```

Do not paste private keys, seed phrases, wallet credentials, or unrelated wallet data.

## Local Experiment Log

### 2026-05-25 - Local `Minimask` Node Read-Only Baseline

Environment:

- Node process: local `minima.jar`
- Base folder: `C:\Users\Charles\Documents\Crypto\Minima\Nodes\Minimask`
- Direct RPC: `http://127.0.0.1:9005`
- MDS/MiniDAPP surface: `https://127.0.0.1:9003`
- Minima version: `1.0.45.15`
- RPC mode: enabled on port `9005`
- MDS mode: enabled on port `9003`

Confirmed command transport:

```text
http://127.0.0.1:9005/status
http://127.0.0.1:9005/balance
http://127.0.0.1:9005/getaddress
http://127.0.0.1:9005/coins%20relevant:true
```

Interpretation:

- Direct local command research should use port `9005`.
- The MiniDAPP/MDS surface on port `9003` is HTTPS and uses `/mdscommand_/cmd?uid=...`.
- `uid=0x00` was rejected over MDS with HTTP 500, so local command-line research should not rely on a fake MDS UID.
- MiniDAPP integration should continue to use `MDS.cmd(...)` from the installed MiniDAPP context.

Selected `status` output:

```json
{
  "command": "status",
  "status": true,
  "response": {
    "version": "1.0.45.15",
    "locked": false,
    "chain": {
      "block": 2119896,
      "time": "Mon May 25 00:57:48 TRT 2026"
    },
    "network": {
      "connected": 2,
      "rpc": {
        "enabled": true,
        "port": 9005
      }
    }
  }
}
```

Selected `balance` findings:

- `balance` returned a MINIMA row and a USDT row.
- Confirmed USDT token ID observed locally:

```text
0x7D39745FBD29049BE29850B55A18BF550E4D442F930F86266E34193D89042A90
```

- The USDT token metadata includes:

```json
{
  "ticker": "USDT",
  "description": "USDT bridged native Minima token",
  "webvalidate": "https://mxusd.global/validation/USDT.txt",
  "external_url": "https://mxusd.global",
  "owner": "MINIMAXIA.GLOBAL.SA",
  "name": "USDT"
}
```

Selected `coins relevant:true` findings:

- The command returns individual UTXOs, including `amount`, `tokenid`, `tokenamount`, `storestate`, `state`, `spent`, `mmrentry`, `created`, and `age`.
- USDT token coins can have a very small base `amount` but a human token amount in `tokenamount`.
- Several observed USDT coins had `storestate:true` and an empty `state:[]`, confirming that token coins can carry the `storestate` flag even when no state values are present.

Open follow-up:

- Confirm exact filtering for production coin selection: `sendable:true`, `tokenid:...`, `checkmempool:true`, and whether `coins` excludes pending inputs reliably enough for wallet-side pending tracking.

### 2026-05-25 - Script Address Derivation

Command:

```text
newscript script:"RETURN TRUE" trackall:false clean:true
```

Selected response:

```json
{
  "command": "newscript",
  "status": true,
  "response": {
    "script": "RETURN TRUE",
    "address": "0x582AA40EA996419A3D8A5D26039A4E9584B746C2C26F860DAC8372BEA4457AF6",
    "miniaddress": "MxG082Z5AW0TACM86D3R2WT4Z1PKJKYGWRKDGM2DU30RB43EAVA8HBQURHCQE9V",
    "simple": false,
    "default": false,
    "publickey": "0x00",
    "track": false
  }
}
```

Confirmed:

- `newscript` derives the canonical address and Mini address from the exact script text.
- `trackall` is required by the command.
- `clean:true` normalizes the script before address derivation.
- This supports the no-admin-key model: the pool address is the script address, and spending is allowed only when the script validates.

Open follow-up:

- Confirm whether production pool scripts should be added with `trackall:true` or tracked through specific state variables / coin import flows.
- Confirm whether the final pool script must use `clean:true` before publishing the canonical address.

### 2026-05-25 - Script Dry Run And Instruction Count

Command:

```text
runscript script:"RETURN TRUE"
```

Selected response:

```json
{
  "command": "runscript",
  "status": true,
  "response": {
    "script": {
      "script": "RETURN TRUE",
      "address": "0x582AA40EA996419A3D8A5D26039A4E9584B746C2C26F860DAC8372BEA4457AF6"
    },
    "parseok": true,
    "monotonic": true,
    "success": true
  }
}
```

Trace findings:

```text
Size       : 11
Contract instructions : 2
Contract finished     : true
```

Confirmed:

- `runscript` can be used before transaction construction to validate parse success, monotonic status, script address, and instruction count.
- The trace includes the script size and executed instruction count, which should be recorded for progressively more complex AMM scripts.

Open follow-up:

- Build dry-run scripts for `VERIFYOUT`, `STATE`, `PREVSTATE`, `SAMESTATE`, and token ID checks, then record instruction counts.

### 2026-05-25 - Transaction Output State Skeleton

Commands:

```text
txncreate id:poolstatetest
txnoutput id:poolstatetest amount:0.001 address:0x582AA40EA996419A3D8A5D26039A4E9584B746C2C26F860DAC8372BEA4457AF6 storestate:true
txnstate id:poolstatetest port:0 value:pool_id_v1
txnstate id:poolstatetest port:1 value:100
txncheck id:poolstatetest
txndelete id:poolstatetest
```

Selected findings:

- `txnoutput ... storestate:true` produced an output with:

```json
{
  "amount": "0.001",
  "address": "0x582AA40EA996419A3D8A5D26039A4E9584B746C2C26F860DAC8372BEA4457AF6",
  "tokenid": "0x00",
  "storestate": true,
  "state": []
}
```

- Raw text state failed:

```text
txnstate id:poolstatetest port:0 value:pool_id_v1
```

Result:

```text
status:false
error: java.lang.NumberFormatException
```

- Numeric state succeeded:

```json
{
  "port": 1,
  "type": 2,
  "data": "100"
}
```

- `txncheck` on an intentionally unfunded skeleton showed:

```json
{
  "validamounts": false,
  "valid": {
    "basic": false,
    "signatures": true,
    "mmrproofs": true,
    "scripts": true
  }
}
```

Interpretation:

- `storestate:true` marks an output as able to store state.
- Transaction state is added with `txnstate`; the state list sits at transaction level in the `txncheck` view.
- A skeleton transaction with outputs but no inputs is useful for structure checks but correctly fails amount validation.

### 2026-05-25 - State Value Encoding

Commands:

```text
txncreate id:poolstatetest2
txnstate id:poolstatetest2 port:0 value:0x010203
txnstate id:poolstatetest2 port:1 value:[pool_id_v1]
txncheck id:poolstatetest2
txndelete id:poolstatetest2
```

Selected responses:

```json
{
  "port": 0,
  "type": 1,
  "data": "0x010203"
}
```

```json
{
  "port": 1,
  "type": 4,
  "data": "[pool_id_v1]"
}
```

Confirmed:

- Hex state values are accepted and represented as type `1`.
- Numeric state values are represented as type `2`.
- Bracketed values such as `[pool_id_v1]` are accepted and represented as type `4`.
- Raw text without brackets is not accepted as a state value.

Open follow-up:

- Decide final state encoding convention for pool fields. Numeric fields should remain numeric. IDs/labels should be encoded as hex or bracketed script/string values only if needed.
- Confirm how `STATE(port)` and `PREVSTATE(port)` return each state type inside KISSVM comparisons.

### 2026-05-25 - STATE / PREVSTATE Increment Logic

Script:

```text
RETURN STATE(0) EQ INC(PREVSTATE(0))
```

Address derived by `newscript`:

```text
0x124BA1EFB2548E2770F767A44168376752C84F1670B08ED6EA8A5FC7895338D3
MxG080W9EGUVCWKHZJN1TR7KH0MGDR7AB44U5JGM27DDQKABV3ZWKPZQE3M9WPZ
```

Command:

```text
runscript script:"RETURN STATE(0) EQ INC(PREVSTATE(0))" state:{"0":"1"} prevstate:{"0":"0"}
```

Selected result:

```json
{
  "parseok": true,
  "monotonic": true,
  "success": true
}
```

Trace confirms:

```text
State[0] : 1
PrevState[0] : 0
function:STATE returns:1
function:PREVSTATE returns:0
function:INC returns:1
Contract instructions : 7
Contract finished     : true
```

Negative test:

```text
runscript script:"RETURN STATE(0) EQ INC(PREVSTATE(0))" state:{"0":"2"} prevstate:{"0":"0"}
```

Selected result:

```json
{
  "parseok": true,
  "monotonic": true,
  "success": false
}
```

Trace confirms:

```text
State[0] : 2
PrevState[0] : 0
function:INC returns:1
Contract finished     : false
```

Confirmed:

- `STATE(port)` reads the candidate transaction state.
- `PREVSTATE(port)` reads the state on the input coin being spent.
- Numeric state values compare as expected.
- A simple monotonic state transition can be enforced with `STATE(0) EQ INC(PREVSTATE(0))`.

### 2026-05-25 - SAMESTATE Requires Start/End Range

Failed command:

```text
runscript script:"RETURN SAMESTATE(0)" state:{"0":"1"} prevstate:{"0":"1"}
```

Selected failure:

```text
SAMESTATE function requires exactly 2 parameters not 1
```

Working command:

```text
runscript script:"RETURN SAMESTATE(0 0)" state:{"0":"1"} prevstate:{"0":"1"}
```

Selected result:

```json
{
  "parseok": true,
  "success": true
}
```

Negative test:

```text
runscript script:"RETURN SAMESTATE(0 0)" state:{"0":"2"} prevstate:{"0":"1"}
```

Trace confirms:

```text
SAMESTATE FAIL [0] PREV:1 / CURRENT:2
Contract finished     : false
```

Range test:

```text
runscript script:"RETURN SAMESTATE(0 1)" state:{"0":"1","1":"2"} prevstate:{"0":"1","1":"2"}
```

Selected result:

```json
{
  "parseok": true,
  "success": true
}
```

Negative range test:

```text
runscript script:"RETURN SAMESTATE(0 1)" state:{"0":"1","1":"3"} prevstate:{"0":"1","1":"2"}
```

Trace confirms:

```text
SAMESTATE FAIL [1] PREV:2 / CURRENT:3
Contract finished     : false
```

Confirmed:

- `SAMESTATE` takes exactly two parameters: start port and end port.
- `SAMESTATE(0 0)` checks one state port.
- `SAMESTATE(0 1)` checks an inclusive range of state ports.
- This is useful for preserving all pool fields except explicitly mutable fields such as fee or reserve values.

### 2026-05-25 - Pending Script Coin Funding Observation

Command dry run:

```text
send address:0x124BA1EFB2548E2770F767A44168376752C84F1670B08ED6EA8A5FC7895338D3 amount:0.001 state:{"0":"0"} dryrun:true
```

Selected dry-run findings:

- Transaction output address was the script address.
- Output had `storestate:true`.
- Transaction state included:

```json
[
  {
    "port": 0,
    "type": 2,
    "data": "0"
  }
]
```

Posted command:

```text
send address:0x124BA1EFB2548E2770F767A44168376752C84F1670B08ED6EA8A5FC7895338D3 amount:0.001 state:{"0":"0"}
```

Observed result:

- Initial `send` response returned `status:true`.
- Initial response `txpowid` was `0x018E357D8CD56FBD3C65782A0E4FA6F9E837845A776884ED0536A92AB63FF572`.
- `history max:5` later showed the mined transaction object under `txpowid` `0x00000CD5B803FB724CF45AB6DEAD65AA5C9BC6DFDDAC003AE21B076655C30D7D`.
- The node mempool showed `1`.
- The output coin `0xAF473082127745C585934E21F9AFDBBB90E99C9015FFEFF22A7C556E4C237656` was not returned by `coins coinid:... checkmempool:true` while the transaction was pending.
- The script address was not returned by `coins address:... checkmempool:true` while the transaction was pending.

Interpretation:

- This node can accept a transaction and show it in history before the output is queryable as a spendable coin.
- The MiniDAPP must treat posted-but-unconfirmed funding outputs as pending and not assume they are available for immediate reuse.
- For state-transition spend tests, wait for confirmation or use a controlled local setup where blocks advance predictably.

Open follow-up:

- Confirm exact confirmation condition for `coins` visibility.
- Confirm whether `mine:true` or a local dev/mining setup should be used for faster contract experiments.
- Once the script coin is confirmed, spend it with `STATE(0)=1` and verify the full live transition.

Follow-up result:

- The script coin became visible after block `2120673`.
- `coins coinid:0xAF473082127745C585934E21F9AFDBBB90E99C9015FFEFF22A7C556E4C237656 checkmempool:true` returned the coin with `state[0]=0`.

### 2026-05-25 - Live State Coin Spend

Input script coin:

```text
coinid: 0xAF473082127745C585934E21F9AFDBBB90E99C9015FFEFF22A7C556E4C237656
amount: 0.001 MINIMA
address: 0x124BA1EFB2548E2770F767A44168376752C84F1670B08ED6EA8A5FC7895338D3
state[0]: 0
```

Transaction build:

```text
txncreate id:stateinc1
txninput id:stateinc1 coinid:0xAF473082127745C585934E21F9AFDBBB90E99C9015FFEFF22A7C556E4C237656
txnoutput id:stateinc1 amount:0.001 address:0x124BA1EFB2548E2770F767A44168376752C84F1670B08ED6EA8A5FC7895338D3 storestate:true
txnstate id:stateinc1 port:0 value:1
txnbasics id:stateinc1
txncheck id:stateinc1
```

`txnbasics` added:

- MMR proof for the input coin
- script witness:

```text
RETURN STATE(0) EQ INC(PREVSTATE(0))
```

`txncheck` result:

```json
{
  "validamounts": true,
  "signatures": 0,
  "valid": {
    "basic": true,
    "signatures": true,
    "mmrproofs": true,
    "scripts": true
  }
}
```

Confirmed:

- A script-controlled coin can be spent without a private-key signature when the script validates.
- The witness includes the script and MMR proof.
- `STATE(0)=1` and `PREVSTATE(0)=0` passed the script.
- The recreated coin can stay at the same script address with updated state.

Post command:

```text
txnpost id:stateinc1 auto:false
```

Initial post response:

```text
status:true
txpowid: 0x26BCAC4B985F8ABCC34D7D6B0412AD015D9FD5DA8C8AD88DC22461ADFA224E5C
```

Confirmed after block `2120676`:

```text
new coinid: 0xD5DD69A88ACFC3BFAA0C24253277E4E37EDAD2774CEF724438F71705BB10E756
state[0]: 1
old coinid no longer returned by coins
```

Production relevance:

- This is the minimal pattern for a single canonical pool-state coin.
- The pool state coin can be recreated at the same script address with updated state.
- No admin key is needed for the pool-state transition.
- The transaction builder must include `txnbasics` or equivalent MMR/script witness setup before `txncheck`/`txnpost`.

### 2026-05-25 - VERIFYOUT Output Enforcement

Script:

```text
RETURN VERIFYOUT(@INPUT @ADDRESS @AMOUNT @TOKENID TRUE)
```

Address derived by `newscript`:

```text
0xDB8C1844B9464545B94B4806CF0A5EA2779EDD8E0E8C21FBA9503275D5D2BD00
MxG086RHGC49EA68Y2RWWQ80R7GKNY2EUFDR3GEHGGVNAAG69QTBKYT03RU000N
```

`runscript` result:

- The script parses.
- `runscript` cannot fully evaluate it without transaction globals such as `@INPUT`.
- This is expected; live transaction testing is required for `VERIFYOUT`.

Funding coin:

```text
coinid: 0xCEB96520A019BDA4C5A8BE5838F47F4C5FAEA6E80868D6A1E77EC98ED8A08FCF
amount: 0.001 MINIMA
state[0]: 0
```

Valid transaction:

```text
txncreate id:verifyout_valid
txninput id:verifyout_valid coinid:0xCEB96520A019BDA4C5A8BE5838F47F4C5FAEA6E80868D6A1E77EC98ED8A08FCF
txnoutput id:verifyout_valid amount:0.001 address:0xDB8C1844B9464545B94B4806CF0A5EA2779EDD8E0E8C21FBA9503275D5D2BD00 storestate:true
txnstate id:verifyout_valid port:0 value:1
txnbasics id:verifyout_valid
txncheck id:verifyout_valid
```

`txncheck` selected result:

```json
{
  "validamounts": true,
  "signatures": 0,
  "valid": {
    "basic": true,
    "signatures": true,
    "mmrproofs": true,
    "scripts": true
  }
}
```

Invalid wrong-address transaction:

```text
txncreate id:verifyout_badaddr
txninput id:verifyout_badaddr coinid:0xCEB96520A019BDA4C5A8BE5838F47F4C5FAEA6E80868D6A1E77EC98ED8A08FCF
txnoutput id:verifyout_badaddr amount:0.001 address:0x124BA1EFB2548E2770F767A44168376752C84F1670B08ED6EA8A5FC7895338D3 storestate:true
txnstate id:verifyout_badaddr port:0 value:1
txnbasics id:verifyout_badaddr
txncheck id:verifyout_badaddr
```

`txncheck` selected result:

```json
{
  "validamounts": true,
  "signatures": 0,
  "valid": {
    "basic": true,
    "signatures": true,
    "mmrproofs": true,
    "scripts": false
  }
}
```

Confirmed:

- `VERIFYOUT(@INPUT @ADDRESS @AMOUNT @TOKENID TRUE)` verifies output index, output address, output amount, token ID, and `storestate:true`.
- A transaction can balance amounts and still fail the script when the output address is wrong.
- This is the core mechanism needed to force recreated pool-state/reserve outputs to exact addresses and values.

Post result:

```text
txnpost id:verifyout_valid auto:false
status:true
txpowid: 0x946D0BF5287DB2DCB80C41B6B8672F0EC97CCBE8FA301324798EFA7010DB5091
```

Confirmed after block `2120688`:

```text
new coinid: 0xEC1B1F274D03C6D9FB34A5231FF713D7CFDC35B5B331443DAC43F7083DC5FF74
state[0]: 1
old coinid no longer returned by coins
```

Production relevance:

- The V1 pool script can use `VERIFYOUT` to require exact recreated outputs.
- Wrong receiver/reserve addresses can be rejected at script level even if token amounts balance.
- Wrong amount, wrong token ID, wrong output index, and `storestate:false` should also be rejected by script-level checks.

### 2026-05-25 - Additional Output And Conservation Checks

These checks reused the live `VERIFYOUT(@INPUT @ADDRESS @AMOUNT @TOKENID TRUE)` coin where possible:

```text
coinid: 0xEC1B1F274D03C6D9FB34A5231FF713D7CFDC35B5B331443DAC43F7083DC5FF74
amount: 0.001 MINIMA
address: 0xDB8C1844B9464545B94B4806CF0A5EA2779EDD8E0E8C21FBA9503275D5D2BD00
```

Balanced wrong-amount transaction:

```text
input:  0.001 MINIMA from script coin
output 0: 0.0009 MINIMA to script address, storestate:true
output 1: 0.0001 MINIMA to wallet change address
```

`txncheck` selected result:

```json
{
  "validamounts": true,
  "scripts": false,
  "signatures": 0
}
```

Confirmed: `VERIFYOUT` rejects the wrong output amount even when the total transaction amount balances.

Explicit `storestate:false` transaction:

```text
input:  0.001 MINIMA from script coin
output 0: 0.001 MINIMA to script address, storestate:false
```

`txncheck` selected result:

```json
{
  "validamounts": true,
  "scripts": false,
  "signatures": 0
}
```

Confirmed: `VERIFYOUT(... TRUE)` rejects `storestate:false`.

Important nuance: omitting the `storestate` parameter on `txnoutput` locally produced an output with `storestate:true`. To make a non-state output for testing, `storestate:false` had to be passed explicitly.

Wrong token-ID transaction:

```text
script: RETURN VERIFYOUT(@INPUT @ADDRESS @AMOUNT 0x7D39745FBD29049BE29850B55A18BF550E4D442F930F86266E34193D89042A90 TRUE)
funding coin: 0.001 MINIMA
output: 0.001 MINIMA to the same script address
```

`txncheck` selected result:

```json
{
  "validamounts": true,
  "scripts": false,
  "signatures": 0
}
```

Confirmed: a hard-coded expected token ID can reject a same-amount output with the wrong token ID. This is the script-level pattern needed for wrong-USDT rejection.

Wrong output-index transaction:

```text
script: RETURN VERIFYOUT(@INPUT @ADDRESS @AMOUNT @TOKENID TRUE)
input index: 0
output 0: wallet change
output 1: recreated script output
```

`txncheck` selected result:

```json
{
  "validamounts": true,
  "scripts": false,
  "signatures": 0
}
```

Confirmed: `VERIFYOUT` checks the exact output index. For this script, `@INPUT` is `0`, so the required recreated output must be at output index `0`.

`SUMINPUTS` / `SUMOUTPUTS` conservation check:

```text
script: RETURN SUMINPUTS(0x00) EQ SUMOUTPUTS(0x00)
address: 0x101D6A48C282F7284645B8F59317C2CAF26FCAEDD6DDF1454BEA7B523540C0C1
funding coin: 0xEC768A838465DEDB84B761B3648B8A3EEF8139A06FEEA5A497D73C39782BCC31
```

Balanced transaction result:

```json
{
  "validamounts": true,
  "scripts": true
}
```

Short-output transaction result:

```json
{
  "validamounts": true,
  "scripts": false
}
```

Confirmed:

- `SUMINPUTS(tokenid)` and `SUMOUTPUTS(tokenid)` can enforce token conservation at script level.
- `txncheck.validamounts` can still be `true` when output is less than input because the difference is treated as burn.
- Therefore pool reserve conservation must be enforced explicitly in the script; it must not rely only on `txncheck.validamounts`.

Production relevance:

- Pool-state and reserve scripts can require exact recreated output amount, address, token ID, output index, and state storage.
- Reserve token conservation should use `SUMINPUTS(tokenid)` / `SUMOUTPUTS(tokenid)` or stricter output checks.
- Wrong-token rejection can be implemented at script level by hard-coding the verified token IDs.

### 2026-05-25 - State Coin Plus Separate Reserve Coin Prototype

Purpose:

Validate the working V1 structure:

```text
one canonical pool state coin
separate script-controlled reserve coin(s)
```

Tiny prototype script:

```text
RETURN ((@AMOUNT EQ 0.001 AND STATE(0) EQ INC(PREVSTATE(0)) AND VERIFYOUT(0 @ADDRESS 0.001 0x00 TRUE) AND VERIFYOUT(1 @ADDRESS 0.002 0x00 TRUE)) OR (@AMOUNT EQ 0.002 AND VERIFYIN(0 @ADDRESS 0.001 0x00) AND VERIFYOUT(1 @ADDRESS 0.002 0x00 TRUE)))
```

Script address:

```text
0x02A8BBCB4A389457F4A488A87B303130CB75124EEDB6D8399D2B9327CDC11B0C
MxG0802Y2TSMWHZWHBV9948Y1TJ0C9GPDQH4JNDMRC3J79BWCJSRG8R1HUDU9QV
```

Initial test coins:

```text
state coin:   0xFB114711D266E682297C3E7A04FAF78C8A1EDC2B82DFE2CA1671FFF2AA49EE1C
amount:       0.001 MINIMA
state[0]:     0

reserve coin: 0x7D7E1A5B7AC25B0603693B219FDA5E85BCB3F8279CF1399E748A7B0495E95398
amount:       0.002 MINIMA
state[0]:     0
```

Important script behavior:

- The first reserve-only test with a reserve coin that had no state failed even for the intended valid transaction.
- Funding the reserve coin with the same `state[0]` field made the valid transition pass.
- This suggests shared-script branch patterns should avoid missing state fields, or all pool coins using the shared script should carry the required state fields.

Valid state-plus-reserve transition:

```text
input 0:  state coin, amount 0.001, state[0]=0
input 1:  reserve coin, amount 0.002, state[0]=0
output 0: state coin, amount 0.001, state[0]=1
output 1: reserve coin, amount 0.002, state[0]=1
```

`txncheck` selected result:

```json
{
  "validamounts": true,
  "scripts": true,
  "signatures": 0,
  "inputs": 2,
  "outputs": 2,
  "burn": "0"
}
```

Invalid reserve-only movement:

```json
{
  "validamounts": true,
  "scripts": false,
  "signatures": 0,
  "inputs": 1,
  "outputs": 1,
  "burn": "0"
}
```

Invalid wrong reserve output:

```json
{
  "validamounts": true,
  "scripts": false,
  "signatures": 0,
  "inputs": 2,
  "outputs": 2,
  "burn": "0.0001"
}
```

Live post of the valid transition:

```text
txnpost id:poolpair_post_valid auto:false
status:true
txpowid: 0x4D5142DA3B59D4A7C09C95BDC4E158D91A446E09DA41EAD847F58277C0D91AC3
```

Confirmed after block `2120777`:

```text
new state coin:   0x0D36D6752936C385CB26A7D02A8DA489BF2577A08E962D2415A6C91E9404F1BD
new reserve coin: 0x78842BB742BBFC3894F835F62CD8A5FA46900EFF0EE8FA025FB6DEFCDE53D0DE
state[0]:         1
```

Nonce / sequence checks using the new state coin:

```json
[
  {
    "nextState": 2,
    "scripts": true
  },
  {
    "nextState": 1,
    "scripts": false
  },
  {
    "nextState": 3,
    "scripts": false
  }
]
```

Stale input behavior:

After posting the valid transition, trying to add the old input coins to a new transaction returned:

```text
CoinID not found : 0xFB114711D266E682297C3E7A04FAF78C8A1EDC2B82DFE2CA1671FFF2AA49EE1C
CoinID not found : 0x7D7E1A5B7AC25B0603693B219FDA5E85BCB3F8279CF1399E748A7B0495E95398
```

Confirmed:

- A state coin plus a separate reserve coin can be linked by script checks.
- The reserve coin can be made unspendable unless the expected state coin is also input `0`.
- The state coin can require exact reserve output recreation.
- The sequence can require exactly `state[n+1] = state[n] + 1`.
- A stale state reference appears at transaction-build time as `CoinID not found` when the old coin is no longer available locally.

Production relevance:

- Option A is practical for a tiny MINIMA-only prototype.
- The real AMM should continue with state coin plus separate reserve coins as the working design.
- If a shared script is used across state and reserve coins, all coins may need the same core state fields to avoid branch-evaluation issues.
- For the real two-token pool, the next experiment must repeat this with a non-MINIMA test token and verify the exact amount semantics for `VERIFYOUT` and `SUMINPUTS/SUMOUTPUTS`.

### 2026-05-25 - Test Token Creation Pending Availability

Created a fake test token:

```text
name: POOLTESTUSDT_20260525130028
provisional tokenid in creation body: 0x93F5E0CF4923E869912BF93F3DD385DC086C459305F0B58CC45E16D3BB690EE4
final tokenid in `tokens`:        0x21D1D295FEDF808703DA2D78DD8C714F3CF740DF5740D37CC232636EAEDA563D
txpowid: 0xB18F651303EEB403542FB942B086861F77E2B389C42EDCE57CB6F1FC5E77715F
amount: 1000
decimals: 8
```

Immediate send attempt:

```text
send amount:10 address:<pool-test-address> tokenid:<test-token-id> state:{"0":"1"} mine:true
```

Result:

```text
status:false
error: No Coins of tokenid:0x93F5E0CF4923E869912BF93F3DD385DC086C459305F0B58CC45E16D3BB690EE4 available!
```

Interpretation:

- `tokencreate` returned successfully, but the token coin was not immediately available under the provisional token ID seen inside the transaction body.
- The final token ID must be read from `tokens` or from the confirmed token coin, not from the provisional `0xFF`/body token object.
- The usable token ID became available as `0x21D1D295FEDF808703DA2D78DD8C714F3CF740DF5740D37CC232636EAEDA563D`.
- Token sends can temporarily make token change unavailable for follow-up sends. In one local poll, the token change became spendable after roughly 95 seconds.

### 2026-05-25 - Token Amount Semantics

Test token:

```text
tokenid: 0x21D1D295FEDF808703DA2D78DD8C714F3CF740DF5740D37CC232636EAEDA563D
decimals: 8
```

Sending `10` test tokens to a script address produced:

```text
amount:      0.00000000000000000000000000000000001
tokenamount: 10
```

Custom transaction output syntax:

```text
txnoutput id:<id> amount:10 address:<address> tokenid:<tokenid> storestate:true
```

created:

```text
amount:      0.00000000000000000000000000000000001
tokenamount: 10
```

Confirmed:

- `txnoutput amount:<n> tokenid:<id>` uses the human token amount.
- `txncheck` reports token input/output values in base coin amount under `coins`.
- Script hardcoded `VERIFYOUT` amount parameters for token outputs should use the human token amount, not the base coin amount.

Token `VERIFYOUT` test:

```text
script: RETURN VERIFYOUT(@INPUT @ADDRESS @AMOUNT @TOKENID TRUE)
coinid: 0xA2B51C4F50F1254975A763518020D331BC4ECB1213CBCD49174A965EBB42F9A8
tokenamount: 5
```

Results:

```json
[
  {
    "case": "exact 5-token recreated output",
    "scripts": true
  },
  {
    "case": "4-token script output plus 1-token wallet change",
    "validamounts": true,
    "scripts": false
  },
  {
    "case": "storestate:false",
    "validamounts": true,
    "scripts": false
  }
]
```

Token conservation test:

```text
script: RETURN SUMINPUTS(0x21D1D295FEDF808703DA2D78DD8C714F3CF740DF5740D37CC232636EAEDA563D) EQ SUMOUTPUTS(0x21D1D295FEDF808703DA2D78DD8C714F3CF740DF5740D37CC232636EAEDA563D)
coinid: 0xD0609D5C8ED440A9E40E2E97E94842AE61550F95DF72CB458DD961F47A8AAB65
tokenamount: 5
```

Results:

```json
[
  {
    "case": "5-token input, 5-token output",
    "validamounts": true,
    "scripts": true,
    "burn": "0"
  },
  {
    "case": "5-token input, 4-token output",
    "validamounts": true,
    "scripts": false,
    "burn": "0.000000000000000000000000000000000001"
  }
]
```

Confirmed:

- `SUMINPUTS(tokenid)` and `SUMOUTPUTS(tokenid)` work for non-MINIMA tokens.
- Token burns can still show `validamounts:true`, so token reserve conservation also must be script-enforced.

### 2026-05-25 - Two-Token State Coin Plus Token Reserve Coin Prototype

Purpose:

Repeat the state coin plus separate reserve coin prototype using:

```text
state coin: MINIMA
reserve coin: test token
```

Important amount rule:

The first two-token attempt hardcoded the token reserve amount as the base coin amount:

```text
0.000000000000000000000000000000000005
```

That intended valid transaction failed. The corrected script hardcoded the human token amount:

```text
5
```

Working script:

```text
RETURN ((@TOKENID EQ 0x00 AND @AMOUNT EQ 0.001 AND STATE(0) EQ INC(PREVSTATE(0)) AND VERIFYOUT(0 @ADDRESS 0.001 0x00 TRUE) AND VERIFYOUT(1 @ADDRESS 5 0x21D1D295FEDF808703DA2D78DD8C714F3CF740DF5740D37CC232636EAEDA563D TRUE)) OR (@TOKENID EQ 0x21D1D295FEDF808703DA2D78DD8C714F3CF740DF5740D37CC232636EAEDA563D AND @AMOUNT EQ 5 AND VERIFYIN(0 @ADDRESS 0.001 0x00) AND VERIFYOUT(1 @ADDRESS @AMOUNT @TOKENID TRUE)))
```

Script address:

```text
0xA167F949DC8E5B2D3DB0306DA628CFF6964752B423EF4550E21AB42F23C72F3E
```

Initial coins:

```text
state coin: 0xE6BEBF6C56BAA5470E375E72CECC3DE2D7A3FE097D11D9DD192E6B955880AE6D
amount:     0.001 MINIMA
state[0]:   0

token reserve coin: 0xCE3F31DA86B883FC0E33665C7039008FFD274B2F8F7AB1749C4E624C750CA6F3
tokenamount:        5
state[0]:           0
```

Matrix results:

```json
[
  {
    "case": "valid state plus token reserve transition",
    "validamounts": true,
    "scripts": true,
    "burn": "0"
  },
  {
    "case": "token reserve only",
    "validamounts": true,
    "scripts": false,
    "burn": "0"
  },
  {
    "case": "wrong token reserve amount",
    "validamounts": true,
    "scripts": false,
    "burn": "0.000000000000000000000000000000000001"
  },
  {
    "case": "nonce skip",
    "validamounts": true,
    "scripts": false,
    "burn": "0"
  }
]
```

Live post:

```text
txnpost id:twotoken_human_post_valid auto:false
status:true
txpowid: 0xDA0B322226C4E381AFBE13636B6D35D499FF1BE5836BDEE91D0A7F1180A5D978
```

Confirmed recreated coins:

```text
new state coin: 0xBC4A56B1DF34A83F188D97EBD7C01085E914442093C82CF320B98EB0C1E4DD47
state[0]:       1

new token reserve coin: 0xB2D21219E33B1435D7A9606068321478FB630940277701AC048B1C7218C7A72B
state[0]:              1
tokenamount:           5
```

Confirmed:

- The chosen V1 structure works with a MINIMA state coin and a separate non-MINIMA token reserve coin.
- Token reserve-only movement can be rejected.
- Wrong token reserve amount can be rejected even when `validamounts:true`.
- Token amount constants in scripts should use human token amounts.
- The prototype remains within the broad script size limit; this test script was 409 characters, but full AMM math still needs instruction/proof measurement.

### 2026-05-25 - LP Token Mint/Burn Command Research

Command help:

```text
tokencreate [name:] [amount:] (decimals:) (script:) (state:{}) (signtoken:) (webvalidate:) (burn:)
```

Relevant local help text:

```text
Create (mint) custom tokens or NFTs.
The amount is the total supply to create for the token.
```

Initial implication:

- Minima `tokencreate` mints a token supply at token creation time.
- The command surface does not show an obvious later `mint more of the same token ID` function.
- A classic AMM LP-token model that mints new fungible LP tokens on every add-liquidity action may therefore require either:
  - a pre-minted maximum LP-token supply held under a script-controlled allocation model, or
  - a different LP accounting model where pool state tracks shares/positions rather than dynamically minting more of the same token.
- Burning LP tokens appears mechanically possible by consuming LP token inputs and not recreating the full token output, but the AMM script must explicitly validate the corresponding reserve withdrawal. As with reserve tokens, burn-style amount changes must not be treated as safe unless the script enforces the exact intended accounting.

V1 decision:

```text
Use pre-minted fungible LP token supply allocated by script.
```

The unallocated LP supply must be locked under the pool script. It must not be held by an admin, deployer, operator, or treasury wallet.

### 2026-05-25 - Script Size Pressure: V1 Skeletons

Purpose:

Check whether representative V1 script shapes parse before writing the full AMM math.

Reserve-conservation skeleton:

```text
RETURN STATE(0) EQ INC(PREVSTATE(0)) AND STATE(1) GT 0 AND STATE(2) GT 0 AND STATE(3) EQ PREVSTATE(3) AND STATE(4) EQ PREVSTATE(4) AND STATE(1) * STATE(2) GTE PREVSTATE(1) * PREVSTATE(2) AND VERIFYOUT(0 @ADDRESS 0.001 0x00 TRUE) AND VERIFYOUT(1 @ADDRESS STATE(1) 0x00 TRUE) AND VERIFYOUT(2 @ADDRESS STATE(2) 0x21D1D295FEDF808703DA2D78DD8C714F3CF740DF5740D37CC232636EAEDA563D TRUE) AND SUMINPUTS(0x00) EQ SUMOUTPUTS(0x00) AND SUMINPUTS(0x21D1D295FEDF808703DA2D78DD8C714F3CF740DF5740D37CC232636EAEDA563D) EQ SUMOUTPUTS(0x21D1D295FEDF808703DA2D78DD8C714F3CF740DF5740D37CC232636EAEDA563D)
```

Result:

```text
parseok: true
monotonic: true
size: 584
```

Shared-branch state/reserve skeleton:

```text
RETURN ((@TOKENID EQ 0x00 AND @AMOUNT EQ 0.001 AND STATE(0) EQ INC(PREVSTATE(0)) AND VERIFYOUT(0 @ADDRESS 0.001 0x00 TRUE) AND VERIFYOUT(1 @ADDRESS STATE(1) 0x00 TRUE) AND VERIFYOUT(2 @ADDRESS STATE(2) 0x21D1D295FEDF808703DA2D78DD8C714F3CF740DF5740D37CC232636EAEDA563D TRUE)) OR (@TOKENID EQ 0x00 AND @AMOUNT EQ PREVSTATE(1) AND VERIFYIN(0 @ADDRESS 0.001 0x00) AND VERIFYOUT(1 @ADDRESS STATE(1) 0x00 TRUE)) OR (@TOKENID EQ 0x21D1D295FEDF808703DA2D78DD8C714F3CF740DF5740D37CC232636EAEDA563D AND @AMOUNT EQ PREVSTATE(2) AND VERIFYIN(0 @ADDRESS 0.001 0x00) AND VERIFYOUT(2 @ADDRESS STATE(2) 0x21D1D295FEDF808703DA2D78DD8C714F3CF740DF5740D37CC232636EAEDA563D TRUE)))
```

Result:

```text
parseok: true
monotonic: true
size: 662
```

Notes:

- These are parse and size checks only, not full valid transaction checks.
- The final AMM script still needs exact swap math, minimum-output checks, add/remove-liquidity branches, LP accounting, fee bounds, and possibly dormant governance fields.
- The early size numbers show that script size and instruction pressure must be measured continuously. If full V1 logic becomes too large, the design should split operations into separate scripts or move non-critical features out of V1.

## MiniDAPP Integration Notes

The current static MiniDAPP already includes `mds-2.1.0.js`.

Current confirmed MiniDAPP command call:

```javascript
MDS.cmd("balance", callback)
```

Future transaction builder needs to confirm whether to use:

```javascript
MDS.cmd("txncreate ...", callback)
MDS.cmd("txninput ...", callback)
MDS.cmd("txnoutput ...", callback)
MDS.cmd("txncheck ...", callback)
MDS.cmd("txnsign ...", callback)
MDS.cmd("txnbasics ...", callback)
MDS.cmd("txnpost ...", callback)
```

or whether newer MDS helper APIs should be preferred.

## Immediate Next Task

Build the smallest complete swap script prototype with:

- exact reserve-output checks
- token conservation checks
- constant-product / no-free-withdrawal check
- fee accounting
- user minimum-output enforcement
- stale-state rejection
