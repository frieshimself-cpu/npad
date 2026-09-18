import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BadgeCheck, Coins, Search, Wallet } from "lucide-react";
import { coinsForHandle } from "../data/coins";
import { Avatar } from "../components/Avatar";
import { WalletButton } from "../components/WalletButton";
import { XIcon } from "../components/XIcon";
import { useWallet } from "../context/WalletContext";
import { useToast } from "../context/ToastContext";
import { fmtEth, fmtUsd, normalizeHandle, shortAddr } from "../lib/format";
import { FEES } from "../config";

export function ClaimPage() {
  const [params, setParams] = useSearchParams();
  const wallet = useWallet();
  const { toast } = useToast();
  const initial = params.get("handle") ?? "";
  const [input, setInput] = useState(initial);
  const [handle, setHandle] = useState(normalizeHandle(initial));
  const [verified, setVerified] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const coins = handle ? coinsForHandle(handle) : [];
  const total = coins.reduce((a, c) => a + c.personFeesEth, 0);
  const unclaimed = coins.reduce((a, c) => a + (c.personFeesEth - c.personFeesClaimedEth), 0);
  const alreadyClaimed = coins.some((c) => c.person.claimed);

  const lookup = (e: FormEvent) => {
    e.preventDefault();
    const h = normalizeHandle(input);
    setHandle(h);
    setVerified(false);
    setClaimed(false);
    setParams(h ? { handle: h } : {});
  };

  const step = !wallet.connected ? 1 : !verified ? 2 : !claimed ? 3 : 4;

  return (
    <div className="container" style={{ paddingBottom: 40, maxWidth: 820 }}>
      <div className="page-head">
        <h1>Claim your fees</h1>
        <p>
          If someone launched a coin about you, {Math.round(FEES.split.person * 100)}% of every trade fee has been set aside for you.
          Verify your X account once, link a wallet, and it pays out. You never have to touch the coin itself.
        </p>
      </div>

      <form className="search" onSubmit={lookup} style={{ marginBottom: 20 }}>
        <Search size={16} />
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Your X handle, e.g. @amarapaints" aria-label="X handle" style={{ paddingRight: 100 }} />
        <button type="submit" className="btn btn-sm btn-primary" style={{ position: "absolute", right: 6, top: 6 }}>Look up</button>
      </form>

      {handle && coins.length === 0 && (
        <div className="card empty">
          No coins found for <b>@{handle}</b> yet. <Link to="/launch" className="accent">Launch one</Link> or ask someone who backs you to.
          <p className="dim" style={{ fontSize: 12, marginTop: 8 }}>Try <span className="kbd">amarapaints</span>, <span className="kbd">niabellmusic</span>, or <span className="kbd">keishaeats</span> in the demo.</p>
        </div>
      )}

      {coins.length > 0 && (
        <div className="stack">
          <div className="card card-pad">
            <div className="row-between">
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Avatar name={coins[0].person.name} size={48} round />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 17 }}>{coins[0].person.name}</div>
                  <div className="x-link" style={{ fontSize: 13 }}><XIcon size={12} /> {handle}</div>
                </div>
              </div>
              {(alreadyClaimed || claimed) && <span className="badge badge-green"><BadgeCheck size={12} /> Verified</span>}
            </div>
            <div className="stats-strip" style={{ marginTop: 18 }}>
              <div className="stat" style={{ padding: 0 }}><div className="label">Earned for you</div><div className="value accent">{fmtEth(total, 3)}</div><div className="sub">{fmtUsd(total)}</div></div>
              <div className="stat" style={{ padding: 0 }}><div className="label">Ready to claim</div><div className="value">{fmtEth(claimed ? 0 : unclaimed, 3)}</div><div className="sub">{coins.length} coin{coins.length === 1 ? "" : "s"}</div></div>
            </div>
          </div>

          <div className="claim-steps">
            <div className={`card claim-step ${step > 1 ? "done" : "current"}`}>
              <div className="n">{step > 1 ? "✓" : "1"}</div>
              <div>
                <h3>Connect the wallet you want paid</h3>
                <p>Any wallet. This is where the ETH lands, now and for every future trade.</p>
                {wallet.address && <p className="mono" style={{ color: "var(--text)" }}>{shortAddr(wallet.address)}</p>}
              </div>
              <div className="action"><WalletButton /></div>
            </div>

            <div className={`card claim-step ${step > 2 ? "done" : step === 2 ? "current" : ""}`}>
              <div className="n">{step > 2 ? "✓" : "2"}</div>
              <div>
                <h3>Verify you're @{handle}</h3>
                <p>Sign in with X. We only check that you control the account. No posting on your behalf.</p>
              </div>
              <div className="action">
                <button className="btn" disabled={step < 2 || verified} onClick={() => { setVerified(true); toast(`Verified @${handle}`); }}>
                  <XIcon size={13} /> {verified ? "Verified" : "Sign in with X"}
                </button>
              </div>
            </div>

            <div className={`card claim-step ${step > 3 ? "done" : step === 3 ? "current" : ""}`}>
              <div className="n">{step > 3 ? "✓" : "3"}</div>
              <div>
                <h3>Claim {fmtEth(unclaimed, 3)}</h3>
                <p>One signature. After this, your share of every future trade streams to your wallet automatically.</p>
              </div>
              <div className="action">
                <button className="btn btn-primary" disabled={step !== 3} onClick={() => { setClaimed(true); toast(`${fmtEth(unclaimed, 3)} sent to your wallet`); }}>
                  <Coins size={15} /> {claimed ? "Claimed" : "Claim"}
                </button>
              </div>
            </div>
          </div>

          {claimed && (
            <div className="notice green">
              <Wallet size={16} />
              <span>Done. {fmtEth(unclaimed, 3)} is in {wallet.address ? shortAddr(wallet.address) : "your wallet"}. Future fees from {coins.map((c) => `$${c.ticker}`).join(", ")} pay out automatically.</span>
            </div>
          )}

          <div className="card">
            <table className="table">
              <thead><tr><th>Coin</th><th className="num">Earned</th><th className="num">Claimed</th><th className="num">Pending</th></tr></thead>
              <tbody>
                {coins.map((c) => (
                  <tr key={c.id}>
                    <td><Link to={`/coin/${c.id}`} style={{ fontWeight: 600 }}>{c.name} <span className="mono dim">${c.ticker}</span></Link></td>
                    <td className="num">{fmtEth(c.personFeesEth, 3)}</td>
                    <td className="num">{fmtEth(claimed ? c.personFeesEth : c.personFeesClaimedEth, 3)}</td>
                    <td className="num accent">{fmtEth(claimed ? 0 : c.personFeesEth - c.personFeesClaimedEth, 3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!handle && (
        <div className="steps" style={{ marginTop: 8 }}>
          <div className="card step"><div className="num">1</div><h3>Look yourself up</h3><p>Search your X handle to see if anyone's launched a coin for you.</p></div>
          <div className="card step"><div className="num">2</div><h3>Verify once</h3><p>Connect a wallet and sign in with X. Takes under a minute.</p></div>
          <div className="card step"><div className="num">3</div><h3>Get paid forever</h3><p>Everything in escrow pays out, and every future trade streams to you.</p></div>
        </div>
      )}
    </div>
  );
}
