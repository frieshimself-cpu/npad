import { Link } from "react-router-dom";
import { BadgeCheck, MessageSquare, Users } from "lucide-react";
import type { Coin } from "../types";
import { Avatar } from "./Avatar";
import { Sparkline } from "./Sparkline";
import { XIcon } from "./XIcon";
import { graduationProgress, marketCapEth } from "../lib/curve";
import { fmtCompact, fmtEth, fmtUsd, timeAgo } from "../lib/format";

export function CoinCard({ coin }: { coin: Coin }) {
  const mcap = marketCapEth(coin.ethRaised);
  const prog = graduationProgress(coin.ethRaised);
  const change = coin.history[coin.history.length - 1] / coin.history[0] - 1;

  return (
    <Link to={`/coin/${coin.id}`} className="card coin-card">
      <div className="coin-card-top">
        <Avatar name={coin.person.name} size={52} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="title">
            {coin.name}
            <span className="ticker-sym">${coin.ticker}</span>
          </div>
          <div className="person-line">
            <span className="x-link"><XIcon size={11} /> {coin.person.xHandle}</span>
            <span>·</span>
            <span>{coin.person.role}, {coin.person.city}</span>
            {coin.person.claimed && <span className="badge badge-green" style={{ padding: "1px 6px", fontSize: 11 }}><BadgeCheck size={11} /> Claimed</span>}
          </div>
        </div>
        <Sparkline data={coin.history} />
      </div>

      <p className="desc">{coin.description}</p>

      <div className="row">
        <span className="kv">MC <b>{fmtUsd(mcap)}</b></span>
        <span className="kv" style={{ color: change >= 0 ? "var(--green)" : "var(--red)" }}>
          <b style={{ color: "inherit" }}>{change >= 0 ? "+" : ""}{(change * 100).toFixed(1)}%</b>
        </span>
        <span className="kv"><Users size={12} style={{ verticalAlign: -2 }} /> <b>{fmtCompact(coin.holders)}</b></span>
        <span className="kv"><MessageSquare size={12} style={{ verticalAlign: -2 }} /> <b>{coin.replies}</b></span>
        <span className="kv">{timeAgo(coin.createdAt)}</span>
      </div>

      <div>
        <div className="progress"><i style={{ width: `${prog * 100}%` }} /></div>
        <div className="progress-label">
          <span>{prog >= 1 ? "Graduated" : `${Math.round(prog * 100)}% to graduation`}</span>
          <span className="mono">{fmtEth(coin.ethRaised, 1)}</span>
        </div>
      </div>

      <div className="fee-line">
        <b className="mono">{fmtEth(coin.personFeesEth)}</b> earned for {coin.person.xHandle} so far
      </div>
    </Link>
  );
}
