# The Pool

Time for a splash.

The Pool is a 0xHorizon open-source project for a decentralized MINIMA / USDT liquidity pool on Minima.

The Pool is distributed as a Minima MiniDAPP. It is designed to run locally through Minima rather than through a hosted website or centralized application server.

The Pool uses dedicated repositories, branding, wallets, contracts, liquidity, deployment accounts, and operational processes.

## Status

Current version:

```text
v0.0.1 beta
```

The Pool is in staged development.

The first implementation is intended for test-token development and review. After the contract and MiniDAPP flows are reviewed, the project can move to a small capped real-fund trial.

## Intended Design

The Pool is a local Minima MiniDAPP:

- No website dependency
- No backend server
- No centralized database
- No custody
- No admin wallet
- No treasury
- No hidden fee receiver

## Latest Version

The latest public MiniDAPP release will be published in:

```text
latest/
```

Current version target:

```text
v0.0.1 beta
```

The interface should help users create valid transactions. The on-chain pool logic must enforce the pool rules.

## Pair

Initial target pair:

- MINIMA
- USDT bridged native Minima token

Verified USDT token ID:

```text
0x7D39745FBD29049BE29850B55A18BF550E4D442F930F86266E34193D89042A90
```

The application must hardcode this token ID and reject any token that does not match it exactly.

## AMM Model

The planned pool model is a constant-product AMM:

```text
x * y = k
```

The trading fee is planned to be 1%. Fees remain inside the pool reserves for liquidity providers. There is no separate fee receiver.

## Planned Actions

- Swap MINIMA / USDT
- Add liquidity
- Remove liquidity
- View pool reserves
- View implied price
- View LP ownership share
- Review risk information before using the pool

Every swap must include slippage protection through a minimum output amount.

## Links

- GitHub: https://github.com/Charles0xhorizonxyz/the-minima-pool
- X: https://x.com/theminimapool
- Telegram: https://t.me/theminimapool

## Project Posture

The Pool should publish concrete milestones, testing status, review status, and current pool limits so users can evaluate the system clearly.
