import axios from "axios";
import useNotification from "../../hooks/useNotification";
import { PATH_COINMARKET } from "../../utils/constants/tokens/coinmarketTokens";
import { formatCoingeckoPortfolio, formatCoinmarketPortfolio } from "./methods";

const useGetPrice = (chainID: number) => {
  const { errorDB } = useNotification();

  const getPrices = async () => {
    try {
      const { data: coingeckoPrices } = await axios("/api/coingeckoPrices");
      return formatCoingeckoPortfolio(coingeckoPrices, chainID);
    } catch (error) {
      errorDB("coingecko");
      try {
        const { data: coinMarketPrices } = await axios(
          "/api/coinmarketPrices",
          {
            params: { tokens: PATH_COINMARKET },
          }
        );
        return formatCoinmarketPortfolio(coinMarketPrices.data, chainID);
      } catch (error) {
        errorDB("coinmarket");
      }
    }
  };
  return { getPrices };
};

export default useGetPrice;
