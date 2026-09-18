import { hashString } from "../lib/seed";

const PALETTES = [
  ["#00c805", "#059e0a"],
  ["#2fbf71", "#1a8a52"],
  ["#5b9cf6", "#3b6fd6"],
  ["#e5484d", "#b3262b"],
  ["#c084fc", "#8b4bd6"],
  ["#f97316", "#c2410c"],
  ["#22d3ee", "#0e7490"],
];

export function Avatar({ name, size = 48, round = false, src }: { name: string; size?: number; round?: boolean; src?: string | null }) {
  const [a, b] = PALETTES[hashString(name) % PALETTES.length];
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  const style = {
    width: size,
    height: size,
    fontSize: Math.round(size * 0.38),
    background: src ? undefined : `linear-gradient(135deg, ${a}, ${b})`,
    overflow: "hidden",
  } as const;
  return (
    <div className={`avatar${round ? " round" : ""}`} style={style} aria-hidden>
      {src ? <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
    </div>
  );
}
