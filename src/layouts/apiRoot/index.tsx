import { useEffect } from "react";
import axios from "axios";
import { NetworksMethods } from "../../store/methods/network";
import { TokensMethod } from "../../store/methods/tokens";
import { UserMethods } from "../../store/methods/user";
import { formatCoingeckoPortfolio, formatCovalentPortfolio } from "./methods";
import { useToast } from "@chakra-ui/react";
import { TokenPortfolio } from "../../utils/interfaces/index.";

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
          const array = pricesPortfolio.length
            ? pricesPortfolio
            : covalentPortfolio;
          getFarmsBalance(wallet.account, array);
        } else {
          cleanFarms();
        }
      } else {
        try {
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
