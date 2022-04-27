import axios from "axios";
import useNotification from "../../hooks/useNotification";
import { PATH_COINMARKET } from "../../utils/constants/tokens/coinmarketTokens";
import { TokenPortfolio } from "../../utils/interfaces/index.";
import { coingeckoFormat, coinmarketFormat, getCovalentData } from "./methods";

const useGetPrice = (chainID: number) => {
  const { errorDB } = useNotification();

  const getPricesV2 = async () => {
    try {
      const { data: coingeckoPrices } = await axios("/api/coingeckoPrices");
      return coingeckoFormat(coingeckoPrices, chainID);
    } catch (error) {
      try {
        const { data: coinMarketPrices } = await axios(
          "/api/coinmarketPrices",
          {
            params: { tokens: PATH_COINMARKET },
          }
        );
        return coinmarketFormat(coinMarketPrices.data, chainID);
      } catch (error) {
        errorDB("Failed get Prices");
      }
    }
  };
  const getBalances = async (allTokens: TokenPortfolio[], account) => {
    try {
      const { data: covalentData } = await axios("/api/covalentData", {
        params: { chainID, account },
      });
      return getCovalentData(covalentData.data.items, allTokens);
    } catch (error) {
      errorDB("covalent");
    }
  };
  return { getPricesV2, getBalances };
};

export default useGetPrice;
