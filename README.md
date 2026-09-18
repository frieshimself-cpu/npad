# NIGGAPAD

Frontend for a memecoin launchpad on Robinhood Chain, built on Pons, with one twist: the person a
coin is about gets the biggest share of every trade fee, paid out in ETH once they verify their X account.

Built with Vite, React 19, TypeScript, react-router, and plain CSS. No backend or on-chain
integration yet. Everything is driven by mock data so the UI can be reviewed and iterated on first.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build
```

## Deploy to Vercel

The repo is ready to deploy as-is. `vercel.json` sets the Vite framework preset, the build
command, and an SPA rewrite so deep links like `/coin/amara` resolve on refresh.

**From the dashboard:** import the GitHub repo at https://vercel.com/new, keep the detected
settings (Framework: Vite, build `npm run build`, output `dist`), and click Deploy. Every push to
the connected branch redeploys automatically.

**From the CLI:**

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production deployment
```

No environment variables are required yet. Once the app talks to the Robinhood Chain RPC or Pons, add them in
the Vercel project settings and read them with `import.meta.env.VITE_*`.

## Pages

| Route | What it does |
| --- | --- |
| `/` | Hero, live stats, trade ticker, searchable/sortable board of coins, fee split, how-it-works |
| `/coin/:id` | Price chart, bonding-curve progress, buy/sell panel with live fee breakdown, fees earned for the person, comments/trades/holders |
| `/launch` | Form to deploy a coin for someone (name, X handle, ticker, description, image, optional first buy) with live preview and consent notice |
| `/claim` | Look up an X handle, connect a wallet, verify with X, claim escrowed fees |
| `/how-it-works` | Fee model, curve mechanics, FAQ |

## Things to swap before going live

- **Brand.** `BRAND` in `src/config.ts` holds the name and X handle. The name is used everywhere from the nav to the footer; the X handle is still a placeholder.
- **Fee model.** `FEES` in `src/config.ts` sets the trade fee (1%) and the split (60% person / 20% launcher / 20% protocol). The whole UI reads from it.
- **Chain and launchpad.** `CHAIN` in `src/config.ts` names Robinhood Chain, ETH as the quote asset, and Pons as the launchpad. `CURVE` sets the virtual reserves and 17 ETH graduation; `src/lib/curve.ts` has the quote math.
- **Wallet.** `src/context/WalletContext.tsx` is a mock. Replace it with wagmi or viem configured for Robinhood Chain; the `WalletButton` and `WalletModal` components are shaped to make that a drop-in.
- **Data.** `src/data/coins.ts` holds fictional sample coins and people. Replace with the Pons API or your own indexer.
- **X verification.** The "Sign in with X" button on the claim page is a stub for an OAuth flow that proves control of the handle before releasing escrowed fees.

## Design notes

- The person share is locked to the X handle entered at launch. The launcher cannot redirect it, and unclaimed fees stay in escrow. The launch form makes the launcher confirm this.
- Dark theme only, with Robinhood green as the primary accent, green for buys, red for sells.
- Responsive down to 360px with no horizontal scroll.
