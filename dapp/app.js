const USDT_TOKEN_ID = "0x7D39745FBD29049BE29850B55A18BF550E4D442F930F86266E34193D89042A90";

const state = {
  minimaReserve: 513347.022587,
  usdtReserve: 5000,
  totalLpTokens: 10000,
  feeRate: 0.01,
  slippageTolerance: 0.005,
  historyView: "mine",
  balances: {
    minima: 25667.35,
    usdt: 250,
    lp: 500
  },
  position: {
    investedValue: 500,
    feesEarned: 18.25,
    impermanentLoss: 7.86,
    daysHeld: 14
  },
  analytics: [
    { day: "Mon", transactions: 18, volume: 7200, fees: 72 },
    { day: "Tue", transactions: 23, volume: 9400, fees: 94 },
    { day: "Wed", transactions: 15, volume: 6800, fees: 68 },
    { day: "Thu", transactions: 31, volume: 12600, fees: 126 },
    { day: "Fri", transactions: 27, volume: 11100, fees: 111 },
    { day: "Sat", transactions: 38, volume: 14800, fees: 148 },
    { day: "Sun", transactions: 26, volume: 10300, fees: 103 }
  ],
  trades: [
    { timestamp: "2026-05-24T09:44:00", owner: "mine", side: "Buy MINIMA", amount: "125 USDT", output: "1,222.10 MINIMA" },
    { timestamp: "2026-05-24T09:12:00", owner: "pool", side: "Sell MINIMA", amount: "840 MINIMA", output: "82.31 USDT" },
    { timestamp: "2026-05-24T08:37:00", owner: "mine", side: "Add liquidity", amount: "5,000 MINIMA", output: "500 USDT" },
    { timestamp: "2026-05-24T08:11:00", owner: "pool", side: "Buy MINIMA", amount: "75 USDT", output: "742.12 MINIMA" }
  ]
};

