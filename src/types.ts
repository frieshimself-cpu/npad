export type Person = {
  name: string;
  xHandle: string;
  role: string;
  city: string;
  /** True once the person has verified their X account and linked a wallet. */
  claimed: boolean;
  wallet?: string;
};

export type Trade = {
  id: string;
  coinId: string;
  side: "buy" | "sell";
  eth: number;
  wallet: string;
  at: number;
};

export type Coin = {
  id: string;
  name: string;
  ticker: string;
  description: string;
  person: Person;
  launcher: string;
  createdAt: number;
  /** Real ETH currently in the curve. */
  ethRaised: number;
  holders: number;
  volume24hEth: number;
  /** Lifetime fees accrued to the featured person. */
  personFeesEth: number;
  personFeesClaimedEth: number;
  replies: number;
  /** Price history (ETH per token), oldest first. */
  history: number[];
};
