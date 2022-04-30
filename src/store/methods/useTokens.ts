import { Provider } from "ethers-multicall";
import { useRecoilState } from "recoil";
import { getProviderRPC } from "../../utils/cryptoMethods";
import { principalTokensState } from "../atoms/tokens";
import { farmsState, portfolioStateV2 } from "../atoms/user";
import { formatSpiritFarms, spiritCalls } from "./spiritMethod";
import { farmsCall, formatFarms } from "./globalMethods";

const useTokens = () => {
  const [portfolio, setPortfolio] = useRecoilState(portfolioStateV2);
  const [farmsPortfolio, setFarmsPortfolio] = useRecoilState(farmsState);
  const [principalTokens, setPrincipalTokens] =
    useRecoilState(principalTokensState);
  const getFarmsPortfolio = async (
    account,
    spookyFarms,
    spiritFarms,
    allTokens
  ) => {
    const provider = getProviderRPC();
    const ethcallProvider = new Provider(provider);
    await ethcallProvider.init();
    const calls = spiritCalls(account);
    const booCalls = farmsCall(account, "BOO");
    const spiritV1Calls = farmsCall(account, "SPIRIT");
    const spiritLength = calls.length;
    const spiritV1Length = spiritV1Calls.length;
    const globalCalls = [...calls, ...spiritV1Calls, ...booCalls];
    const result = await ethcallProvider.all(globalCalls);

    const spiritResult = result.splice(0, spiritLength);
    const spiritV1Result = result.splice(0, spiritV1Length);

    const { farmsData: spookyData, farmsLiquidity: spookyLiquidity } =
      formatFarms(result, spookyFarms, "BOO");

    const { farmsData, farmsLiquidity } = formatFarms(
      spiritV1Result,
      spiritFarms,
      "SPIRIT"
    );

    const { spiritData, spiritLiquidity } = formatSpiritFarms(
      spiritResult,
      allTokens
    );
    setFarmsPortfolio({
      spiritFarms: [...spiritData, ...farmsData],
      spookyFarms: spookyData,
      liquidity: [...spookyLiquidity, ...spiritLiquidity, ...farmsLiquidity],
    });
  };

  const getPortfolio = (tokensBalance) => {
    if (tokensBalance.princialTokens) {
      setPrincipalTokens(tokensBalance.princialTokens);
    }
    if (tokensBalance.userBalance.length) {
      setPortfolio({
        assets: tokensBalance.userBalance,
        liquidity: tokensBalance.userLiquidity,
        hasBalance: true,
        isLoading: false,
      });
    } else {
      setPortfolio({
        assets: tokensBalance.allTokens,
        liquidity: tokensBalance.userLiquidity,
        hasBalance: false,
        isLoading: false,
      });
    }
  };

  const cleanFarms = () => {
    setFarmsPortfolio({ spiritFarms: [], liquidity: [], spookyFarms: [] });
  };

  return {
    getFarmsPortfolio,
    getPortfolio,
    cleanFarms,
    farmsPortfolio,
    principalTokens,
    portfolio,
  };
};

export default useTokens;