const els = {
  minimaReserve: document.querySelector("#minimaReserve"),
  usdtReserve: document.querySelector("#usdtReserve"),
  tabs: document.querySelectorAll(".tab"),
  panels: {
    swap: document.querySelector("#swapPanel"),
    liquidity: document.querySelector("#liquidityPanel")
  },
  swapDirection: document.querySelector("#swapDirection"),
  switchDirection: document.querySelector("#switchDirection"),
  swapMax: document.querySelector("#swapMax"),
  swapBalance: document.querySelector("#swapBalance"),
  swapOutputMax: document.querySelector("#swapOutputMax"),
  swapOutputBalance: document.querySelector("#swapOutputBalance"),
  fromToken: document.querySelector("#fromToken"),
  toToken: document.querySelector("#toToken"),
  fromIcon: document.querySelector("#fromIcon"),
  toIcon: document.querySelector("#toIcon"),
  swapAmount: document.querySelector("#swapAmount"),
  minOutput: document.querySelector("#minOutput"),
  swapSettings: document.querySelector(".swap-settings"),
  slippageLabel: document.querySelector("#slippageLabel"),
  slippageOptions: document.querySelectorAll(".slippage-option"),
  customSlippage: document.querySelector("#customSlippage"),
  priceUsdtPerMinima: document.querySelector("#priceUsdtPerMinima"),
  priceMinimaPerUsdt: document.querySelector("#priceMinimaPerUsdt"),
  priceImpact: document.querySelector("#priceImpact"),
  impactInfo: document.querySelector("#impactInfo"),
  impactLoss: document.querySelector("#impactLoss"),
  riskAckWrap: document.querySelector("#riskAckWrap"),
  riskAck: document.querySelector("#riskAck"),
  previewSwap: document.querySelector("#previewSwap"),
  swapOutput: document.querySelector("#swapOutput"),
  midPrice: document.querySelector("#midPrice"),
  bandLiquidity: document.querySelector("#bandLiquidity"),
  liquidityModeButtons: document.querySelectorAll("[data-liquidity-mode]"),
  addLiquidityForm: document.querySelector("#addLiquidityForm"),
  removeLiquidityForm: document.querySelector("#removeLiquidityForm"),
  addMinima: document.querySelector("#addMinima"),
  addUsdt: document.querySelector("#addUsdt"),
  addMinimaMax: document.querySelector("#addMinimaMax"),
  addUsdtMax: document.querySelector("#addUsdtMax"),
  addMinimaBalance: document.querySelector("#addMinimaBalance"),
  addUsdtBalance: document.querySelector("#addUsdtBalance"),
  addShare: document.querySelector("#addShare"),
  removeLp: document.querySelector("#removeLp"),
  removeMax: document.querySelector("#removeMax"),
  removeBalance: document.querySelector("#removeBalance"),
  removeMinimaOut: document.querySelector("#removeMinimaOut"),
  removeUsdtOut: document.querySelector("#removeUsdtOut"),
  removeRemaining: document.querySelector("#removeRemaining"),
  positionValue: document.querySelector("#positionValue"),
  positionValueChange: document.querySelector("#positionValueChange"),
  positionPoolShare: document.querySelector("#positionPoolShare"),
  positionVotingPower: document.querySelector("#positionVotingPower"),
  positionImpermanentLoss: document.querySelector("#positionImpermanentLoss"),
  positionFeesEarned: document.querySelector("#positionFeesEarned"),
  positionReturn: document.querySelector("#positionReturn"),
  positionAnnualizedReturn: document.querySelector("#positionAnnualizedReturn"),
  positionDays: document.querySelector("#positionDays"),
  governanceCurrentFee: document.querySelector("#governanceCurrentFee"),
  governanceVotingPower: document.querySelector("#governanceVotingPower"),
  castVote: document.querySelector("#castVote"),
  voteResult: document.querySelector("#voteResult"),
  transactionsChart: document.querySelector("#transactionsChart"),
  feesChart: document.querySelector("#feesChart"),
  dailyVolume: document.querySelector("#dailyVolume"),
  dailyFees: document.querySelector("#dailyFees"),
  dailyApr: document.querySelector("#dailyApr"),
  cumulativeVolume: document.querySelector("#cumulativeVolume"),
  cumulativeFees: document.querySelector("#cumulativeFees"),
  cumulativeReturn: document.querySelector("#cumulativeReturn"),
  tradeList: document.querySelector("#tradeList"),
  historyFilters: document.querySelectorAll(".history-filter-button"),
  swapResult: document.querySelector("#swapResult"),
  liquidityResult: document.querySelector("#liquidityResult"),
  removeResult: document.querySelector("#removeResult"),
  swapModal: document.querySelector("#swapModal"),
  confirmFrom: document.querySelector("#confirmFrom"),
  confirmTo: document.querySelector("#confirmTo"),
  confirmMinimum: document.querySelector("#confirmMinimum"),
  confirmPriceUsdtPerMinima: document.querySelector("#confirmPriceUsdtPerMinima"),
  confirmPriceMinimaPerUsdt: document.querySelector("#confirmPriceMinimaPerUsdt"),
  confirmPriceImpact: document.querySelector("#confirmPriceImpact"),
  confirmImpactMeter: document.querySelector("#confirmImpactMeter"),
  confirmImpactLabel: document.querySelector("#confirmImpactLabel"),
  confirmImpactLoss: document.querySelector("#confirmImpactLoss"),
  cancelSwap: document.querySelector("#cancelSwap"),
  confirmSwap: document.querySelector("#confirmSwap"),
  liquidityModal: document.querySelector("#liquidityModal"),
  confirmAddMinima: document.querySelector("#confirmAddMinima"),
  confirmAddUsdt: document.querySelector("#confirmAddUsdt"),
  confirmAddShare: document.querySelector("#confirmAddShare"),
  confirmAddRatio: document.querySelector("#confirmAddRatio"),
  cancelAdd: document.querySelector("#cancelAdd"),
  confirmAdd: document.querySelector("#confirmAdd"),
  removeModal: document.querySelector("#removeModal"),
  confirmRemoveLp: document.querySelector("#confirmRemoveLp"),
  confirmRemoveMinima: document.querySelector("#confirmRemoveMinima"),
  confirmRemoveUsdt: document.querySelector("#confirmRemoveUsdt"),
  confirmRemoveRemaining: document.querySelector("#confirmRemoveRemaining"),
  cancelRemove: document.querySelector("#cancelRemove"),
  confirmRemove: document.querySelector("#confirmRemove")
};

function asNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function formatAmount(value) {
  if (!Number.isFinite(value)) return "0";
  return value.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

function formatQuoteAmount(value) {
  if (!Number.isFinite(value)) return "0.00";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatPriceAmount(value) {
  if (!Number.isFinite(value)) return "0.00";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 6,
    maximumFractionDigits: 6
  });
}

function formatInputAmount(value) {
  if (!Number.isFinite(value)) return "";
  return value.toFixed(2);
}

function formatPercent(value) {
  return `${value.toFixed(2)}%`;
}

