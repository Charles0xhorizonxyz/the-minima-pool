# Security Review And Attack Surface

The Pool should invite technical review before any real-fund launch.

The priority is safety: no admin custody, no hidden withdrawal path, no fake-token acceptance, no LP accounting failure, and no transaction path that can move reserves without satisfying the pool script.

## Review Status

Current status:

```text
prototype / design review
```

No production pool contract has launched.

## White-Hat Review Request

Reviewers are encouraged to try to break the design and report issues before any capped real-fund trial.

High-value review questions:

- Can reserves move without a valid state transition?
- Can a reserve coin be spent without consuming the current state coin?
- Can a fake USDT token enter the pool?
- Can an output burn or redirect pool reserves while still passing generic transaction validity?
- Can LP tokens be released without proportional deposits?
- Can reserves be withdrawn without returning or burning valid LP tokens?
- Can a stale pool-state transaction execute against the wrong price?
- Can transaction ordering create an unfair or unsafe result?
- Can malformed inputs, dust, or token decimals break accounting?
- Can script size, proof size, or instruction limits force weaker checks?
- Can a UI bug construct a transaction the script accepts but the user did not intend?

## Main Attack Surface

### Pool Script

The pool script is the primary security boundary.

It must enforce:

- exact token IDs
- exact reserve outputs
- exact next state
- minimum swap output
- no hidden fee receiver
- no admin withdrawal path
- LP token release and redemption rules

### Token Handling

The verified USDT token ID must be hardcoded and checked by script.

The LP token ID must be fixed in pool state and checked by script.

### UTXO Sequencing

The first version uses one canonical pool state, so transactions are sequential. Stale-state failures must be expected and handled cleanly.

### LP Accounting

V1 uses a pre-minted script-locked LP token supply. The unallocated supply must not be held by an operator.

Reviewers should focus on whether LP tokens can be released, redirected, or redeemed incorrectly.

### MiniDAPP Transaction Builder

The UI must not be trusted for fund safety, but it can still harm users by constructing wrong transactions.

It must handle:

- slippage
- stale quotes
- pending UTXOs
- wrong token IDs
- over-balance inputs
- confirmation and failure states

## Disclosure

Until a formal process exists, security issues should be reported privately to the project maintainer before public disclosure.

Public exploit demonstrations against real users or real funds are not acceptable.
