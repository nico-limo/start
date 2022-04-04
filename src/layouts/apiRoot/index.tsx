import { useEffect } from "react";
import axios from "axios";
import { NetworksMethods } from "../../store/methods/network";
import { TokensMethod } from "../../store/methods/tokens";
import { UserMethods } from "../../store/methods/user";
import { CovalentPool } from "../../utils/interfaces/index.";
import { formatCoingeckoPortfolio, formatCovalentPortfolio } from "./methods";
import { useToast } from "@chakra-ui/react";

const ApiRoot = ({ children }) => {
  const { network } = NetworksMethods();
  const { chainID } = network;
  const { wallet } = UserMethods();
  const { updatePortfolio, getFarmsBalance, cleanFarms } = TokensMethod();
  const toast = useToast();
  useEffect(() => {
    const fethData = async () => {
      try {
        if (wallet.account) {
          const { data: coingeckoPrices } = await axios("/api/coingeckoPrices");
          const pricesPortfolio = formatCoingeckoPortfolio(
            coingeckoPrices,
            chainID
          );
          const { data: covalentData } = await axios("/api/covalentData", {
            params: { chainID, account: wallet.account },
          });
          const covalentPortfolio = formatCovalentPortfolio(
            covalentData,
            chainID
          );
          updatePortfolio({ pricesPortfolio, covalentPortfolio });
          if (chainID === 250) {
            const { data: covalentPools }: { data: CovalentPool[] } =
              await axios("/api/covalentPools", {
                params: { chainID },
              });
            getFarmsBalance(wallet.account, covalentPools);
          } else {
            cleanFarms();
          }
        } else {
          const { data: coingeckoPrices } = await axios("/api/coingeckoPrices");
          const pricesPortfolio = formatCoingeckoPortfolio(
            coingeckoPrices,
            chainID
          );
          updatePortfolio({ pricesPortfolio });
        }
      } catch (error) {
        toast({
          title: "Error fetching data",
          description: "Failed to get external data",
          position: "top-right",
          status: "error",
        });
      }
    };
    fethData();
    const interval = setInterval(() => {
      fethData();
    }, 25000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, chainID]);

  return children;
};

export default ApiRoot;