function formatUsd(value) {
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

function swapQuote(amountIn, inputReserve, outputReserve) {
  if (amountIn <= 0) return 0;
  const amountInWithFee = amountIn * (1 - state.feeRate);
  return (amountInWithFee * outputReserve) / (inputReserve + amountInWithFee);
}

function inputForExactOutput(amountOut, inputReserve, outputReserve) {
  if (amountOut <= 0 || amountOut >= outputReserve) return 0;
  return (inputReserve * amountOut) / ((outputReserve - amountOut) * (1 - state.feeRate));
}

function twoPercentDepth() {
  const upUsdtGross = (state.usdtReserve * (Math.sqrt(1.02) - 1)) / (1 - state.feeRate);
  const downMinimaGross = (state.minimaReserve * ((1 / Math.sqrt(0.98)) - 1)) / (1 - state.feeRate);
  const downUsdtEquivalent = downMinimaGross * (state.usdtReserve / state.minimaReserve);
  return Math.min(upUsdtGross, downUsdtEquivalent);
}

function swapTokens() {
  const isBuy = els.swapDirection.value === "buy";
  els.fromToken.textContent = isBuy ? "USDT" : "MINIMA";
  els.toToken.textContent = isBuy ? "MINIMA" : "USDT";
  els.fromIcon.src = isBuy ? "assets/USDT.svg" : "assets/MINIMA.svg";
  els.toIcon.src = isBuy ? "assets/MINIMA.svg" : "assets/USDT.svg";
  renderBalances();
}

function renderLiquidity() {
  els.minimaReserve.textContent = formatAmount(state.minimaReserve);
  els.usdtReserve.textContent = formatAmount(state.usdtReserve);
  els.midPrice.textContent = `${(state.usdtReserve / state.minimaReserve).toFixed(5)} USDT`;
  els.bandLiquidity.textContent = `${formatQuoteAmount(twoPercentDepth())} USDT`;
}

function renderBalances() {
  const isBuy = els.swapDirection.value === "buy";
  els.swapBalance.textContent = formatQuoteAmount(isBuy ? state.balances.usdt : state.balances.minima);
  els.swapOutputBalance.textContent = formatQuoteAmount(isBuy ? state.balances.minima : state.balances.usdt);
  els.addMinimaBalance.textContent = formatQuoteAmount(state.balances.minima);
  els.addUsdtBalance.textContent = formatQuoteAmount(state.balances.usdt);
  els.removeBalance.textContent = formatQuoteAmount(state.balances.lp);
}

function maxSwapOutput() {
  const isBuy = els.swapDirection.value === "buy";
  const maxInput = isBuy ? state.balances.usdt : state.balances.minima;
  return isBuy
    ? swapQuote(maxInput, state.usdtReserve, state.minimaReserve)
    : swapQuote(maxInput, state.minimaReserve, state.usdtReserve);
}

function renderSwapQuote() {
  const output = asNumber(els.swapOutput.value);
  swapTokens();

  els.minOutput.textContent = output > 0 ? formatQuoteAmount(output * (1 - state.slippageTolerance)) : "0.00";
  els.slippageLabel.textContent = `${formatPercent(state.slippageTolerance * 100)} slippage`;
  renderAveragePrices();
  renderPriceImpact();
}

function calculateSwapFromInput() {
  const amount = asNumber(els.swapAmount.value);
  const isBuy = els.swapDirection.value === "buy";

  const output = isBuy
    ? swapQuote(amount, state.usdtReserve, state.minimaReserve)
    : swapQuote(amount, state.minimaReserve, state.usdtReserve);

  els.swapOutput.value = output > 0 ? formatInputAmount(output) : "";
  renderSwapQuote();
}

function calculateSwapFromOutput() {
  const output = asNumber(els.swapOutput.value);
  const isBuy = els.swapDirection.value === "buy";
  const input = isBuy
    ? inputForExactOutput(output, state.usdtReserve, state.minimaReserve)
    : inputForExactOutput(output, state.minimaReserve, state.usdtReserve);

  els.swapAmount.value = input > 0 ? formatInputAmount(input) : "";
  renderSwapQuote();
}

function formatSwapInputs() {
  const amount = asNumber(els.swapAmount.value);
  const output = asNumber(els.swapOutput.value);
  els.swapAmount.value = amount > 0 ? formatInputAmount(amount) : "";
  els.swapOutput.value = output > 0 ? formatInputAmount(output) : "";
}

function currentAmountsByToken() {
  const amount = asNumber(els.swapAmount.value);
  const output = asNumber(els.swapOutput.value);
  const isBuy = els.swapDirection.value === "buy";

  return {
    usdt: isBuy ? amount : output,
    minima: isBuy ? output : amount
  };
}

function renderAveragePrices() {
  const { usdt, minima } = currentAmountsByToken();
  const midUsdtPerMinima = state.usdtReserve / state.minimaReserve;
  const midMinimaPerUsdt = state.minimaReserve / state.usdtReserve;
  const usdtPerMinima = usdt > 0 && minima > 0 ? usdt / minima : midUsdtPerMinima;
  const minimaPerUsdt = usdt > 0 && minima > 0 ? minima / usdt : midMinimaPerUsdt;

  els.priceUsdtPerMinima.textContent = formatPriceAmount(usdtPerMinima);
  els.priceMinimaPerUsdt.textContent = formatPriceAmount(minimaPerUsdt);
}

function currentPriceImpact() {
  const { usdt, minima } = currentAmountsByToken();
  if (usdt <= 0 || minima <= 0) return 0;

  const mid = state.usdtReserve / state.minimaReserve;
  const average = usdt / minima;
  return Math.abs((average - mid) / mid) * 100;
}

function currentPriceImpactLoss() {
  const amount = asNumber(els.swapAmount.value);
  const output = asNumber(els.swapOutput.value);
  const isBuy = els.swapDirection.value === "buy";
  if (amount <= 0 || output <= 0) {
    return { text: "0.00 USDT", usdt: 0 };
  }

  const mid = state.usdtReserve / state.minimaReserve;
  const feeAdjustedAmount = amount * (1 - state.feeRate);
  const idealOutput = isBuy ? feeAdjustedAmount / mid : feeAdjustedAmount * mid;
  const outputLoss = Math.max(idealOutput - output, 0);
  const usdtLoss = isBuy ? outputLoss * mid : outputLoss;
  const text = isBuy
    ? `${formatQuoteAmount(outputLoss)} MINIMA / ${formatUsd(usdtLoss)}`
    : `${formatUsd(outputLoss)}`;

  return { text, usdt: usdtLoss };
}

function priceImpactSeverity(impact) {
  if (impact >= 5) return { level: "high", label: "High price impact" };
  if (impact >= 3) return { level: "medium", label: "Noticeable price impact" };
  if (impact >= 1) return { level: "low", label: "Low price impact" };
  return { level: "minimal", label: "Minimal price impact" };
}

function requiresRiskAck() {
  return currentPriceImpact() > 5;
}

function currentInputBalance() {
  const isBuy = els.swapDirection.value === "buy";
  return isBuy ? state.balances.usdt : state.balances.minima;
}

function hasInsufficientSwapBalance() {
  const amount = asNumber(els.swapAmount.value);
  return amount > currentInputBalance();
}

function renderPreviewButtonState() {
  const blockedByRisk = requiresRiskAck() && !els.riskAck.checked;
  const blockedByBalance = hasInsufficientSwapBalance();
  const blocked = blockedByRisk || blockedByBalance;
  els.previewSwap.disabled = blocked;
  els.previewSwap.classList.toggle("is-disabled", blocked);
  els.previewSwap.textContent = blockedByBalance ? "Insufficient balance" : "Preview swap";
}

function renderPriceImpact() {
  const impact = currentPriceImpact();
  const impactLoss = currentPriceImpactLoss();
  const severity = priceImpactSeverity(impact);
  els.priceImpact.textContent = formatPercent(impact);
  els.priceImpact.classList.toggle("is-warning", impact >= 3);
  els.priceImpact.classList.toggle("is-high", impact >= 5);
  els.impactInfo.classList.toggle("is-warning", impact >= 3);
  els.impactInfo.dataset.impact = severity.level;
  els.impactLoss.textContent = impactLoss.text;
  els.riskAckWrap.hidden = impact <= 5;
  if (impact <= 5) {
    els.riskAck.checked = false;
  }
  renderPreviewButtonState();
}

function renderAddQuote() {
  els.addShare.textContent = formatPercent(currentAddShare());
}

function calculateLiquidityFromMinima() {
  const minima = asNumber(els.addMinima.value);
  const usdt = minima > 0 ? minima * (state.usdtReserve / state.minimaReserve) : 0;
  els.addUsdt.value = usdt > 0 ? formatInputAmount(usdt) : "";
  renderAddQuote();
}

function calculateLiquidityFromUsdt() {
  const usdt = asNumber(els.addUsdt.value);
  const minima = usdt > 0 ? usdt * (state.minimaReserve / state.usdtReserve) : 0;
  els.addMinima.value = minima > 0 ? formatInputAmount(minima) : "";
  renderAddQuote();
}

function formatLiquidityInputs() {
  const minima = asNumber(els.addMinima.value);
  const usdt = asNumber(els.addUsdt.value);
  els.addMinima.value = minima > 0 ? formatInputAmount(minima) : "";
  els.addUsdt.value = usdt > 0 ? formatInputAmount(usdt) : "";
}

function currentAddShare() {
  const minima = asNumber(els.addMinima.value);
  const usdt = asNumber(els.addUsdt.value);
  const shareByMinima = minima / (state.minimaReserve + minima);
  const shareByUsdt = usdt / (state.usdtReserve + usdt);
  return Math.min(shareByMinima || 0, shareByUsdt || 0) * 100;
}

function openLiquidityPreview() {
  const minima = asNumber(els.addMinima.value);
  const usdt = asNumber(els.addUsdt.value);

  els.confirmAddMinima.textContent = `${formatQuoteAmount(minima)} MINIMA`;
  els.confirmAddUsdt.textContent = `${formatQuoteAmount(usdt)} USDT`;
  els.confirmAddShare.textContent = formatPercent(currentAddShare());
  els.confirmAddRatio.textContent = `${(state.usdtReserve / state.minimaReserve).toFixed(5)} USDT / MINIMA`;
  els.liquidityModal.hidden = false;
}

function removeOutputs() {
  const lp = asNumber(els.removeLp.value);
  const share = state.totalLpTokens > 0 ? Math.min(lp / state.totalLpTokens, 1) : 0;
  return {
    lp,
    minima: state.minimaReserve * share,
    usdt: state.usdtReserve * share,
    remaining: Math.max(state.balances.lp - lp, 0)
  };
}

function renderRemoveQuote() {
  const quote = removeOutputs();
  els.removeMinimaOut.textContent = `${formatQuoteAmount(quote.minima)} MINIMA`;
  els.removeUsdtOut.textContent = `${formatQuoteAmount(quote.usdt)} USDT`;
  els.removeRemaining.textContent = `${formatQuoteAmount(quote.remaining)} LP`;
}

function openRemovePreview() {
  const quote = removeOutputs();
  els.confirmRemoveLp.textContent = `${formatQuoteAmount(quote.lp)} LP`;
  els.confirmRemoveMinima.textContent = `${formatQuoteAmount(quote.minima)} MINIMA`;
  els.confirmRemoveUsdt.textContent = `${formatQuoteAmount(quote.usdt)} USDT`;
  els.confirmRemoveRemaining.textContent = `${formatQuoteAmount(quote.remaining)} LP`;
  els.removeModal.hidden = false;
}

function showLiquidityMode(mode) {
  const isAdd = mode === "add";
  els.addLiquidityForm.hidden = !isAdd;
  els.removeLiquidityForm.hidden = isAdd;
  els.liquidityModeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.liquidityMode === mode);
  });
}

