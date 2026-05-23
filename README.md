# The Pool

Time for a splash.

The Pool is a 0xHorizon open-source project for a decentralized MINIMA / USDT liquidity pool on Minima.

The Pool is independent from Stables. Stables code, infrastructure, branding, wallets, contracts, liquidity, repositories, deployment accounts, and operational processes are not shared with The Pool. The only permitted association is the human/user identity `charles0xhorizon`.

## Status

Current version:

```text
v0.0.1 beta
```

The Pool is experimental software.

Do not use The Pool with real funds. The first implementation is intended for test-token development and review only.

## Intended Design

The Pool is intended to be a local Minima MiniDAPP:

- No website dependency
- No backend server
- No centralized database
- No custody
- No admin wallet
- No treasury
- No hidden fee receiver

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

## Non-Claims

The Pool does not claim to be safe, audited, official, endorsed by Minima, endorsed by the USDT issuer, guaranteed, stable, or risk-free.
