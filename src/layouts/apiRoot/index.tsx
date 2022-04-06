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
import { useToast } from "@chakra-ui/react";
import { TokenPortfolio } from "../../utils/interfaces/index.";
import { PATH_COINMARKET } from "../../utils/constants/tokens/coinmarketTokens";

const ApiRoot = ({ children }) => {
  const { network } = NetworksMethods();
  const { chainID } = network;
  const { wallet } = UserMethods();
  const { updatePortfolio, getFarmsBalance, cleanFarms } = TokensMethod();
  const toast = useToast();
  useEffect(() => {
    const fethData = async () => {
      let pricesPortfolio: TokenPortfolio[] = [],
        covalentPortfolio: TokenPortfolio[] = [];

      if (wallet.account) {
        try {
          const { data: coingeckoPrices } = await axios("/api/coingeckoPrices");
          pricesPortfolio = formatCoingeckoPortfolio(coingeckoPrices, chainID);
        } catch (error) {
          toast({
            title: "Error Database",
            description: "Failed to get prices info",
            position: "top-right",
            status: "error",
          });
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
          toast({
            title: "Error api covalent",
            description: "Failed to get covalent data",
            position: "top-right",
            status: "error",
          });
        }

        updatePortfolio({ pricesPortfolio, covalentPortfolio });
        if (chainID === 250) {
          getFarmsBalance(wallet.account, pricesPortfolio);
        } else {
          cleanFarms();
        }
      } else {
        try {
          console.log("process.env.COVALENT_KEY ", process.env.COVALENT_KEY);
          console.log("process.env ", process.env);
          const { data: coingeckoPrices } = await axios("/api/coingeckoPrices");
          pricesPortfolio = formatCoingeckoPortfolio(coingeckoPrices, chainID);
          updatePortfolio({ pricesPortfolio });
        } catch (error) {
          toast({
            title: "Error Database sin covalent",
            description: "Failed to get prices info",
            position: "top-right",
            status: "error",
          });
          try {
            console.log(
              "process.env.COINMARKET_KEY ",
              process.env.COINMARKET_KEY
            );

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
            toast({
              title: "Error coinmarket api",
              description: "Failed to get prices info",
              position: "top-right",
              status: "error",
            });
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
