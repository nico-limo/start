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

import { checkAddresses } from "../../utils/methods";
import { spiritState } from "../atoms/tokens";
import { spiritFarms } from "../../utils/constants/farms/spiritFarms";
interface PortfolioProps {
  pricesPortfolio?: TokenPortfolio[];
  covalentPortfolio?: TokenPortfolio[];
}

export const TokensMethod = () => {
  const [portfolio, setPortfolio] = useRecoilState(portfolioState);
  const [farmsPortfolio, setFarmsPortfolio] = useRecoilState(farmsState);
  const [spiritToken, setSpiritToken] = useRecoilState(spiritState);

  const updatePortfolio = ({
    pricesPortfolio,
    covalentPortfolio,
  }: PortfolioProps) => {
    if (
      pricesPortfolio &&
      pricesPortfolio.length &&
      covalentPortfolio &&
      covalentPortfolio.length
    ) {
      const spirit = pricesPortfolio.find((token) =>
        checkAddresses(token.address, spiritToken.address)
      );
      if (spirit) setSpiritToken(spirit);
      const mixData = covalentPortfolio.map((covaToken) => {
        const tokenPrice = pricesPortfolio.find((token) =>
          checkAddresses(token.address, covaToken.address)
        );
        if (tokenPrice) {
          return {
            ...tokenPrice,
            balance: covaToken.balance,
            balance_24h: covaToken.balance_24h
              ? covaToken.balance_24h
              : covaToken.balance,
            type: covaToken.type,
          };
        }
        return {
          ...covaToken,
          balance_24h: covaToken.balance_24h
            ? covaToken.balance_24h
            : covaToken.balance,
        };
      });
      setPortfolio(mixData);
    } else if (
      pricesPortfolio &&
      pricesPortfolio.length &&
      ((covalentPortfolio && !covalentPortfolio.length) || !covalentPortfolio)
    ) {
      setPortfolio(pricesPortfolio);
    } else if (
      ((pricesPortfolio && !pricesPortfolio.length) || !pricesPortfolio) &&
      covalentPortfolio &&
      covalentPortfolio.length
    ) {
      setPortfolio(covalentPortfolio);
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

        const balanceCalls = spiritFarms.map((farm) => {
          const farmContract = new Contract(farm.gaugeAddress, GAUGE_ABI);
          const balanceOf = farmContract.balanceOf(account);
          return balanceOf;
        });

        const earnsCalls = spiritFarms.map((farm) => {
          const farmContract = new Contract(farm.gaugeAddress, GAUGE_ABI);
          const earned = farmContract.earned(account);
          return earned;
        });

        const allCalls = balanceCalls.concat(earnsCalls);
        const response = await ethcallProvider.all(allCalls);
        const staked = response.slice(0, balanceCalls.length);
        const earns = response.slice(balanceCalls.length);

        const farmsData: FarmContract[] = spiritFarms.map((farm, i) => {
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
