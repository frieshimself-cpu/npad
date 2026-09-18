/**
 * Site-wide configuration.
 */
export const BRAND = {
  name: "NIGGAPAD",
  tagline: "Coins for the people who inspire you. Fees for the people on them.",
  xHandle: "NiggaPadOnChain",
};

export const CHAIN = {
  name: "Robinhood Chain",
  /** Native gas/quote asset on Robinhood Chain (an Ethereum L2). */
  currency: "ETH",
  launchpad: "Pons",
};

export const LINKS = {
  x: `https://x.com/${BRAND.xHandle}`,
  pons: "https://pons.xyz",
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

/** Pons-style constant-product bonding curve with virtual reserves, denominated in ETH. */
export const CURVE = {
  totalSupply: 1_000_000_000,
  virtualEth: 6,
  virtualTokens: 1_073_000_000,
  /** ETH that must be raised before the coin graduates to a DEX. */
  graduationEth: 17,
};

export const ETH_USD = 3_920; // display-only reference price for mock data
