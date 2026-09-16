import { CURVE, FEES } from "../config";

/** Tokens still on the curve for a given amount of real SOL raised. */
export function tokensRemaining(solRaised: number): number {
  const k = CURVE.virtualSol * CURVE.virtualTokens;
  return k / (CURVE.virtualSol + solRaised);
}

/** Tokens already sold for a given amount of real SOL raised. */
export function tokensSold(solRaised: number): number {
  return CURVE.virtualTokens - tokensRemaining(solRaised);
}

/** Spot price in SOL per token. */
export function spotPrice(solRaised: number): number {
  const vSol = CURVE.virtualSol + solRaised;
  return vSol / tokensRemaining(solRaised);
}

export function marketCapSol(solRaised: number): number {
  return spotPrice(solRaised) * CURVE.totalSupply;
}

export function graduationProgress(solRaised: number): number {
  return Math.min(1, solRaised / CURVE.graduationSol);
}

export type Quote = {
  input: number;
  fee: number;
  feeToPerson: number;
  feeToLauncher: number;
  feeToProtocol: number;
  output: number;
  priceImpact: number;
};

export function splitFee(fee: number) {
  return {
    feeToPerson: fee * FEES.split.person,
    feeToLauncher: fee * FEES.split.launcher,
    feeToProtocol: fee * FEES.split.protocol,
  };
}

/** Quote a buy: SOL in, tokens out. Fee is taken from the SOL before it hits the curve. */
export function quoteBuy(solIn: number, solRaised: number): Quote {
  const fee = solIn * (FEES.tradeFeeBps / 10_000);
  const net = solIn - fee;
  const vSol = CURVE.virtualSol + solRaised;
  const vTok = tokensRemaining(solRaised);
  const k = vSol * vTok;
  const tokensOut = vTok - k / (vSol + net);
  const before = spotPrice(solRaised);
  const after = spotPrice(solRaised + net);
  return {
    input: solIn,
    fee,
    ...splitFee(fee),
    output: tokensOut,
    priceImpact: before > 0 ? after / before - 1 : 0,
  };
}

/** Quote a sell: tokens in, SOL out. Fee is taken from the SOL that comes out. */
export function quoteSell(tokensIn: number, solRaised: number): Quote {
  const vSol = CURVE.virtualSol + solRaised;
  const vTok = tokensRemaining(solRaised);
  const k = vSol * vTok;
  const gross = vSol - k / (vTok + tokensIn);
  const fee = gross * (FEES.tradeFeeBps / 10_000);
  const before = spotPrice(solRaised);
  const after = spotPrice(Math.max(0, solRaised - gross));
  return {
    input: tokensIn,
    fee,
    ...splitFee(fee),
    output: gross - fee,
    priceImpact: before > 0 ? after / before - 1 : 0,
  };
}
