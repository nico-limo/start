import { useRecoilState } from "recoil";
import {
  PrincipalTokensProps,
  TokenPortfolio,
} from "../../utils/interfaces/index.";
import { farmsState, portfolioState } from "../atoms/user";
import { Contract, Provider } from "ethers-multicall";
import { getProviderRPC } from "../../utils/cryptoMethods";
import { checkAddresses } from "../../utils/methods";
import { principalTokensState } from "../atoms/tokens";
import { formatSpiritFarms, spiritCalls, tokenCall } from "./spiritMethod";
import ERC20_ABI from "../../utils/constants/abis/erc20.json";
import { ADDRESS_ZERO, CONTRACT_SPIRIT } from "../../utils/constants";
import { formatUnits } from "ethers/lib/utils";

interface PortfolioProps {
  pricesPortfolio?: { list: TokenPortfolio[]; principal: PrincipalTokensProps };
  covalentPortfolio?: { tokens: TokenPortfolio[]; liquidity: TokenPortfolio[] };
  account: string;
  chainID: number;
}

export const TokensMethod = () => {
  const [portfolio, setPortfolio] = useRecoilState(portfolioState);
  const [farmsPortfolio, setFarmsPortfolio] = useRecoilState(farmsState);
  const [principalTokens, setPrincipalTokens] =
    useRecoilState(principalTokensState);

  const updatePortfolio = async ({
    pricesPortfolio,
    covalentPortfolio,
    account,
    chainID,
  }: PortfolioProps) => {
    if (
      pricesPortfolio &&
      pricesPortfolio.list.length &&
      covalentPortfolio &&
      covalentPortfolio.tokens.length
    ) {
      setPrincipalTokens(pricesPortfolio.principal);
      const covalentRestArr = covalentPortfolio.tokens;
      const userPortfolio: TokenPortfolio[] = [];
      const calls = [];

      const provider = getProviderRPC(chainID);
      const ethcallProvider = new Provider(provider);
      await ethcallProvider.init();

      for (let i = 0; i < pricesPortfolio.list.length; i++) {
        const priceToken = pricesPortfolio.list[i];
        const covaToken = covalentPortfolio.tokens.find((token) =>
          checkAddresses(token.address, priceToken.address)
        );
        const covaTokenIndex = covalentPortfolio.tokens.findIndex((token) =>
          checkAddresses(token.address, priceToken.address)
        );

        if (covaToken) {
          covalentRestArr.splice(covaTokenIndex, 1);
          const mixToken: TokenPortfolio = {
            ...priceToken,
            balance: covaToken.balance,
            balance_24h: covaToken.balance_24h,
          };
          if (priceToken.address === ADDRESS_ZERO) {
            const nativeBalanceOf = ethcallProvider.getEthBalance(account);
            calls.push(nativeBalanceOf);
          } else {
            const call = tokenCall(account, priceToken, ethcallProvider);
            calls.push(call);
          }
          userPortfolio.push(mixToken);
        } else {
          const call = tokenCall(account, priceToken, ethcallProvider);
          calls.push(call);
          userPortfolio.push(priceToken);
        }
      }

      for (let i = 0; i < covalentRestArr.length; i++) {
        const call = tokenCall(account, covalentRestArr[i], ethcallProvider);
        calls.push(call);
      }

      const totalTokens = userPortfolio.concat(covalentRestArr);

      if (totalTokens.length === calls.length) {
        getTokensBalance(
          account,
          totalTokens,
          covalentPortfolio.liquidity,
          ethcallProvider,
          calls
        );
      }
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
    liquidity: TokenPortfolio[],
    ethcallProvider,
    calls
  ) => {
    try {
      if (account && tokensBalance.length) {
        const web3TokensBalance: TokenPortfolio[] = [];

        const result = await ethcallProvider.all(calls);

        for (let i = 0; i < tokensBalance.length; i++) {
          const token = tokensBalance[i];
          const balanceOf = result[i];
          const formatBalance = formatUnits(balanceOf, token.decimals);
          if (formatBalance !== "0.0") {
            const newToken: TokenPortfolio = {
              ...token,
              balance: formatBalance,
            };
            web3TokensBalance.push(newToken);
          }
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

  const updateToken = async (account: string, chainID = 250) => {
    const provider = getProviderRPC(chainID);
    const ethcallProvider = new Provider(provider);
    await ethcallProvider.init();
    const nativeBalance = await ethcallProvider.getEthBalance(account);
    const tokenContract = new Contract(CONTRACT_SPIRIT, ERC20_ABI);
    const balanceOf = await tokenContract.balanceOf(account);
    const [nativeBalanceOf, tokenBalanceOf] = await ethcallProvider.all([
      nativeBalance,
      balanceOf,
    ]);
    const formatBalance = formatUnits(tokenBalanceOf, 18);
    const formatNativeBalance = formatUnits(nativeBalanceOf, 18);
    const assets = portfolio.assets;
    const newAssets = assets.map((token) => {
      if (checkAddresses(token.address, CONTRACT_SPIRIT))
        return { ...token, balance: formatBalance };
      if (token.address === ADDRESS_ZERO)
        return { ...token, balance: formatNativeBalance };
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
