import { useEffect } from "react";
import { tokensBalance, tokensPrice } from ".";
import { NetworksMethods } from "../../store/methods/network";
import { TokensMethod } from "../../store/methods/tokens";
import { UserMethods } from "../../store/methods/user";

const ApiRoot = ({ children }) => {
  const { wallet } = UserMethods();
  const { network } = NetworksMethods();
  const { updatePortfolio } = TokensMethod();

  useEffect(() => {
    const fethData = async () => {
      const tokensPrices = await tokensPrice(network.chainID);
      updatePortfolio({ tokensPrices });
      const tokensBalances = await tokensBalance({
        account: wallet.account,
        chainID: network.chainID,
      });
      updatePortfolio({ tokensPrices, tokensBalances });
    };
    fethData();
    const interval = setInterval(() => {
      fethData();
    }, 6000000);
    return () => clearInterval(interval);
  }, [wallet, network]);

  return children;
};

export default ApiRoot;
