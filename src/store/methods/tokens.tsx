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
import { formatSpiritFarms, spiritCalls, tokensCalls } from "./spiritMethod";
import ERC20_ABI from "../../utils/constants/abis/erc20.json";
import { ADDRESS_ZERO, CONTRACT_SPIRIT } from "../../utils/constants";
import { formatUnits } from "ethers/lib/utils";
import { ethers } from "ethers";

interface PortfolioProps {
  pricesPortfolio?: { list: TokenPortfolio[]; principal: PrincipalTokensProps };
  covalentPortfolio?: { tokens: TokenPortfolio[]; liquidity: TokenPortfolio[] };
  account: string;
}

export const TokensMethod = () => {
  const [portfolio, setPortfolio] = useRecoilState(portfolioState);
  const [farmsPortfolio, setFarmsPortfolio] = useRecoilState(farmsState);
  const [principalTokens, setPrincipalTokens] =
    useRecoilState(principalTokensState);

  const updatePortfolio = ({
    pricesPortfolio,
    covalentPortfolio,
    account,
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
      getTokensBalance(account, userPortfolio, covalentPortfolio.liquidity);
    } else if (
      pricesPortfolio &&
      pricesPortfolio.list.length &&
      ((covalentPortfolio && !covalentPortfolio.tokens.length) ||
        !covalentPortfolio)
    ) {
      setPrincipalTokens(pricesPortfolio.principal);
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

  const getTokensBalance = async (
    account: string,
    tokensBalance: TokenPortfolio[],
    liquidity: TokenPortfolio[]
  ) => {
    try {
      if (account && tokensBalance.length) {
        const provider = getProviderRPC();
        const ethcallProvider = new Provider(provider);
        let native: TokenPortfolio[];
        const web3TokensBalance: TokenPortfolio[] = [];
        for (let i = 0; i < tokensBalance.length; i++) {
          const token = tokensBalance[i];
          if (token.address === ADDRESS_ZERO) {
            native = tokensBalance.splice(i, 1);
          }
        }

        await ethcallProvider.init();
        const calls = tokensCalls(account, tokensBalance);

        const result = await ethcallProvider.all(calls);

        for (let i = 0; i < tokensBalance.length; i++) {
          const token = tokensBalance[i];
          const balanceOf = result[i];
          const formatBalance = formatUnits(balanceOf, token.decimals);
          const newToken: TokenPortfolio = { ...token, balance: formatBalance };
          web3TokensBalance.push(newToken);
        }
        if (native.length) {
          const nativeBalance = await provider.getBalance(account);
          const formatBalance = formatUnits(nativeBalance, 18);

          const newNative: TokenPortfolio = {
            ...native[0],
            balance: formatBalance,
          };
          web3TokensBalance.push(newNative);
        }

        setPortfolio({
          assets: web3TokensBalance,
          hasBalance: true,
          liquidity,
        });
      }
    } catch (error) {
      console.log("error tokens multicall ", error);
    }
  };

  const cleanFarms = () => {
    setFarmsPortfolio({ spiritFarms: [], spiritLiquidity: [] });
  };

  const updateToken = async (account: string) => {
    const provider = getProviderRPC();
    const nativeBalance = await provider.getBalance(account);
    const formatNative = formatUnits(nativeBalance, 18);

    const tokenContract = new ethers.Contract(
      CONTRACT_SPIRIT,
      ERC20_ABI,
      provider
    );
    const balanceOf = await tokenContract.balanceOf(account);
    const formatBalance = formatUnits(balanceOf, 18);

    const assets = portfolio.assets;
    const newAssets = assets.map((token) => {
      if (checkAddresses(token.address, CONTRACT_SPIRIT))
        return { ...token, balance: formatBalance };
      if (token.address === ADDRESS_ZERO)
        return { ...token, balance: formatNative };
      return token;
    });

    setPortfolio({
      assets: newAssets,
      hasBalance: true,
      liquidity: portfolio.liquidity,
    });
  };

  return {
    portfolio,
    farmsPortfolio,
    principalTokens,
    updatePortfolio,
    getFarmsBalance,
    getTokensBalance,
    cleanFarms,
    updateToken,
  };
};
