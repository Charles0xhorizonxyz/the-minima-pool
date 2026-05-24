# MiniDAPP

This directory is reserved for the future local Minima MiniDAPP interface.

The Pool MiniDAPP should run locally through the Minima MiniDAPP system. It must not depend on a hosted website, backend server, centralized database, custodian, admin wallet, or centralized liquidity manager.

Current files provide a basic one-page prototype UI only. It does not construct or submit real Minima transactions yet.

The MiniDAPP should eventually include:

- Pool overview
- Reserve display
- Implied price display
- Swap panel
- Add liquidity panel
- Remove liquidity panel
- LP position view
- Risk warnings
- Verified USDT token ID display

Verified USDT token ID:

```text
0x7D39745FBD29049BE29850B55A18BF550E4D442F930F86266E34193D89042A90
```

The MiniDAPP should help users create valid transactions, but the on-chain logic must enforce the rules.

Real-fund contract interaction should begin only after the specification and test-token prototype have been reviewed, starting with a small capped trial.
