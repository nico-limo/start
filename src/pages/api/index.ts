import axios from "axios";
import { API_COINGECKO, API_COVALENT } from "../../utils/constants";
import { TOKENS } from "../../utils/constants/tokens";
import {
  CovalentApi,
  CovalentData,
  CovalentPool,
  Token,
  TokenPortfolio,
} from "../../utils/interfaces/index.";
import { formatCovalentData } from "./methods";

export const tokensPrice = async (chainID: number) => {
  const namesArr = TOKENS[chainID].map((token) => token.pathCoingecko);
  const ids = namesArr.join(",");
  const params = {
    ids,
    include_24hr_change: true,
    vs_currencies: "usd",
  };
  try {
    const { data } = await axios.get(API_COINGECKO, { params });
    const dataTokens: [string, { usd: number; usd_24h_change: number }][] =
      Object.entries(data);
    const formatTokens = dataTokens.map((token) => {
      const tokenList: Token = TOKENS[chainID].find(
        (listToken) => listToken.pathCoingecko === token[0]
      );

      const portfolioToken: TokenPortfolio = {
        ...tokenList,
        address: tokenList.address.toLowerCase(),
        balance: "",
        balance_24h: "",
        logo_url: "",
        type: "",
        usd: token[1].usd,
        usd_24h: token[1].usd_24h_change,
        pathCoingecko: tokenList.pathCoingecko,
      };
      return portfolioToken;
    });
    return formatTokens;
  } catch (error) {
    console.log("error coingecko", error);
  }
};
export const tokensBalance = async ({ account, chainID }: CovalentApi) => {
  const params = {
    key: process.env.NEXT_PUBLIC_COVALENT_KEY,
  };

  try {
    if (!account) return null;
    const { data } = await axios.get(
      `${API_COVALENT}/${chainID}/address/${account}/balances_v2/`,
      {
        params,
      }
    );
    const walletBalance: CovalentData[] = data.data.items.filter(
      (token) => token.balance !== "0"
    );
    const portfolioBalance = formatCovalentData(walletBalance, chainID);
    return portfolioBalance;
  } catch (error) {
    console.log("error covalnet", error);
  }
};
export const covalentPools = async (chainID: number) => {
  const params = {
    key: process.env.NEXT_PUBLIC_COVALENT_KEY,
  };

  try {
    const { data } = await axios.get(
      `https://api.covalenthq.com/v1/${chainID}/xy=k/spiritswap/pools/?quote-currency=USD&&key=${params.key}`
    );

    const items: CovalentPool[] = data.data.items;

    return items;
  } catch (error) {
    console.log("error covalnet", error);
  }
};