function renderTrades() {
  els.historyFilters.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.history === state.historyView);
  });

  const trades = state.historyView === "mine"
    ? state.trades.filter((trade) => trade.owner === "mine")
    : state.trades;

  if (!trades.length) {
    els.tradeList.innerHTML = `<p class="empty-state">No trades yet.</p>`;
    return;
  }

  els.tradeList.innerHTML = trades.map((trade) => `
    <div class="trade">
      <time datetime="${trade.timestamp}" title="${formatFullTimestamp(trade.timestamp)}">${formatTradeTime(trade.timestamp)}</time>
      <div>${trade.side}<br><span>${trade.amount}</span></div>
      <strong>${trade.output}</strong>
    </div>
  `).join("");
}

function formatFullTimestamp(timestamp) {
  const date = new Date(timestamp);
  if (!Number.isFinite(date.getTime())) return "";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatTradeTime(timestamp) {
  const date = new Date(timestamp);
  if (!Number.isFinite(date.getTime())) return "";
  const now = new Date();
  const elapsedMs = now - date;
  const elapsedMinutes = Math.floor(elapsedMs / 60000);
  if (elapsedMinutes >= 0 && elapsedMinutes < 60) return `${Math.max(elapsedMinutes, 1)}m ago`;
  if (elapsedMinutes >= 60 && elapsedMinutes < 1440) return `${Math.floor(elapsedMinutes / 60)}h ago`;
  return date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function renderPositionMonitor() {
  const poolValue = state.usdtReserve * 2;
  const poolShare = state.totalLpTokens > 0 ? state.balances.lp / state.totalLpTokens : 0;
  const timeWeight = Math.min(state.position.daysHeld / 90, 1);
  const votingPower = poolShare * timeWeight * 100;
  const currentValue = poolValue * poolShare;
  const netPnl = state.position.feesEarned - state.position.impermanentLoss;
  const netReturn = state.position.investedValue > 0 ? (netPnl / state.position.investedValue) * 100 : 0;
  const annualizedReturn = state.position.daysHeld > 0 ? netReturn * (365 / state.position.daysHeld) : 0;

  els.positionValue.textContent = formatUsd(currentValue);
  els.positionValueChange.textContent = formatUsd(netPnl);
  els.positionValueChange.classList.toggle("is-positive", netPnl >= 0);
  els.positionValueChange.classList.toggle("is-negative", netPnl < 0);
  els.positionPoolShare.textContent = formatPercent(poolShare * 100);
  els.positionVotingPower.textContent = formatPercent(votingPower);
  els.positionImpermanentLoss.textContent = `-${formatUsd(state.position.impermanentLoss)}`;
  els.positionFeesEarned.textContent = formatUsd(state.position.feesEarned);
  els.positionReturn.textContent = formatPercent(netReturn);
  els.positionReturn.classList.toggle("is-positive", netReturn >= 0);
  els.positionReturn.classList.toggle("is-negative", netReturn < 0);
  els.positionAnnualizedReturn.textContent = formatPercent(annualizedReturn);
  els.positionAnnualizedReturn.classList.toggle("is-positive", annualizedReturn >= 0);
  els.positionAnnualizedReturn.classList.toggle("is-negative", annualizedReturn < 0);
  els.positionDays.textContent = state.position.daysHeld.toLocaleString("en-US");
  els.governanceCurrentFee.textContent = formatPercent(state.feeRate * 100);
  els.governanceVotingPower.textContent = formatPercent(votingPower);
}

function renderLiquidityAnalytics() {
  const poolValue = state.usdtReserve * 2;
  const latest = state.analytics[state.analytics.length - 1];
  const cumulativeVolume = state.analytics.reduce((total, day) => total + day.volume, 0);
  const cumulativeFees = state.analytics.reduce((total, day) => total + day.fees, 0);
  const dailyApr = poolValue > 0 ? (latest.fees / poolValue) * 365 * 100 : 0;
  const cumulativeReturn = poolValue > 0 ? (cumulativeFees / poolValue) * 100 : 0;

  els.dailyVolume.textContent = formatUsd(latest.volume);
  els.dailyFees.textContent = formatUsd(latest.fees);
  els.dailyApr.textContent = formatPercent(dailyApr);
  els.cumulativeVolume.textContent = formatUsd(cumulativeVolume);
  els.cumulativeFees.textContent = formatUsd(cumulativeFees);
  els.cumulativeReturn.textContent = formatPercent(cumulativeReturn);

  renderTimeSeriesChart(els.transactionsChart, {
    key: "transactions",
    yLabel: "Transactions",
    valuePrefix: "",
    valueSuffix: "",
    className: "transaction-line"
  });

  renderTimeSeriesChart(els.feesChart, {
    key: "fees",
    yLabel: "Fees (USDT)",
    valuePrefix: "$",
    valueSuffix: "",
    className: "fee-line"
  });
}

function renderTimeSeriesChart(chart, config) {
  const width = 560;
  const height = 220;
  const left = 64;
  const right = 22;
  const top = 28;
  const bottom = 48;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const values = state.analytics.map((point) => point[config.key]);
  const maxValue = Math.max(...values);
  const yMax = Math.ceil(maxValue * 1.18);
  const slot = chartWidth / Math.max(state.analytics.length - 1, 1);
  const points = state.analytics.map((point, index) => {
    const x = left + slot * index;
    const y = top + chartHeight - (point[config.key] / yMax) * chartHeight;
    return { x, y, point };
  });
  const pointString = points.map(({ x, y }) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const yTicks = [0, yMax / 2, yMax];

  chart.innerHTML = `
    <text class="axis-label y-axis-label" x="16" y="${top + chartHeight / 2}" text-anchor="middle" transform="rotate(-90 16 ${top + chartHeight / 2})">${config.yLabel}</text>
    <text class="axis-label x-axis-label" x="${left + chartWidth / 2}" y="${height - 8}" text-anchor="middle">Day</text>
    ${yTicks.map((tick) => {
      const y = top + chartHeight - (tick / yMax) * chartHeight;
      const label = `${config.valuePrefix}${Math.round(tick).toLocaleString("en-US")}${config.valueSuffix}`;
      return `
        <line class="grid-line" x1="${left}" y1="${y.toFixed(1)}" x2="${width - right}" y2="${y.toFixed(1)}" />
        <text class="tick-label" x="${left - 10}" y="${(y + 4).toFixed(1)}" text-anchor="end">${label}</text>
      `;
    }).join("")}
    <line class="axis-line" x1="${left}" y1="${top}" x2="${left}" y2="${top + chartHeight}" />
    <line class="axis-line" x1="${left}" y1="${top + chartHeight}" x2="${width - right}" y2="${top + chartHeight}" />
    <polyline class="${config.className}" points="${pointString}" />
    ${points.map(({ x, y, point }, index) => {
      const valueX = index === 0 ? x + 12 : index === points.length - 1 ? x - 12 : x;
      return `
      <circle class="data-point" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" />
      <text class="value-label" x="${valueX.toFixed(1)}" y="${(y - 10).toFixed(1)}" text-anchor="middle">${config.valuePrefix}${point[config.key].toLocaleString("en-US")}</text>
      <text class="tick-label" x="${x.toFixed(1)}" y="${height - 28}" text-anchor="middle">${point.day}</text>
    `;
    }).join("")}
  `;
}

function setResult(target, message) {
  if (!target) return;
  target.textContent = message;
  target.hidden = false;
}

function showTab(tabName) {
  els.tabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.tab === tabName);
  });

  Object.entries(els.panels).forEach(([name, panel]) => {
    panel.classList.toggle("is-active", name === tabName);
  });
}

