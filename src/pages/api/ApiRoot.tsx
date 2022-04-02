import axios from "axios";
import { useEffect } from "react";
import { covalentPools, tokensBalance, tokensPrice } from ".";
import { NetworksMethods } from "../../store/methods/network";
import { TokensMethod } from "../../store/methods/tokens";
import { UserMethods } from "../../store/methods/user";
import { API_COINGECKO } from "../../utils/constants";
import { TOKENS } from "../../utils/constants/tokens";

const ApiRoot = ({ children }) => {
  const { wallet } = UserMethods();
  const { network } = NetworksMethods();
  const { updatePortfolio, getFarmsBalance } = TokensMethod();

  // useEffect(() => {
  //   const fethData = async () => {
  //     // const tokensPrices = await tokensPrice(network.chainID);
  //     const tokensBalances = await tokensBalance({
  //       account: wallet.account,
  //       chainID: network.chainID,
  //     });
  //     updatePortfolio({ tokensBalances });
  //     const poolsPrices = await covalentPools(network.chainID);
  //     await getFarmsBalance(wallet.account, poolsPrices);
  //   };
  //   fethData();
  //   const interval = setInterval(() => {
  //     fethData();
  //   }, 20000);
  //   return () => clearInterval(interval);
  // }, [wallet, network]);

  return children;
};

export default ApiRoot;
