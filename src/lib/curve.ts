import { CURVE, FEES } from "../config";

/** Tokens still on the curve for a given amount of real ETH raised. */
export function tokensRemaining(ethRaised: number): number {
  const k = CURVE.virtualEth * CURVE.virtualTokens;
  return k / (CURVE.virtualEth + ethRaised);
}

/** Tokens already sold for a given amount of real ETH raised. */
export function tokensSold(ethRaised: number): number {
  return CURVE.virtualTokens - tokensRemaining(ethRaised);
}

/** Spot price in ETH per token. */
export function spotPrice(ethRaised: number): number {
  const vEth = CURVE.virtualEth + ethRaised;
  return vEth / tokensRemaining(ethRaised);
}

export function marketCapEth(ethRaised: number): number {
  return spotPrice(ethRaised) * CURVE.totalSupply;
}

export function graduationProgress(ethRaised: number): number {
  return Math.min(1, ethRaised / CURVE.graduationEth);
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

/** Quote a buy: ETH in, tokens out. Fee is taken from the ETH before it hits the curve. */
export function quoteBuy(ethIn: number, ethRaised: number): Quote {
  const fee = ethIn * (FEES.tradeFeeBps / 10_000);
  const net = ethIn - fee;
  const vEth = CURVE.virtualEth + ethRaised;
  const vTok = tokensRemaining(ethRaised);
  const k = vEth * vTok;
  const tokensOut = vTok - k / (vEth + net);
  const before = spotPrice(ethRaised);
  const after = spotPrice(ethRaised + net);
  return {
    input: ethIn,
    fee,
    ...splitFee(fee),
    output: tokensOut,
    priceImpact: before > 0 ? after / before - 1 : 0,
  };
}

/** Quote a sell: tokens in, ETH out. Fee is taken from the ETH that comes out. */
export function quoteSell(tokensIn: number, ethRaised: number): Quote {
  const vEth = CURVE.virtualEth + ethRaised;
  const vTok = tokensRemaining(ethRaised);
  const k = vEth * vTok;
  const gross = vEth - k / (vTok + tokensIn);
  const fee = gross * (FEES.tradeFeeBps / 10_000);
  const before = spotPrice(ethRaised);
  const after = spotPrice(Math.max(0, ethRaised - gross));
  return {
    input: tokensIn,
    fee,
    ...splitFee(fee),
    output: gross - fee,
    priceImpact: before > 0 ? after / before - 1 : 0,
  };
}
