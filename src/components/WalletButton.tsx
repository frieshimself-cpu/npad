import { LogOut, Wallet } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import { shortAddr } from "../lib/format";

export function WalletButton({ block = false }: { block?: boolean }) {
  const w = useWallet();
  if (w.connected && w.address) {
    return (
      <button className={`btn${block ? " btn-block" : ""}`} onClick={w.disconnect} title="Disconnect">
        <span className="mono" style={{ fontSize: 13 }}>{shortAddr(w.address)}</span>
        <LogOut size={15} className="dim" />
      </button>
    );
  }
  return (
    <button className={`btn btn-primary${block ? " btn-block" : ""}`} onClick={w.openModal}>
      <Wallet size={16} />
      <span className={block ? undefined : "wallet-label"}>Connect wallet</span>
    </button>
  );
}

const WALLETS = [
  { name: "Robinhood Wallet", color: "#00c805" },
  { name: "MetaMask", color: "#f6851b" },
  { name: "Rabby", color: "#8697ff" },
  { name: "Coinbase Wallet", color: "#1652f0" },
];

export function WalletModal() {
  const w = useWallet();
  if (!w.modalOpen) return null;
  return (
    <div className="modal-bg" onClick={w.closeModal} role="dialog" aria-modal="true" aria-label="Connect a wallet">
      <div className="card modal" onClick={(e) => e.stopPropagation()}>
        <h3>Connect a wallet</h3>
        <p className="muted" style={{ fontSize: 13 }}>Pick a wallet on Robinhood Chain to trade, launch, or claim fees.</p>
        <div className="wallet-list">
          {WALLETS.map((x) => (
            <button key={x.name} onClick={() => w.connect(x.name)}>
              <span className="ic" style={{ background: x.color }}>{x.name[0]}</span>
              {x.name}
            </button>
          ))}
        </div>
        <p className="dim" style={{ fontSize: 12, marginTop: 14 }}>
          Demo mode: this connects a mock wallet. Wire up wagmi or viem with the Robinhood Chain RPC to go live.
        </p>
      </div>
    </div>
  );
}