function addTrade(side, amount, output) {
  state.trades.unshift({
    timestamp: new Date().toISOString(),
    owner: "mine",
    side,
    amount,
    output
  });
  state.trades = state.trades.slice(0, 8);
  renderTrades();
}

els.tabs.forEach((tab) => {
  tab.addEventListener("click", () => showTab(tab.dataset.tab));
});

els.liquidityModeButtons.forEach((button) => {
  button.addEventListener("click", () => showLiquidityMode(button.dataset.liquidityMode));
});

els.historyFilters.forEach((button) => {
  button.addEventListener("click", () => {
    state.historyView = button.dataset.history;
    renderTrades();
  });
});

els.switchDirection.addEventListener("click", () => {
  const currentInput = els.swapAmount.value;
  const currentOutput = els.swapOutput.value;
  els.swapDirection.value = els.swapDirection.value === "buy" ? "sell" : "buy";
  els.swapAmount.value = currentOutput;
  els.swapOutput.value = currentInput;
  formatSwapInputs();
  els.swapResult.textContent = "";
  renderSwapQuote();
});

els.swapMax.addEventListener("click", () => {
  const isBuy = els.swapDirection.value === "buy";
  els.swapAmount.value = formatInputAmount(isBuy ? state.balances.usdt : state.balances.minima);
  calculateSwapFromInput();
});

