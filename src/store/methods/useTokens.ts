import { Provider } from "ethers-multicall";
import { useRecoilState } from "recoil";
import { getProviderRPC } from "../../utils/cryptoMethods";
import { principalTokensState } from "../atoms/tokens";
import { farmsState, portfolioStateV2 } from "../atoms/user";
import { formatSpiritFarms, spiritCalls } from "./spiritMethod";
import { formatSpookyFarms, spookyCalls } from "./spookyMethods";

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
    const booCalls = spookyCalls(account);
    const spiritLength = calls.length;
    const globalCalls = calls.concat(booCalls);
    const result = await ethcallProvider.all(globalCalls);
    const spiritResult = result.splice(0, spiritLength);
    const { spookyData, spookyLiquidity } = formatSpookyFarms(
      result,
      spookyFarms
    );

    const { spiritData, spiritLiquidity } = formatSpiritFarms(
      spiritResult,
      allTokens
    );
    setFarmsPortfolio({
      spiritFarms: spiritData,
      spookyFarms: spookyData,
      liquidity: [...spookyLiquidity, ...spiritLiquidity],
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
