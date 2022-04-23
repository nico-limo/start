import { TOKENS } from "./constants/tokens/tokens";
import { Token, TokenPortfolio } from "./interfaces/index.";

export const formatAmount = (value: number | string = 0, round = 18) => {
  if (!value) return "0";
  const stringValue = value.toString();
  if (!stringValue.includes("."))
    return Number(stringValue).toLocaleString("en-US");
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

export const sortItems = (items: TokenPortfolio[]): TokenPortfolio[] =>
  items.sort((a, b) => {
    const tokenA = a.name.toUpperCase();
    const tokenB = b.name.toUpperCase();
    if (tokenA > tokenB) return 1;
    if (tokenA < tokenB) return -1;
    return 0;
  });

export const getColumns = (balance: boolean, premium: boolean) => {
  if (!balance) return "1fr 1fr";
  if (balance && premium) return "1fr 1fr 1fr 80px";
  return "1fr 1fr 1fr";
};
