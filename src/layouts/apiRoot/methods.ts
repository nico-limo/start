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
    const networkTokens: TokenPortfolio[] = data.reduce(
      (filterTokens, token) => {
        const tokenList: Token = TOKENS[chainID].find(
          (listToken) => listToken.pathCoingecko === token.path
        );
        if (tokenList) {
          const portfolioToken: TokenPortfolio = {
            ...tokenList,
            address: tokenList.address.toLowerCase(),
            balance: "",
            balance_24h: "",
            type: "",
            usd: token.price,
            usd_24h: token.price24,
          };
          filterTokens.push(portfolioToken);
        }
        return filterTokens;
      },
      []
    );
    return networkTokens;
  } catch (error) {
    console.log("Error formating coingecko data ", error);
  }
};

export const formatCovalentPortfolio = (data, chainID: number) => {
  const covalentPortfolio: TokenPortfolio[] = data.data.items.reduce(
    (filterTokens, token: CovalentData) => {
      if (
        token.balance !== "0" &&
        token.quote &&
        token.quote_24h !== Infinity &&
        token.contract_name &&
        !token.contract_name.includes("LP") &&
        !TOKENS_SCAM.includes(token.contract_address) &&
        token.type === "cryptocurrency"
      ) {
        const usd_24h =
          ((token.quote_rate - token.quote_rate_24h) / token.quote_rate_24h) *
          100;
        const nativeToken: string = NATIVES_TOKENS[chainID];
        const isNative = nativeToken === token.contract_ticker_symbol;
        const newToken: TokenPortfolio = {
          address: !isNative
            ? token.contract_address.toLowerCase()
            : ADDRESS_ZERO,
          symbol: token.contract_ticker_symbol,
          decimals: token.contract_decimals,
          name: token.contract_name,
          balance: token.balance,
          balance_24h: token.balance_24h,
          usd: token.quote_rate,
          usd_24h,
          type: token.type,
        };
        filterTokens.push(newToken);
      }
      return filterTokens;
    },
    []
  );

  return covalentPortfolio;
};
