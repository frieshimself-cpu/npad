import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Rocket, Search, Sparkles } from "lucide-react";
import { BRAND } from "../config";
import { coins, siteStats } from "../data/coins";
import { CoinCard } from "../components/CoinCard";
import { Ticker } from "../components/Ticker";
import { FeeSplit } from "../components/FeeSplit";
import { fmtCompact, fmtSol, fmtUsd } from "../lib/format";
import { graduationProgress } from "../lib/curve";

type Sort = "trending" | "new" | "graduating" | "earners";
const TABS: { id: Sort; label: string }[] = [
  { id: "trending", label: "Trending" },
  { id: "new", label: "New" },
  { id: "graduating", label: "About to graduate" },
  { id: "earners", label: "Top earners" },
];

export function Home() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("trending");

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    let out = coins.filter((c) =>
      !term ||
      c.name.toLowerCase().includes(term) ||
      c.ticker.toLowerCase().includes(term) ||
      c.person.xHandle.toLowerCase().includes(term) ||
      c.person.city.toLowerCase().includes(term) ||
      c.person.role.toLowerCase().includes(term),
    );
    out = [...out];
    switch (sort) {
      case "trending": out.sort((a, b) => b.volume24hSol - a.volume24hSol); break;
      case "new": out.sort((a, b) => b.createdAt - a.createdAt); break;
      case "graduating": out.sort((a, b) => graduationProgress(b.solRaised) - graduationProgress(a.solRaised)); break;
      case "earners": out.sort((a, b) => b.personFeesSol - a.personFeesSol); break;
    }
    return out;
  }, [q, sort]);

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-eyebrow"><Sparkles size={14} /> Launchpad on Solana</div>
          <h1>Put your people on. <em>Pay them every trade.</em></h1>
          <p className="lead">
            {BRAND.name} is a launchpad for coins that celebrate Black creators, athletes, small-business owners, and everyday legends.
            A cut of every buy and sell goes straight to the person on the coin. No middlemen, no waiting.
          </p>
          <div className="hero-actions">
            <Link to="/launch" className="btn btn-primary btn-lg"><Rocket size={17} /> Launch a coin</Link>
            <Link to="/claim" className="btn btn-lg">Is there a coin about you? Claim your fees <ArrowRight size={16} /></Link>
          </div>

          <div className="stats-strip">
            <div className="card stat">
              <div className="label">Paid to people</div>
              <div className="value gold">{fmtSol(siteStats.paidToPeopleSol, 1)}</div>
              <div className="sub">{fmtUsd(siteStats.paidToPeopleSol)} in fees, lifetime</div>
            </div>
            <div className="card stat">
              <div className="label">Coins launched</div>
              <div className="value">{fmtCompact(siteStats.coinsLaunched)}</div>
              <div className="sub">Across {siteStats.peopleClaimed} claimed people</div>
            </div>
            <div className="card stat">
              <div className="label">24h volume</div>
              <div className="value">{fmtSol(siteStats.volume24hSol, 0)}</div>
              <div className="sub">{fmtUsd(siteStats.volume24hSol)}</div>
            </div>
            <div className="card stat">
              <div className="label">Fee to the person</div>
              <div className="value green">60%</div>
              <div className="sub">of every 1% trade fee</div>
            </div>
          </div>
        </div>
      </section>

      <Ticker />

      <section className="section" id="board">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>The board</h2>
              <p>Every coin here pays the person it's about.</p>
            </div>
          </div>
          <div className="toolbar">
            <div className="search">
              <Search size={16} />
              <input placeholder="Search by name, ticker, handle, or city" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search coins" />
            </div>
            <div className="tabs" role="tablist">
              {TABS.map((t) => (
                <button key={t.id} role="tab" aria-selected={sort === t.id} className={sort === t.id ? "active" : ""} onClick={() => setSort(t.id)}>{t.label}</button>
              ))}
            </div>
          </div>
          {list.length === 0 ? (
            <div className="card empty">Nothing matches "{q}". <Link to="/launch" className="gold">Be the first to launch it.</Link></div>
          ) : (
            <div className="grid">
              {list.map((c) => <CoinCard key={c.id} coin={c} />)}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Where the fee goes</h2>
              <p>Every trade on the bonding curve charges a flat 1%. Here's the split.</p>
            </div>
            <Link to="/how-it-works" className="btn btn-sm">Full breakdown <ArrowRight size={14} /></Link>
          </div>
          <div className="card card-pad">
            <FeeSplit />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>How it works</h2>
              <p>Three steps. No code.</p>
            </div>
          </div>
          <div className="steps">
            <div className="card step">
              <div className="num">1</div>
              <h3>Pick someone worth backing</h3>
              <p>A creator, a coach, a barber, an athlete. Anyone with an X account. Drop their handle, a name, and a ticker.</p>
            </div>
            <div className="card step">
              <div className="num">2</div>
              <h3>Trade on the curve</h3>
              <p>The coin starts on a bonding curve. Buys push the price up, sells push it down. At 85 SOL it graduates to a DEX with locked liquidity.</p>
            </div>
            <div className="card step">
              <div className="num">3</div>
              <h3>They get paid</h3>
              <p>60% of every fee accrues to the person. They verify their X account once, link a wallet, and it's theirs. Until then it waits in escrow.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
