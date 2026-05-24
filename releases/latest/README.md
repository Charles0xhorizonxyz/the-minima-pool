# Latest MiniDAPP Release

This folder contains the latest packaged The Pool MiniDAPP prototype release.

Current version target:

```text
v0.0.1 beta
```

Current package:

```text
the-pool-0.0.1-beta.mds.zip
```

SHA256:

```text
7FF2DD2D137DE757AA56F1E50681596EA5995ADC051BADC29D7365EC07496B5E
```

Package contents:

- `dapp.conf`
- `index.html`
- `app.js`
- `app_icon.png`
- `mds-2.1.0.js`
- `pool_icon.png`
- `styles.css`
- `favicon.ico`
- `favicon.svg`
- `icon.png`
- `assets/`

Validation notes:

- `dapp.conf` is valid JSON.
- Root `favicon.ico` is included for the MiniDAPP install icon.
- `dapp.conf` declares `icon: "pool_icon.png"` and `web: "index.html"`.
- Package permission is `read`.
- This is a UI prototype with MDS balance reads when installed in MiniHub.
- Real Minima transaction building is not connected yet.
- Real local node balances are read with `MDS.cmd("balance")`.
