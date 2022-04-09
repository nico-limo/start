import { TOKENS } from "./constants/tokens/tokens";
import { Token, TokenPortfolio } from "./interfaces/index.";

export const formatAmount = (value: number | string = 0, round = 18) => {
  const stringValue = value.toString();

  const [integer, decimals] = stringValue.split(".");
  const newValue = Number(integer).toLocaleString("en-US");
  const newDecimals = decimals?.slice(0, round);
  return newValue.concat(".", newDecimals);
};

export const currentTokens = (chainID: number): TokenPortfolio[] => {
  try {
    return TOKENS[chainID].map((token: Token) => ({
      ...token,
      balance: "",
      balance_24h: "",
      logo_url: "",
      usd: 0,
      usd_24h: 0,
      type: "",
    }));
  } catch (error) {
    console.log("fail TOKENS fn ", error);
  }
};

export const priceStatus = (value: number) => {
  const [color_rate, symbol_rate] =
    value > 0 ? ["green.300", "+"] : ["red.300", ""];
  return { color_rate, symbol_rate };
};

export const checkAddresses = (valueA: string, valueB: string): boolean => {
  if (valueA && valueB) return valueA.toLowerCase() === valueB.toLowerCase();
  return false;
};
