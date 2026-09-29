# 🎨📈 Color Stock Market

**▶ Play it live: https://maanas-pab.github.io/color-stock-market/**

**Treat RED, BLUE, and YELLOW as stocks. Your portfolio IS the art.**

You start with **$100**. Three color-stocks tick with a random walk. Buy low,
sell high — and the canvas background is mixed live from your holdings: own
mostly RED and the whole painting glows red. Corner YELLOW before a spike and
you're bathed in gold.

Built with **p5.js**. At its heart: just **3 variables**.

```js
let RED = 20.0;
let BLUE = 20.0;
let YELLOW = 20.0;
```

## How to run

No build step. Just open it:

```bash
# option 1 — open directly
open index.html

# option 2 — serve locally (recommended, avoids CDN/file quirks)
npx serve .
# or
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## How to play

| Action | Mouse | Keyboard |
|---|---|---|
| Buy RED / BLUE / YELLOW | Buy button | `1` / `2` / `3` |
| Sell RED / BLUE / YELLOW | Sell button | `Q` / `W` / `E` |
| Pause / resume | Pause button | `Space` |
| Speed 1× → 2× → 4× | Speed button | — |
| Fresh $100 + blank canvas | Reset button | — |
| Download price history | Export CSV | — |

**Win condition:** there isn't one — it's a painting. But beating $100 net
worth means you out-traded noise, and the canvas proves it.

## The market model

Each stock follows a geometric-ish random walk, stepped every frame:

```
price *= 1 + drift + volatility × shock
```

| Stock | Drift | Volatility | Personality |
|---|---|---|---|
| RED | +0.12% | 2.8% | the crowd favorite |
| BLUE | +0.06% | 2.0% | slow, steady, cold |
| YELLOW | +0.18% | 3.8% | volatile rocket (or wreck) |

Shocks are partially correlated (a shared "market mood" factor), so colors
sometimes rally and crash together. Prices are clamped to [$1, $200] — a
color can crash 95% but never go negative.

On top of that, the **news wire** (`js/events.js`) fires every few hundred
ticks: viral moments, critic takedowns, pigment shortages, market-wide
selloffs. Each event shocks prices *and* bursts matching brush strokes
across the canvas.

## Your portfolio is the palette

- **Background** = value-weighted mix of holdings. All cash → soft paper
  white; all RED → deep crimson. Color eases toward its target so shifts
  feel like wet paint, not a light switch.
- **Brush strokes** = tinted by whichever stock has the best trailing
  12-tick return. Momentum paints.
- **Grain** = 40 faint speckles per frame for a paper feel.

## Project map

```
index.html            scaffold: canvas + trading panel
css/style.css         gallery-terminal theme
js/market.js          RED/BLUE/YELLOW random-walk engine
js/portfolio.js       $100 wallet, buy/sell, pigment mix
js/events.js          news-wire shocks + stroke bursts
js/charts.js          ticker bar + sparklines overlay
js/sketch.js          p5 draw loop: market → paint → HUD
js/ui.js              stock cards, cash/net-worth, CSV export
data/sample-history.csv   200 ticks of example market data
```

## Data

Hit **Export CSV** any time to download the full session history as
`tick,RED,BLUE,YELLOW`. A sample run lives in `data/sample-history.csv` —
plot it, backtest a strategy, or seed a new canvas.

## License

MIT — see [LICENSE](LICENSE).
