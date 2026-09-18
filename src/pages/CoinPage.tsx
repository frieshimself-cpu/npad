import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BadgeCheck, Clock, Copy, ExternalLink, Lock, Users } from "lucide-react";
import { getCoin } from "../data/coins";
import { Avatar } from "../components/Avatar";
import { PriceChart } from "../components/PriceChart";
import { TradePanel } from "../components/TradePanel";
import { XIcon } from "../components/XIcon";
import { useToast } from "../context/ToastContext";
import { graduationProgress, marketCapEth, spotPrice, tokensSold } from "../lib/curve";
import { fmtCompact, fmtEth, fmtUsd, shortAddr, timeAgo } from "../lib/format";
import { fakeAddress, hashString, mulberry32 } from "../lib/seed";
import { CURVE } from "../config";

export function CoinPage() {
  const { id = "" } = useParams();
  const coin = getCoin(id);
  const { toast } = useToast();
  const [tab, setTab] = useState<"comments" | "trades" | "holders">("comments");

  if (!coin) {
    return (
      <div className="container">
        <div className="card empty" style={{ marginTop: 40 }}>
          That coin doesn't exist. <Link to="/" className="accent">Back to the board</Link>
        </div>
      </div>
    );
  }

  const price = spotPrice(coin.ethRaised);
  const mcap = marketCapEth(coin.ethRaised);
  const prog = graduationProgress(coin.ethRaised);
  const change = coin.history[coin.history.length - 1] / coin.history[0] - 1;
  const unclaimed = coin.personFeesEth - coin.personFeesClaimedEth;
  const contract = fakeAddress(`contract-${coin.id}`);

  const copy = (s: string) => { navigator.clipboard?.writeText(s); toast("Copied to clipboard"); };

  return (
    <div className="container" style={{ paddingTop: 20, paddingBottom: 20 }}>
      <Link to="/" className="btn btn-ghost btn-sm" style={{ marginLeft: -8 }}><ArrowLeft size={14} /> Board</Link>

      <div className="coin-layout" style={{ marginTop: 12 }}>
        <div className="stack">
          <div className="card card-pad">
            <div className="coin-head">
              <Avatar name={coin.person.name} size={72} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1>{coin.name} <span className="sym">${coin.ticker}</span></h1>
                <div className="meta">
                  <a href={`https://x.com/${coin.person.xHandle}`} target="_blank" rel="noreferrer" className="x-link"><XIcon size={12} /> {coin.person.xHandle} <ExternalLink size={11} /></a>
                  <span>{coin.person.role} · {coin.person.city}</span>
                  {coin.person.claimed
                    ? <span className="badge badge-green"><BadgeCheck size={12} /> Claimed by {coin.person.xHandle}</span>
                    : <span className="badge badge-accent"><Lock size={12} /> Unclaimed · fees in escrow</span>}
                  <span className="dim"><Clock size={12} style={{ verticalAlign: -2 }} /> {timeAgo(coin.createdAt)}</span>
                </div>
                <p className="muted" style={{ marginTop: 12, fontSize: 14 }}>{coin.description}</p>
              </div>
            </div>

            <div className="price-block">
              <div>
                <div className="kv">Market cap</div>
                <div className="big">{fmtUsd(mcap)}</div>
                <div style={{ fontSize: 13, color: change >= 0 ? "var(--green)" : "var(--red)", fontFamily: "var(--mono)" }}>{change >= 0 ? "+" : ""}{(change * 100).toFixed(1)}% since launch</div>
              </div>
              <div><div className="kv">Price</div><div className="v">{price.toExponential(3)} ETH</div></div>
              <div><div className="kv">24h vol</div><div className="v">{fmtEth(coin.volume24hEth, 1)}</div></div>
              <div><div className="kv">Holders</div><div className="v">{fmtCompact(coin.holders)}</div></div>
            </div>
          </div>

          <div className="card chart-wrap">
            <PriceChart data={coin.history} />
          </div>

          <div className="card card-pad">
            <div className="row-between">
              <span className="panel-title">Bonding curve</span>
              <span className="mono muted" style={{ fontSize: 13 }}>{fmtEth(coin.ethRaised, 1)} / {CURVE.graduationEth} ETH</span>
            </div>
            <div className="progress" style={{ marginTop: 10, height: 10 }}><i style={{ width: `${prog * 100}%` }} /></div>
            <p className="muted" style={{ fontSize: 13, marginTop: 10 }}>
              {prog >= 1
                ? "This coin graduated. Liquidity is on a DEX and permanently locked."
                : `${Math.round(prog * 100)}% of the way there. ${fmtCompact(tokensSold(coin.ethRaised))} tokens sold of ${fmtCompact(CURVE.totalSupply)}. When the curve fills, liquidity moves to a DEX and gets burned.`}
            </p>
            <div className="row-between" style={{ marginTop: 12, fontSize: 12 }}>
              <span className="dim">Contract</span>
              <button className="btn btn-ghost btn-sm mono" onClick={() => copy(contract)}>{shortAddr(contract)} <Copy size={12} /></button>
            </div>
          </div>

          <div className="card">
            <div className="tabs tabs-2" role="tablist" style={{ padding: "0 8px" }}>
              <button role="tab" aria-selected={tab === "comments"} className={tab === "comments" ? "active" : ""} onClick={() => setTab("comments")}>Comments ({coin.replies})</button>
              <button role="tab" aria-selected={tab === "trades"} className={tab === "trades" ? "active" : ""} onClick={() => setTab("trades")}>Trades</button>
              <button role="tab" aria-selected={tab === "holders"} className={tab === "holders" ? "active" : ""} onClick={() => setTab("holders")}>Holders</button>
            </div>
            {tab === "comments" && <Comments seed={coin.id} handle={coin.person.xHandle} />}
            {tab === "trades" && <Trades seed={coin.id} ticker={coin.ticker} />}
            {tab === "holders" && <Holders seed={coin.id} />}
          </div>
        </div>

        <div className="stack sticky">
          <TradePanel coin={coin} />

          <div className="card fees-panel">
            <span className="panel-title">Earned for {coin.person.xHandle}</span>
            <div className="big accent">{fmtEth(coin.personFeesEth, 3)}</div>
            <div className="row"><span>Claimed to wallet</span><b>{fmtEth(coin.personFeesClaimedEth, 3)}</b></div>
            <div className="row"><span>{coin.person.claimed ? "Pending payout" : "Waiting in escrow"}</span><b>{fmtEth(unclaimed, 3)}</b></div>
            <div className="row"><span>USD value</span><b>{fmtUsd(coin.personFeesEth)}</b></div>
            {coin.person.claimed && coin.person.wallet ? (
              <div className="row"><span>Payout wallet</span><b>{shortAddr(coin.person.wallet)}</b></div>
            ) : (
              <Link to={`/claim?handle=${coin.person.xHandle}`} className="btn btn-primary btn-block">Are you {coin.person.xHandle}? Claim this</Link>
            )}
            <p className="dim" style={{ fontSize: 12 }}>
              <Users size={12} style={{ verticalAlign: -2 }} /> {fmtCompact(coin.holders)} people are backing {coin.person.name.split(" ")[0]}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const COMMENT_POOL = [
  "been following since the first post, this is the one",
  "put my whole paycheck in fr",
  "the fact the fees actually go to them >>>",
  "someone tag them so they claim already",
  "graduation this week no cap",
  "bought a bag for the culture",
  "this is what the space was supposed to be",
  "holding till they open the shop",
];

function Comments({ seed, handle }: { seed: string; handle: string }) {
  const rnd = mulberry32(hashString(`c-${seed}`));
  const rows = Array.from({ length: 6 }, (_, i) => ({
    who: fakeAddress(`c${seed}${i}`),
    at: Date.now() - (i + 1) * (900_000 + rnd() * 3_000_000),
    body: COMMENT_POOL[Math.floor(rnd() * COMMENT_POOL.length)],
  }));
  return (
    <div style={{ padding: "4px 16px" }}>
      {rows.map((r, i) => (
        <div key={i} className="comment">
          <Avatar name={r.who} size={30} round />
          <div>
            <div className="who">{shortAddr(r.who)} · {timeAgo(r.at)}</div>
            <div className="body">{i === 1 ? `@${handle} claim your bag 🙏` : r.body}</div>
          </div>
        </div>
      ))}
      <div style={{ padding: "12px 0 8px" }}>
        <input className="input" placeholder="Post a reply (connect a wallet first)" disabled />
      </div>
    </div>
  );
}

function Trades({ seed, ticker }: { seed: string; ticker: string }) {
  const rnd = mulberry32(hashString(`t-${seed}`));
  const rows = Array.from({ length: 10 }, (_, i) => {
    const eth = 0.01 + rnd() * 0.5;
    return { who: fakeAddress(`t${seed}${i}`), side: rnd() > 0.4 ? "buy" : "sell", eth, tokens: eth * (2_000_000 + rnd() * 1_500_000), at: Date.now() - (i + 1) * (40_000 + rnd() * 600_000) };
  });
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="table">
        <thead><tr><th>Wallet</th><th>Side</th><th className="num">ETH</th><th className="num">${ticker}</th><th className="num">When</th></tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="mono">{shortAddr(r.who)}</td>
              <td><span className={`badge ${r.side === "buy" ? "badge-green" : "badge-red"}`}>{r.side}</span></td>
              <td className="num">{r.eth.toFixed(3)}</td>
              <td className="num">{fmtCompact(r.tokens)}</td>
              <td className="num dim">{timeAgo(r.at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Holders({ seed }: { seed: string }) {
  const rnd = mulberry32(hashString(`h-${seed}`));
  let remaining = 100;
  const rows = Array.from({ length: 10 }, (_, i) => {
    const share = Math.min(remaining * (0.08 + rnd() * 0.12), remaining);
    remaining -= share;
    return { who: fakeAddress(`h${seed}${i}`), share };
  });
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="table">
        <thead><tr><th>#</th><th>Wallet</th><th className="num">Share</th></tr></thead>
        <tbody>
          <tr><td className="dim">—</td><td className="mono">Bonding curve</td><td className="num">{remaining.toFixed(2)}%</td></tr>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="dim">{i + 1}</td>
              <td className="mono">{shortAddr(r.who)}</td>
              <td className="num">{r.share.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
