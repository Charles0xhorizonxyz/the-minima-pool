const test = require("node:test");
const assert = require("node:assert/strict");

const {
  USDT_TOKEN_ID,
  initializePool,
  addLiquidity,
  removeLiquidity,
  quoteSwap,
  swapMinimaForUsdt,
  swapUsdtForMinima
} = require("../simulation/amm");

const MINIMA = 1_000_000n;
const USDT = 1_000_000n;

function seededPool() {
  return initializePool({
    minimaAmount: 100_000n * MINIMA,
    usdtAmount: 10_000n * USDT,
    usdtTokenId: USDT_TOKEN_ID
  }).state;
}

test("initializes a pool and mints initial LP tokens", () => {
  const { state, lpTokensMinted } = initializePool({
    minimaAmount: 100_000n * MINIMA,
    usdtAmount: 10_000n * USDT,
    usdtTokenId: USDT_TOKEN_ID
  });

  assert.equal(state.minimaReserve, 100_000n * MINIMA);
  assert.equal(state.usdtReserve, 10_000n * USDT);
  assert.equal(state.totalLpTokens, lpTokensMinted);
  assert.ok(lpTokensMinted > 0n);
});

test("rejects fake USDT token IDs", () => {
  assert.throws(() => initializePool({
    minimaAmount: 100_000n * MINIMA,
    usdtAmount: 10_000n * USDT,
    usdtTokenId: "0xFAKE"
  }), /Invalid USDT token ID/);
});

test("adds liquidity only at the current pool ratio", () => {
  const state = seededPool();

  const added = addLiquidity(state, {
    minimaAmount: 10_000n * MINIMA,
    usdtAmount: 1_000n * USDT,
    usdtTokenId: USDT_TOKEN_ID
  });

  assert.equal(added.state.minimaReserve, 110_000n * MINIMA);
  assert.equal(added.state.usdtReserve, 11_000n * USDT);
  assert.ok(added.lpTokensMinted > 0n);

  assert.throws(() => addLiquidity(state, {
    minimaAmount: 10_000n * MINIMA,
    usdtAmount: 2_000n * USDT,
    usdtTokenId: USDT_TOKEN_ID
  }), /current pool ratio/);
});

test("removes liquidity proportionally", () => {
  const state = seededPool();
  const lpTokens = state.totalLpTokens / 10n;

  const removed = removeLiquidity(state, { lpTokens });

  assert.equal(removed.minimaOut, (state.minimaReserve * lpTokens) / state.totalLpTokens);
  assert.equal(removed.usdtOut, (state.usdtReserve * lpTokens) / state.totalLpTokens);
  assert.equal(removed.state.totalLpTokens, state.totalLpTokens - lpTokens);
});

test("quotes and executes MINIMA to USDT swap with 1% retained in reserves", () => {
  const state = seededPool();
  const minimaIn = 1_000n * MINIMA;
  const expectedUsdtOut = quoteSwap(minimaIn, state.minimaReserve, state.usdtReserve, state.feeBps);

  const swapped = swapMinimaForUsdt(state, {
    minimaIn,
    minUsdtOut: expectedUsdtOut,
    usdtTokenId: USDT_TOKEN_ID
  });

  assert.equal(swapped.usdtOut, expectedUsdtOut);
  assert.equal(swapped.state.minimaReserve, state.minimaReserve + minimaIn);
  assert.equal(swapped.state.usdtReserve, state.usdtReserve - expectedUsdtOut);
  assert.ok(swapped.state.minimaReserve * swapped.state.usdtReserve > state.minimaReserve * state.usdtReserve);
});

test("quotes and executes USDT to MINIMA swap with 1% retained in reserves", () => {
  const state = seededPool();
  const usdtIn = 100n * USDT;
  const expectedMinimaOut = quoteSwap(usdtIn, state.usdtReserve, state.minimaReserve, state.feeBps);

  const swapped = swapUsdtForMinima(state, {
    usdtIn,
    minMinimaOut: expectedMinimaOut,
    usdtTokenId: USDT_TOKEN_ID
  });

  assert.equal(swapped.minimaOut, expectedMinimaOut);
  assert.equal(swapped.state.usdtReserve, state.usdtReserve + usdtIn);
  assert.equal(swapped.state.minimaReserve, state.minimaReserve - expectedMinimaOut);
  assert.ok(swapped.state.minimaReserve * swapped.state.usdtReserve > state.minimaReserve * state.usdtReserve);
});

test("rejects swaps when minimum output is too high", () => {
  const state = seededPool();
  const usdtIn = 100n * USDT;
  const expectedMinimaOut = quoteSwap(usdtIn, state.usdtReserve, state.minimaReserve, state.feeBps);

  assert.throws(() => swapUsdtForMinima(state, {
    usdtIn,
    minMinimaOut: expectedMinimaOut + 1n,
    usdtTokenId: USDT_TOKEN_ID
  }), /Slippage check failed/);
});
