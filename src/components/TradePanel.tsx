import { useMemo, useState } from "react";
import { ArrowDown, Info } from "lucide-react";
import type { Coin } from "../types";
import { useWallet } from "../context/WalletContext";
import { useToast } from "../context/ToastContext";
import { quoteBuy, quoteSell, spotPrice } from "../lib/curve";
import { fmtCompact, fmtPct, fmtSol } from "../lib/format";
import { FEES } from "../config";
import { WalletButton } from "./WalletButton";

const BUY_CHIPS = [0.1, 0.5, 1, 5];
const SELL_CHIPS = [0.25, 0.5, 0.75, 1];

export function TradePanel({ coin }: { coin: Coin }) {
  const wallet = useWallet();
  const { toast } = useToast();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("0.5");
  const [slippage, setSlippage] = useState(2);

  // Mock holdings for the connected wallet so the sell side has something to quote.
  const holdingTokens = wallet.connected ? 2_400_000 : 0;

  const n = Number(amount) || 0;
  const quote = useMemo(() => {
    if (n <= 0) return null;
    return side === "buy" ? quoteBuy(n, coin.solRaised) : quoteSell(n, coin.solRaised);
  }, [side, n, coin.solRaised]);

  const price = spotPrice(coin.solRaised);
  const invalid = wallet.connected && (side === "buy" ? n > wallet.balanceSol : n > holdingTokens);
  const disabled = !quote || invalid || n <= 0;

  const submit = () => {
    if (!quote) return;
    toast(
      side === "buy"
        ? `Bought ${fmtCompact(quote.output)} $${coin.ticker}. ${fmtSol(quote.feeToPerson, 4)} sent to ${coin.person.xHandle}'s escrow.`
        : `Sold for ${fmtSol(quote.output, 3)}. ${fmtSol(quote.feeToPerson, 4)} sent to ${coin.person.xHandle}'s escrow.`,
    );
  };

  return (
    <div className="card trade">
      <div className="seg" role="tablist">
        <button role="tab" aria-selected={side === "buy"} className={`buy${side === "buy" ? " active" : ""}`} onClick={() => { setSide("buy"); setAmount("0.5"); }}>Buy</button>
        <button role="tab" aria-selected={side === "sell"} className={`sell${side === "sell" ? " active" : ""}`} onClick={() => { setSide("sell"); setAmount(holdingTokens ? String(holdingTokens) : "0"); }}>Sell</button>
      </div>

      <div className="row-between" style={{ fontSize: 12 }}>
        <span className="dim">{side === "buy" ? "Balance" : "You hold"}</span>
        <span className="mono muted">{side === "buy" ? fmtSol(wallet.balanceSol) : `${fmtCompact(holdingTokens)} $${coin.ticker}`}</span>
      </div>

      <div className="amount">
        <input
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
          aria-label={side === "buy" ? "SOL amount" : "Token amount"}
        />
        <span className="unit">{side === "buy" ? "SOL" : `$${coin.ticker}`}</span>
      </div>

      <div className="chips">
        {side === "buy"
          ? BUY_CHIPS.map((c) => <button key={c} onClick={() => setAmount(String(c))}>{c} SOL</button>)
          : SELL_CHIPS.map((c) => <button key={c} onClick={() => setAmount(String(Math.floor(holdingTokens * c)))}>{Math.round(c * 100)}%</button>)}
        <button onClick={() => setSlippage((s) => (s === 2 ? 5 : s === 5 ? 10 : 2))} style={{ marginLeft: "auto" }} title="Cycle slippage">
          Slippage {slippage}%
        </button>
      </div>

      {quote && (
        <div className="quote">
          <div className="r"><span>Price</span><b>{price.toExponential(3)} SOL</b></div>
          <div className="r"><span>You receive</span><b>{side === "buy" ? `${fmtCompact(quote.output)} $${coin.ticker}` : fmtSol(quote.output, 4)}</b></div>
          <div className="r"><span>Price impact</span><b style={{ color: Math.abs(quote.priceImpact) > 0.05 ? "var(--red)" : undefined }}>{fmtPct(quote.priceImpact, 2)}</b></div>
          <hr />
          <div className="r"><span>Fee ({FEES.tradeFeeBps / 100}%)</span><b>{fmtSol(quote.fee, 4)}</b></div>
          <div className="r hi"><span><ArrowDown size={11} style={{ verticalAlign: -1 }} /> To {coin.person.xHandle}</span><b>{fmtSol(quote.feeToPerson, 4)}</b></div>
          <div className="r"><span>To launcher</span><b>{fmtSol(quote.feeToLauncher, 4)}</b></div>
          <div className="r"><span>To protocol</span><b>{fmtSol(quote.feeToProtocol, 4)}</b></div>
        </div>
      )}

      {invalid && n > 0 && <p className="red" style={{ fontSize: 12 }}>Not enough {side === "buy" ? "SOL" : `$${coin.ticker}`} in your wallet.</p>}

      {wallet.connected ? (
        <button className={`btn btn-lg btn-block ${side === "buy" ? "btn-green" : "btn-red"}`} disabled={disabled} onClick={submit}>
          {side === "buy" ? `Buy $${coin.ticker}` : `Sell $${coin.ticker}`}
        </button>
      ) : (
        <WalletButton block />
      )}

      <p className="dim" style={{ fontSize: 12, display: "flex", gap: 6 }}>
        <Info size={13} style={{ flex: "0 0 auto", marginTop: 2 }} />
        {coin.person.claimed
          ? `${coin.person.xHandle} has claimed this coin. Their share pays out to their wallet automatically.`
          : `${coin.person.xHandle} hasn't claimed yet. Their share sits in escrow until they verify on X.`}
      </p>
    </div>
  );
}
