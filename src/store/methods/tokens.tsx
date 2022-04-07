import { useRecoilState } from "recoil";
import { TokenPortfolio } from "../../utils/interfaces/index.";
import { farmsState, portfolioState } from "../atoms/user";
import { Provider } from "ethers-multicall";
import { getProviderRPC } from "../../utils/cryptoMethods";
import { checkAddresses } from "../../utils/methods";
import { spiritState } from "../atoms/tokens";
import { formatSpiritFarms, spiritCalls } from "./spiritMethod";

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
        const provider = getProviderRPC();
        const ethcallProvider = new Provider(provider);
        await ethcallProvider.init();
        const calls = spiritCalls(account);
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
