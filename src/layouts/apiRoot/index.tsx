import { useEffect } from "react";
import axios from "axios";
import { NetworksMethods } from "../../store/methods/network";
import { TokensMethod } from "../../store/methods/tokens";
import { useUserMethods } from "../../store/methods/user";
import { formatCovalentPortfolio } from "./methods";
import {
  PrincipalTokensProps,
  TokenPortfolio,
} from "../../utils/interfaces/index.";
import useNotification from "../../hooks/useNotification";
import { PRINCIPAL_DEFAULT } from "../../utils/constants";
import useGetPrice from "./useGetPrice";

const ApiRoot = ({ children }) => {
  const { network } = NetworksMethods();
  const { chainID } = network;
  const { wallet } = useUserMethods();
  const { getPrices } = useGetPrice(chainID);
  const { updatePortfolio, getFarmsBalance, cleanFarms } = TokensMethod();
  const { errorDB } = useNotification();
  useEffect(() => {
    const fethData = async () => {
      let pricesPortfolio: {
          list: TokenPortfolio[];
          principal: PrincipalTokensProps;
        } = { list: [], principal: PRINCIPAL_DEFAULT },
        covalentPortfolio: {
          tokens: TokenPortfolio[];
          liquidity: TokenPortfolio[];
          spookyFarms: TokenPortfolio[];
        } = {
          tokens: [],
          liquidity: [],
          spookyFarms: [],
        };

      if (wallet.account) {
        pricesPortfolio = await getPrices();

        try {
          const { data: covalentData } = await axios("/api/covalentData", {
            params: { chainID, account: wallet.account },
          });

          covalentPortfolio = formatCovalentPortfolio(covalentData, chainID);
        } catch (error) {
          errorDB("covalent");
        }

        updatePortfolio({
          pricesPortfolio,
          covalentPortfolio,
          account: wallet.account,
          chainID,
        });
        if (chainID === 250) {
          getFarmsBalance(
            wallet.account,
            pricesPortfolio.list,
            covalentPortfolio.spookyFarms
          );
        } else {
          cleanFarms();
        }
      } else {
        pricesPortfolio = await getPrices();
        updatePortfolio({
          pricesPortfolio,
          account: wallet.account,
          chainID,
        });
      }
    };
    fethData();
    const interval = setInterval(() => {
      fethData();
    }, 18000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, chainID]);

  return children;
};

export default ApiRoot;
