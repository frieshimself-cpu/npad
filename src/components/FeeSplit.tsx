import { FEES } from "../config";

const pct = (n: number) => `${Math.round(n * 100)}%`;

export function FeeSplit({ personLabel = "The person on the coin" }: { personLabel?: string }) {
  const { person, launcher, protocol } = FEES.split;
  return (
    <div className="split">
      <div className="split-bar" role="img" aria-label={`Fee split: ${pct(person)} to the person, ${pct(launcher)} to the launcher, ${pct(protocol)} to the protocol`}>
        <div style={{ flex: person, background: "var(--accent)" }}>{pct(person)}</div>
        <div style={{ flex: launcher, background: "var(--blue)" }}>{pct(launcher)}</div>
        <div style={{ flex: protocol, background: "#8b8b95" }}>{pct(protocol)}</div>
      </div>
      <div className="split-legend">
        <div className="item">
          <i className="dot" style={{ background: "var(--accent)" }} />
          <div><b>{personLabel}</b><span>Paid out in ETH. Held in escrow until they verify their X account and claim.</span></div>
        </div>
        <div className="item">
          <i className="dot" style={{ background: "var(--blue)" }} />
          <div><b>Whoever launched it</b><span>A reward for finding and putting someone on. Claimable any time.</span></div>
        </div>
        <div className="item">
          <i className="dot" style={{ background: "#8b8b95" }} />
          <div><b>Protocol</b><span>Keeps the lights on, funds audits, and seeds the community pool.</span></div>
        </div>
      </div>
    </div>
  );
}
