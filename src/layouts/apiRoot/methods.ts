import { TOKENS } from "../../utils/constants/tokens/tokens";
import {
  CoinMarket,
  CovalentData,
  PricesApiDB,
  PrincipalTokensProps,
  Token,
  TokenPortfolio,
} from "../../utils/interfaces/index.";
import {
  ADDRESS_ZERO,
  NATIVES_TOKENS,
  PRINCIPAL_TOKENS,
} from "../../utils/constants";
import { TOKENS_SCAM } from "../../utils/constants/tokens/scamTokens";
import { IDs_COINMARKET } from "../../utils/constants/tokens/coinmarketTokens";
import { spiritFarms } from "../../utils/constants/farms/spiritFarms";
import spookyFarms from "../../utils/constants/farms/spookyFarms";
import { checkAddresses } from "../../utils/methods";
import { formatUnits } from "ethers/lib/utils";

export const formatCoingeckoPortfolio = (
  data: PricesApiDB[],
  chainID: number
) => {
  try {
    const prices = Object.entries(data).map((price) => {
      return {
        path: price[0],
        price: price[1].usd,
        price24: price[1].usd_24h_change,
      };
    });
    const networkTokens: TokenPortfolio[] = [];
    const prinpalTokens = {};
    const defaultTokens: Token[] = TOKENS[chainID];
    for (let i = 0; i < defaultTokens.length; i++) {
      const defaultToken = defaultTokens[i];
      const tokenList = prices.find(
        (token) => token.path === defaultToken.path
      );
      if (tokenList) {
        if (PRINCIPAL_TOKENS.includes(defaultToken.symbol)) {
          prinpalTokens[defaultToken.symbol] = {
            USD: tokenList.price,
            USD_24h: tokenList.price24,
          };
        }
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

    return {
      list: networkTokens,
      principal: prinpalTokens as PrincipalTokensProps,
    };
  } catch (error) {
    console.log("Error formating coingecko data ", error);
  }
};

export const formatCovalentPortfolio = (data, chainID: number) => {
  const covalentData: CovalentData[] = data.data.items;

  const covalentArray: TokenPortfolio[] = [];
  const covalentLPArray: TokenPortfolio[] = [];
  for (let i = 0; i < covalentData.length; i++) {
    const {
      balance,
      balance_24h,
      quote_24h,
      type,
      contract_name,
      contract_address,
      quote,
      quote_rate,
      quote_rate_24h,
      contract_decimals,
      contract_ticker_symbol,
    } = covalentData[i];

    if (
      contract_name &&
      balance !== "0" &&
      quote_24h !== Infinity &&
      !TOKENS_SCAM.includes(contract_address) &&
      type === "cryptocurrency" &&
      quote_rate &&
      quote_rate_24h &&
      quote
    ) {
      if (contract_name.includes("LP")) {
        const protocol = contract_name.includes("Spooky") ? "BOO" : "SPIRIT";
        const poolFarm = contract_name.includes("Spooky")
          ? spookyFarms
          : spiritFarms;
        const pool = poolFarm.find((farm) =>
          checkAddresses(farm.lpAddresses[250], contract_address)
        );
        const formatBalance = formatUnits(balance, 18);
        const newFarm: TokenPortfolio = {
          address: contract_address.toLowerCase(),
          symbol: pool
            ? `${pool.lpSymbol[0]}-${pool.lpSymbol[1]}`
            : contract_ticker_symbol,
          decimals: contract_decimals,
          name: pool
            ? `${pool.lpSymbol[0]}-${pool.lpSymbol[1]}`
            : contract_name,
          balance: formatBalance,
          balance_24h: balance_24h ? balance_24h : balance,
          usd: quote > 100000 ? 0 : quote,
          usd_24h: 0,
          type,
          path: "",
          id_coinMarket: 0,
          protocol,
        };
        covalentLPArray.push(newFarm);
      } else {
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
  }

  return { tokens: covalentArray, liquidity: covalentLPArray };
};

export const formatCoinmarketPortfolio = (data, chainID: number) => {
  const coinMarketArr: [string, Array<CoinMarket>][] = Object.entries(data);
  const defaultTokens: Token[] = TOKENS[chainID];

  const listArr: TokenPortfolio[] = [];
  const prinpalTokens = {};
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
      if (PRINCIPAL_TOKENS.includes(defaultToken.symbol)) {
        prinpalTokens[defaultToken.symbol] = {
          USD: tokenCoinMarket.quote.USD.price,
          USD_24h: tokenCoinMarket.quote.USD.percent_change_24h,
        };
      }
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

  return { list: listArr, principal: prinpalTokens as PrincipalTokensProps };
};