els.swapOutputMax.addEventListener("click", () => {
  els.swapOutput.value = formatInputAmount(maxSwapOutput());
  calculateSwapFromOutput();
});

document.querySelector("#swapForm").addEventListener("submit", (event) => {
  event.preventDefault();
  renderSwapQuote();

  const amount = asNumber(els.swapAmount.value);
  const output = asNumber(els.swapOutput.value);
  const isBuy = els.swapDirection.value === "buy";

  if (amount <= 0 || output <= 0) {
    if (amount > 0) {
      calculateSwapFromInput();
    } else if (output > 0) {
      calculateSwapFromOutput();
    }
  }

  const recalculatedAmount = asNumber(els.swapAmount.value);
  const recalculatedOutput = asNumber(els.swapOutput.value);

  if (recalculatedAmount <= 0 || recalculatedOutput <= 0) {
    setResult(els.swapResult, "Enter a swap amount.");
    return;
  }

  if (recalculatedAmount > currentInputBalance()) {
    setResult(els.swapResult, `Insufficient ${isBuy ? "USDT" : "MINIMA"} balance.`);
    return;
  }

  const impact = currentPriceImpact();
  if (impact > 5 && !els.riskAck.checked) {
    setResult(els.swapResult, "High price impact. Tick the acknowledgement box to continue.");
    return;
  }

  formatSwapInputs();
  renderSwapQuote();
  els.confirmFrom.textContent = `${formatQuoteAmount(recalculatedAmount)} ${isBuy ? "USDT" : "MINIMA"}`;
  els.confirmTo.textContent = `${formatQuoteAmount(recalculatedOutput)} ${isBuy ? "MINIMA" : "USDT"}`;
  els.confirmMinimum.textContent = `${els.minOutput.textContent} ${isBuy ? "MINIMA" : "USDT"}`;
  els.confirmPriceUsdtPerMinima.textContent = els.priceUsdtPerMinima.textContent;
  els.confirmPriceMinimaPerUsdt.textContent = els.priceMinimaPerUsdt.textContent;
  els.confirmPriceImpact.textContent = els.priceImpact.textContent;
  els.confirmPriceImpact.classList.toggle("is-warning", impact >= 3);
  els.confirmPriceImpact.classList.toggle("is-high", impact >= 5);
  els.confirmImpactMeter.dataset.impact = priceImpactSeverity(impact).level;
  els.confirmImpactLabel.textContent = priceImpactSeverity(impact).label;
  els.confirmImpactLoss.textContent = `Estimated pool-depth loss: ${currentPriceImpactLoss().text}`;
  els.swapModal.hidden = false;
});

