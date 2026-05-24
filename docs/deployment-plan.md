# Deployment Plan

## Goal

The Pool should become a local Minima MiniDAPP for decentralized MINIMA / USDT liquidity without website, backend, custody, or admin dependencies.

## Phase 0: Repository Foundation

Create and review documentation:

- README.md
- SPEC.md
- SECURITY.md
- TESTPLAN.md
- docs/architecture.md
- docs/liquidity-model.md
- docs/deployment-plan.md
- docs/risk-disclosures.md
- contracts/README.md
- 2_development/dapp/README.md
- tests/README.md

No production smart contract code should be written in this phase.

## Phase 1: Test-Token Prototype

Use test tokens first.

Implement prototype behavior for:

- Fake MINIMA reserve simulation if needed
- Fake test-USDT token
- Add liquidity
- Remove liquidity
- Swap MINIMA to USDT
- Swap USDT to MINIMA
- 1% fee retained inside reserves
- LP token accounting
- Wrong-token rejection
- Slippage rejection

## Phase 2: Local MiniDAPP Prototype

Build the local MiniDAPP interface.

The UI should include:

- Pool overview
- Reserves
- Swap panel
- Add liquidity panel
- Remove liquidity panel
- LP position view
- Risk warnings
- Verified token ID display

Verified USDT token ID:

```text
0x7D39745FBD29049BE29850B55A18BF550E4D442F930F86266E34193D89042A90
```

## Phase 3: Community Review

Publish the repository and request review of:

- Contract logic
- Token handling
- Transaction construction
- LP accounting
- Fee accounting
- Security assumptions
- MiniDAPP packaging
- Risk disclosures

Findings should be tracked before any capped real-fund use.

## Phase 4: Small Capped Real-Fund Trial

Only after review, consider a small capped real MINIMA / USDT pool.

This phase should publish clear limits, current review status, and known risks.

## Deployment Communication

The Pool should be deployed with clear public facts:

- Current version
- Current pool cap
- Review status
- Test status
- Supported token IDs
- Known limitations
