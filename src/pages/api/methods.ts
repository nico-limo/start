import { ADDRESS_ZERO, NATIVES_TOKENS } from "../../utils/constants";
import { CovalentData, TokenPortfolio } from "../../utils/interfaces/index.";

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
      logo_url: token.logo_url,
      type: token.type,
    };
    return newToken;
  });
  return portfolio;
};
