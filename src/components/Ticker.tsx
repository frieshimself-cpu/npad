import { Link } from "react-router-dom";
import { recentTrades, getCoin } from "../data/coins";
import { fmtSol, shortAddr } from "../lib/format";

export function Ticker() {
  const trades = recentTrades();
  const items = [...trades, ...trades]; // duplicated for a seamless loop
  return (
    <div className="ticker" aria-label="Recent trades">
      <div className="ticker-track">
        {items.map((t, i) => {
          const c = getCoin(t.coinId);
          if (!c) return null;
          return (
            <Link key={`${t.id}-${i}`} to={`/coin/${c.id}`} className="ticker-item">
              <span className={`side ${t.side}`}>{t.side.toUpperCase()}</span>
              <span className="mono dim">{shortAddr(t.wallet)}</span>
              <span className="muted">{t.side === "buy" ? "bought" : "sold"}</span>
              <span className="mono">{fmtSol(t.sol)}</span>
              <span className="muted">of</span>
              <span style={{ fontWeight: 600 }}>${c.ticker}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
