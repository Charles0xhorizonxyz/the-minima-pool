const USDT_TOKEN_ID = "0x7D39745FBD29049BE29850B55A18BF550E4D442F930F86266E34193D89042A90";
const FEE_BPS = 100n;
const BPS_DENOMINATOR = 10000n;

function assertPositiveAmount(value, name) {
  if (typeof value !== "bigint" || value <= 0n) {
    throw new Error(`${name} must be a positive bigint amount`);
  }
}

function assertUsdtToken(usdtTokenId) {
  if (usdtTokenId !== USDT_TOKEN_ID) {
    throw new Error("Invalid USDT token ID");
  }
}

function cloneState(state) {
  return {
    minimaReserve: state.minimaReserve,
    usdtReserve: state.usdtReserve,
    totalLpTokens: state.totalLpTokens,
    feeBps: state.feeBps
  };
}

function createEmptyPool() {
  return {
    minimaReserve: 0n,
    usdtReserve: 0n,
    totalLpTokens: 0n,
    feeBps: FEE_BPS
  };
}

function sqrt(value) {
  if (value < 0n) throw new Error("Cannot calculate square root of a negative amount");
  if (value < 2n) return value;

  let x0 = value / 2n;
  let x1 = (x0 + value / x0) / 2n;
  while (x1 < x0) {
    x0 = x1;
    x1 = (x0 + value / x0) / 2n;
  }
  return x0;
}

function initializePool({ minimaAmount, usdtAmount, usdtTokenId }) {
  assertPositiveAmount(minimaAmount, "minimaAmount");
  assertPositiveAmount(usdtAmount, "usdtAmount");
  assertUsdtToken(usdtTokenId);

  const lpTokens = sqrt(minimaAmount * usdtAmount);
  if (lpTokens <= 0n) {
    throw new Error("Initial liquidity is too small");
  }

  return {
    state: {
      minimaReserve: minimaAmount,
      usdtReserve: usdtAmount,
      totalLpTokens: lpTokens,
      feeBps: FEE_BPS
    },
    lpTokensMinted: lpTokens
  };
}

function addLiquidity(state, { minimaAmount, usdtAmount, usdtTokenId }) {
  assertPositiveAmount(minimaAmount, "minimaAmount");
  assertPositiveAmount(usdtAmount, "usdtAmount");
  assertUsdtToken(usdtTokenId);

  if (state.totalLpTokens <= 0n) {
    return initializePool({ minimaAmount, usdtAmount, usdtTokenId });
  }

  if (minimaAmount * state.usdtReserve !== usdtAmount * state.minimaReserve) {
    throw new Error("Liquidity deposits must match the current pool ratio");
  }

  const lpByMinima = (minimaAmount * state.totalLpTokens) / state.minimaReserve;
  const lpByUsdt = (usdtAmount * state.totalLpTokens) / state.usdtReserve;
  const lpTokensMinted = lpByMinima < lpByUsdt ? lpByMinima : lpByUsdt;
  if (lpTokensMinted <= 0n) {
    throw new Error("Liquidity deposit is too small");
  }

  return {
    state: {
      ...cloneState(state),
      minimaReserve: state.minimaReserve + minimaAmount,
      usdtReserve: state.usdtReserve + usdtAmount,
      totalLpTokens: state.totalLpTokens + lpTokensMinted
    },
    lpTokensMinted
  };
}

function removeLiquidity(state, { lpTokens }) {
  assertPositiveAmount(lpTokens, "lpTokens");
  if (lpTokens > state.totalLpTokens) {
    throw new Error("Cannot burn more LP tokens than total supply");
  }

  const minimaOut = (state.minimaReserve * lpTokens) / state.totalLpTokens;
  const usdtOut = (state.usdtReserve * lpTokens) / state.totalLpTokens;

  return {
    state: {
      ...cloneState(state),
      minimaReserve: state.minimaReserve - minimaOut,
      usdtReserve: state.usdtReserve - usdtOut,
      totalLpTokens: state.totalLpTokens - lpTokens
    },
    minimaOut,
    usdtOut
  };
}

function quoteSwap(amountIn, inputReserve, outputReserve, feeBps = FEE_BPS) {
  assertPositiveAmount(amountIn, "amountIn");
  assertPositiveAmount(inputReserve, "inputReserve");
  assertPositiveAmount(outputReserve, "outputReserve");

  const amountInAfterFee = (amountIn * (BPS_DENOMINATOR - feeBps)) / BPS_DENOMINATOR;
  return (amountInAfterFee * outputReserve) / (inputReserve + amountInAfterFee);
}

function swapMinimaForUsdt(state, { minimaIn, minUsdtOut, usdtTokenId }) {
  assertPositiveAmount(minimaIn, "minimaIn");
  assertPositiveAmount(minUsdtOut, "minUsdtOut");
  assertUsdtToken(usdtTokenId);

  const usdtOut = quoteSwap(minimaIn, state.minimaReserve, state.usdtReserve, state.feeBps);
  if (usdtOut < minUsdtOut) {
    throw new Error("Slippage check failed");
  }

  return {
    state: {
      ...cloneState(state),
      minimaReserve: state.minimaReserve + minimaIn,
      usdtReserve: state.usdtReserve - usdtOut
    },
    usdtOut
  };
}

function swapUsdtForMinima(state, { usdtIn, minMinimaOut, usdtTokenId }) {
  assertPositiveAmount(usdtIn, "usdtIn");
  assertPositiveAmount(minMinimaOut, "minMinimaOut");
  assertUsdtToken(usdtTokenId);

  const minimaOut = quoteSwap(usdtIn, state.usdtReserve, state.minimaReserve, state.feeBps);
  if (minimaOut < minMinimaOut) {
    throw new Error("Slippage check failed");
  }

  return {
    state: {
      ...cloneState(state),
      minimaReserve: state.minimaReserve - minimaOut,
      usdtReserve: state.usdtReserve + usdtIn
    },
    minimaOut
  };
}

module.exports = {
  USDT_TOKEN_ID,
  FEE_BPS,
  BPS_DENOMINATOR,
  createEmptyPool,
  initializePool,
  addLiquidity,
  removeLiquidity,
  quoteSwap,
  swapMinimaForUsdt,
  swapUsdtForMinima
};
