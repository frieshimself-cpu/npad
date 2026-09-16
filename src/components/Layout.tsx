import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, Rocket, X } from "lucide-react";
import { BRAND } from "../config";
import { WalletButton, WalletModal } from "./WalletButton";
import { XIcon } from "./XIcon";

const LINKS = [
  { to: "/", label: "Board", end: true },
  { to: "/launch", label: "Launch" },
  { to: "/claim", label: "Claim fees" },
  { to: "/how-it-works", label: "How it works" },
];

export function Layout() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const cls = ({ isActive }: { isActive: boolean }) => (isActive ? "active" : "");

  return (
    <>
      <header className="nav">
        <div className="container nav-inner">
          <Link to="/" className="brand" onClick={() => setOpen(false)}>
            <span className="brand-mark"><Rocket size={16} /></span>
            {BRAND.name}
          </Link>
          <nav className="nav-links">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={cls}>{l.label}</NavLink>
            ))}
          </nav>
          <div className="nav-right">
            <Link to="/launch" className="btn btn-sm nav-launch" style={{ display: loc.pathname === "/launch" ? "none" : undefined }}>
              <Rocket size={14} /> Launch a coin
            </Link>
            <WalletButton />
            <button className="nav-burger" onClick={() => setOpen((o) => !o)} aria-label="Menu">
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {open && (
          <div className="nav-drawer">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={cls} onClick={() => setOpen(false)}>{l.label}</NavLink>
            ))}
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <b style={{ color: "var(--text)" }}>{BRAND.name}</b> · Built on Solana. Not financial advice. Memecoins are volatile and can go to zero.
          </div>
          <div className="footer-links">
            <Link to="/how-it-works">Fees</Link>
            <Link to="/claim">Claim</Link>
            <a href={`https://x.com/${BRAND.xHandle}`} target="_blank" rel="noreferrer" className="x-link"><XIcon size={13} /> {BRAND.xHandle}</a>
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
          </div>
        </div>
      </footer>

      <WalletModal />
    </>
  );
}
