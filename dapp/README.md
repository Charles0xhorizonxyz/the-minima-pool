# MiniDAPP

This directory is reserved for the future local Minima MiniDAPP interface.

The Pool MiniDAPP should run locally through the Minima MiniDAPP system. It must not depend on a hosted website, backend server, centralized database, custodian, admin wallet, or centralized liquidity manager.

Current files provide a basic one-page prototype UI only. It does not construct or submit real Minima transactions yet.

Latest installable MiniDAPP package:

```text
../releases/latest/the-pool-0.0.1-beta.mds.zip
```

Direct GitHub download:

```text
https://raw.githubusercontent.com/Charles0xhorizonxyz/the-minima-pool/main/releases/latest/the-pool-0.0.1-beta.mds.zip
```

SHA256:

```text
0902D5266F4CE2B50FE40CE503109274A406A665B5A6D10B2187C5DC9EA756F3
```

The MiniDAPP package includes a root `favicon.ico` generated from The Pool logo. Minima's MiniDAPP install flow uses the root favicon for the installed-app icon.

The `dapp.conf` file declares `icon: "pool_icon.png"` and `web: "index.html"`, matching the working convention used by the Stables MiniDAPP package.

When installed inside MiniHub/MDS, the prototype reads real local node balances with `MDS.cmd("balance")` and uses the `sendable` amount for MINIMA and the verified USDT token ID. Local browser preview keeps the static prototype balances as a fallback.

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
