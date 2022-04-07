import { useEffect } from "react";
import axios from "axios";
import { NetworksMethods } from "../../store/methods/network";
import { TokensMethod } from "../../store/methods/tokens";
import { UserMethods } from "../../store/methods/user";
import {
  formatCoingeckoPortfolio,
  formatCoinmarketPortfolio,
  formatCovalentPortfolio,
} from "./methods";
import { TokenPortfolio } from "../../utils/interfaces/index.";
import { PATH_COINMARKET } from "../../utils/constants/tokens/coinmarketTokens";
import useNotification from "../../hooks/useNotification";

const ApiRoot = ({ children }) => {
  const { network } = NetworksMethods();
  const { chainID } = network;
  const { wallet } = UserMethods();
  const { updatePortfolio, getFarmsBalance, cleanFarms } = TokensMethod();
  const { errorDB } = useNotification();
  useEffect(() => {
    const fethData = async () => {
      let pricesPortfolio: TokenPortfolio[] = [],
        covalentPortfolio: TokenPortfolio[] = [];

      if (wallet.account) {
        try {
          const { data: coingeckoPrices } = await axios("/api/coingeckoPrices");
          pricesPortfolio = formatCoingeckoPortfolio(coingeckoPrices, chainID);
        } catch (error) {
          errorDB("coingecko");

          const { data: coinMarketPrices } = await axios(
            "/api/coinmarketPrices",
            {
              params: { tokens: PATH_COINMARKET },
            }
          );
          pricesPortfolio = formatCoinmarketPortfolio(
            coinMarketPrices.data,
            chainID
          );
        }

        try {
          const { data: covalentData } = await axios("/api/covalentData", {
            params: { chainID, account: wallet.account },
          });
          covalentPortfolio = formatCovalentPortfolio(covalentData, chainID);
        } catch (error) {
          errorDB("covalent");
        }

        updatePortfolio({ pricesPortfolio, covalentPortfolio });
        if (chainID === 250) {
          getFarmsBalance(wallet.account, pricesPortfolio);
        } else {
          cleanFarms();
        }
      } else {
        try {
          const { data: coingeckoPrices } = await axios("/api/coingeckoPrices");
          pricesPortfolio = formatCoingeckoPortfolio(coingeckoPrices, chainID);
          updatePortfolio({ pricesPortfolio });
        } catch (error) {
          errorDB("coingecko");
          try {
            const { data: coinMarketPrices } = await axios(
              "/api/coinmarketPrices",
              {
                params: { tokens: PATH_COINMARKET },
              }
            );
            pricesPortfolio = formatCoinmarketPortfolio(
              coinMarketPrices.data,
              chainID
            );
            updatePortfolio({ pricesPortfolio });
          } catch (error) {
            errorDB("coinmarket");
          }
        }
      }
    };
    fethData();
    const interval = setInterval(() => {
      fethData();
    }, 150000000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, chainID]);

  return children;
};

export default ApiRoot;
