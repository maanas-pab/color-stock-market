# 🎨📈 Color Stock Market

**Treat RED, BLUE, and YELLOW as stocks. Your portfolio IS the art.**

You start with **$100**. Prices move with a random walk. Buy low, sell high —
and watch the canvas background shift: own mostly RED and the whole painting
glows red. Go all-in on BLUE and you're swimming in blue.

Built with **p5.js** and (at its heart) just **3 variables** for the stock prices.

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

# option 2 — serve locally (recommended)
npx serve .
# or
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## How to play

1. Watch the three color-stocks tick.
2. Click **BUY** / **SELL** (or keys `1/2/3` to buy, `Q/W/E` to sell).
3. Your **portfolio mix** becomes the canvas background color.
4. Beat buy-and-hold: grow your $100 net worth before a stock moons without you.

More details coming as the project grows — see the commit history.
