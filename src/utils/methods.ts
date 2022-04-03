import { TOKENS } from "./constants/tokens/tokens";
import { Token, TokenPortfolio } from "./interfaces/index.";

export const formatAmount = (value: number | string, round: number = 0) => {
  if (typeof value === "string") {
    const [integer, decimals] = value.split(".");
    const newValue = Number(integer).toLocaleString("en-US");
    const newDecimals = decimals?.slice(round);
    return newValue.concat(".", newDecimals);
  }
  const getDigits = () => {
    if (value > 1000) return 6;
    if (value > 100) return 9;
    if (value > 10) return 12;
    if (value < 10) return 4;
    return 4;
  };
  return value.toLocaleString("en-US", {
    maximumSignificantDigits: getDigits(),
  });
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

export const getToken = (chainID: number, symbol: string): TokenPortfolio => {
  try {
    const token = TOKENS[chainID].find(
      (token: Token) => token.symbol === symbol
    );
    return {
      ...token,
      balance: "",
      balance_24h: "",
      logo_url: "",
      usd: 0,
      usd_24h: 0,
      type: "",
    };
  } catch (error) {
    console.log("fail to get Token ", error);
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
