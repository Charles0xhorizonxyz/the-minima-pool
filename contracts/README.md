# Contracts

This directory is reserved for future pool contract work.

Do not add production smart contract code during Phase 0.

The next contract-related step should be a test-token prototype before a capped real-fund trial.

Future contract logic must enforce:

- Verified USDT token ID matching
- Fake USDT rejection
- Constant-product AMM behavior
- 1% swap fee retained inside reserves
- LP token minting and burning rules
- Proportional liquidity deposits after initialization
- Minimum output checks on every swap
- No admin wallet
- No upgrade key
- No hidden fee receiver
- No custody outside the pool contract

Verified USDT token ID:

```text
0x7D39745FBD29049BE29850B55A18BF550E4D442F930F86266E34193D89042A90
```
