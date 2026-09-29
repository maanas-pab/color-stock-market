/* ------------------------------------------------------------------
 * charts.js — draws the market ticker: three sparklines + price labels
 * overlaid at the top of the canvas so it reads like a Bloomberg
 * terminal that melted into a painting.
 * ------------------------------------------------------------------ */

const CHART_COLORS = {
  RED: [200, 30, 30],
  BLUE: [30, 80, 220],
  YELLOW: [200, 160, 10],
};

function paintTicker() {
  drawTickerBar();
}

/** Translucent dark strip with live prices. Called from updateHUD? No —
 *  drawn in canvas space each frame for crisp text. */
function drawTickerBar() {
  const p = getPrices();
  noStroke();
  fill(15, 15, 20, 170);
  rect(0, 0, width, 64);

  fill(255);
  textSize(13);
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  text(`TICK ${tick}`, 12, 20);

  textStyle(NORMAL);
  textSize(13);
  fill(255, 120, 120);
  text(`RED $${p.RED.toFixed(2)}`, 12, 44);
  fill(140, 170, 255);
  text(`BLUE $${p.BLUE.toFixed(2)}`, 140, 44);
  fill(255, 220, 120);
  text(`YELLOW $${p.YELLOW.toFixed(2)}`, 280, 44);

  const nw = netWorth();
  const pnl = nw - STARTING_CASH;
  fill(pnl >= 0 ? color(120, 255, 150) : color(255, 120, 120));
  textAlign(RIGHT, CENTER);
  text(`NET $${nw.toFixed(2)} (${pnl >= 0 ? "+" : ""}${pnl.toFixed(2)})`, width - 12, 32);
  textAlign(LEFT, CENTER);
}

function drawSparklines(x, y, w, h) {
  push();
  translate(x, y);
  noFill();
  for (const key of ["RED", "BLUE", "YELLOW"]) {
    const hist = priceHistory[key];
    if (hist.length < 2) continue;
    const lo = Math.min(...hist);
    const hi = Math.max(...hist);
    const span = Math.max(1e-6, hi - lo);
    stroke(CHART_COLORS[key][0], CHART_COLORS[key][1], CHART_COLORS[key][2]);
    strokeWeight(2);
    beginShape();
    hist.forEach((v, i) => {
      const px = (i / (MAX_HISTORY - 1)) * w;
      const py = h - ((v - lo) / span) * (h - 8) - 4;
      vertex(px, py);
    });
    endShape();
  }
  pop();
}
