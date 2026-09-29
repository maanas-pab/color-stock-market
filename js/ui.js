/* ------------------------------------------------------------------
 * ui.js — DOM side of the piece: stock cards, cash/net-worth readout,
 * pause + reset + CSV export wiring, and the market news wire.
 * ------------------------------------------------------------------ */

const STOCK_META = {
  RED: { hex: "#e12828", key: "1 / Q" },
  BLUE: { hex: "#285ae6", key: "2 / W" },
  YELLOW: { hex: "#f0c81e", key: "3 / E" },
};

function buildUI() {
  const container = document.getElementById("stocks");
  if (!container) return;
  container.innerHTML = "";
  for (const color of ["RED", "BLUE", "YELLOW"]) {
    const card = document.createElement("div");
    card.className = "stock-card";
    card.innerHTML = `
      <div class="stock-head">
        <span class="dot" style="background:${STOCK_META[color].hex}"></span>
        <strong>${color}</strong>
        <span class="price" id="price-${color}">$20.00</span>
      </div>
      <div class="stock-sub">
        <span id="held-${color}">0 sh</span>
        <span class="key">${STOCK_META[color].key}</span>
      </div>
      <div class="stock-actions">
        <button data-buy="${color}">Buy</button>
        <button data-sell="${color}">Sell</button>
      </div>`;
    container.appendChild(card);
  }

  container.querySelectorAll("[data-buy]").forEach((b) =>
    b.addEventListener("click", () => buy(b.dataset.buy))
  );
  container.querySelectorAll("[data-sell]").forEach((b) =>
    b.addEventListener("click", () => sell(b.dataset.sell))
  );

  document.getElementById("btn-pause")?.addEventListener("click", () => {
    paused = !paused;
    syncPauseButton();
  });
  document.getElementById("btn-speed")?.addEventListener("click", cycleSpeed);
  document.getElementById("btn-reset")?.addEventListener("click", () => {
    resetMarket();
    strokes = [];
    syncPauseButton();
  });
  document.getElementById("btn-export")?.addEventListener("click", exportCSV);
}

function updateHUD() {
  const p = getPrices();
  const summary = portfolioSummary();

  const cashEl = document.getElementById("cash");
  const nwEl = document.getElementById("networth");
  if (cashEl) cashEl.textContent = `$${summary.cash.toFixed(2)}`;
  if (nwEl) {
    nwEl.textContent = `$${summary.netWorth.toFixed(2)}`;
    nwEl.classList.toggle("down", summary.netWorth < STARTING_CASH);
  }

  for (const color of ["RED", "BLUE", "YELLOW"]) {
    const priceEl = document.getElementById(`price-${color}`);
    if (priceEl) priceEl.textContent = `$${p[color].toFixed(2)}`;
    const heldEl = document.getElementById(`held-${color}`);
    if (heldEl) {
      const sh = summary.holdings[color];
      const val = sh * p[color];
      heldEl.textContent = `${sh} sh · $${val.toFixed(2)}`;
    }
  }
}

function syncPauseButton() {
  const btn = document.getElementById("btn-pause");
  if (btn) btn.textContent = paused ? "Resume" : "Pause";
}

const SPEEDS = [1, 2, 4];
let speedIdx = 0;

/** Cycle 1× → 2× → 4× simulation speed. */
function cycleSpeed() {
  speedIdx = (speedIdx + 1) % SPEEDS.length;
  const btn = document.getElementById("btn-speed");
  if (btn) btn.textContent = `Speed: ${SPEEDS[speedIdx]}×`;
  if (typeof frameRate !== "undefined") frameRate(30 * SPEEDS[speedIdx]);
}

function pushNews(msg) {
  const el = document.getElementById("news");
  if (!el) return;
  el.textContent = msg;
}

/** Download the full price history as CSV (art-grade market data). */
function exportCSV() {
  const rows = ["tick,RED,BLUE,YELLOW"];
  const n = priceHistory.RED.length;
  for (let i = 0; i < n; i++) {
    rows.push(
      `${i},${priceHistory.RED[i].toFixed(4)},${priceHistory.BLUE[i].toFixed(4)},${priceHistory.YELLOW[i].toFixed(4)}`
    );
  }
  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "color-market-history.csv";
  a.click();
  URL.revokeObjectURL(a.href);
  pushNews(`Exported ${n} ticks of market history to CSV.`);
}
