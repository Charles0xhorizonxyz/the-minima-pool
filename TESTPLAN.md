# Test Plan

## Scope

This test plan covers the expected behavior for The Pool before capped real-fund use.

Early tests use fake test tokens before any capped real-fund trial.

## Test Principles

- Test the pool rules independently from the UI.
- Test MiniDAPP transaction construction separately from contract enforcement.
- Treat UI validation as convenience only.
- Treat on-chain validation as the source of truth.
- Verify all token IDs exactly.
- Include failure cases for every user action.

## Core Test Areas

### Token Validation

Verify that the system:

- Accepts only the verified USDT token ID
- Rejects fake USDT tokens
- Rejects malformed token IDs
- Rejects missing token IDs
- Displays the verified token ID clearly in the UI

Verified USDT token ID:

```text
0x7D39745FBD29049BE29850B55A18BF550E4D442F930F86266E34193D89042A90
```

### Add Liquidity

Test:

- First liquidity deposit initializes reserves
- First liquidity deposit sets the initial price
- UI warns that the first depositor sets the price
- Later deposits must match the current reserve ratio
- Non-proportional later deposits are rejected
- Expected LP tokens are calculated correctly
- Pool share after deposit is calculated correctly

### Remove Liquidity

Test:

- LP tokens are burned
- User receives proportional MINIMA and USDT reserves
- Pool reserves decrease correctly
- LP token supply decreases correctly
- Remaining LP position is calculated correctly
- Removing more LP tokens than owned is rejected

### Swap MINIMA to USDT

Test:

- MINIMA input increases MINIMA reserve
- USDT output decreases USDT reserve
- 1% fee remains in the pool
- Only 99% of input is used for output calculation
- Minimum USDT output is enforced
- Swap fails when output is below minimum
- Price impact is displayed

### Swap USDT to MINIMA

Test:

- USDT input increases USDT reserve
- MINIMA output decreases MINIMA reserve
- 1% fee remains in the pool
- Only 99% of input is used for output calculation
- Minimum MINIMA output is enforced
- Swap fails when output is below minimum
- Price impact is displayed

### Fee Accounting

Test:

- There is no fee receiver address
- There is no treasury address
- There is no manual fee claim mechanism
- Fees increase reserve value
- LP token value increases as fees accumulate

### Slippage

Test:

- Every swap requires a minimum output
- Missing minimum output is rejected
- Minimum output below expected succeeds
- Minimum output above actual output fails
- UI shows expected output, minimum received, pool fee, and price impact

### Risk Warnings

Verify that the UI and documentation disclose:

- Experimental status
- Smart contract risk
- MiniDAPP implementation risk
- Fake token risk
- Low liquidity risk
- High slippage risk
- Impermanent loss
- First liquidity price manipulation
- Possible transaction ordering risk if relevant to Minima execution
- User error
- Loss of funds

## Phase Gates

### Phase 0 Exit

Documentation exists and clearly defines:

- Scope
- Security assumptions
- Token ID handling
- AMM model
- Fee model
- LP model
- Test plan
- Deployment plan

### Phase 1 Exit

The test-token prototype passes:

- Add liquidity tests
- Remove liquidity tests
- Swap tests in both directions
- Fee accounting tests
- Wrong-token rejection tests
- Slippage rejection tests

### Phase 2 Exit

The local MiniDAPP prototype demonstrates:

- Pool overview
- Reserves
- Swap panel
- Add liquidity panel
- Remove liquidity panel
- LP position view
- Risk warnings
- Verified token ID display

### Phase 3 Exit

Community review has been requested and findings have been tracked.

### Phase 4 Entry

Start a small capped real-fund trial only after review findings are tracked and current limits are clearly documented.
