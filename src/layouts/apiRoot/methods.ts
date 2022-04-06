import { TOKENS } from "../../utils/constants/tokens/tokens";
import {
  CoinMarket,
  CovalentData,
  PricesApiDB,
  Token,
  TokenPortfolio,
} from "../../utils/interfaces/index.";
import { ADDRESS_ZERO, NATIVES_TOKENS } from "../../utils/constants";
import { TOKENS_SCAM } from "../../utils/constants/tokens/scamTokens";
import { IDs_COINMARKET } from "../../utils/constants/tokens/coinmarketTokens";

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
        id_coinMarket: 0,
      };
      covalentArray.push(newToken);
    }
  }
  return covalentArray;
};

export const formatCoinmarketPortfolio = (data, chainID: number) => {
  const coinMarketArr: [string, Array<CoinMarket>][] = Object.entries(data);
  const defaultTokens: Token[] = TOKENS[chainID];

  const listArr = [];
  for (let i = 0; i < coinMarketArr.length; i++) {
    const tokenArr = coinMarketArr[i];
    const token_id: number = IDs_COINMARKET[tokenArr[0]];
    const tokenCoinMarket = tokenArr[1].find(
      (coinToken) => coinToken.id === token_id
    );
    const defaultToken = defaultTokens.find(
      (token) => token.id_coinMarket === token_id
    );
    if (tokenCoinMarket && defaultToken) {
      const newTokenPortfolio: TokenPortfolio = {
        ...defaultToken,
        balance: "",
        balance_24h: "",
        type: "",
        usd: tokenCoinMarket.quote.USD.price,
        usd_24h: tokenCoinMarket.quote.USD.percent_change_24h,
      };
      listArr.push(newTokenPortfolio);
    }
  }

  return listArr;
};
