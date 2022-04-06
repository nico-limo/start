import { TOKENS } from "../../utils/constants/tokens/tokens";
import {
  CovalentData,
  PricesApiDB,
  Token,
  TokenPortfolio,
} from "../../utils/interfaces/index.";
import { ADDRESS_ZERO, NATIVES_TOKENS } from "../../utils/constants";
import { TOKENS_SCAM } from "../../utils/constants/tokens/scamTokens";

export const formatCoingeckoPortfolio = (
  data: PricesApiDB[],
  chainID: number
) => {
  try {
    const networkTokens: TokenPortfolio[] = [];
    const defaultTokens: Token[] = TOKENS[chainID];
    for (let i = 0; i < defaultTokens.length; i++) {
      const defaultToken = defaultTokens[i];
      const tokenList = data.find((token) => token.path === defaultToken.path);
      if (tokenList) {
        const portfolioToken: TokenPortfolio = {
          ...defaultToken,
          address: defaultToken.address.toLowerCase(),
          balance: "",
          balance_24h: "",
          type: "",
          usd: tokenList.price,
          usd_24h: tokenList.price24,
        };
        networkTokens.push(portfolioToken);
      }
    }
    return networkTokens;
  } catch (error) {
    console.log("Error formating coingecko data ", error);
  }
};

export const formatCovalentPortfolio = (data, chainID: number) => {
  const covalentData: CovalentData[] = data.data.items;
  const covalentArray: TokenPortfolio[] = [];
  for (let i = 0; i < covalentData.length; i++) {
    const {
      balance,
      balance_24h,
      quote_24h,
      type,
      contract_name,
      contract_address,
      quote_rate,
      quote_rate_24h,
      contract_decimals,
      contract_ticker_symbol,
    } = covalentData[i];
    if (
      contract_name &&
      !contract_name.includes("LP") &&
      balance !== "0" &&
      quote_24h !== Infinity &&
      !TOKENS_SCAM.includes(contract_address) &&
      type === "cryptocurrency" &&
      quote_rate &&
      quote_rate_24h
    ) {
      const usd_24h = ((quote_rate - quote_rate_24h) / quote_rate_24h) * 100;
      const nativeToken: string = NATIVES_TOKENS[chainID];
      const isNative = nativeToken === contract_ticker_symbol;
      const newToken: TokenPortfolio = {
        address: !isNative ? contract_address.toLowerCase() : ADDRESS_ZERO,
        symbol: contract_ticker_symbol,
        decimals: contract_decimals,
        name: contract_name,
        balance,
        balance_24h: balance_24h ? balance_24h : balance,
        usd: quote_rate,
        usd_24h,
        type,
        path: "",
      };
      covalentArray.push(newToken);
    }
  }
  return covalentArray;
};
