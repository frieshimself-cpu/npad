import type { Coin, Trade } from "../types";
import { spotPrice } from "../lib/curve";
import { fakeAddress, hashString, mulberry32 } from "../lib/seed";

/**
 * Mock data. Every person here is fictional — replace with live on-chain data
 * once the program and indexer are wired up.
 */

const HOUR = 3_600_000;
const NOW = Date.now();

function history(seed: string, ethRaised: number, points = 48): number[] {
  const rnd = mulberry32(hashString(seed));
  const end = spotPrice(ethRaised);
  const start = spotPrice(Math.max(0.2, ethRaised * (0.15 + rnd() * 0.5)));
  const out: number[] = [];
  let v = start;
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    const drift = start + (end - start) * t;
    v = drift * (1 + (rnd() - 0.5) * 0.18);
    out.push(Math.max(v, start * 0.6));
  }
  out[points - 1] = end;
  return out;
}

type Seed = Omit<Coin, "history" | "launcher"> & { launcherSeed: string };

const seeds: Seed[] = [
  {
    id: "amara",
    name: "Amara Okafor",
    ticker: "AMARA",
    description: "Houston-based muralist who's painted 40+ walls across the Third Ward. Fees fund her next public piece.",
    person: { name: "Amara Okafor", xHandle: "amarapaints", role: "Muralist", city: "Houston, TX", claimed: true, wallet: fakeAddress("amara-wallet") },
    createdAt: NOW - 5 * 24 * HOUR,
    ethRaised: 12.28,
    holders: 1_284,
    volume24hEth: 42.54,
    personFeesEth: 1.964,
    personFeesClaimedEth: 1.42,
    replies: 318,
    launcherSeed: "l1",
  },
  {
    id: "dre",
    name: "Coach Dre",
    ticker: "DRE",
    description: "Runs a free youth basketball program in South Side Chicago. Every trade helps keep the gym lights on.",
    person: { name: "Andre Wilkins", xHandle: "coachdre_chi", role: "Youth coach", city: "Chicago, IL", claimed: true, wallet: fakeAddress("dre-wallet") },
    createdAt: NOW - 11 * 24 * HOUR,
    ethRaised: 16.82,
    holders: 2_930,
    volume24hEth: 77.64,
    personFeesEth: 4.28,
    personFeesClaimedEth: 4.28,
    replies: 742,
    launcherSeed: "l2",
  },
  {
    id: "nia",
    name: "Nia Bell",
    ticker: "NIABELL",
    description: "Atlanta indie R&B artist. Dropped three EPs fully independent. Coin fees go straight to studio time.",
    person: { name: "Nia Bell", xHandle: "niabellmusic", role: "Musician", city: "Atlanta, GA", claimed: false },
    createdAt: NOW - 14 * HOUR,
    ethRaised: 3.72,
    holders: 402,
    volume24hEth: 19.28,
    personFeesEth: 0.386,
    personFeesClaimedEth: 0.0,
    replies: 88,
    launcherSeed: "l3",
  },
  {
    id: "marcus",
    name: "Marcus Reed",
    ticker: "REED",
    description: "Oakland barber who cuts hair for free every Monday for anyone with a job interview. Community legend.",
    person: { name: "Marcus Reed", xHandle: "reedcuts", role: "Barber", city: "Oakland, CA", claimed: true, wallet: fakeAddress("marcus-wallet") },
    createdAt: NOW - 3 * 24 * HOUR,
    ethRaised: 6.78,
    holders: 811,
    volume24hEth: 28.2,
    personFeesEth: 1.122,
    personFeesClaimedEth: 0.6,
    replies: 203,
    launcherSeed: "l4",
  },
  {
    id: "keisha",
    name: "Keisha Thompson",
    ticker: "KEISHA",
    description: "Detroit food-truck owner feeding the east side. Wants to open a brick-and-mortar by next spring.",
    person: { name: "Keisha Thompson", xHandle: "keishaeats", role: "Chef", city: "Detroit, MI", claimed: false },
    createdAt: NOW - 6 * HOUR,
    ethRaised: 1.44,
    holders: 156,
    volume24hEth: 8.26,
    personFeesEth: 0.116,
    personFeesClaimedEth: 0.0,
    replies: 41,
    launcherSeed: "l5",
  },
  {
    id: "jalen",
    name: "Jalen Price",
    ticker: "JP7",
    description: "D-II point guard grinding for a pro contract. Highlights every Friday. Fees cover training and travel.",
    person: { name: "Jalen Price", xHandle: "jalenprice7", role: "Athlete", city: "Charlotte, NC", claimed: true, wallet: fakeAddress("jalen-wallet") },
    createdAt: NOW - 2 * 24 * HOUR,
    ethRaised: 8.96,
    holders: 1_022,
    volume24hEth: 35.3,
    personFeesEth: 1.38,
    personFeesClaimedEth: 0.84,
    replies: 264,
    launcherSeed: "l6",
  },
  {
    id: "tasha",
    name: "Tasha Green",
    ticker: "TASHA",
    description: "Comedian from Memphis. 2M followers, zero label. Coin fees are her tour fund.",
    person: { name: "Tasha Green", xHandle: "tashagreenlol", role: "Comedian", city: "Memphis, TN", claimed: false },
    createdAt: NOW - 90 * 60_000,
    ethRaised: 0.48,
    holders: 63,
    volume24hEth: 2.56,
    personFeesEth: 0.038,
    personFeesClaimedEth: 0.0,
    replies: 17,
    launcherSeed: "l7",
  },
  {
    id: "elijah",
    name: "Elijah Moore",
    ticker: "MOORE",
    description: "Baltimore teacher who built a coding club with donated laptops. Now 120 kids strong.",
    person: { name: "Elijah Moore", xHandle: "mrmooreteaches", role: "Educator", city: "Baltimore, MD", claimed: true, wallet: fakeAddress("elijah-wallet") },
    createdAt: NOW - 7 * 24 * HOUR,
    ethRaised: 5.5,
    holders: 690,
    volume24hEth: 17.62,
    personFeesEth: 0.824,
    personFeesClaimedEth: 0.824,
    replies: 155,
    launcherSeed: "l8",
  },
  {
    id: "simone",
    name: "Simone Carter",
    ticker: "SIMONE",
    description: "Brooklyn fashion designer. Sold out two drops from her apartment. Fees go to her first real workshop.",
    person: { name: "Simone Carter", xHandle: "simonecarterny", role: "Designer", city: "Brooklyn, NY", claimed: false },
    createdAt: NOW - 20 * HOUR,
    ethRaised: 2.58,
    holders: 288,
    volume24hEth: 10.92,
    personFeesEth: 0.242,
    personFeesClaimedEth: 0.0,
    replies: 62,
    launcherSeed: "l9",
  },
];

