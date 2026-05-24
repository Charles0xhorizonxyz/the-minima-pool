# Tests

This directory contains The Pool test plans, scenarios, and automated tests.

Early tests use fake test tokens before any capped real-fund trial.

Current automated test command:

```text
node --test tests/amm-simulation.test.js
```

Priority test areas:

- [x] Verified USDT token ID enforcement
- [x] Fake USDT rejection
- [x] Add liquidity
- [x] Remove liquidity
- [x] Swap MINIMA to USDT
- [x] Swap USDT to MINIMA
- [x] 1% fee retained in pool reserves
- [x] LP token accounting
- [x] Slippage protection
- [x] Minimum output rejection
- First liquidity warning
- Low-liquidity and price-impact warnings
- Configurable fee bounds
- LP-holder fee governance rules
- Minima transaction construction
- UTXO coin selection
- Stale pool-state failure and retry behavior

Verified USDT token ID:

```text
0x7D39745FBD29049BE29850B55A18BF550E4D442F930F86266E34193D89042A90
```

The project should advance through clear test, review, and capped-liquidity milestones.
