# The Pool

Summer is coming. Time for a splash.

The Pool is a 0xHorizon open-source project for a decentralized MINIMA / USDT liquidity pool on Minima.

The Pool is distributed as a Minima MiniDAPP. The project is not intended to require a hosted website, hosted backend, or centralized application server.

The app name is **The Pool**. 0xHorizon is the publisher and maintainer.

The Pool uses dedicated repositories, branding, wallets, contracts, liquidity, deployment accounts, and operational processes.

The Pool is intended to be a local Minima MiniDAPP:

- No website dependency
- No backend server
- No centralized database
- No custody
- No admin wallet
- No treasury
- No hidden fee receiver

The MiniDAPP interface should help users create valid transactions. The on-chain pool logic must enforce the pool rules.

## Status

The Pool is in staged development.

The first implementation validates the AMM, transaction flow, token handling, and MiniDAPP behavior with test tokens. After review, the project can move to a small capped real-fund trial.

Current status:

- Static local MiniDAPP prototype exists
- Packaged prototype release exists in `releases/latest/`
- Pure AMM simulation exists
- AMM simulation tests pass
- Production smart contract code has not been written
- No real-fund pool has been launched

Latest MiniDAPP package:

```text
releases/latest/the-pool-0.0.1-beta.mds.zip
```

Direct download:

```text
https://raw.githubusercontent.com/Charles0xhorizonxyz/the-minima-pool/main/releases/latest/the-pool-0.0.1-beta.mds.zip
```

SHA256:

```text
0902D5266F4CE2B50FE40CE503109274A406A665B5A6D10B2187C5DC9EA756F3
```

Technical review entry point:

```text
docs/technical-review-brief.md
```

The project is seeking Minima developer review before moving from prototype/simulation work into contract-backed test-token implementation.

## Pair

Initial pair:

- MINIMA
- USDT bridged native Minima token

Verified USDT token ID:

```text
0x7D39745FBD29049BE29850B55A18BF550E4D442F930F86266E34193D89042A90
```

The application must hardcode this token ID, clearly display it, and reject any token that does not match it exactly.

## AMM Model

The Pool uses the constant-product AMM model:

```text
x * y = k
```

Where:

- `x` is the MINIMA reserve
- `y` is the USDT reserve
- `k` is the invariant product

The implied price is determined by the reserve ratio.

## Fee Model

The trading fee is 1%.

The fee remains inside the pool reserves. There is no separate fee receiver, no fee collector wallet, no treasury, and no manual fee claim mechanism.

For each swap, 100% of the input amount enters the pool, but only 99% of the input amount is used for the output calculation. Liquidity providers benefit because each LP token represents a claim on a larger pool.

## Planned User Actions

The Pool should eventually support:

- Add liquidity
- Remove liquidity
- Swap MINIMA for USDT
- Swap USDT for MINIMA
- View pool reserves
- View implied price
- View LP ownership share
- Review risks before using the pool

Every swap must include slippage protection through a minimum output amount. A swap must fail if the output is below the user's minimum.

## Development Phases

### Phase 0: Repository Foundation

Create project documentation and define the protocol, security assumptions, test plan, and deployment approach.

No production smart contract code should be written in this phase.

### Phase 1: Test-Token Prototype

Use test tokens to implement the AMM behavior, LP accounting, wrong-token rejection, and slippage rejection in a prototype environment.

### Phase 2: Local MiniDAPP Prototype

Build a local MiniDAPP interface for pool overview, swaps, liquidity management, LP position display, risk warnings, and verified token ID display.

### Phase 3: Community Review

Publish the repository and request review from Minima developers and community members.

Primary review document:

```text
docs/technical-review-brief.md
```

Review priorities:

- Pool-state UTXO design
- Reserve coin control design
- LP token mechanics
- Verified USDT token ID enforcement
- Minimum-output enforcement
- Stale transaction behavior
- Transaction expiry and retry UX
- Minima proof size and script limits
- Whether fee-only LP governance can safely be reserved in V1
- Confirmation that no admin/custody path exists

### Phase 4: Small Real-Token Test

After review, launch a very small capped real MINIMA / USDT pool and expand gradually as the system proves itself.

## Long-Term Direction

The first pool is a simple full-range MINIMA / USDT AMM.

The long-term direction is broader:

- V1: simple full-range MINIMA / USDT AMM
- V2: additional full-range pools, event indexer, portfolio analytics, keeper tooling, and better UTXO operations
- V3: liquidity bins, user-selected liquidity shapes, advanced LP positions, and multi-pool routing
- Later: lending protocol beside the pools, only after separate specification and risk review

Long-term vision:

```text
docs/long-term-vision.md
```

## Repository Structure

```text
.
├── README.md
├── SPEC.md
├── SECURITY.md
├── TESTPLAN.md
├── LICENSE
├── docs/
│   ├── architecture.md
│   ├── implementation-plan.md
│   ├── liquidity-model.md
│   ├── long-term-vision.md
│   ├── deployment-plan.md
│   ├── execution-checklist.md
│   ├── risk-disclosures.md
│   ├── technical-review-brief.md
│   ├── throughput-scaling.md
│   └── utxo-management.md
├── dapp/
│   ├── README.md
│   ├── dapp.conf
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── releases/
│   └── latest/
├── scripts/
│   ├── package-dapp.ps1
│   └── serve-dapp-lan.ps1
├── simulation/
│   └── amm.js
├── contracts/
│   └── README.md
└── tests/
    ├── README.md
    └── amm-simulation.test.js
```

## Document Guide

Start here:

- `docs/technical-review-brief.md` - technical review entry point for Minima developers
- `docs/long-term-vision.md` - V1 to V3+ product and protocol direction

Core protocol:

- `SPEC.md` - intended AMM behavior and required protections
- `docs/architecture.md` - system architecture, trust model, governance direction, and evolution compatibility
- `docs/liquidity-model.md` - AMM and LP economics
- `docs/utxo-management.md` - UTXO management, stale-state handling, and throughput assumptions
- `docs/throughput-scaling.md` - scaling paths and future capacity designs
- `docs/implementation-plan.md` - phased build plan

Safety and review:

- `SECURITY.md` - security posture and reporting
- `TESTPLAN.md` - test strategy
- `docs/risk-disclosures.md` - user-facing risk categories
- `docs/deployment-plan.md` - staged deployment approach
- `docs/execution-checklist.md` - current execution status

MiniDAPP and releases:

- `dapp/README.md` - MiniDAPP prototype notes
- `releases/latest/README.md` - latest packaged prototype release

Project operations:

- `docs/x-setup.md` - X profile setup
- `docs/telegram-setup.md` - Telegram setup

## Project Posture

The Pool should publish concrete milestones, testing status, review status, and current pool limits so users can evaluate the system clearly.
