import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { FeeSplit } from "../components/FeeSplit";
import { BRAND, CURVE, FEES } from "../config";
import { fmtCompact } from "../lib/format";

const FAQ: { q: string; a: string }[] = [
  {
    q: "Do I need the person's permission to launch a coin about them?",
    a: "No, but you can't redirect their money either. The person share of the fee is locked to the X handle you enter. Only that account can ever claim it. If they never claim, it sits in escrow. You can't touch it, and neither can we.",
  },
  {
    q: "What if someone launches a coin about me and I don't want it?",
    a: "Claim it anyway. The fees are yours regardless. If you'd rather it not be promoted, verify with X and ask us to delist it from the board. It stays tradable on-chain, since nobody can stop that, but we won't feature it.",
  },
  {
    q: "How is the fee actually collected?",
    a: `Every buy and sell on the bonding curve takes a flat ${FEES.tradeFeeBps / 100}% in SOL. The program splits it on the spot: ${Math.round(FEES.split.person * 100)}% to the person's escrow (or straight to their wallet once claimed), ${Math.round(FEES.split.launcher * 100)}% to the launcher, ${Math.round(FEES.split.protocol * 100)}% to the protocol. Nothing is held by a person or a multisig.`,
  },
  {
    q: "What happens at graduation?",
    a: `When ${CURVE.graduationSol} SOL has been raised on the curve, the liquidity moves to a DEX pool and the LP tokens are burned. After graduation the person keeps earning from the DEX pool's fee share.`,
  },
  {
    q: "Is there a presale or team allocation?",
    a: `No. All ${fmtCompact(CURVE.totalSupply)} tokens start on the curve. Mint and freeze authority are revoked at launch. The launcher can buy first if they want, and that first buy is shown publicly.`,
  },
  {
    q: "Why is this focused on Black people specifically?",
    a: "Because the memecoin space has made a lot of money off Black culture and sent very little of it back. This is a small, direct way to fix that: if a coin is about someone, they get paid. Anyone can launch, anyone can trade.",
  },
  {
    q: "Is this financial advice?",
    a: "No. These are memecoins. Most go to zero. Never put in more than you're fine losing. The person on the coin gets paid whether the price goes up or down.",
  },
];

export function HowItWorks() {
  return (
    <div className="container" style={{ paddingBottom: 40, maxWidth: 860 }}>
      <div className="page-head">
        <h1>How it works</h1>
        <p>{BRAND.name} is a bonding-curve launchpad on Solana with one twist: the person a coin is about gets the biggest cut of the fees.</p>
      </div>

      <div className="stack">
        <div className="card card-pad">
          <h2 style={{ fontSize: 20, marginBottom: 6 }}>The fee split</h2>
          <p className="muted" style={{ fontSize: 14, marginBottom: 18 }}>A flat {FEES.tradeFeeBps / 100}% on every trade, split by the program the moment it's collected.</p>
          <FeeSplit />
        </div>

        <div className="steps">
          <div className="card step">
            <div className="num">1</div>
            <h3>Launch</h3>
            <p>Enter a person's name and X handle, a coin name, ticker, and a short why. Pay network fees, and it's on the curve with {fmtCompact(CURVE.totalSupply)} supply.</p>
          </div>
          <div className="card step">
            <div className="num">2</div>
            <h3>Trade</h3>
            <p>Constant-product curve with {CURVE.virtualSol} SOL virtual reserves. Price climbs as SOL comes in. At {CURVE.graduationSol} SOL the coin graduates to a DEX and liquidity is burned.</p>
          </div>
          <div className="card step">
            <div className="num">3</div>
            <h3>Claim</h3>
            <p>The person signs in with X, links a wallet, and everything in escrow pays out. From then on their share streams in real time.</p>
          </div>
        </div>

        <div className="card card-pad">
          <h2 style={{ fontSize: 20, marginBottom: 6 }}>Questions</h2>
          <div className="faq">
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q} <ChevronDown size={16} /></summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="card card-pad row-between">
          <div>
            <b>Ready?</b>
            <p className="muted" style={{ fontSize: 14 }}>Launch a coin for someone who deserves it, or claim the one that's waiting for you.</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Link to="/launch" className="btn btn-primary">Launch</Link>
            <Link to="/claim" className="btn">Claim</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
