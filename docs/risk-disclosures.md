# Risk Disclosures

The Pool is staged financial software. Users can lose funds.

The Pool is a 0xHorizon open-source project.

## Readiness Signals

The Pool should publish clear signals for the current stage:

- Current version
- Contract review status
- Test coverage status
- Current pool cap
- Known limitations
- Supported token IDs

## Smart Contract Risk

The pool rules must be enforced by on-chain logic. Bugs in that logic could cause incorrect swaps, incorrect LP accounting, stuck funds, or loss of funds.

## MiniDAPP Risk

The local MiniDAPP may display incorrect data or construct incorrect transactions. The UI must not be treated as the trusted enforcement layer.

## Fake Token Risk

The app must accept only this verified USDT token ID:

```text
0x7D39745FBD29049BE29850B55A18BF550E4D442F930F86266E34193D89042A90
```

Fake USDT tokens or lookalike assets must be rejected.

## Low Liquidity Risk

Small pools can produce poor swap prices. A modest trade can move the price significantly.

## High Slippage Risk

Slippage occurs when the final execution price is worse than the expected price. Every swap must include a minimum output amount so the transaction fails if the output is too low.

## Impermanent Loss

Liquidity providers can underperform simply holding MINIMA and USDT if the market price moves away from the pool price.

## First Liquidity Risk

The first liquidity provider sets the initial price. If the initial ratio is poor or manipulated, later users may receive unfair prices.

## Transaction Ordering Risk

If Minima execution makes transaction ordering or front-running relevant to this design, that risk must be documented and tested before capped real-fund use.

## User Error

Users may enter incorrect amounts, accept excessive slippage, interact with the wrong token, or misunderstand the risks.

## Loss of Funds

The Pool should grow through staged limits, review, and observed behavior. Loss of funds is possible.
