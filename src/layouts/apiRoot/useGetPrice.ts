import axios from "axios";
import useNotification from "../../hooks/useNotification";
import { useUserMethods } from "../../store/methods/user";
import { PATH_COINMARKET } from "../../utils/constants/tokens/coinmarketTokens";
import {
  formatCoingeckoPortfolio,
  formatCoinmarketPortfolio,
  formatCovalentPortfolio,
} from "./methods";

const useGetPrice = (chainID: number) => {
  const { errorDB } = useNotification();
  const { wallet } = useUserMethods();

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

  const getBalances = async () => {
    try {
      const { data: covalentData } = await axios("/api/covalentData", {
        params: { chainID, account: wallet.account },
      });

      return formatCovalentPortfolio(covalentData, chainID);
    } catch (error) {
      errorDB("covalent");
    }
  };
  return { getPrices, getBalances };
};

export default useGetPrice;
