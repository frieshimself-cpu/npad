/**
 * Site-wide configuration.
 */
export const BRAND = {
  name: "NIGGAPAD",
  tagline: "Coins for the people who inspire you. Fees for the people on them.",
  xHandle: "NiggaPadOnChain",
  /** Official platform token contract address (pump.fun mint). */
  tokenCA: "7QtPipzupvyhyK9u4wWrccGJenCrDjGNNbszWyiKpump",
};

export const LINKS = {
  x: `https://x.com/${BRAND.xHandle}`,
  pumpFun: `https://pump.fun/coin/${BRAND.tokenCA}`,
  solscan: `https://solscan.io/token/${BRAND.tokenCA}`,
};

/** Fee model, expressed in basis points and shares of the fee. */
export const FEES = {
  /** Fee taken on every buy and sell on the bonding curve (100 bps = 1%). */
  tradeFeeBps: 100,
  /** How the collected fee is split. Must sum to 1. */
  split: {
    person: 0.6, // the person featured on the coin
    launcher: 0.2, // whoever deployed the coin
    protocol: 0.2, // platform treasury
  },
};

/** Pump.fun-style constant-product bonding curve with virtual reserves. */
export const CURVE = {
  totalSupply: 1_000_000_000,
  virtualSol: 30,
  virtualTokens: 1_073_000_000,
  /** SOL that must be raised before the coin graduates to a DEX. */
  graduationSol: 85,
};

export const SOL_USD = 148.2; // display-only reference price for mock data
