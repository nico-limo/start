import { PRINCIPAL_TOKENS } from "../../utils/constants";
import { IDs_COINMARKET } from "../../utils/constants/tokens/coinmarketTokens";
import { TOKENS_SCAM } from "../../utils/constants/tokens/scamTokens";
import { TOKENS } from "../../utils/constants/tokens/tokens";
import {
  CoinMarket,
  CovalentData,
  PricesApiDB,
  PrincipalTokensProps,
  Token,
  TokenPortfolio,
} from "../../utils/interfaces/index.";
import { checkAddresses } from "../../utils/methods";
import {
  spiritFarms,
  spiritFarms_v1,
} from "../../utils/constants/farms/spiritFarms";
import spookyFarms from "../../utils/constants/farms/spookyFarms";
import { formatUnits } from "ethers/lib/utils";

export const coingeckoFormat = (data: PricesApiDB[], chainID) => {
  const prices = Object.entries(data).map((price) => {
    return {
      path: price[0],
      price: price[1].usd,
      price24: price[1].usd_24h_change,
    };
  });
  const allTokens: TokenPortfolio[] = [];
  const principalTokens = {};
  const defaultTokens: Token[] = TOKENS[chainID];
  for (let i = 0; i < defaultTokens.length; i++) {
    const defaultToken = defaultTokens[i];
    const tokenList = prices.find((token) => token.path === defaultToken.path);
    if (tokenList) {
      if (PRINCIPAL_TOKENS.includes(defaultToken.symbol)) {
        principalTokens[defaultToken.symbol] = {
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
      allTokens.push(portfolioToken);
    }
  }

  return {
    allTokens,
    principalTokens: principalTokens as PrincipalTokensProps,
  };
};

export const coinmarketFormat = (data, chainID) => {
  const coinMarketArr: [string, Array<CoinMarket>][] = Object.entries(data);
  const defaultTokens: Token[] = TOKENS[chainID];

  const allTokens: TokenPortfolio[] = [];
  const principalTokens = {};
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
        principalTokens[defaultToken.symbol] = {
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
      allTokens.push(newTokenPortfolio);
    }
  }
  return {
    allTokens,
    principalTokens: principalTokens as PrincipalTokensProps,
  };
};

export const getCovalentData = (
  data: CovalentData[],
  allTokens: TokenPortfolio[],
  chainID: number
) => {
  const userBalances: TokenPortfolio[] = [];
  const spiritBalance: TokenPortfolio[] = [];
  const spookyBalance: TokenPortfolio[] = [];

  for (let i = 0; i < data.length; i++) {
    const {
      balance,
      balance_24h,
      contract_name,
      contract_address,
      quote_rate,
      quote_rate_24h,
      contract_decimals,
      contract_ticker_symbol,
    } = data[i];

    if (
      !TOKENS_SCAM[chainID].includes(contract_address) &&
      contract_name &&
      contract_decimals
    ) {
      if (contract_name.includes("LP")) {
        // FARMS BALANCES
        if (balance && balance !== "0") {
          if (contract_name.includes("Spooky")) {
            const spookyFarm = spookyFarms.find((lp) =>
              checkAddresses(lp.lpAddresses[250], contract_address)
            );
            if (spookyFarm) {
              const { lpSymbol } = spookyFarm;
              const newSpookyFarm: TokenPortfolio = {
                name: `${lpSymbol[0]}-${lpSymbol[1]}`,
                address: contract_address,
                symbol: `${lpSymbol[0]}-${lpSymbol[1]}`,
                decimals: 18,
                path: "",
                id_coinMarket: 0,
                balance: formatUnits(balance, contract_decimals),
                balance_24h: formatUnits(
                  balance_24h !== "0" ? balance_24h : balance,
                  contract_decimals
                ),
                type: "",
                usd: quote_rate ? quote_rate : 1,
                usd_24h: quote_rate_24h ? quote_rate_24h : 1,
                protocol: "BOO",
              };
              spookyBalance.push(newSpookyFarm);
            }
          } else {
            const spiritFarm = spiritFarms.find((lp) =>
              checkAddresses(lp.lpAddresses[250], contract_address)
            );
            const spiritFarmV1 = spiritFarms_v1.find((lp) =>
              checkAddresses(lp.lpAddresses[250], contract_address)
            );
            if (spiritFarm) {
              const { lpSymbol } = spiritFarm;
              const newSpiritFarm: TokenPortfolio = {
                name: `${lpSymbol[0]}-${lpSymbol[1]}`,
                address: contract_address,
                symbol: `${lpSymbol[0]}-${lpSymbol[1]}`,
                decimals: 18,
                path: "",
                id_coinMarket: 0,
                balance: formatUnits(balance, contract_decimals),
                balance_24h: formatUnits(
                  balance_24h !== "0" ? balance_24h : balance,
                  contract_decimals
                ),
                type: "",
                usd: quote_rate ? quote_rate : 1,
                usd_24h: quote_rate_24h ? quote_rate_24h : 1,
                protocol: "SPIRIT",
              };
              spiritBalance.push(newSpiritFarm);
            } else if (spiritFarmV1) {
              const { lpSymbol } = spiritFarmV1;
              const newSpiritFarm: TokenPortfolio = {
                name: `${lpSymbol[0]}-${lpSymbol[1]}`,
                address: contract_address,
                symbol: `${lpSymbol[0]}-${lpSymbol[1]}`,
                decimals: 18,
                path: "",
                id_coinMarket: 0,
                balance: formatUnits(balance, contract_decimals),
                balance_24h: formatUnits(
                  balance_24h !== "0" ? balance_24h : balance,
                  contract_decimals
                ),
                type: "",
                usd: quote_rate ? quote_rate : 1,
                usd_24h: quote_rate_24h ? quote_rate_24h : 1,
                protocol: "SPIRIT",
              };
              spiritBalance.push(newSpiritFarm);
            }
          }
        }
      } else {
        // USER TOKENS BALANCE
        if (balance && balance !== "0" && quote_rate && quote_rate < 300000) {
          const priceToken = allTokens.find((price) =>
            checkAddresses(price.address, contract_address)
          );

          if (priceToken) {
            const tokenBalance: TokenPortfolio = {
              ...priceToken,
              balance: formatUnits(balance, contract_decimals),
              balance_24h: formatUnits(
                balance_24h ? balance_24h : balance,
                contract_decimals
              ),
            };
            userBalances.push(tokenBalance);
          } else {
            const tokenBalance: TokenPortfolio = {
              name: contract_name,
              address: contract_address,
              symbol: contract_ticker_symbol,
              decimals: contract_decimals,
              path: "",
              id_coinMarket: 0,
              balance: formatUnits(balance, contract_decimals),
              balance_24h: formatUnits(
                balance_24h ? balance_24h : balance,
                contract_decimals
              ),
              type: "",
              usd: quote_rate,
              usd_24h: quote_rate_24h ? quote_rate_24h : quote_rate,
            };
            userBalances.push(tokenBalance);
          }
        }
      }
    }
  }

  return { userBalances, spiritBalance, spookyBalance };
};
