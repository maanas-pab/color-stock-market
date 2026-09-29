/* ------------------------------------------------------------------
 * sketch.js — the painting. Every frame:
 *   1. step the market,
 *   2. mix the background color from the portfolio,
 *   3. lay down brush strokes tinted by recent winners.
 * Your holdings literally ARE the palette.
 * ------------------------------------------------------------------ */

let strokes = [];
const MAX_STROKES = 900;

function setup() {
  const holder = document.getElementById("sketch-holder");
  const w = holder ? holder.clientWidth : 800;
  const canvas = createCanvas(Math.max(320, w), 520);
  canvas.parent("sketch-holder");
  frameRate(30);
  background(240, 238, 230);
  buildUI();
  pushNews("Market opens. RED $20 · BLUE $20 · YELLOW $20.");
}

function draw() {
  if (!paused) {
    stepMarket();
    maybeMarketEvent();
    layStroke();
  }
  paintBackground();
  paintStrokes();
  paintGrain();
  drawTickerBar();
  drawSparklines(12, 76, Math.min(360, width - 24), 90);
  updateHUD();
}

function windowResized() {
  const holder = document.getElementById("sketch-holder");
  if (holder) resizeCanvas(Math.max(320, holder.clientWidth), 520);
}

/** Background = portfolio mix, eased so color shifts feel like paint. */
let bgR = 240;
let bgG = 238;
let bgB = 230;

function paintBackground() {
  const mix = portfolioMix();
  const tR = mix.r * 255;
  const tG = (mix.empty ? 0.93 : 0.25 + mix.g * 0.7) * 255;
  const tB = (mix.empty ? 0.9 : mix.b) * 255;
  bgR += (tR - bgR) * 0.04;
  bgG += (tG - bgG) * 0.04;
  bgB += (tB - bgB) * 0.04;
  background(bgR, bgG, bgB);
}

/** Drop a translucent brush stroke each tick, tinted by momentum. */
function layStroke() {
  const p = getPrices();
  const rets = {
    RED: recentReturn("RED"),
    BLUE: recentReturn("BLUE"),
    YELLOW: recentReturn("YELLOW"),
  };
  const winner = Object.keys(rets).sort((a, b) => rets[b] - rets[a])[0];
  const col = strokeColorFor(winner);
  const n = 1 + Math.floor(Math.random() * 2);
  for (let i = 0; i < n; i++) {
    strokes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      len: 20 + Math.random() * 90,
      ang: Math.random() * Math.PI * 2,
      w: 2 + Math.random() * 10,
      col,
      alpha: 26 + Math.random() * 40,
      age: 0,
    });
  }
  if (strokes.length > MAX_STROKES) strokes.splice(0, strokes.length - MAX_STROKES);
}

function strokeColorFor(winner) {
  if (winner === "RED") return [225, 40, 40];
  if (winner === "BLUE") return [40, 90, 230];
  return [240, 200, 30];
}

function paintStrokes() {
  noStroke();
  for (const s of strokes) {
    s.age += 1;
    push();
    translate(s.x, s.y);
    rotate(s.ang);
    fill(s.col[0], s.col[1], s.col[2], s.alpha);
    rectMode(CENTER);
    rect(0, 0, s.len, s.w, s.w);
    pop();
  }
}

/** Subtle film grain so the canvas feels like paper, not pixels. */
function paintGrain() {
  stroke(0, 0, 0, 8);
  strokeWeight(1);
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    point(x, y);
  }
}

function recentReturn(color, lookback = 12) {
  const h = priceHistory[color];
  if (h.length <= lookback) return 0;
  const then = h[h.length - 1 - lookback];
  const now = h[h.length - 1];
  return (now - then) / then;
}

function keyPressed() {
  if (key === "1") buy("RED");
  else if (key === "2") buy("BLUE");
  else if (key === "3") buy("YELLOW");
  else if (key === "q" || key === "Q") sell("RED");
  else if (key === "w" || key === "W") sell("BLUE");
  else if (key === "e" || key === "E") sell("YELLOW");
  else if (key === " ") {
    paused = !paused;
    syncPauseButton();
    return false;
  }
}
