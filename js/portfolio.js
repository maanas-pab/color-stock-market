/* ------------------------------------------------------------------
 * portfolio.js — the $100 wallet. Holdings double as paint pigment:
 * the more of a color you own (by value), the more it tints the canvas.
 * ------------------------------------------------------------------ */

const STARTING_CASH = 100.0;

let cash = STARTING_CASH;
let holdings = { RED: 0, BLUE: 0, YELLOW: 0 };

function resetPortfolio() {
  cash = STARTING_CASH;
  holdings = { RED: 0, BLUE: 0, YELLOW: 0 };
}

function priceOf(color) {
  return getPrices()[color];
}

/** Buy `qty` shares of a color (default 1). Returns true on success. */
function buy(color, qty = 1) {
  const cost = priceOf(color) * qty;
  if (cost > cash + 1e-9) {
    pushNews(`Not enough cash to buy ${qty} ${color} ($${cost.toFixed(2)}).`);
    return false;
  }
  cash -= cost;
  holdings[color] += qty;
  return true;
}

/** Sell `qty` shares of a color (default 1). Returns true on success. */
function sell(color, qty = 1) {
  if (holdings[color] < qty) {
    pushNews(`You don't own enough ${color} to sell.`);
    return false;
  }
  holdings[color] -= qty;
  cash += priceOf(color) * qty;
  return true;
}

function holdingsValue() {
  const p = getPrices();
  return holdings.RED * p.RED + holdings.BLUE * p.BLUE + holdings.YELLOW * p.YELLOW;
}

function netWorth() {
  return cash + holdingsValue();
}

/**
 * Portfolio mix as RGB weights in [0,1].
 * All-cash (or empty) portfolio drifts toward a soft paper white so the
 * painting starts blank and gains color as you invest.
 */
function portfolioMix() {
  const p = getPrices();
  const vR = holdings.RED * p.RED;
  const vB = holdings.BLUE * p.BLUE;
  const vY = holdings.YELLOW * p.YELLOW;
  const total = vR + vB + vY;

  if (total < 1e-6) {
    return { r: 0.94, g: 0.93, b: 0.9, empty: true };
  }

  // YELLOW contributes to red+green channels (it's yellow, not blue).
  const r = (vR + vY) / total;
  const g = vY / total;
  const b = vB / total;

  // Keep it vivid: lift saturation a touch.
  return { r: Math.min(1, r * 1.05), g: Math.min(1, 0.08 + g), b: Math.min(1, b * 1.05), empty: false };
}

function portfolioSummary() {
  return {
    cash,
    holdings: { ...holdings },
    value: holdingsValue(),
    netWorth: netWorth(),
    mix: portfolioMix(),
  };
}
