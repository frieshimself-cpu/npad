import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, CheckCircle2, ImagePlus, Rocket, ShieldCheck } from "lucide-react";
import { Avatar } from "../components/Avatar";
import { FeeSplit } from "../components/FeeSplit";
import { WalletButton } from "../components/WalletButton";
import { XIcon } from "../components/XIcon";
import { useWallet } from "../context/WalletContext";
import { CURVE, FEES } from "../config";
import { quoteBuy } from "../lib/curve";
import { fmtCompact, fmtSol, normalizeHandle } from "../lib/format";

type Form = {
  personName: string;
  xHandle: string;
  role: string;
  city: string;
  coinName: string;
  ticker: string;
  description: string;
  initialBuy: string;
  consent: boolean;
};

const EMPTY: Form = { personName: "", xHandle: "", role: "", city: "", coinName: "", ticker: "", description: "", initialBuy: "", consent: false };

export function LaunchPage() {
  const wallet = useWallet();
  const [f, setF] = useState<Form>(EMPTY);
  const [img, setImg] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState(false);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((o) => ({ ...o, [k]: v }));
  const handle = normalizeHandle(f.xHandle);

  const errors = useMemo(() => {
    const e: Partial<Record<keyof Form, string>> = {};
    if (!f.personName.trim()) e.personName = "Who is this coin about?";
    if (!handle) e.xHandle = "Their X handle is how they'll claim the fees.";
    else if (!/^[a-z0-9_]{1,15}$/.test(handle)) e.xHandle = "That doesn't look like a valid X handle.";
    if (!f.coinName.trim()) e.coinName = "Give the coin a name.";
    if (!f.ticker.trim()) e.ticker = "Pick a ticker.";
    else if (!/^[A-Z0-9]{2,10}$/.test(f.ticker)) e.ticker = "2–10 letters or numbers, all caps.";
    if (f.description.trim().length < 20) e.description = "Say a little more (20+ characters).";
    if (f.initialBuy && (Number(f.initialBuy) < 0 || Number.isNaN(Number(f.initialBuy)))) e.initialBuy = "Enter a number of SOL.";
    if (!f.consent) e.consent = "You need to confirm this.";
    return e;
  }, [f, handle]);

  const valid = Object.keys(errors).length === 0;
  const initial = Number(f.initialBuy) || 0;
  const initialQuote = initial > 0 ? quoteBuy(initial, 0) : null;

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setImg(String(r.result));
    r.readAsDataURL(file);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid || !wallet.connected) return;
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (done) {
    return (
      <div className="container" style={{ paddingTop: 48, paddingBottom: 48, maxWidth: 640 }}>
        <div className="card card-pad" style={{ textAlign: "center" }}>
          <CheckCircle2 size={44} className="green" style={{ margin: "0 auto 12px" }} />
          <h1 style={{ fontSize: 26 }}>${f.ticker} is live</h1>
          <p className="muted" style={{ marginTop: 8 }}>
            {f.coinName} is on the curve. {Math.round(FEES.split.person * 100)}% of every fee now accrues to {handle}.
            Tell them to head to the claim page and verify.
          </p>
          <div className="hero-actions" style={{ justifyContent: "center", marginTop: 22 }}>
            <a className="btn btn-primary" href={`https://x.com/intent/tweet?text=${encodeURIComponent(`@${handle} someone launched $${f.ticker} for you. Claim your fees:`)}%20${encodeURIComponent(window.location.origin + "/claim?handle=" + handle)}`} target="_blank" rel="noreferrer">
              <XIcon size={14} /> Tell {handle}
            </a>
            <Link className="btn" to="/">Back to the board</Link>
          </div>
        </div>
      </div>
    );
  }

  const cls = (k: keyof Form, base = "input") => `${base}${touched && errors[k] ? " invalid" : ""}`;
  const err = (k: keyof Form) => touched && errors[k] ? <span className="err">{errors[k]}</span> : null;

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <div className="page-head">
        <h1>Launch a coin</h1>
        <p>Put someone on. Costs ~0.02 SOL in network fees. No code, no presale, no team allocation.</p>
      </div>

      <div className="launch-layout">
        <form className="form card card-pad" onSubmit={submit} noValidate>
          <span className="panel-title">Who is it about?</span>
          <div className="two">
            <div className="field">
              <label htmlFor="personName">Their name</label>
              <input id="personName" className={cls("personName")} value={f.personName} onChange={(e) => set("personName", e.target.value)} placeholder="e.g. Amara Okafor" />
              {err("personName")}
            </div>
            <div className="field">
              <label htmlFor="xHandle">Their X handle</label>
              <div className="input-prefix">
                <span>@</span>
                <input id="xHandle" className={cls("xHandle")} value={f.xHandle} onChange={(e) => set("xHandle", e.target.value)} placeholder="handle" autoCapitalize="off" />
              </div>
              {err("xHandle") ?? <span className="hint">This is the account that can claim the fees. Double-check it.</span>}
            </div>
          </div>
          <div className="two">
            <div className="field">
              <label htmlFor="role">What they do</label>
              <input id="role" className="input" value={f.role} onChange={(e) => set("role", e.target.value)} placeholder="Muralist, coach, chef, athlete…" />
            </div>
            <div className="field">
              <label htmlFor="city">City</label>
              <input id="city" className="input" value={f.city} onChange={(e) => set("city", e.target.value)} placeholder="Houston, TX" />
            </div>
          </div>

          <span className="panel-title" style={{ marginTop: 8 }}>The coin</span>
          <div className="two">
            <div className="field">
              <label htmlFor="coinName">Coin name</label>
              <input id="coinName" className={cls("coinName")} value={f.coinName} onChange={(e) => set("coinName", e.target.value)} placeholder="Amara Okafor" />
              {err("coinName")}
            </div>
            <div className="field">
              <label htmlFor="ticker">Ticker</label>
              <div className="input-prefix">
                <span>$</span>
                <input id="ticker" className={cls("ticker")} value={f.ticker} onChange={(e) => set("ticker", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10))} placeholder="AMARA" />
              </div>
              {err("ticker")}
            </div>
          </div>
          <div className="field">
            <label htmlFor="description">Why them?</label>
            <textarea id="description" className={cls("description", "textarea")} value={f.description} onChange={(e) => set("description", e.target.value)} placeholder="What do they do, and what would the fees help with?" />
            {err("description")}
          </div>
          <div className="field">
            <label>Image</label>
            <label className="dropzone">
              {img ? <img src={img} alt="Preview" /> : <ImagePlus size={22} />}
              <span>{img ? "Click to change" : "Upload a photo or logo (PNG, JPG, GIF · max 2MB)"}</span>
              <input type="file" accept="image/*" className="sr-only" onChange={onFile} />
            </label>
          </div>

          <span className="panel-title" style={{ marginTop: 8 }}>Optional: first buy</span>
          <div className="field">
            <label htmlFor="initialBuy">Buy in at launch</label>
            <div className="amount">
              <input id="initialBuy" className={cls("initialBuy")} inputMode="decimal" value={f.initialBuy} onChange={(e) => set("initialBuy", e.target.value.replace(/[^\d.]/g, ""))} placeholder="0.0" style={{ fontFamily: "var(--mono)" }} />
              <span className="unit">SOL</span>
            </div>
            {err("initialBuy") ?? (
              <span className="hint">
                {initialQuote ? `You'd get ~${fmtCompact(initialQuote.output)} $${f.ticker || "TOKENS"} and ${fmtSol(initialQuote.feeToPerson, 4)} goes to ${handle || "them"} on trade one.` : "Snipers can't front-run you if you're the first buyer."}
              </span>
            )}
          </div>

          <label className="notice gold" style={{ cursor: "pointer" }}>
            <input type="checkbox" checked={f.consent} onChange={(e) => set("consent", e.target.checked)} style={{ marginTop: 3 }} />
            <span>
              I understand that only <b>@{handle || "this handle"}</b> can ever claim the person share of the fees, that it stays in escrow until they do, and that I can't redirect it. I'm not impersonating anyone.
            </span>
          </label>
          {err("consent")}

          {wallet.connected ? (
            <button type="submit" className="btn btn-primary btn-lg btn-block"><Rocket size={17} /> Launch ${f.ticker || "COIN"}</button>
          ) : (
            <WalletButton block />
          )}
          {touched && !valid && (
            <p className="red" style={{ fontSize: 13, display: "flex", gap: 6 }}><AlertTriangle size={15} /> Fix the fields above to launch.</p>
          )}
        </form>

        <div className="stack">
          <div className="card card-pad preview-card">
            <span className="panel-title">Preview</span>
            <div className="coin-card-top" style={{ marginTop: 12 }}>
              <Avatar name={f.personName || "?"} size={52} src={img} />
              <div>
                <div className="title">{f.coinName || "Coin name"} <span className="ticker-sym">${f.ticker || "TICKER"}</span></div>
                <div className="person-line" style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>
                  <span className="x-link"><XIcon size={11} /> {handle || "handle"}</span>
                  {(f.role || f.city) && <span> · {[f.role, f.city].filter(Boolean).join(", ")}</span>}
                </div>
              </div>
            </div>
            <p className="muted" style={{ fontSize: 13, marginTop: 12 }}>{f.description || "Your description shows up here."}</p>
          </div>

          <div className="card card-pad">
            <span className="panel-title">Fee split on this coin</span>
            <div style={{ marginTop: 12 }}>
              <FeeSplit personLabel={handle ? `@${handle}` : "The person on the coin"} />
            </div>
          </div>

          <div className="card card-pad checklist">
            <span className="panel-title">What you get</span>
            <div className="item"><ShieldCheck size={16} className="green" /> <span>{fmtCompact(CURVE.totalSupply)} supply, all on the curve. No team tokens.</span></div>
            <div className="item"><ShieldCheck size={16} className="green" /> <span>{Math.round(FEES.split.launcher * 100)}% of every fee to your wallet as the launcher, forever.</span></div>
            <div className="item"><ShieldCheck size={16} className="green" /> <span>Liquidity locked and burned at graduation ({CURVE.graduationSol} SOL).</span></div>
            <div className="item"><ShieldCheck size={16} className="green" /> <span>Mint and freeze authority revoked at launch.</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
