import { useRecoilState } from "recoil";
import {
  CovalentPool,
  FarmContract,
  FarmsPortfolio,
  TokenPortfolio,
} from "../../utils/interfaces/index.";
import { farmsState, portfolioState } from "../atoms/user";
import GAUGE_ABI from "../../utils/constants/abis/gauges.json";
import { Contract, Provider } from "ethers-multicall";
import { formatTokenAmount, getProvider } from "../../utils/cryptoMethods";
import { farms } from "../../utils/constants/farms";
import { checkAddresses } from "../../utils/methods";
import { spiritState } from "../atoms/tokens";
interface PortfolioProps {
  tokensPrices?: TokenPortfolio[];
  tokensBalances?: TokenPortfolio[];
}

export const TokensMethod = () => {
  const [portfolio, setPortfolio] = useRecoilState(portfolioState);
  const [farmsPortfolio, setFarmsPortfolio] = useRecoilState(farmsState);
  const [spiritToken, setSpiritToken] = useRecoilState(spiritState);

  const filterCovalentTokens = (array: TokenPortfolio[]) =>
    array.filter(
      (token) =>
        token.usd &&
        token.type === "cryptocurrency" &&
        !token.symbol.includes("LP") &&
        token.usd_24h !== Infinity
    );

  const updatePortfolio = ({
    tokensPrices,
    tokensBalances,
  }: PortfolioProps) => {
    if (tokensBalances?.length && tokensPrices?.length) {
      const spiritPrice = tokensPrices.find((token) =>
        checkAddresses(token.address, spiritToken.address)
      );
      setSpiritToken(spiritPrice);
      const mixData = tokensBalances.map((tokensBalances) => {
        const tokenPrice = tokensPrices.find(
          (token) => token.address === tokensBalances.address
        );
        if (tokenPrice) {
          return {
            ...tokenPrice,
            balance: tokensBalances.balance,
            balance_24h: tokensBalances.balance_24h,
            logo_url: tokensBalances.logo_url,
            type: tokensBalances.type,
          };
        }
        return tokensBalances;
      });
      const filterTokens = filterCovalentTokens(mixData);
      setPortfolio(filterTokens);
    }
    if (tokensPrices && !tokensBalances) setPortfolio(tokensPrices);
    if (!tokensPrices && tokensBalances?.length) {
      const filterTokens = filterCovalentTokens(tokensBalances);
      setPortfolio(filterTokens);
    }
  };

  const getFarmsBalance = async (
    account: string,
    poolsPrices: CovalentPool[]
  ) => {
    try {
      if (account) {
        const provider = await getProvider();
        const ethcallProvider = new Provider(provider);
        await ethcallProvider.init();

        const balanceCalls = farms.map((farm) => {
          const farmContract = new Contract(farm.gaugeAddress, GAUGE_ABI);
          const balanceOf = farmContract.balanceOf(account);
          return balanceOf;
        });

        const earnsCalls = farms.map((farm) => {
          const farmContract = new Contract(farm.gaugeAddress, GAUGE_ABI);
          const earned = farmContract.earned(account);
          return earned;
        });

        const allCalls = balanceCalls.concat(earnsCalls);
        const response = await ethcallProvider.all(allCalls);
        const staked = response.slice(0, balanceCalls.length);
        const earns = response.slice(balanceCalls.length);

        const farmsData: FarmContract[] = farms.map((farm, i) => {
          const stakeFormat = formatTokenAmount(staked[i].toString(), 18);
          const earnFormat = formatTokenAmount(earns[i].toString(), 18);
          return {
            ...farm,
            staked: stakeFormat,
            earns: earnFormat,
          };
        });
        const userFarms = farmsData.filter(
          (farm) => farm.earns !== "0.0" || farm.staked !== "0.0"
        );

        const userCovalentFarms = poolsPrices.filter(({ exchange }) =>
          userFarms.some(({ lpAddresses }) =>
            checkAddresses(exchange, lpAddresses[250])
          )
        );

        const completeFarms: FarmsPortfolio[] = userFarms.map((farm) => {
          const covalentPool = userCovalentFarms.find((pool) =>
            checkAddresses(pool.exchange, farm.lpAddresses[250])
          );
          return {
            ...farm,
            usd: covalentPool.quote_rate,
            totalSupply: covalentPool.total_supply,
            liquidity_rate: covalentPool.total_liquidity_quote,
          };
        });

        setFarmsPortfolio(completeFarms);
      }
    } catch (error) {
      console.log("error multicall ", error);
    }
  };

  const cleanFarms = () => {
    setFarmsPortfolio([]);
  };

  return {
    portfolio,
    spiritToken,
    farmsPortfolio,
    updatePortfolio,
    getFarmsBalance,
    cleanFarms,
  };
};
