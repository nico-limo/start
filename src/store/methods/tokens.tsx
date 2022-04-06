import { useRecoilState } from "recoil";
import { TokenPortfolio } from "../../utils/interfaces/index.";
import { farmsState, portfolioState } from "../atoms/user";
import GAUGE_ABI from "../../utils/constants/abis/gauges.json";
import PAIR_ABI from "../../utils/constants/abis/pair.json";
import ERC_ABI from "../../utils/constants/abis/erc20.json";
import { Contract, Provider } from "ethers-multicall";
import { getProvider } from "../../utils/cryptoMethods";
import { checkAddresses } from "../../utils/methods";
import { spiritState } from "../atoms/tokens";
import { spiritFarms } from "../../utils/constants/farms/spiritFarms";
import { QUOTES } from "../../utils/constants/tokens/quoteFarms";
import { formatSpiritFarms } from "./spiritMethod";

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

      const userPortfolio: TokenPortfolio[] = [];
      for (let i = 0; i < covalentPortfolio.length; i++) {
        const covaToken = covalentPortfolio[i];
        const priceToken = pricesPortfolio.find((priceItem) =>
          checkAddresses(priceItem.address, covaToken.address)
        );
        if (priceToken) {
          const mixToken: TokenPortfolio = {
            ...priceToken,
            balance: covaToken.balance,
            balance_24h: covaToken.balance_24h,
          };
          userPortfolio.push(mixToken);
        } else {
          userPortfolio.push(covaToken);
        }
      }

      setPortfolio(userPortfolio);
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
    tokenPrices: TokenPortfolio[]
  ) => {
    try {
      if (account && tokenPrices.length) {
        const provider = await getProvider();
        const ethcallProvider = new Provider(provider);
        await ethcallProvider.init();

        const calls = [];
        for (let i = 0; i < spiritFarms.length; i++) {
          const farm = spiritFarms[i];
          const tokenAddress: string = QUOTES[farm.lpSymbol[1]]?.address;
          const lpAddress: string = farm.lpAddresses[250];
          const gaugeAddress: string = farm.gaugeAddress;
          const tokenContract = new Contract(tokenAddress, ERC_ABI);
          const lpContract = new Contract(lpAddress, PAIR_ABI);
          const gaugeContract = new Contract(gaugeAddress, GAUGE_ABI);

          const balanceOfLP = tokenContract.balanceOf(lpAddress);
          const lpSupply = lpContract.totalSupply();
          const gaugeSupply = gaugeContract.totalSupply();
          const staked = gaugeContract.balanceOf(account);
          const earned = gaugeContract.earned(account);
          calls.push(balanceOfLP);
          calls.push(lpSupply);
          calls.push(gaugeSupply);
          calls.push(staked);
          calls.push(earned);
        }

        const result = await ethcallProvider.all(calls);
        const spiritData = formatSpiritFarms(result, tokenPrices);

        setFarmsPortfolio(spiritData);
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
