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
  sol: number;
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
  /** Real SOL currently in the curve. */
  solRaised: number;
  holders: number;
  volume24hSol: number;
  /** Lifetime fees accrued to the featured person. */
  personFeesSol: number;
  personFeesClaimedSol: number;
  replies: number;
  /** Price history (SOL per token), oldest first. */
  history: number[];
};
