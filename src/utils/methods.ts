import { TOKENS } from "./constants/tokens";
import { Token, TokenPortfolio } from "./interfaces/index.";

export const formatAmount = (value: number | string) => {
  if (typeof value === "string") {
    const [integer, decimals] = value.split(".");
    const newValue = Number(integer).toLocaleString("en-US");
    return newValue.concat(".", decimals);
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

export const priceStatus = (value: number) => {
  const [color_rate, symbol_rate] =
    value > 0 ? ["green.300", "+"] : ["red.300", ""];
  return { color_rate, symbol_rate };
};
