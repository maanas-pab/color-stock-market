/* ------------------------------------------------------------------
 * market.js — the heart of the piece: just 3 variables for prices.
 *
 *   RED, BLUE, YELLOW behave like tiny stocks following a random walk
 *   with drift, volatility clustering, and a hard price floor so a
 *   color can crash without going negative.
 * ------------------------------------------------------------------ */

const STARTING_PRICE = 20.0;
const PRICE_FLOOR = 1.0;
const PRICE_CAP = 200.0;

let RED = STARTING_PRICE;
let BLUE = STARTING_PRICE;
let YELLOW = STARTING_PRICE;

let tick = 0;
let paused = false;
let priceHistory = { RED: [RED], BLUE: [BLUE], YELLOW: [YELLOW] };
const MAX_HISTORY = 400;

// Per-stock personality: drift (trend) + volatility (jitter).
const STOCK_PARAMS = {
  RED: { drift: 0.0012, vol: 0.028 },
  BLUE: { drift: 0.0006, vol: 0.02 },
  YELLOW: { drift: 0.0018, vol: 0.038 },
};

function getPrices() {
  return { RED, BLUE, YELLOW };
}

function setPrices(next) {
  RED = clampPrice(next.RED);
  BLUE = clampPrice(next.BLUE);
  YELLOW = clampPrice(next.YELLOW);
}

function clampPrice(p) {
  if (!isFinite(p)) return PRICE_FLOOR;
  return Math.min(PRICE_CAP, Math.max(PRICE_FLOOR, p));
}

/** Advance the market one tick using geometric-ish random walk. */
function stepMarket() {
  tick += 1;

  const shock = gaussianShock();

  RED = clampPrice(RED * (1 + STOCK_PARAMS.RED.drift + STOCK_PARAMS.RED.vol * shock.r + smallNoise()));
  BLUE = clampPrice(BLUE * (1 + STOCK_PARAMS.BLUE.drift + STOCK_PARAMS.BLUE.vol * shock.b + smallNoise()));
  YELLOW = clampPrice(YELLOW * (1 + STOCK_PARAMS.YELLOW.drift + STOCK_PARAMS.YELLOW.vol * shock.y + smallNoise()));

  priceHistory.RED.push(RED);
  priceHistory.BLUE.push(BLUE);
  priceHistory.YELLOW.push(YELLOW);
  for (const key of Object.keys(priceHistory)) {
    if (priceHistory[key].length > MAX_HISTORY) priceHistory[key].shift();
  }
}

function smallNoise() {
  return (Math.random() - 0.5) * 0.004;
}

/** Correlated-ish shocks so the market feels alive, not independent. */
function gaussianShock() {
  const market = randn() * 0.6;
  return {
    r: market + randn() * 0.8,
    b: market * 0.7 + randn() * 0.8,
    y: market * 0.4 + randn() * 1.0,
  };
}

// Box–Muller transform.
function randn() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function resetMarket() {
  RED = STARTING_PRICE;
  BLUE = STARTING_PRICE;
  YELLOW = STARTING_PRICE;
  tick = 0;
  paused = false;
  priceHistory = { RED: [RED], BLUE: [BLUE], YELLOW: [YELLOW] };
  resetPortfolio();
  pushNews("Market reset. Fresh $100, fresh canvas.");
}