els.cancelSwap.addEventListener("click", () => {
  els.swapModal.hidden = true;
});

els.swapModal.addEventListener("click", (event) => {
  if (event.target === els.swapModal) {
    els.swapModal.hidden = true;
  }
});

els.confirmSwap.addEventListener("click", () => {
  const amount = asNumber(els.swapAmount.value);
  const output = asNumber(els.swapOutput.value);
  const isBuy = els.swapDirection.value === "buy";

  els.confirmSwap.disabled = true;
  els.confirmSwap.textContent = "Submitting...";
  setResult(els.swapResult, "Transaction pending. Waiting for local Minima confirmation.");

  window.setTimeout(() => {
    addTrade(
      isBuy ? "Buy MINIMA" : "Sell MINIMA",
      `${formatQuoteAmount(amount)} ${isBuy ? "USDT" : "MINIMA"}`,
      `${formatQuoteAmount(output)} ${isBuy ? "MINIMA" : "USDT"}`
    );
    els.swapModal.hidden = true;
    els.confirmSwap.disabled = false;
    els.confirmSwap.textContent = "Confirm swap";
    setResult(els.swapResult, "Swap request accepted by the prototype. Real Minima transaction building is not connected yet.");
  }, 700);
});

document.querySelector("#addLiquidityForm").addEventListener("submit", (event) => {
  event.preventDefault();
  renderAddQuote();

  const minima = asNumber(els.addMinima.value);
  const usdt = asNumber(els.addUsdt.value);

  if (minima <= 0 || usdt <= 0) {
    setResult(els.liquidityResult, "Enter both MINIMA and USDT amounts.");
    return;
  }

  formatLiquidityInputs();
  openLiquidityPreview();
});

els.cancelAdd.addEventListener("click", () => {
  els.liquidityModal.hidden = true;
});

els.liquidityModal.addEventListener("click", (event) => {
  if (event.target === els.liquidityModal) {
    els.liquidityModal.hidden = true;
  }
});

