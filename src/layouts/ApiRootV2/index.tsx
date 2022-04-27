import { useEffect } from "react";
import useNetwork from "../../store/methods/useNetwork";
import { useUserMethods } from "../../store/methods/user";
import useTokens from "../../store/methods/useTokens";
import { PRINCIPAL_DEFAULT } from "../../utils/constants";
import useGetPrice from "./useGetPrice";

const ApiRootV2 = ({ children }) => {
  const { chainID } = useNetwork();
  const { wallet } = useUserMethods();
  const { getPricesV2, getBalances } = useGetPrice(chainID);
  const { getFarmsPortfolio, getPortfolio } = useTokens();

  useEffect(() => {
    const fetchAPI = async () => {
      const tokensBalance = {
        userBalance: [],
        allTokens: [],
        princialTokens: PRINCIPAL_DEFAULT,
        userLiquidity: [],
      };

      const { allTokens, principalTokens } = await getPricesV2();
      tokensBalance.allTokens = allTokens;
      tokensBalance.princialTokens = principalTokens;

      if (wallet.isConnected) {
        const { spiritBalance, spookyBalance, userBalances } =
          await getBalances(allTokens, wallet.account);
        tokensBalance.userBalance = userBalances;
        tokensBalance.userLiquidity = [...spiritBalance, ...spookyBalance];
        if (chainID === 250) {
          getFarmsPortfolio(
            wallet.account,
            spookyBalance,
            spiritBalance,
            allTokens
          );
        }
      }

      getPortfolio(tokensBalance);
    };
    fetchAPI();

    const interval = setInterval(() => {
      fetchAPI();
    }, 18000);
    return () => clearInterval(interval);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, chainID]);

  return children;
};

export default ApiRootV2;
