import { ETH_USD } from "../config";

export function fmtEth(n: number, digits = 2): string {
  if (n === 0) return "0 ETH";
  if (Math.abs(n) < 0.001) return `${n.toExponential(2)} ETH`;
  if (Math.abs(n) < 1) return `${n.toFixed(4)} ETH`;
  return `${n.toLocaleString(undefined, { maximumFractionDigits: digits })} ETH`;
}

export function fmtUsd(eth: number): string {
  const usd = eth * ETH_USD;
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(2)}M`;
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(1)}K`;
  return `$${usd.toFixed(2)}`;
}

export function fmtCompact(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export function fmtPct(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${(n * 100).toFixed(digits)}%`;
}

export function timeAgo(ts: number, now = Date.now()): string {
  const s = Math.max(1, Math.floor((now - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function shortAddr(a: string): string {
  return a.length <= 10 ? a : `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export function normalizeHandle(h: string): string {
  return h.trim().replace(/^@/, "").toLowerCase();
}
