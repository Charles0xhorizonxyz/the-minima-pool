# Security Policy

## Experimental Status

The Pool is in staged development. Security status should be communicated through concrete review, testing, and deployment milestones.

The first implementation uses test tokens. After the contract and MiniDAPP flows are reviewed, the project can move to a small capped real-fund trial.

## Project Constraints

The Pool is a 0xHorizon open-source project distributed as a Minima MiniDAPP.

The project uses dedicated Pool repositories, branding, wallets, contracts, liquidity, deployment accounts, and operational processes.

The intended system has:

- No website dependency
- No backend server
- No custody
- No admin wallet
- No upgrade key
- No hidden fee receiver
- No treasury

## Verified USDT Token

The only accepted USDT token ID is:

```text
0x7D39745FBD29049BE29850B55A18BF550E4D442F930F86266E34193D89042A90
```

The app and contract design must reject fake USDT tokens and any token that does not match this ID exactly.

## Required Security Properties

The design must enforce:

- Slippage protection on every swap
- Minimum output amount on every swap
- Proportional liquidity deposits after pool initialization
- Clear warning when the first liquidity provider sets the initial price
- No separate fee receiver
- No external fee collector wallet
- No manual LP fee claim path
- No external price oracle in v1
- No centralized matching engine
- No centralized liquidity manager

## Known Risks

Users and reviewers should assume the following risks exist unless disproven through implementation, testing, and review:

- Smart contract risk
- MiniDAPP implementation risk
- Fake token risk
- Low liquidity risk
- High slippage risk
- Impermanent loss
- First liquidity price manipulation
- Front-running or transaction ordering risk if relevant to Minima execution
- User error
- Loss of funds

## Reporting Issues

Until the public repository and maintainer process are finalized, security issues should be documented privately and not promoted as resolved until the fix has been reviewed and tested.

When reporting an issue, include:

- A clear description of the issue
- Impacted flow: add liquidity, remove liquidity, swap, token validation, LP accounting, or MiniDAPP packaging
- Reproduction steps
- Expected behavior
- Actual behavior
- Suggested fix, if known

## Review Requirements Before Real-Token Use

Before any real-token test, the project needs review of:

- Contract logic
- Transaction construction
- Token ID validation
- LP token accounting
- Fee accounting
- Slippage checks
- Low-liquidity behavior
- MiniDAPP local packaging
- User-facing risk warnings
