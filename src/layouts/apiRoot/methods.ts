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
    const formatTokens = data.map((geckoToken) => {
      const tokenList: Token = TOKENS[chainID].find(
        (listToken) => listToken.pathCoingecko === geckoToken.path
      );
      if (tokenList) {
        const portfolioToken: TokenPortfolio = {
          ...tokenList,
          address: tokenList.address.toLowerCase(),
          balance: "",
          balance_24h: "",
          type: "",
          usd: geckoToken.price,
          usd_24h: geckoToken.price24,
          pathCoingecko: tokenList.pathCoingecko,
        };
        return portfolioToken;
      }
      return null;
    });
    const excludeNullTokens = formatTokens.filter((token) => token);
    return excludeNullTokens;
  } catch (error) {
    console.log("Error formating coingecko data ", error);
  }
};

export const formatCovalentPortfolio = (data, chainID: number) => {
  const covalentWallet: CovalentData[] = data.data.items.filter(
    (token) => token.balance !== "0"
  );

  const formatCovalent = formatCovalentData(covalentWallet, chainID);
  return formatCovalent;
};

export const formatCovalentData = (data: CovalentData[], chainID: number) => {
  const portfolio = data.map((token) => {
    const usd_24h =
      ((token.quote_rate - token.quote_rate_24h) / token.quote_rate_24h) * 100;
    const nativeToken: string = NATIVES_TOKENS[chainID];
    const isNative = nativeToken === token.contract_ticker_symbol;
    const newToken: TokenPortfolio = {
      address: !isNative ? token.contract_address.toLowerCase() : ADDRESS_ZERO,
      symbol: token.contract_ticker_symbol,
      decimals: token.contract_decimals,
      name: token.contract_name,
      balance: token.balance,
      balance_24h: token.balance_24h,
      usd: token.quote_rate,
      usd_24h,
      pathCoingecko: "",
      type: token.type,
    };
    return newToken;
  });

  const excludeIncompleteData = portfolio.filter(
    (token) =>
      token.usd &&
      token.name &&
      token.type === "cryptocurrency" &&
      !token.name.includes("LP") &&
      token.usd_24h !== Infinity &&
      !TOKENS_SCAM.includes(token.address)
  );
  return excludeIncompleteData;
};
