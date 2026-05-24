# The Pool Specification

## 1. Scope

The Pool is a 0xHorizon open-source Minima MiniDAPP for a decentralized MINIMA / USDT liquidity pool.

The Pool uses dedicated repositories, branding, wallets, contracts, liquidity, deployment accounts, and operational processes.

This specification describes the intended behavior for the project before production smart contract development begins.

## 2. Design Constraints

The Pool must operate as a local MiniDAPP with:

- No website dependency
- No backend server
- No centralized database
- No centralized matching engine
- No centralized liquidity manager
- No custodian
- No admin wallet
- No upgrade key
- No hidden fee receiver

The MiniDAPP UI may help users construct transactions. It must not be trusted to enforce pool rules. The on-chain contract logic must enforce the rules.

## 3. Initial Pair

The initial trading pair is MINIMA / USDT.

Verified USDT token ID:

```text
0x7D39745FBD29049BE29850B55A18BF550E4D442F930F86266E34193D89042A90
```

USDT description from wallet:

```text
USDT bridged native Minima token
```

The application must reject every token that does not exactly match the verified USDT token ID.

## 4. Liquidity Model

The Pool uses a constant-product invariant:

```text
x * y = k
```

Where:

- `x` is the MINIMA reserve
- `y` is the USDT reserve
- `k` is the invariant product

The implied price is the current reserve ratio.

Example:

```text
100,000 MINIMA / 10,000 USDT = 0.10 USDT per MINIMA
```

## 5. Fee Model

Trading fee:

```text
1%
```

The fee remains inside the pool reserves. It is not transferred to any external wallet.

For swaps:

- 100% of the input enters the pool
- 99% of the input is used for the output calculation
- 1% remains in reserves as LP value

LPs benefit through LP token value appreciation, not through separate fee claims.

## 6. LP Token Model

LP tokens represent ownership of the pool.

If a user owns 10% of the LP token supply, the user owns 10% of the pool reserves.

When liquidity is removed, LP tokens are burned and the user receives a proportional share of:

- MINIMA reserves
- USDT reserves

## 7. Add Liquidity

Users deposit MINIMA and USDT.

For the first liquidity deposit:

- The depositor sets the initial price
- The UI must show a clear first-liquidity warning

For later deposits:

- Deposits must be proportional to the current reserve ratio
- Non-proportional deposits must be rejected

The UI should show:

- MINIMA amount
- USDT amount
- Implied price
- Expected LP tokens
- Pool share after deposit
- First-liquidity warning when relevant

## 8. Remove Liquidity

Users burn LP tokens and receive a proportional share of reserves.

The UI should show:

- LP tokens burned
- Expected MINIMA received
- Expected USDT received
- Remaining LP position
- Pool share before withdrawal
- Pool share after withdrawal

## 9. Swap MINIMA to USDT

Users input MINIMA and receive USDT.

The 1% fee is retained inside the pool.

The transaction must include a minimum USDT output. The transaction must fail if output is below the minimum.

## 10. Swap USDT to MINIMA

Users input USDT and receive MINIMA.

The 1% fee is retained inside the pool.

The transaction must include a minimum MINIMA output. The transaction must fail if output is below the minimum.

## 11. Slippage Protection

Every swap must include a user-defined or user-accepted minimum output amount.

The UI should show:

- Expected output
- Minimum received
- Price impact
- Pool fee
- Final warning before transaction confirmation

## 12. Required Protections

The implementation must include:

- Hardcoded verified USDT token ID
- Fake USDT rejection
- Slippage protection on every swap
- Minimum output enforcement on every swap
- Proportional liquidity deposits after initialization
- Clear first-liquidity warning
- No admin wallet
- No upgrade key
- No hidden fee receiver
- No custody outside the pool contract
- No server dependency
- No website dependency
- No external price oracle for v1
- Clear impermanent loss warnings
- Clear low-liquidity and price-impact warnings

## 13. Out of Scope for Phase 0

Phase 0 must not include production smart contract code.

The next implementation step should be a test-token prototype using fake tokens only.
