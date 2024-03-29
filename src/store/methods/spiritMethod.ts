import { ethers, FixedNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { spiritFarms } from "../../utils/constants/farms/spiritFarms";
import { formatTokenAmount, getProvider } from "../../utils/cryptoMethods";
import GAUGE_ABI from "../../utils/constants/abis/gauges.json";
import PAIR_ABI from "../../utils/constants/abis/pair.json";
import ERC_ABI from "../../utils/constants/abis/erc20.json";
import {
  FarmsLiquidity,
  FarmsPortfolio,
  TokenPortfolio,
} from "../../utils/interfaces/index.";
import { Contract, Provider } from "ethers-multicall";
import { QUOTES } from "../../utils/constants/tokens/quoteFarms";
import { ADDRESS_ZERO } from "../../utils/constants/contracts";

export const formatSpiritFarms = (calls, prices: TokenPortfolio[]) => {
  const spiritData: FarmsPortfolio[] = [];
  const spiritLiquidity: FarmsLiquidity[] = [];
  const { signer } = getProvider();
  for (let i = 0; i < spiritFarms.length; i++) {
    const farm = spiritFarms[i];
    const [
      balanceOfLP,
      lpSupply,
      gaugeSupply,
      staked,
      earned,
      balanceOfAccount,
      allowance,
    ] = calls.splice(0, 7);
    const stakeFormat = formatTokenAmount(staked.toString(), 18);
    const earnFormat = formatTokenAmount(earned.toString(), 18);
    const balanceFormat = formatTokenAmount(balanceOfAccount.toString(), 18);

    const gaugeEtherContract = new ethers.Contract(
      farm.investAddress,
      GAUGE_ABI,
      signer
    );
    const LPEtherContract = new ethers.Contract(
      farm.lpAddresses[250],
      PAIR_ABI,
      signer
    );

    // Spiritswap actions
    const getRewards = async () => await gaugeEtherContract.getReward();
    const withdrawAll = async () => await gaugeEtherContract.exit();
    const depositAll = async () => await gaugeEtherContract.depositAll();

    const approve = async () =>
      await LPEtherContract.approve(
        farm.investAddress,
        ethers.constants.MaxUint256.toString()
      );

    if (balanceFormat !== "0.0") {
      const liquidityFarm = {
        ...farm,
        hasBalance: true,
        depositAll,
        allowance,
        approve,
      };
      spiritLiquidity.push(liquidityFarm);
    }

    if (stakeFormat !== "0.0" || earnFormat !== "0.0") {
      const { usd, decimals } = prices.find(
        (tokenPrice) => tokenPrice.symbol === farm.lpSymbol[1]
      );

      const formatQuote = formatUnits(balanceOfLP, decimals);
      const formatGauge = formatUnits(gaugeSupply, 18);

      const FixedLPSupply = FixedNumber.from(lpSupply);
      const FixedGaugeSupply = FixedNumber.from(gaugeSupply);

      const FixedQuote = FixedNumber.fromString(formatQuote);
      const lpTokenRatio = FixedGaugeSupply.divUnsafe(FixedLPSupply);

      const lpTotalInQuoteToken = FixedQuote.mulUnsafe(
        FixedNumber.fromString("2")
      ).mulUnsafe(lpTokenRatio);

      const totalValue = lpTotalInQuoteToken.mulUnsafe(
        FixedNumber.fromString(usd.toString())
      );

      const FixedGauge2 = FixedNumber.fromString(formatGauge);
      const lpPrice = totalValue.divUnsafe(FixedGauge2);

      const staked_usd = FixedNumber.fromString(stakeFormat)
        .mulUnsafe(lpPrice)
        .toString();

      const userFarm = {
        ...farm,
        staked: stakeFormat,
        earns: earnFormat,
        usd: staked_usd,
        totalSupply: "100000",
        actions: {
          getRewards,
          depositAll,
          withdrawAll,
        },
      };
      spiritData.push(userFarm);
    }
  }

  return { spiritData, spiritLiquidity };
};

export const spiritCalls = (account: string) => {
  const calls = [];
  for (let i = 0; i < spiritFarms.length; i++) {
    const farm = spiritFarms[i];
    const tokenAddress: string = QUOTES[farm.lpSymbol[1]]?.address;
    const lpAddress: string = farm.lpAddresses[250];
    const gaugeAddress: string = farm.investAddress;
    const tokenContract = new Contract(tokenAddress, ERC_ABI);
    const lpContract = new Contract(lpAddress, PAIR_ABI);
    const gaugeContract = new Contract(gaugeAddress, GAUGE_ABI);

    const balanceOfLP = tokenContract.balanceOf(lpAddress);
    const lpSupply = lpContract.totalSupply();
    const lpAccountBalance = lpContract.balanceOf(account);
    const lpAllowanceAccount = lpContract.allowance(
      account,
      farm.investAddress
    );

    const gaugeSupply = gaugeContract.totalSupply();

    const staked = gaugeContract.balanceOf(account);
    const earned = gaugeContract.earned(account);
    calls.push(balanceOfLP);
    calls.push(lpSupply);
    calls.push(gaugeSupply);
    calls.push(staked);
    calls.push(earned);
    calls.push(lpAccountBalance);
    calls.push(lpAllowanceAccount);
  }
  return calls;
};

export const tokenCall = (
  account: string,
  tokens: TokenPortfolio,
  provider: Provider
) => {
  const { address } = tokens;
  if (address === ADDRESS_ZERO) {
    const nativeBalanceOf = provider.getEthBalance(account);
    return nativeBalanceOf;
  } else {
    const tokenContract = new Contract(address, ERC_ABI);
    const balanceOf = tokenContract.balanceOf(account);
    return balanceOf;
  }
};
