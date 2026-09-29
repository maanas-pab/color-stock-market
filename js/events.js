/* ------------------------------------------------------------------
 * events.js — the market wire. Every so often a headline hits and one
 * color spikes or crashes. It keeps the painting (and the player)
 * from getting comfortable.
 * ------------------------------------------------------------------ */

const EVENTS = [
  { text: "🔥 RED goes viral — galleries can't get enough crimson.", color: "RED", shock: 0.22 },
  { text: "🌊 BLUE wins the biennale — collectors pile in.", color: "BLUE", shock: 0.2 },
  { text: "🌟 YELLOW spotted in a blockbuster film — demand surges.", color: "YELLOW", shock: 0.25 },
  { text: "📉 RED overprinted — the market dumps crimson.", color: "RED", shock: -0.2 },
  { text: "🥶 BLUE declared 'cold' by critics — prices slip.", color: "BLUE", shock: -0.18 },
  { text: "🌧 YELLOW out of season — ochre fatigue sets in.", color: "YELLOW", shock: -0.22 },
  { text: "🎨 Pigment shortage! All colors squeeze higher.", color: "ALL", shock: 0.1 },
  { text: "🧹 Market-wide selloff — collectors take profit.", color: "ALL", shock: -0.09 },
];

let nextEventTick = 350;

function maybeMarketEvent() {
  if (tick < nextEventTick) return;
  nextEventTick = tick + 300 + Math.floor(Math.random() * 500);

  const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)];
  applyEventShock(ev);
  pushNews(`[tick ${tick}] ${ev.text}`);
  burstStrokes(ev.color, ev.shock > 0 ? 26 : 14);
}

function applyEventShock(ev) {
  const targets = ev.color === "ALL" ? ["RED", "BLUE", "YELLOW"] : [ev.color];
  const next = getPrices();
  for (const c of targets) {
    // Scale the shock down a touch for ALL-market events per color.
    const s = ev.color === "ALL" ? ev.shock : ev.shock;
    next[c] = clampPrice(next[c] * (1 + s));
  }
  setPrices(next);
}

/** Celebration (or panic) brush burst across the canvas. */
function burstStrokes(color, count) {
  const palette = color === "ALL" ? [[225, 40, 40], [40, 90, 230], [240, 200, 30]] : [strokeColorFor(color)];
  for (let i = 0; i < count; i++) {
    const col = palette[Math.floor(Math.random() * palette.length)];
    strokes.push({
      x: Math.random() * (typeof width !== "undefined" ? width : 800),
      y: Math.random() * (typeof height !== "undefined" ? height : 520),
      len: 40 + Math.random() * 120,
      ang: Math.random() * Math.PI * 2,
      w: 3 + Math.random() * 12,
      col,
      alpha: 40 + Math.random() * 50,
      age: 0,
    });
  }
}
