import { useId } from "react";
import { ETH_USD } from "../config";

/** Lightweight SVG area chart. Swap for a candlestick lib once live data exists. */
export function PriceChart({ data }: { data: number[] }) {
  const id = useId();
  const W = 800;
  const H = 260;
  const padL = 8;
  const padR = 70;
  const padT = 12;
  const padB = 22;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const x = (i: number) => padL + (i / (data.length - 1)) * (W - padL - padR);
  const y = (v: number) => padT + (1 - (v - min) / range) * (H - padT - padB);
  const path = data.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${path} L${x(data.length - 1).toFixed(1)},${(H - padB).toFixed(1)} L${x(0).toFixed(1)},${(H - padB).toFixed(1)} Z`;
  const up = data[data.length - 1] >= data[0];
  const color = up ? "var(--green)" : "var(--red)";
  const ticks = [max, min + range * 0.5, min];
  const mcap = (v: number) => `$${((v * 1_000_000_000 * ETH_USD) / 1000).toFixed(1)}K`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="Price chart">
      <defs>
        <linearGradient id={`g${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.28" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeDasharray="3 4" />
          <text x={W - padR + 8} y={y(t) + 4} fontSize="11" fill="var(--text-3)" fontFamily="var(--mono)">
            {mcap(t)}
          </text>
        </g>
      ))}
      <path d={area} fill={`url(#g${id})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <circle cx={x(data.length - 1)} cy={y(data[data.length - 1])} r="4" fill={color} />
    </svg>
  );
}
