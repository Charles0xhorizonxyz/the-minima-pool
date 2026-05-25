# Liquidity Model

## Constant Product

The Pool uses the classic constant-product AMM model:

```text
x * y = k
```

Where:

- `x` is the MINIMA reserve
- `y` is the USDT reserve
- `k` is the invariant product

The reserve ratio determines the implied price.

## Implied Price

If the pool has:

```text
100,000 MINIMA
10,000 USDT
```

Then:

```text
1 MINIMA = 0.10 USDT
```

The price changes automatically as users swap against the pool.

## Trading Fee

The trading fee is 1%.

For a swap input amount:

- 100% enters the pool
- 99% is used for output calculation
- 1% remains inside the reserves as LP value

There is no fee receiver, no treasury, and no manual fee claim mechanism.

## Swap Formula

For an input token reserve `inputReserve`, output token reserve `outputReserve`, and user input `amountIn`:

```text
amountInWithFee = amountIn * 0.99
amountOut = (amountInWithFee * outputReserve) / (inputReserve + amountInWithFee)
```

The full `amountIn` still enters the pool reserves.

## LP Tokens

LP tokens represent proportional ownership of the pool.

If a user owns 10% of the LP token supply, that user owns 10% of the pool reserves.

LP token value increases when fees remain in the reserves.

For V1, LP tokens are pre-minted with a fixed maximum supply and the unallocated supply is locked under the pool script.

Circulating LP supply is the amount released from the script-locked unallocated supply:

```text
circulating_lp_supply = max_lp_supply - script_locked_unallocated_lp_supply
```

The pool state should store circulating LP supply and the script should verify that it changes consistently with the unallocated LP reserve.

Initial LP issuance should target a starting display value close to `1 USDT` per LP token:

```text
initial_lp_released = initial_usdt_deposit * 2 * lp_display_scale
```

V1 uses:

```text
LP token decimals = 8
lp_display_scale = 1
```

With this scale, a first deposit of `10,000 MINIMA + 90 USDT` releases `180.00000000 LP`, because the first depositor sets the price and the pool starts with about `180 USDT` of total value.

## Add Liquidity

The first liquidity provider sets the initial price.

After initialization, liquidity deposits must be proportional to the current reserve ratio.

If deposits are not proportional, the transaction must be rejected.

## Remove Liquidity

When a user removes liquidity:

- LP tokens are returned to the pool-controlled unallocated LP reserve, or burned only if the script explicitly validates that path
- The user receives the same percentage of MINIMA reserves
- The user receives the same percentage of USDT reserves

## Slippage

Every swap must include a minimum output amount.

If the actual output is lower than the minimum output, the transaction must fail.

## Risk Notes

Liquidity providers and traders are exposed to:

- Low liquidity risk
- High slippage risk
- Impermanent loss
- First liquidity price manipulation
- User error
- Loss of funds