els.confirmAdd.addEventListener("click", () => {
  const minima = asNumber(els.addMinima.value);
  const usdt = asNumber(els.addUsdt.value);

  addTrade("Add liquidity", `${formatAmount(minima)} MINIMA`, `${formatAmount(usdt)} USDT`);
  els.liquidityModal.hidden = true;
  setResult(els.liquidityResult, "Add liquidity transaction trigger requested. Real LP token minting is not connected yet.");
});

document.querySelector("#removeLiquidityForm").addEventListener("submit", (event) => {
  event.preventDefault();
  renderRemoveQuote();

  const lp = asNumber(els.removeLp.value);
  if (lp <= 0) {
    setResult(els.removeResult, "Enter an LP amount to remove.");
    return;
  }

  if (lp > state.balances.lp) {
    setResult(els.removeResult, "Amount exceeds your LP balance.");
    return;
  }

  els.removeLp.value = formatInputAmount(lp);
  renderRemoveQuote();
  openRemovePreview();
});

els.cancelRemove.addEventListener("click", () => {
  els.removeModal.hidden = true;
});

els.removeModal.addEventListener("click", (event) => {
  if (event.target === els.removeModal) {
    els.removeModal.hidden = true;
  }
});

els.confirmRemove.addEventListener("click", () => {
  const quote = removeOutputs();
  addTrade(
    "Remove liquidity",
    `${formatAmount(quote.lp)} LP`,
    `${formatAmount(quote.minima)} MINIMA / ${formatAmount(quote.usdt)} USDT`
  );
  els.removeModal.hidden = true;
  setResult(els.removeResult, "Remove liquidity transaction trigger requested. Real LP token burning is not connected yet.");
});

els.castVote.addEventListener("click", () => {
  const selectedVote = document.querySelector("input[name=\"feeVote\"]:checked");
  const vote = selectedVote ? Number(selectedVote.value) : 0;
  const nextFee = (state.feeRate * 100) + vote;
  const voteText = vote === 0 ? "no fee change" : `${vote > 0 ? "+" : ""}${vote.toFixed(2)}% fee change`;
  setResult(
    els.voteResult,
    `Vote preview: ${voteText}. The LP objective is to maximize net fee income, but a higher fee can reduce trading volume while a lower fee can increase volume with less fee per trade. If accepted, the fee would become ${formatPercent(nextFee)}. LP tokens used for this vote are frozen for 72 hours.`
  );
});

els.slippageOptions.forEach((button) => {
  button.addEventListener("click", () => {
    state.slippageTolerance = Number(button.dataset.slippage);
    els.slippageOptions.forEach((option) => option.classList.toggle("is-active", option === button));
    els.customSlippage.value = "";
    renderSwapQuote();
  });
});

els.customSlippage.addEventListener("input", () => {
  const custom = Number(els.customSlippage.value);
  if (!Number.isFinite(custom) || custom <= 0) return;
  state.slippageTolerance = custom / 100;
  els.slippageOptions.forEach((option) => option.classList.remove("is-active"));
  renderSwapQuote();
});

document.addEventListener("click", (event) => {
  if (els.swapSettings.open && !els.swapSettings.contains(event.target)) {
    els.swapSettings.open = false;
  }
});

els.swapAmount.addEventListener("input", calculateSwapFromInput);
els.swapOutput.addEventListener("input", calculateSwapFromOutput);
els.riskAck.addEventListener("change", renderPreviewButtonState);
els.addMinima.addEventListener("input", calculateLiquidityFromMinima);
els.addUsdt.addEventListener("input", calculateLiquidityFromUsdt);
els.removeLp.addEventListener("input", renderRemoveQuote);

els.addMinimaMax.addEventListener("click", () => {
  els.addMinima.value = formatInputAmount(state.balances.minima);
  calculateLiquidityFromMinima();
});

els.addUsdtMax.addEventListener("click", () => {
  els.addUsdt.value = formatInputAmount(state.balances.usdt);
  calculateLiquidityFromUsdt();
});

els.removeMax.addEventListener("click", () => {
  els.removeLp.value = formatInputAmount(state.balances.lp);
  renderRemoveQuote();
});

els.swapAmount.addEventListener("blur", () => {
  formatSwapInputs();
});

els.swapOutput.addEventListener("blur", () => {
  formatSwapInputs();
});

els.addMinima.addEventListener("blur", () => {
  formatLiquidityInputs();
});

els.addUsdt.addEventListener("blur", () => {
  formatLiquidityInputs();
});

els.removeLp.addEventListener("blur", () => {
  const lp = asNumber(els.removeLp.value);
  els.removeLp.value = lp > 0 ? formatInputAmount(lp) : "";
  renderRemoveQuote();
});

renderLiquidity();
renderBalances();
calculateSwapFromInput();
renderAddQuote();
renderRemoveQuote();
renderTrades();
renderPositionMonitor();
renderLiquidityAnalytics();
