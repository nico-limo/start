import { useRecoilState } from "recoil";
import {
  PrincipalTokensProps,
  TokenPortfolio,
} from "../../utils/interfaces/index.";
import { farmsState, portfolioState } from "../atoms/user";
import { Provider } from "ethers-multicall";
import { getProviderRPC } from "../../utils/cryptoMethods";
import { checkAddresses } from "../../utils/methods";
import { principalTokensState } from "../atoms/tokens";
import { formatSpiritFarms, spiritCalls } from "./spiritMethod";

interface PortfolioProps {
  pricesPortfolio?: { list: TokenPortfolio[]; principal: PrincipalTokensProps };
  covalentPortfolio?: { tokens: TokenPortfolio[]; liquidity: TokenPortfolio[] };
}

export const TokensMethod = () => {
  const [portfolio, setPortfolio] = useRecoilState(portfolioState);
  const [farmsPortfolio, setFarmsPortfolio] = useRecoilState(farmsState);
  const [principalTokens, setPrincipalTokens] =
    useRecoilState(principalTokensState);

  const updatePortfolio = ({
    pricesPortfolio,
    covalentPortfolio,
  }: PortfolioProps) => {
    if (
      pricesPortfolio &&
      pricesPortfolio.list.length &&
      covalentPortfolio &&
      covalentPortfolio.tokens.length
    ) {
      setPrincipalTokens(pricesPortfolio.principal);

      const userPortfolio: TokenPortfolio[] = [];
      for (let i = 0; i < covalentPortfolio.tokens.length; i++) {
        const covaToken = covalentPortfolio.tokens[i];
        const priceToken = pricesPortfolio.list.find((priceItem) =>
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

      setPortfolio({
        assets: userPortfolio,
        hasBalance: true,
        liquidity: covalentPortfolio.liquidity,
      });
    } else if (
      pricesPortfolio &&
      pricesPortfolio.list.length &&
      ((covalentPortfolio && !covalentPortfolio.tokens.length) ||
        !covalentPortfolio)
    ) {
      setPortfolio({
        assets: pricesPortfolio.list,
        hasBalance: false,
        liquidity: [],
      });
    } else if (
      ((pricesPortfolio && !pricesPortfolio.list.length) || !pricesPortfolio) &&
      covalentPortfolio &&
      covalentPortfolio.tokens.length
    ) {
      setPortfolio({
        assets: covalentPortfolio.tokens,
        hasBalance: true,
        liquidity: covalentPortfolio.liquidity,
      });
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

        const { spiritData, spiritLiquidity } = formatSpiritFarms(
          result,
          tokenPrices
        );

        setFarmsPortfolio({ spiritFarms: spiritData, spiritLiquidity });
      }
    } catch (error) {
      console.log("error multicall ", error);
    }
  };

  const cleanFarms = () => {
    setFarmsPortfolio({ spiritFarms: [], spiritLiquidity: [] });
  };

  return {
    portfolio,
    farmsPortfolio,
    principalTokens,
    updatePortfolio,
    getFarmsBalance,
    cleanFarms,
  };
};