export const coins: Coin[] = seeds.map(({ launcherSeed, ...s }) => ({
  ...s,
  launcher: fakeAddress(launcherSeed),
  history: history(s.id, s.ethRaised),
}));

export function getCoin(id: string): Coin | undefined {
  return coins.find((c) => c.id === id);
}

export function coinsForHandle(handle: string): Coin[] {
  return coins.filter((c) => c.person.xHandle.toLowerCase() === handle.toLowerCase());
}

/** A rolling feed of mock trades for the ticker. */
export function recentTrades(count = 14): Trade[] {
  const rnd = mulberry32(hashString("trades"));
  const out: Trade[] = [];
  for (let i = 0; i < count; i++) {
    const coin = coins[Math.floor(rnd() * coins.length)];
    out.push({
      id: `t${i}`,
      coinId: coin.id,
      side: rnd() > 0.38 ? "buy" : "sell",
      eth: +(0.01 + rnd() * 0.6).toFixed(3),
      wallet: fakeAddress(`w${i}`),
      at: NOW - i * (25_000 + rnd() * 60_000),
    });
  }
  return out;
}

export const siteStats = {
  paidToPeopleEth: coins.reduce((a, c) => a + c.personFeesEth, 0),
  coinsLaunched: 1_842,
  volume24hEth: coins.reduce((a, c) => a + c.volume24hEth, 0) * 4.7,
  peopleClaimed: 611,
};
